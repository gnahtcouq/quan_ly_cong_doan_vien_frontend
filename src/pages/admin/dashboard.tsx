import {Card, Col, Row, Statistic} from 'antd'
import CountUp from 'react-countup'

const DashboardPage = () => {
  const formatter = (value: number | string) => {
    return <CountUp end={Number(value)} separator="," />
  }

  return (
    <Row gutter={[20, 20]}>
      <Col span={24} md={8}>
        <Card title="Thành viên" bordered={false}>
          <Statistic title="Số lượng" value={29} formatter={formatter} />
        </Card>
      </Col>
      <Col span={24} md={8}>
        <Card title="Công đoàn viên" bordered={false}>
          <Statistic title="Số lượng" value={10} formatter={formatter} />
        </Card>
      </Col>
      <Col span={24} md={8}>
        <Card title="Bài đăng" bordered={false}>
          <Statistic title="Số lượng" value={2} formatter={formatter} />
        </Card>
      </Col>
    </Row>
  )
}

export default DashboardPage
