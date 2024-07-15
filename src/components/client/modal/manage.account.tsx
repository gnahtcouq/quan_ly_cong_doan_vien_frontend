import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import type {TabsProps} from 'antd'
import {IDocument, IUser} from '@/types/backend'
import {useState, useEffect} from 'react'
import {
  callFetchDocumentByUser,
  callFetchUserById,
  callGetSubscriberThreads,
  callUpdateSubscriber,
  callUpdateUser,
  callUpdateUserEmail,
  callUpdateUserPassword
} from '@/config/api'
import type {ColumnsType} from 'antd/es/table'
import dayjs from 'dayjs'
import {CopyOutlined, ExportOutlined, MonitorOutlined} from '@ant-design/icons'
import {THREADS_LIST} from '@/config/utils'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {ProForm, ProFormSelect, ProFormText} from '@ant-design/pro-components'
import en_US from 'antd/locale/en_US'
import {updateUserInfo} from '@/redux/slice/accountSlide'

interface IProps {
  open: boolean
  onClose: (v: boolean) => void
}

// const UserDocument = (props: any) => {
//   const [listDoc, setListDoc] = useState<IDocument[]>([])
//   const [isFetching, setIsFetching] = useState<boolean>(false)

//   useEffect(() => {
//     const init = async () => {
//       setIsFetching(true)
//       const res = await callFetchDocumentByUser()
//       if (res && res.data) {
//         setListDoc(res.data as IDocument[])
//       }
//       setIsFetching(false)
//     }
//     init()
//   }, [])

//   const columns: ColumnsType<IDocument> = [
//     {
//       title: 'STT',
//       key: 'index',
//       width: 50,
//       align: 'center',
//       render: (text, record, index) => {
//         return <>{index + 1}</>
//       }
//     },
//     {
//       title: 'Tên văn bản',
//       dataIndex: 'name'
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       width: 100,
//       render(value, record, index) {
//         return (
//           <>
//             <Tag color={record.status === 'ACTIVE' ? 'lime' : 'red'}>
//               {record.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
//             </Tag>
//           </>
//         )
//       }
//     },
//     {
//       title: 'Ngày tạo',
//       dataIndex: 'createdAt',
//       render(value, record, index) {
//         return <>{dayjs(record.createdAt).format('DD/MM/YYYY - HH:mm:ss')}</>
//       }
//     },
//     {
//       title: 'Đường dẫn',
//       dataIndex: '',
//       width: 120,
//       render: (value, record, index) => (
//         <Space>
//           <CopyOutlined
//             style={{
//               fontSize: 20,
//               color: '#85b970'
//             }}
//             type=""
//             onClick={() => {
//               navigator.clipboard.writeText(
//                 `${import.meta.env.VITE_BACKEND_URL}/files/document/${
//                   record?.url
//                 }`
//               )
//               message.success('Đã lưu đường dẫn vào bảng nhớ tạm!')
//             }}
//           />

//           <a
//             href={`${import.meta.env.VITE_BACKEND_URL}/files/document/${
//               record?.url
//             }`}
//             target="_blank"
//           >
//             <ExportOutlined
//               style={{
//                 fontSize: 20,
//                 color: '#ffa500'
//               }}
//               type=""
//             />
//           </a>
//         </Space>
//       )
//     }
//   ]

//   return (
//     <div>
//       <Table<IDocument>
//         columns={columns}
//         dataSource={listDoc}
//         loading={isFetching}
//         pagination={false}
//       />
//     </div>
//   )
// }

