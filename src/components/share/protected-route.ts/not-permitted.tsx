import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'

const NotPermitted = () => {
  const navigate = useNavigate()
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không được phép truy cập trang này."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Quay lại
        </Button>
      }
    />
  )
}

export default NotPermitted
