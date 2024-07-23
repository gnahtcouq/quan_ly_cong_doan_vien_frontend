import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'

const NotPermitted = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/') // Điều hướng đến trang chính nếu không có lịch sử
    }
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không được phép truy cập trang này."
      extra={
        <Button type="primary" onClick={handleGoBack}>
          Quay lại
        </Button>
      }
    />
  )
}

export default NotPermitted
