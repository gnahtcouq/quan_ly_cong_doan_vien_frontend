import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
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
  callCreateFee,
  callFetchUnionist,
  callFetchUnionistById,
  callUpdateFee
} from '@/config/api'
import {IFee} from '@/types/backend'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'
import {DebounceSelect} from '@/config/debouce.select'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IFee | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

export interface IUnionistSelect {
  label: string | undefined
  value: string | undefined
  key?: string | undefined
}

const ModalFee = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [unionists, setUnionists] = useState<IUnionistSelect[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (dataInit?._id) {
          if (dataInit.unionistId) {
            const res = await callFetchUnionistById(dataInit.unionistId)
            if (res && res.data) {
              setUnionists([
                {
                  label: res.data.name,
                  value: res.data._id,
                  key: res.data._id
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

  const submitFee = async (valuesForm: any) => {
    const {unionistId, monthYear, fee} = valuesForm
    if (dataInit?._id) {
      //update
      const fees = {
        _id: dataInit._id,
        monthYear,
        fee: dataInit.fee, // không cho sửa số tiền
        unionistId:
          unionistId && unionistId.value
            ? unionistId.value
            : dataInit.unionistId
      }

      const res = await callUpdateFee(fees, dataInit._id)
      if (res.data) {
        message.success('Cập nhật công đoàn phí thành công!')
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
      const fees = {
        monthYear,
        fee,
        unionistId: unionistId.value
      }
      const res = await callCreateFee(fees)
      if (res.data) {
        message.success('Thêm mới công đoàn phí thành công!')
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

  async function fetchUnionistList(name: string): Promise<IUnionistSelect[]> {
    const res = await callFetchUnionist(
      `current=1&pageSize=100&name=/${name}/i`
    )
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

  return (
    <>
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={
            <>
              {dataInit?._id
                ? 'Cập nhật công đoàn phí'
                : 'Thêm mới công đoàn phí'}
            </>
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
          onFinish={submitFee}
          initialValues={dataInit?._id ? dataInit : {}}
        >
          {isLoading ? (
            <Spin />
          ) : (
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24} xs={24}>
                <ProForm.Item
                  name="unionistId"
                  label="Công đoàn viên"
                  rules={[
                    {required: true, message: 'Vui lòng chọn công đoàn viên!'}
                  ]}
                >
                  <DebounceSelect
                    allowClear
                    showSearch
                    defaultValue={unionists}
                    value={unionists}
                    placeholder="Chọn công đoàn viên"
                    fetchOptions={fetchUnionistList}
                    onChange={(newValue: any) => {
                      if (newValue?.length === 0 || newValue?.length === 1) {
                        setUnionists(newValue as IUnionistSelect[])
                      }
                    }}
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={24} md={12} sm={24} xs={24}>
                <ProForm.Item
                  label="Thời gian (tháng/năm)"
                  name="monthYear"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
                  getValueFromEvent={(e: any) => e?.format('YYYY/MM')}
                  getValueProps={(e: string) => ({
                    value: e ? dayjs(e) : ''
                  })}
                >
                  <DatePicker
                    format="MM/YYYY"
                    placeholder="mm/yyyy"
                    picker="month"
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={24} md={12} sm={24} xs={24}>
                <ProForm.Item
                  label="Số tiền (Từ 1.000đ - 10 tỷ)"
                  name="fee"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
                >
                  <InputNumber
                    style={{width: '100%'}}
                    min={1000}
                    max={10000000000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    disabled={dataInit && dataInit._id ? true : false}
                  />
                </ProForm.Item>
              </Col>
            </Row>
          )}
        </ModalForm>
      </ConfigProvider>
    </>
  )
}

export default ModalFee
