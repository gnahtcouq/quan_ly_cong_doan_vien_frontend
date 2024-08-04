import {useEffect, useState} from 'react'
import styles from 'styles/client.module.scss'
import {Button, Divider, Form, Input, message, notification} from 'antd'
import {callForgotUnionistPassword, callForgotUserPassword} from '@/config/api'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {fetchAccount} from '@/redux/slice/accountSlide'
import {useNavigate} from 'react-router-dom'
const SendForgotPassword = (props: any) => {
  const [isSubmit, setIsSubmit] = useState(false)
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  )
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAccount())
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  const onFinish = async (values: any) => {
    const {email} = values
    setIsSubmit(true)
    try {
      const resUser = await callForgotUserPassword(email)
      const resUnionist = await callForgotUnionistPassword(email)

      if (resUser.data) {
        message.success(
          'Gửi yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra email của bạn!'
        )
        setTimeout(() => {
          window.location.href = '/'
        }, 4000)
      } else if (resUnionist.data) {
        message.success(
          'Gửi yêu cầu đặt lại mật khẩu thành công. Vui lòng kiểm tra email của bạn!'
        )
        setTimeout(() => {
          window.location.href = '/'
        }, 4000)
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: resUser.message || resUnionist.message
        })
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Gửi yêu cầu đặt lại mật khẩu không thành công!'
      })
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <div className={`${styles['change-email-pane']} ${styles['container']}`}>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <Form name="basic" onFinish={onFinish} autoComplete="off">
              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Email của bạn"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Email không được để trống!'
                  }
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Divider></Divider>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmit}
                  style={{width: '100%'}}
                >
                  Gửi
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </main>
    </div>
  )
}
export default SendForgotPassword
