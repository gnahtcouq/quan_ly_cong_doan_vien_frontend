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
  Row,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import {callCreateUser, callUpdateUser} from '@/config/api'
import {IUser} from '@/types/backend'
import vi_VN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import {disabledDateBirthday, validateDateOfBirth} from '@/config/utils'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IUser | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ModalUser = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [form] = Form.useForm()

  const submitUser = async (valuesForm: any) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      CCCD,
      note,
      permissions
    } = valuesForm

    if (dataInit?._id) {
      //update
      const user = {
        _id: dataInit._id,
        name,
        email,
        password,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        gender,
        phoneNumber: phoneNumber ? phoneNumber : null,
        address,
        CCCD: CCCD ? CCCD : null,
        note,
        permissions: dataInit.permissions
      }

      const res = await callUpdateUser(user, dataInit._id)
      if (res.data) {
        message.success('Cập nhật thành viên thành công!')
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
      const user = {
        name,
        email,
        password,
        dateOfBirth,
        gender,
        phoneNumber,
        address,
        CCCD,
        note,
        permissions
      }
      const res = await callCreateUser(user)
      if (res.data) {
        message.success('Thêm mới thành viên thành công!')
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

  const initialValues = dataInit
    ? {
        ...dataInit,
        dateOfBirth: dataInit.dateOfBirth ? dayjs(dataInit.dateOfBirth) : null
      }
    : {}

  return (
    <>
      <ConfigProvider locale={vi_VN}>
        <ModalForm
          title={
            <>
              {dataInit?._id
                ? 'Cập nhật thông tin thành viên'
                : 'Thêm mới thành viên'}
            </>
          }
          open={openModal}
          modalProps={{
            onCancel: () => {
              handleReset()
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            width: isMobile ? '100%' : 900,
            keyboard: false,
            maskClosable: false,
            okText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>,
            cancelText: 'Hủy'
          }}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          onFinish={submitUser}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText
                label="Email"
                name="email"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {type: 'email', message: 'Vui lòng nhập email hợp lệ!'}
                ]}
                placeholder="Nhập email"
              />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText.Password
                disabled={dataInit?._id ? true : false}
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: dataInit?._id ? false : true,
                    message: 'Vui lòng không để trống!'
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.'
                  }
                ]}
                placeholder="Nhập mật khẩu"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormText
                label="Họ và tên"
                name="name"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập họ và tên"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormSelect
                name="gender"
                label="Giới tính"
                valueEnum={{
                  MALE: 'Nam',
                  FEMALE: 'Nữ',
                  OTHER: 'Khác'
                }}
                placeholder="Chọn giới tính"
                rules={[{required: true, message: 'Vui lòng chọn giới tính!'}]}
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                label="Ngày sinh"
                name="dateOfBirth"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {validator: validateDateOfBirth}
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="dd/mm/yyyy"
                  disabledDate={disabledDateBirthday}
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormText
                label="Căn cước công dân"
                name="CCCD"
                rules={[
                  {
                    required: false,
                    pattern: /^[0-9]{9,12}$/,
                    message: 'Vui lòng nhập CCCD hợp lệ!'
                  }
                ]}
                placeholder="Nhập căn cước công dân"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormText
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: false,
                    pattern: /^(03|05|07|08|09)[0-9]{8}$/,
                    message: 'Vui lòng nhập số điện thoại hợp lệ!'
                  }
                ]}
                placeholder="Nhập số điện thoại"
              />
            </Col>
            <Col lg={18} md={24} sm={24} xs={24}>
              <ProFormText
                label="Ghi chú"
                name="note"
                rules={[{required: false}]}
                placeholder="Nhập ghi chú"
              />
            </Col>
            <Col lg={24} md={12} sm={24} xs={24}>
              <ProFormText
                label="Địa chỉ"
                name="address"
                rules={[{required: false, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập địa chỉ"
              />
            </Col>
          </Row>
        </ModalForm>
      </ConfigProvider>
    </>
  )
}

export default ModalUser
