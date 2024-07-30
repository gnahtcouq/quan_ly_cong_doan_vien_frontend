import {useLocation} from 'react-router-dom'
import {useEffect, useState} from 'react'
import styles from 'styles/client.module.scss'
import {Button, Divider, Form, Input, message, notification} from 'antd'
import {callConfirmForgotUserPassword} from '@/config/api'

const ConfirmForgotPassword = (props: any) => {
  const [isSubmit, setIsSubmit] = useState(false)

  let location = useLocation()
  const userId = location.pathname.split('/').pop()

  const onFinish = async (values: any) => {
    const {verificationCodePassword, newPassword} = values
    setIsSubmit(true)
    try {
      const res = await callConfirmForgotUserPassword(
        userId || '',
        verificationCodePassword,
        newPassword
      )

      if (res.data) {
        message.success('Cập nhật thông tin thành công!')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Hãy liên hệ với quản trị viên của bạn!'
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
                label="Mã xác nhận"
                name="verificationCodePassword"
                rules={[
                  {
                    required: true,
                    message: 'Mã xác nhận không được để trống!'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelCol={{span: 24}} //whole column
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: 'Mật khẩu mới không được để trống!'
                  }
                ]}
              >
                <Input.Password />
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
export default ConfirmForgotPassword
