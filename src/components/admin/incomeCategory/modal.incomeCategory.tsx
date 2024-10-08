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
import vi_VN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import {disabledMonthYear} from '@/config/utils'

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
    const {id, description, year, budget} = valuesForm
    if (dataInit?._id) {
      //update
      const incomeCategory = {
        _id: dataInit._id,
        description,
        budget,
        year
      }

      const res = await callUpdateIncomeCategory(incomeCategory, dataInit._id)
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
      const incomeCategory = {
        id,
        description,
        year,
        budget
      }
      const res = await callCreateIncomeCategory(incomeCategory)
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
      <ConfigProvider locale={vi_VN}>
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
            maskClosable: false,
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
                name="id"
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
                  disabledDate={disabledMonthYear}
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
                  placeholder="Nhập số tiền"
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
