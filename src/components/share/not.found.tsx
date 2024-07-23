import {useNavigate} from 'react-router-dom'
import {Button, Result} from 'antd'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/') // Điều hướng đến trang chính nếu không có lịch sử
    }
  }
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
        extra={
          <Button type="primary" onClick={handleGoBack}>
            Quay lại
          </Button>
        }
      />
    </>
  )
}

export default NotFound
