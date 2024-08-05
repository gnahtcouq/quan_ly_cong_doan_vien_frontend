import {Button, Divider, Form, Input, message, notification} from 'antd'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {callLogin} from 'config/api'
import {useState, useEffect} from 'react'
import {fetchAccount, setUserLoginInfo} from '@/redux/slice/accountSlide'
import styles from 'styles/auth.module.scss'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import logo from '@/assets/logo.webp'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  )

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const callback = params?.get('callback')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(fetchAccount())
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  const onFinish = async (values: any) => {
    const {email, password} = values
    setIsSubmit(true)
    const res = await callLogin(email, password)
    setIsSubmit(false)
    if (res?.data) {
      localStorage.setItem('access_token', res.data.access_token)
      dispatch(setUserLoginInfo(res.data.user))
      message.success('Đăng nhập tài khoản thành công!')
      navigate(callback ? callback : '/')
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
    <div className={styles['login-page']}>
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
            <Form
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
                <Input
                  type="email"
                  onChange={(event) => setEmail(event?.target.value)}
                />
              </Form.Item>

              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  {required: true, message: 'Mật khẩu không được để trống!'}
                ]}
              >
                <Input.Password
                  onChange={(event) => setPassword(event?.target.value)}
                />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                  style={{width: '100%'}}
                  disabled={email && password ? false : true}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider></Divider>
              <p className="text text-normal" style={{textAlign: 'center'}}>
                Bạn chưa có tài khoản?
                <span>
                  <Link to="/register"> Đăng ký </Link> /
                  <Link to="/forgot-password"> Quên mật khẩu </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
