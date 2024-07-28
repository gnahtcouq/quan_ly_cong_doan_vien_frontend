import {Button, Col, Form, Row, Select} from 'antd'
import {MonitorOutlined} from '@ant-design/icons'
import {THREADS_LIST} from '@/config/utils'
import {ProForm} from '@ant-design/pro-components'

const SearchClient = () => {
  const optionsThreads = THREADS_LIST
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {}

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
          <h1>Tìm kiếm</h1>
        </Col>
        <Col span={24} md={16}>
          <ProForm.Item name="threads">
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{width: '100%'}}
              placeholder={
                <>
                  <MonitorOutlined /> Tìm kiếm theo chủ đề...
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
