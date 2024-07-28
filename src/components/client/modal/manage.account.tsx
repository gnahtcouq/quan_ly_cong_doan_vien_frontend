import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import type {TabsProps} from 'antd'
import {IFee, IUser} from '@/types/backend'
import {useState, useEffect} from 'react'
import {
  callFetchFeesByUnionist,
  callFetchUnionistById,
  callFetchUserById,
  callGetSubscriberThreads,
  callUpdateSubscriber,
  callUpdateUnionist,
  callUpdateUnionistEmail,
  callUpdateUnionistPassword,
  callUpdateUser,
  callUpdateUserEmail,
  callUpdateUserPassword
} from '@/config/api'
import type {ColumnsType} from 'antd/es/table'
import dayjs from 'dayjs'
import {MonitorOutlined} from '@ant-design/icons'
import {formatCurrency, THREADS_LIST} from '@/config/utils'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {ProForm, ProFormText} from '@ant-design/pro-components'
import {updateUserInfo} from '@/redux/slice/accountSlide'
import queryString from 'query-string'
import vi_VN from 'antd/locale/vi_VN'

interface IProps {
  open: boolean
  onClose: (v: boolean) => void
}

const UnionistFees = (props: any) => {
  const [listFee, setListFee] = useState<IFee[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(6)
  const [total, setTotal] = useState<number>(0)
  const [monthYear, setMonthYear] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [totalFee, setTotalFee] = useState<number>(0)
  const [searchType, setSearchType] = useState<'all' | 'year' | 'monthYear'>(
    'all'
  )
  const [datePickerKey, setDatePickerKey] = useState<number>(0) // Thêm state để buộc DatePicker làm mới
  const {Option} = Select

  useEffect(() => {
    const fetchFees = async () => {
      setIsFetching(true)
      const query = queryString.stringify({
        current,
        pageSize,
        ...(year ? {year} : {}),
        ...(monthYear ? {monthYear} : {})
      })
      const res = await callFetchFeesByUnionist(query)
      if (res && res.data) {
        setListFee(res.data.result)
        setTotalFee(res.data.meta.totalFee || 0)
        setTotal(res.data.meta.total || 1) // Đặt total theo kết quả thực tế hoặc mặc định là 1 nếu có monthYear
      } else {
        setListFee([])
        setTotal(0)
      }
      setIsFetching(false)
    }
    fetchFees()
  }, [current, pageSize, monthYear, year, searchType])

  // Hàm xử lý khi phân trang thay đổi
  const handleTableChange = (pagination) => {
    setCurrent(pagination.current)
    setPageSize(pagination.pageSize)
  }

  const handleDateChange = (date) => {
    if (searchType === 'monthYear') {
      if (date) {
        const formattedDate = date.format('YYYY/MM')
        setMonthYear(formattedDate)
        setYear(null)
      } else {
        setMonthYear(null)
      }
    } else if (searchType === 'year') {
      if (date) {
        const formattedDate = date.format('YYYY')
        setYear(formattedDate)
        setMonthYear(null)
      } else {
        setYear(null)
      }
    } else {
      setMonthYear(null)
      setYear(null)
    }
    setCurrent(1) // Reset lại trang hiện tại về trang 1 khi có thay đổi tìm kiếm
  }

  const handleSearchTypeChange = (value) => {
    setSearchType(value)
    setMonthYear(null)
    setYear(null)
    setCurrent(1)
    setDatePickerKey((prev) => prev + 1) // Thay đổi key để buộc DatePicker làm mới
  }

  const columns: ColumnsType<IFee> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (current - 1) * pageSize}</>
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'monthYear'
    },
    {
      title: 'Số tiền',
      dataIndex: 'fee',
      render: (text, record) => formatCurrency(record.fee)
    }
  ]

  return (
    <div>
      <ConfigProvider locale={vi_VN}>
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProForm.Item label="Tìm kiếm">
              <Select
                defaultValue="year"
                style={{width: '100%'}}
                onChange={handleSearchTypeChange}
              >
                <Option value="all">Tất cả</Option>
                <Option value="year">Năm</Option>
                <Option value="monthYear">Tháng/Năm</Option>
              </Select>
            </ProForm.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <DatePicker
              key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
              format={searchType === 'year' ? 'YYYY' : 'YYYY/MM'}
              placeholder={
                searchType === 'all'
                  ? '*'
                  : searchType === 'year'
                  ? 'yyyy'
                  : 'yyyy/mm'
              }
              picker={searchType === 'year' ? 'year' : 'month'}
              onChange={handleDateChange}
              disabled={searchType === 'all'}
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProForm.Item label="Tổng số tiền đã đóng">
              <Tag color="red">{formatCurrency(totalFee)}</Tag>
            </ProForm.Item>
          </Col>
        </Row>
        <Table<IFee>
          columns={columns}
          dataSource={listFee.map((item) => ({...item, key: item._id}))}
          loading={isFetching}
          pagination={{
            current: current,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (page, pageSize) =>
              handleTableChange({current: page, pageSize}),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} hàng`
          }}
        />
      </ConfigProvider>
    </div>
  )
}

const UserUpdateInfo = (props: any) => {
  const [dataInit, setDataInit] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const user = useAppSelector((state) => state?.account?.user) // Lấy thông tin user hiện tại
  const type = useAppSelector((state) => state?.account?.user?.type) // Lấy loại user hiện tại
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      if (type === 'user') {
        const res = await callFetchUserById(user._id)
        if (res && res.data) {
          setDataInit(res.data)
          form.setFieldsValue({
            ...res.data,
            dateOfBirth: res.data.dateOfBirth
              ? dayjs(res.data.dateOfBirth)
              : null
          })
        }
      } else {
        const res = await callFetchUnionistById(user._id)
        if (res && res.data) {
          setDataInit(res.data)
          form.setFieldsValue({
            ...res.data,
            dateOfBirth: res.data.dateOfBirth
              ? dayjs(res.data.dateOfBirth)
              : null
          })
        }
      }
      setIsLoading(false)
    }
    fetchUserData()
  }, [user._id])

  const onFinish = async (values: any) => {
    const {name, email, password, dateOfBirth, gender, address, CCCD} = values

    if (dataInit?._id) {
      // Nếu có thay đổi email, gửi yêu cầu thay đổi email qua API trước
      if (email !== dataInit.email) {
        setIsLoading(true)
        if (type === 'user') {
          const resChangeEmail = await callUpdateUserEmail(dataInit._id, email)
          if (resChangeEmail.data) {
            message.success('Yêu cầu thay đổi email đã được gửi đi!')
          } else {
            notification.error({
              message: 'Có lỗi xảy ra',
              description: resChangeEmail.message
            })
            setIsLoading(false)
            return // Ngừng xử lý nếu có lỗi xảy ra khi gửi yêu cầu thay đổi email
          }
        } else {
          const resChangeEmail = await callUpdateUnionistEmail(
            dataInit._id,
            email
          )
          if (resChangeEmail.data) {
            message.success('Yêu cầu thay đổi email đã được gửi đi!')
          } else {
            notification.error({
              message: 'Có lỗi xảy ra',
              description: resChangeEmail.message
            })
            setIsLoading(false)
            return // Ngừng xử lý nếu có lỗi xảy ra khi gửi yêu cầu thay đổi email
          }
        }
        setIsLoading(false)
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
        CCCD: CCCD ? CCCD : null
      }

      // Gửi yêu cầu cập nhật thông tin người dùng
      if (type === 'user') {
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
      } else {
        const resUpdateUnionist = await callUpdateUnionist(user, dataInit._id)
        const resSubscriber = await callGetSubscriberThreads()
        const resUpdateSubscriber = await callUpdateSubscriber({
          email: dataInit.email,
          name: user.name,
          threads: resSubscriber.data ? resSubscriber.data.threads : []
        })
        setIsLoading(false)

        if (resUpdateUnionist.data && resUpdateSubscriber.data) {
          message.success('Cập nhật thông tin thành công!')
          dispatch(updateUserInfo(user))
        } else {
          notification.error({
            message: 'Có lỗi xảy ra',
            description:
              resUpdateUnionist.message || resUpdateSubscriber.message
          })
        }
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
  const user = useAppSelector((state) => state?.account?.user)
  const type = useAppSelector((state) => state?.account?.user?.type) // Lấy loại user hiện tại

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
    if (type === 'user') {
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
    } else {
      const res = await callUpdateUnionistPassword(
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
  const type = useAppSelector((state) => state?.account?.user?.type) // Lấy loại user hiện tại

  const onChange = (key: string) => {
    // console.log(key);
  }

  // if (type === 'unionist')

  const items: TabsProps['items'] = [
    ...(type === 'unionist'
      ? [
          {
            key: 'unionist-fees',
            label: `Công đoàn phí`,
            children: <UnionistFees />
          }
        ]
      : []),
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
        width={isMobile ? '100%' : '700px'}
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
