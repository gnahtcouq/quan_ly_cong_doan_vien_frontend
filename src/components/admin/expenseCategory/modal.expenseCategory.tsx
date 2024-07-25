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
  callCreateExpenseCategory,
  callUpdateExpenseCategory
} from '@/config/api'
import {IExpenseCategory} from '@/types/backend'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'
import {disabledMonthYear} from '@/config/utils'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IExpenseCategory | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ModalExpenseCategory = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [form] = Form.useForm()

  const submitExpenseCategory = async (valuesForm: any) => {
    const {id, description, year, budget} = valuesForm
    if (dataInit?._id) {
      //update
      const expenseCategory = {
        _id: dataInit._id,
        budget,
        description,
        year
      }

      const res = await callUpdateExpenseCategory(expenseCategory, dataInit._id)
      if (res.data) {
        message.success('Cập nhật danh mục chi thành công!')
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
      const expenseCategory = {
        id,
        description,
        year,
        budget
      }
      const res = await callCreateExpenseCategory(expenseCategory)
      if (res.data) {
        message.success('Thêm mới danh mục chi thành công!')
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
                ? 'Cập nhật danh mục chi'
                : 'Thêm mới danh mục chi'}
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
          onFinish={submitExpenseCategory}
          initialValues={dataInit?._id ? dataInit : {}}
        >
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProFormText
                label="Mã danh mục chi (DMC/ngày/tháng/năm)"
                name="id"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {
                    pattern:
                      /^DMC\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
                    message: 'Mã danh mục chi không hợp lệ! (VD: DMC20240101)'
                  }
                ]}
                placeholder="Nhập mã danh mục chi"
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

export default ModalExpenseCategory
