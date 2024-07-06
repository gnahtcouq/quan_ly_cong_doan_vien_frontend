import {Card, Col, Row, Spin, Statistic} from 'antd'
import CountUp from 'react-countup'
import {useEffect, useState} from 'react'
import {
  callFetchNumberOfUsers,
  callFetchNumberOfUnionists,
  callFetchNumberOfDepartments,
  callFetchNumberOfPosts,
  callFetchNumberOfDocuments
} from '@/config/api'

const DashboardPage = () => {
  const formatter = (value: number | string) => {
    return <CountUp end={Number(value)} separator="," />
  }

  const [userCount, setUserCount] = useState(0)
  const [unionistCount, setUnionistCount] = useState(0)
  const [departmentCount, setDepartmentCount] = useState(0)
  const [postCount, setPostCount] = useState(0)
  const [documentCount, setDocumentCount] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    // Fetch the data from the database and update the state
    const fetchCounts = async () => {
      setIsLoading(true)
      const userCountResponse = await callFetchNumberOfUsers()
      const unionistCountResponse = await callFetchNumberOfUnionists()
      const departmentCountResponse = await callFetchNumberOfDepartments()
      const postCountResponse = await callFetchNumberOfPosts()
      const documentCountResponse = await callFetchNumberOfDocuments()
      setUserCount(userCountResponse.data || 0)
      setUnionistCount(unionistCountResponse.data || 0)
      setDepartmentCount(departmentCountResponse.data || 0)
      setPostCount(postCountResponse.data || 0)
      setDocumentCount(documentCountResponse.data || 0)
      setIsLoading(false)
    }
    fetchCounts()
  }, [])

  return (
    <Spin spinning={isLoading}>
      <Row gutter={[20, 20]}>
        <Col span={24} md={8}>
          <Card title="Thành viên" bordered={false}>
            <Statistic
              title="Số lượng"
              value={userCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card title="Công đoàn viên" bordered={false}>
            <Statistic
              title="Số lượng"
              value={unionistCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card title="Đơn vị" bordered={false}>
            <Statistic
              title="Số lượng"
              value={departmentCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card title="Bài đăng" bordered={false}>
            <Statistic
              title="Số lượng"
              value={postCount}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24} md={8}>
          <Card title="Văn bản" bordered={false}>
            <Statistic
              title="Số lượng"
              value={documentCount}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}

export default DashboardPage