const UserUpdateInfo = (props: any) => {
  const [dataInit, setDataInit] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const user = useAppSelector((state) => state.account.user) // Lấy thông tin user hiện tại
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      const res = await callFetchUserById(user._id)
      if (res && res.data) {
        setDataInit(res.data)
        form.setFieldsValue({
          ...res.data,
          dateOfBirth: res.data.dateOfBirth ? dayjs(res.data.dateOfBirth) : null
        })
      }
      setIsLoading(false)
    }
    fetchUserData()
  }, [user._id])

  const onFinish = async (values: any) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      address,
      CCCD,
      permissions
    } = values

    if (dataInit?._id) {
      // Nếu có thay đổi email, gửi yêu cầu thay đổi email qua API trước
      if (email !== dataInit.email) {
        setIsLoading(true)
        const resChangeEmail = await callUpdateUserEmail(dataInit._id, email)
        setIsLoading(false)
        if (resChangeEmail.data) {
          message.success('Yêu cầu thay đổi email đã được gửi đi!')
        } else {
          notification.error({
            message: 'Có lỗi xảy ra',
            description: resChangeEmail.message
          })
          return // Ngừng xử lý nếu có lỗi xảy ra khi gửi yêu cầu thay đổi email
        }
      }

      setIsLoading(true)
      // Tạo đối tượng user với thông tin mới nhưng giữ email hiện tại
      const user = {
        _id: dataInit._id,
        name,
        email: dataInit.email, // Giữ nguyên email hiện tại vì chưa xác nhận
        password,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        gender,
        address,
        CCCD: CCCD ? CCCD : null,
        permissions: dataInit.permissions
      }

      // Gửi yêu cầu cập nhật thông tin người dùng
      const resUpdateUser = await callUpdateUser(user, dataInit._id)
      const resSubscriber = await callGetSubscriberThreads()
      const resUpdateSubscriber = await callUpdateSubscriber({
        email: dataInit.email,
        name: user.name,
        threads: resSubscriber.data ? resSubscriber.data.threads : []
      })
      setIsLoading(false)

      if (resUpdateUser.data && resUpdateSubscriber.data) {
        message.success('Cập nhật thông tin thành công!')
        dispatch(updateUserInfo(user))
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: resUpdateUser.message || resUpdateSubscriber.message
        })
      }
    }
  }

  return (
    <>
      <Spin spinning={isLoading}>
        <Form
          onFinish={onFinish}
          form={form}
          style={{
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
          labelCol={{span: 24}}
          wrapperCol={{span: 24}}
        >
          <Row gutter={20} style={{flexGrow: 1}}>
            <Col span={12}>
              <ProFormText
                label="Họ và tên"
                name="name"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập họ và tên"
                style={{width: '100%'}}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Email"
                name="email"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {type: 'email', message: 'Vui lòng nhập email hợp lệ!'}
                ]}
                placeholder="Nhập email"
                style={{width: '100%'}}
              />
            </Col>
            <Col span={12}>
              <ProForm.Item
                label="Ngày sinh"
                name="dateOfBirth"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                style={{width: '100%'}}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="dd/mm/yyyy"
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col span={12}>
              <ProForm.Item
                name="gender"
                label="Giới tính"
                rules={[{required: true, message: 'Vui lòng chọn giới tính!'}]}
              >
                <Select placeholder="Chọn giới tính" style={{width: '100%'}}>
                  <Select.Option value="MALE">Nam</Select.Option>
                  <Select.Option value="FEMALE">Nữ</Select.Option>
                  <Select.Option value="OTHER">Khác</Select.Option>
                </Select>
              </ProForm.Item>
            </Col>
            <Col span={12}>
              <ProFormText
                label="Căn cước công dân"
                name="CCCD"
                rules={[{required: false}]}
                placeholder="Nhập căn cước công dân"
                style={{width: '100%'}}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                label="Địa chỉ"
                name="address"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập địa chỉ"
                style={{width: '100%'}}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'center'}}>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{width: '100%'}}
              >
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  )
}

const PostByEmail = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const user = useAppSelector((state) => state.account.user)

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const res = await callGetSubscriberThreads()
      if (res && res.data) {
        form.setFieldValue('threads', res.data.threads)
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const onFinish = async (values: any) => {
    setIsLoading(true)
    const {threads} = values
    const res = await callUpdateSubscriber({
      email: user.email,
      name: user.name,
      threads: threads ? threads : []
    })
    setIsLoading(false)
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
      <Spin spinning={isLoading}>
        <Form
          onFinish={onFinish}
          form={form}
          style={{
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Form.Item
                label={'Chủ đề'}
                name={'threads'}
                rules={[{required: false}]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  suffixIcon={null}
                  style={{width: '100%'}}
                  placeholder={
                    <>
                      <MonitorOutlined /> Tìm theo chủ đề...
                    </>
                  }
                  optionLabelProp="label"
                  options={THREADS_LIST}
                  variant="outlined"
                />
              </Form.Item>
            </Col>
            <Col span={24} style={{textAlign: 'center'}}>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{width: '100%'}}
              >
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  )
}

const UserUpdatePassword = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const user = useAppSelector((state) => state.account.user)

  const onFinish = async (values: any) => {
    const {currentPassword, newPassword, reNewPassword} = values
    if (newPassword !== reNewPassword) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Mật khẩu mới và xác nhận mật khẩu không khớp!'
      })
      return
    }

    setIsLoading(true)
    const res = await callUpdateUserPassword(
      user._id,
      currentPassword,
      newPassword
    )
    setIsLoading(false)

    if (res.data) {
      message.success('Cập nhật mật khẩu thành công!')
      form.resetFields()
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message
      })
    }
  }

  return (
    <>
      <Spin spinning={isLoading}>
        <Form
          onFinish={onFinish}
          form={form}
          style={{
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%'
          }}
          labelCol={{span: 24}}
          wrapperCol={{span: 24}}
        >
          <Row gutter={20} style={{flexGrow: 1}}>
            <Col span={24}>
              <ProFormText.Password
                label="Mật khẩu hiện tại"
                name="currentPassword"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập mật khẩu hiện tại"
                style={{width: '100%'}}
              />
            </Col>
            <Col span={24}>
              <ProFormText.Password
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.'
                  }
                ]}
                placeholder="Nhập mật khẩu mới"
                style={{width: '100%'}}
              />
            </Col>
            <Col span={24}>
              <ProFormText.Password
                label="Nhập lại mật khẩu mới"
                name="reNewPassword"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập lại mật khẩu mới"
                style={{width: '100%'}}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'center'}}>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{width: '100%'}}
              >
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  )
}

const ManageAccount = (props: IProps) => {
  const {open, onClose} = props

  const onChange = (key: string) => {
    // console.log(key);
  }

  const items: TabsProps['items'] = [
    // {
    //   key: 'user-document',
    //   label: `Văn bản`,
    //   children: <UserDocument />
    // },
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
      children: <UserUpdatePassword />
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
        width={isMobile ? '100%' : '600px'}
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
