import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  notification
} from 'antd'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {callRegister} from 'config/api'
import styles from 'styles/auth.module.scss'
import {IUser} from '@/types/backend'
import {DatePicker} from 'antd'
import logo from '@/assets/logo.webp'

const {Option} = Select

const RegisterPage = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)

  const onFinish = async (values: IUser) => {
    const {name, email, password, dateOfBirth, gender, address} = values
    setIsSubmit(true)
    const res = await callRegister(
      name,
      email,
      password as string,
      dateOfBirth,
      gender,
      address
    )
    setIsSubmit(false)
    if (res?.data?._id) {
      message.success('Đăng ký tài khoản thành công!')
      navigate('/login')
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5
      })
    }
  }

  return (
    <div className={styles['register-page']}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.heading}>
              <div style={{height: 100, margin: 16, textAlign: 'center'}}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{maxHeight: '100%', maxWidth: '100%'}}
                />
              </div>
              <Divider />
            </div>
            <Form<IUser>
              name="basic"
              //   style={{maxWidth: 600, margin: '0 auto'}}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Email"
                name="email"
                rules={[
                  {required: true, message: 'Email không được để trống!'}
                ]}
              >
                <Input type="email" />
              </Form.Item>

              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'}
                  // {
                  //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  //   message:
                  //     'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.'
                  // }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Họ và tên"
                name="name"
                rules={[
                  {required: true, message: 'Họ và tên không được để trống!'}
                ]}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                    rules={[
                      {required: true, message: 'Vui lòng không để trống!'}
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: 'Giới tính không được để trống!'
                      }
                    ]}
                  >
                    <Select allowClear>
                      <Option value="MALE">Nam</Option>
                      <Option value="FEMALE">Nữ</Option>
                      <Option value="OTHER">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Địa chỉ"
                name="address"
                rules={[
                  {required: true, message: 'Địa chỉ không được để trống!'}
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                  style={{width: '100%'}}
                >
                  Đăng ký
                </Button>
              </Form.Item>
              <Divider />
              <p className="text text-normal" style={{textAlign: 'center'}}>
                {' '}
                Bạn đã có tài khoản?
                <span>
                  <Link to="/login"> Đăng nhập </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage
