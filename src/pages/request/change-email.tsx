import {useLocation} from 'react-router-dom'
import {useEffect, useState} from 'react'
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
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {callConfirmUpdateUserEmail, callFetchUserById} from '@/config/api'
import {updateUserInfo} from '@/redux/slice/accountSlide'

const ConfirmChangeEmail = (props: any) => {
  const [verificationExpires, setVerificationExpires] = useState<string | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const user = useAppSelector((state) => state.account.user)
  const dispatch = useAppDispatch()
  const [isSubmit, setIsSubmit] = useState(false)

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const newEmail = params?.get('newEmail')
  const userId = location.pathname.split('/').pop()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user._id) {
        return
      }

      if (userId !== user._id) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Dữ liệu không hợp lệ'
        })
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
        return
      }

      setIsLoading(true)
      try {
        const res = await callFetchUserById(userId?.toString() || '')
        if (res && res.data) {
          setVerificationExpires(
            res.data.verificationExpires?.toString() || null
          )
          if (!res.data.verificationExpires) {
            window.location.href = '/'
          }
        } else {
          notification.error({
            message: 'Có lỗi xảy ra',
            description: res.message
          })
        }
      } catch (error) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Dữ liệu không hợp lệ'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId, user._id])

  useEffect(() => {
    // Kiểm tra và chuyển hướng nếu verificationExpires không hợp lệ
    if (!verificationExpires) {
      const expiryDate = new Date(verificationExpires?.toString() || '')
      const currentDate = new Date()

      if (expiryDate <= currentDate) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Thời gian xác nhận đã hết hạn. Vui lòng gửi yêu cầu mới'
        })
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    }
  }, [verificationExpires])

  const onFinish = async (values: any) => {
    const {verificationCode} = values
    setIsSubmit(true)
    try {
      if (user._id === userId) {
        const res = await callConfirmUpdateUserEmail(
          user._id,
          verificationCode,
          newEmail?.toString() || ''
        )

        if (res.data) {
          message.success('Cập nhật thông tin thành công!')
          dispatch(updateUserInfo({email: res.data.email}))
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
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
        description: 'Xác nhận thay đổi email không thành công!'
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
    </Spin>
  )
}
export default ConfirmChangeEmail
