import {useState} from 'react'
import styles from 'styles/client.module.scss'
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
  Result,
  Spin
} from 'antd'
import {callForgotUserPassword} from '@/config/api'
const SendForgotPassword = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const onFinish = async (values: any) => {
    const {email} = values
    setIsSubmit(true)
    try {
      const res = await callForgotUserPassword(email)

      if (res.data) {
        message.success('Gửi yêu cầu đặt lại mật khẩu thành công!')
        setTimeout(() => {
          window.location.href = '/'
        }, 4000)
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
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
    <Spin spinning={isLoading}>
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
    </Spin>
  )
}
export default SendForgotPassword
