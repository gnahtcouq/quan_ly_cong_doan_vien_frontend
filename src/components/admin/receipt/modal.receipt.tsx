import {ModalForm, ProForm, ProFormText} from '@ant-design/pro-components'
import {
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Spin,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import {
  callCreateReceipt,
  callFetchIncomeCategory,
  callFetchIncomeCategoryById,
  callFetchUser,
  callFetchUserById,
  callUpdateReceipt
} from '@/config/api'
import {IReceipt} from '@/types/backend'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'
import {DebounceSelect} from '@/config/debouce.select'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IReceipt | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

export interface IUserSelect {
  label: string | undefined
  value: string | undefined
  key?: string | undefined
}

export interface IIncomeCategorySelect {
  label: string | undefined
  value: string | undefined
  key?: string | undefined
}

const ModalReceipt = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [users, setUsers] = useState<IUserSelect[]>([])
  const [incomeCategories, setIncomeCategories] = useState<
    IIncomeCategorySelect[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (dataInit?._id) {
          if (dataInit.userId) {
            const res = await callFetchUserById(dataInit.userId)
            if (res && res.data) {
              setUsers([
                {
                  label: res.data.name,
                  value: res.data._id,
                  key: res.data._id
                }
              ])
            }
          }
          if (dataInit.incomeCategoryId) {
            const res = await callFetchIncomeCategoryById(
              dataInit.incomeCategoryId
            )
            if (res && res.data) {
              setIncomeCategories([
                {
                  label: res.data.description,
                  value: res.data.incomeCategoryId,
                  key: res.data.incomeCategoryId
                }
              ])
            }
          }
        }
      } catch (error) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Đã xảy ra lỗi khi tìm nạp dữ liệu'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dataInit])

  const submitReceipt = async (valuesForm: any) => {
    const {receiptId, description, time, amount, userId, incomeCategoryId} =
      valuesForm
    if (dataInit?._id) {
      // Update
      const receipts = {
        _id: dataInit._id,
        description,
        time: time ? time.toISOString() : null,
        amount,
        userId: userId && userId.value ? userId.value : dataInit.userId,
        incomeCategoryId:
          incomeCategoryId && incomeCategoryId.value
            ? incomeCategoryId.value
            : dataInit.incomeCategoryId
      }
      const res = await callUpdateReceipt(receipts, dataInit._id)
      if (res.data) {
        message.success('Cập nhật phiếu thu thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      // Create
      const receipts = {
        receiptId,
        description,
        time,
        amount,
        userId: userId.value,
        incomeCategoryId: incomeCategoryId.value
      }
      const res = await callCreateReceipt(receipts)
      if (res.data) {
        message.success('Thêm mới phiếu thu thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    }
  }

  const handleReset = async () => {
    form.resetFields()
    setDataInit(null)
    setUsers([])
    setIncomeCategories([])
    setOpenModal(false)
  }

  async function fetchUserList(name: string): Promise<IUserSelect[]> {
    const res = await callFetchUser(`current=1&pageSize=100&name=/${name}/i`)
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => ({
        label: item.name as string,
        value: item._id as string
      }))
      return temp
    } else return []
  }

  async function fetchIncomeCategoryList(
    description: string
  ): Promise<IIncomeCategorySelect[]> {
    const res = await callFetchIncomeCategory(
      `current=1&pageSize=100&description=/${description}/i`
    )
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => ({
        label: item.description as string,
        value: item.incomeCategoryId as string
      }))
      return temp
    } else return []
  }

  const initialValues = dataInit
    ? {
        ...dataInit,
        time: dataInit.time ? dayjs(dataInit.time) : null
      }
    : {}

  return (
    <ConfigProvider locale={en_US}>
      <ModalForm
        title={
          <>{dataInit?._id ? 'Cập nhật phiếu thu' : 'Thêm mới phiếu thu'}</>
        }
        open={openModal}
        modalProps={{
          onCancel: () => {
            handleReset()
          },
          afterClose: () => handleReset(),
          destroyOnClose: true,
          width: isMobile ? '100%' : 400,
          keyboard: false,
          maskClosable: false,
          okText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>,
          cancelText: 'Hủy'
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitReceipt}
        initialValues={initialValues}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProFormText
                label="Mã phiếu thu (PT/năm/tháng/ngày)"
                name="receiptId"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {
                    pattern: /^PT\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
                    message: 'Mã phiếu thu không hợp lệ! (VD: PT20240101)'
                  }
                ]}
                placeholder="Nhập mã phiếu thu"
                disabled={dataInit && dataInit._id ? true : false}
              />
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProFormText
                label="Nội dung"
                name="description"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập nội dung"
              />
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProForm.Item
                label="Thời gian"
                name="time"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="dd/mm/yyyy"
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProForm.Item
                name="userId"
                label="Thành viên"
                rules={[{required: true, message: 'Vui lòng chọn thành viên!'}]}
              >
                <DebounceSelect
                  showSearch
                  defaultValue={users}
                  value={users}
                  placeholder="Chọn thành viên"
                  fetchOptions={fetchUserList}
                  onChange={(newValue: any) => {
                    if (newValue?.length === 0 || newValue?.length === 1) {
                      setUsers(newValue as IUserSelect[])
                    }
                  }}
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProForm.Item
                name="incomeCategoryId"
                label="Danh mục thu"
                rules={[
                  {required: true, message: 'Vui lòng chọn danh mục thu!'}
                ]}
              >
                <DebounceSelect
                  showSearch
                  defaultValue={incomeCategories}
                  value={incomeCategories}
                  placeholder="Chọn danh mục thu"
                  fetchOptions={fetchIncomeCategoryList}
                  onChange={(newValue: any) => {
                    if (newValue?.length === 0 || newValue?.length === 1) {
                      setIncomeCategories(newValue as IIncomeCategorySelect[])
                    }
                  }}
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProForm.Item
                label="Số tiền (Từ 1.000đ - 10 tỷ)"
                name="amount"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <InputNumber
                  style={{width: '100%'}}
                  min={1000}
                  max={10000000000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                />
              </ProForm.Item>
            </Col>
          </Row>
        )}
      </ModalForm>
    </ConfigProvider>
  )
}

export default ModalReceipt
