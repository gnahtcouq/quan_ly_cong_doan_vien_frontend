import {ModalForm, ProForm, ProFormText} from '@ant-design/pro-components'
import {
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  InputNumber,
  Row,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import {
  callCreateExpense,
  callFetchIncomeCategory,
  callFetchUser,
  callUpdateExpense
} from '@/config/api'
import {IExpense} from '@/types/backend'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'
import {DebounceSelect} from '@/config/debouce.select'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IExpense | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

export interface IUserSelect {
  label: string
  value: string
  key?: string
}

export interface IIncomeCategorySelect {
  label: string
  value: string
  key?: string
}

const ModalExpense = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [users, setUsers] = useState<IUserSelect[]>([])
  const [expenseCategories, setIncomeCategories] = useState<
    IIncomeCategorySelect[]
  >([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (dataInit?._id) {
      if (dataInit.user) {
        setUsers([
          {
            label: dataInit.user?.name,
            value: dataInit.user?._id,
            key: dataInit.user?._id
          }
        ])
      }
      if (dataInit.expenseCategory) {
        setIncomeCategories([
          {
            label: dataInit.expenseCategory?.description,
            value: dataInit.expenseCategory?._id,
            key: dataInit.expenseCategory?._id
          }
        ])
      }
    }
  }, [dataInit])

  const submitExpense = async (valuesForm: any) => {
    const {user, description, time, amount, expenseCategory} = valuesForm
    if (dataInit?._id) {
      //update
      const receipts = {
        _id: dataInit._id,
        description,
        time: time ? time.toISOString() : null,
        amount,
        user:
          user && user.value
            ? {
                _id: user.value,
                name: user.label
              }
            : {
                _id: dataInit.user?._id,
                name: dataInit.user?.name
              }, // Giữ nguyên thành viên nếu đã có
        expenseCategory:
          expenseCategory && expenseCategory.value
            ? {
                _id: expenseCategory.value,
                description: expenseCategory.label
              }
            : {
                _id: dataInit.expenseCategory?._id,
                description: dataInit.expenseCategory?.description
              } // Giữ nguyên danh mục nếu đã có
      }

      const res = await callUpdateExpense(receipts, dataInit._id)
      if (res.data) {
        message.success('Cập nhật phiếu chi thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      //create
      const receipts = {
        description,
        time,
        amount,
        user: {
          _id: user.value,
          name: user.label
        },
        expenseCategory: {
          _id: expenseCategory.value,
          description: expenseCategory.label
        }
      }
      const res = await callCreateExpense(receipts)
      if (res.data) {
        message.success('Thêm mới phiếu chi thành công!')
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
    setOpenModal(false)
  }

  async function fetchUserList(name: string): Promise<IUserSelect[]> {
    const res = await callFetchUser(`current=1&pageSize=100&name=/${name}/i`)
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string
        }
      })
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
      const temp = list.map((item) => {
        return {
          label: item.description as string,
          value: item._id as string
        }
      })
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
    <>
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={
            <>{dataInit?._id ? 'Cập nhật phiếu chi' : 'Thêm mới phiếu chi'}</>
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
            maskClosable: true,
            okText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>,
            cancelText: 'Hủy'
          }}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          onFinish={submitExpense}
          initialValues={initialValues}
        >
          <Row gutter={16}>
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
                name="user"
                label="Thành viên"
                rules={[{required: true, message: 'Vui lòng chọn thành viên!'}]}
              >
                <DebounceSelect
                  allowClear
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
                name="expenseCategory"
                label="Danh mục chi"
                rules={[
                  {required: true, message: 'Vui lòng chọn danh mục chi!'}
                ]}
              >
                <DebounceSelect
                  allowClear
                  showSearch
                  defaultValue={expenseCategories}
                  value={expenseCategories}
                  placeholder="Chọn danh mục chi"
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
        </ModalForm>
      </ConfigProvider>
    </>
  )
}

export default ModalExpense
