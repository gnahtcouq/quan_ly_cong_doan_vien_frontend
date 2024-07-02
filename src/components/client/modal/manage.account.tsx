import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import type {TabsProps} from 'antd'
import {IDocument} from '@/types/backend'
import {useState, useEffect} from 'react'
import {
  callFetchDocumentByUser,
  callGetSubscriberThreads,
  callUpdateSubscriber
} from '@/config/api'
import type {ColumnsType} from 'antd/es/table'
import dayjs from 'dayjs'
import {CopyOutlined, ExportOutlined, MonitorOutlined} from '@ant-design/icons'
import {THREADS_LIST} from '@/config/utils'
import {useAppSelector} from '@/redux/hooks'

interface IProps {
  open: boolean
  onClose: (v: boolean) => void
}

const UserDocument = (props: any) => {
  const [listDoc, setListDoc] = useState<IDocument[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      setIsFetching(true)
      const res = await callFetchDocumentByUser()
      if (res && res.data) {
        setListDoc(res.data as IDocument[])
      }
      setIsFetching(false)
    }
    init()
  }, [])

  const columns: ColumnsType<IDocument> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1}</>
      }
    },
    {
      title: 'Tên văn bản',
      dataIndex: 'name'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      render(value, record, index) {
        return (
          <>
            <Tag color={record.status === 'ACTIVE' ? 'lime' : 'red'}>
              {record.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
          </>
        )
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render(value, record, index) {
        return <>{dayjs(record.createdAt).format('DD/MM/YYYY - HH:mm:ss')}</>
      }
    },
    {
      title: 'Đường dẫn',
      dataIndex: '',
      width: 120,
      render: (value, record, index) => (
        <Space>
          <CopyOutlined
            style={{
              fontSize: 20,
              color: '#85b970'
            }}
            type=""
            onClick={() => {
              navigator.clipboard.writeText(
                `${import.meta.env.VITE_BACKEND_URL}/files/document/${
                  record?.url
                }`
              )
              message.success('Đã lưu đường dẫn vào bảng nhớ tạm!')
            }}
          />

          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/files/document/${
              record?.url
            }`}
            target="_blank"
          >
            <ExportOutlined
              style={{
                fontSize: 20,
                color: '#ffa500'
              }}
              type=""
            />
          </a>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Table<IDocument>
        columns={columns}
        dataSource={listDoc}
        loading={isFetching}
        pagination={false}
      />
    </div>
  )
}

const UserUpdateInfo = (props: any) => {
  return <div>//todo</div>
}

const PostByEmail = (props: any) => {
  const [form] = Form.useForm()
  const user = useAppSelector((state) => state.account.user)

  useEffect(() => {
    const init = async () => {
      const res = await callGetSubscriberThreads()
      if (res && res.data) {
        form.setFieldValue('threads', res.data.threads)
      }
    }
    init()
  }, [])

  const onFinish = async (values: any) => {
    const {threads} = values
    const res = await callUpdateSubscriber({
      email: user.email,
      name: user.name,
      threads: threads ? threads : []
    })
    if (res.data) {
      message.success('Cập nhật thông tin thành công!')
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message
      })
    }
  }

  return (
    <>
      <Form onFinish={onFinish} form={form}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label={'Chủ đề'}
              name={'threads'}
              rules={[
                {required: true, message: 'Vui lòng chọn ít nhất 1 chủ đề!'}
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                showArrow={false}
                style={{width: '100%'}}
                placeholder={
                  <>
                    <MonitorOutlined /> Tìm theo chủ đề...
                  </>
                }
                optionLabelProp="label"
                options={THREADS_LIST}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button onClick={() => form.submit()}>Cập nhật</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

const ManageAccount = (props: IProps) => {
  const {open, onClose} = props

  const onChange = (key: string) => {
    // console.log(key);
  }

  const items: TabsProps['items'] = [
    {
      key: 'user-document',
      label: `Văn bản`,
      children: <UserDocument />
    },
    {
      key: 'email-by-threads',
      label: `Nhận thông báo bài đăng qua Email`,
      children: <PostByEmail />
    },
    {
      key: 'user-update-info',
      label: `Cập nhật thông tin`,
      children: <UserUpdateInfo />
    },
    {
      key: 'user-password',
      label: `Thay đổi mật khẩu`,
      children: `//todo`
    }
  ]

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={open}
        onCancel={() => onClose(false)}
        maskClosable={false}
        footer={null}
        destroyOnClose={true}
        width={isMobile ? '100%' : '1000px'}
      >
        <div style={{minHeight: 400}}>
          <Tabs
            defaultActiveKey="user-document"
            items={items}
            onChange={onChange}
          />
        </div>
      </Modal>
    </>
  )
}

export default ManageAccount
