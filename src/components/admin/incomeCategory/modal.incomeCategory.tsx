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
import {callCreateIncomeCategory, callUpdateIncomeCategory} from '@/config/api'
import {IIncomeCategory} from '@/types/backend'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IIncomeCategory | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ModalInComeCategory = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [form] = Form.useForm()

  const submitInComeCategory = async (valuesForm: any) => {
    const {incomeCategoryId, description, year, budget} = valuesForm
    if (dataInit?._id) {
      //update
      const receipts = {
        _id: dataInit._id,
        incomeCategoryId,
        description,
        year,
        budget
      }

      const res = await callUpdateIncomeCategory(receipts, dataInit._id)
      if (res.data) {
        message.success('Cập nhật danh mục thu thành công!')
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
        incomeCategoryId,
        description,
        year,
        budget
      }
      const res = await callCreateIncomeCategory(receipts)
      if (res.data) {
        message.success('Thêm mới danh mục thu thành công!')
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

  return (
    <>
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={
            <>
              {dataInit?._id
                ? 'Cập nhật danh mục thu'
                : 'Thêm mới danh mục thu'}
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
            maskClosable: true,
            okText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>,
            cancelText: 'Hủy'
          }}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          onFinish={submitInComeCategory}
          initialValues={dataInit?._id ? dataInit : {}}
        >
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProFormText
                label="Mã danh mục thu (DMT/ngày/tháng/năm)"
                name="incomeCategoryId"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {
                    pattern:
                      /^DMT\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
                    message: 'Mã danh mục thu không hợp lệ! (VD: DMT20240101)'
                  }
                ]}
                placeholder="Nhập mã danh mục thu"
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
                label="Năm"
                name="year"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                getValueFromEvent={(e: any) => e?.format('YYYY')}
                getValueProps={(e: string) => ({
                  value: e ? dayjs(e) : ''
                })}
              >
                <DatePicker
                  format="YYYY"
                  placeholder="yyyy"
                  picker="year"
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProForm.Item
                label="Dự toán (Từ 1.000đ - 10 tỷ)"
                name="budget"
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

export default ModalInComeCategory
