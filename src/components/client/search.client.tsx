import {Button, Col, Form, Row, Select} from 'antd'
import {MonitorOutlined} from '@ant-design/icons'
import {THREADS_LIST} from '@/config/utils'
import {ProForm} from '@ant-design/pro-components'
import {useNavigate} from 'react-router-dom'

interface SearchClientProps {
  onFilterChange: (filter: string) => void
}

const SearchClient: React.FC<SearchClientProps> = ({onFilterChange}) => {
  const optionsThreads = THREADS_LIST
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: any): Promise<boolean | void> => {
    const {threads} = values
    const topicQuery = threads ? `threads=${threads}` : ''
    navigate(`/post?${topicQuery}`)
    onFilterChange(topicQuery) // Call the callback with the filter value
    return true // Indicate that form submission was successful
  }

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render: () => <></>
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <h2>Tìm kiếm bài đăng</h2>
        </Col>
        <Col span={24} md={16}>
          <ProForm.Item name="threads">
            <Select
              allowClear
              style={{width: '100%'}}
              placeholder={
                <>
                  <MonitorOutlined /> Tìm theo chủ đề...
                </>
              }
              optionLabelProp="label"
              options={optionsThreads}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <Button type="primary" onClick={() => form.submit()}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </ProForm>
  )
}

export default SearchClient
