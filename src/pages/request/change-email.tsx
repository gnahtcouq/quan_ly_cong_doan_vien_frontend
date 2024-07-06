import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import styles from 'styles/client.module.scss'
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
  Skeleton,
  Spin,
  Tag
} from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {useAppSelector} from '@/redux/hooks'
import {callConfirmUpdateUserEmail} from '@/config/api'
import validator from 'validator'

const ConfirmEmailChange = (props: any) => {
  const user = useAppSelector((state) => state.account.user)
  const [isSubmit, setIsSubmit] = useState(false)

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const newEmail = params?.get('newEmail')
  const userId = location.pathname.split('/').pop()

  const onFinish = async (values: any) => {
    const {verificationCode} = values
    setIsSubmit(true)
    try {
      if (user._id === userId && validator.isEmail(newEmail)) {
        const res = await callConfirmUpdateUserEmail(
          user._id,
          verificationCode,
          newEmail?.toString() || ''
        )

        if (res.data) {
          message.success('Cập nhật thông tin thành công!')
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        } else {
          notification.error({
            message: 'Có lỗi xảy ra',
            description: res.message
          })
        }
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Dữ liệu không hợp lệ!'
        })
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Xác nhận thay đổi email không thành công.'
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
                name="verificationCode"
                rules={[
                  {
                    required: true,
                    message: 'Mã xác nhận không được để trống!'
                  }
                ]}
              >
                <Input />
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
export default ConfirmEmailChange
