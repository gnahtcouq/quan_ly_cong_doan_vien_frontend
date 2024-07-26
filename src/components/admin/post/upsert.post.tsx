import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Row,
  Select,
  message,
  notification
} from 'antd'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {
  FooterToolbar,
  ProForm,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'
import styles from 'styles/admin.module.scss'
import {THREADS_LIST} from '@/config/utils'
import {useState, useEffect} from 'react'
import {callCreatePost, callFetchPostById, callUpdatePost} from '@/config/api'
import {useQuill} from 'react-quilljs'
import {quillFormats, quillModules} from '@/config/quill'
import 'quill/dist/quill.snow.css'
import {EditOutlined, MonitorOutlined} from '@ant-design/icons'
import en_US from 'antd/lib/locale/en_US'
import {IPost} from '@/types/backend'

const ViewUpsertPost = (props: any) => {
  const navigate = useNavigate()
  const [value, setValue] = useState<string>('')

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const id = params?.get('id') // post id
  const [dataUpdate, setDataUpdate] = useState<IPost | null>(null)
  const [form] = Form.useForm()

  const {quill, quillRef} = useQuill({
    modules: quillModules,
    formats: quillFormats
  })

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await callFetchPostById(id)
        if (res && res.data) {
          setDataUpdate(res.data)
          setValue(res.data.description)
          form.setFieldsValue({
            ...res.data
          })
        }
      }
    }
    init()
    return () => form.resetFields()
  }, [id])

  useEffect(() => {
    if (quill && dataUpdate?.description) {
      const delta = JSON.parse(dataUpdate.description)
      quill.setContents(delta)
    }
  }, [quill, dataUpdate?.description])

  useEffect(() => {
    if (quill) {
      const handleChange = () => {
        const delta = quill.getContents()
        const deltaString = JSON.stringify(delta)
        setValue(deltaString)
        form.setFieldsValue({description: deltaString})
      }
      quill.on('text-change', handleChange)
      return () => {
        quill.off('text-change', handleChange)
      }
    }
  }, [quill, form])

  const onFinish = async (values: any) => {
    const delta = JSON.parse(values.description)

    if (delta.ops.length === 1 && delta.ops[0].insert === '\n') {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Vui lòng nhập mô tả bài đăng!'
      })
      return
    }

    if (dataUpdate?._id) {
      //update
      const post = {
        name: values.name,
        threads: values.threads,
        description: JSON.stringify(delta)
      }

      const res = await callUpdatePost(post, dataUpdate._id)
      if (res.data) {
        message.success('Cập nhật bài đăng thành công!')
        navigate('/admin/post')
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      //create
      const post = {
        name: values.name,
        threads: values.threads,
        description: value
      }

      const res = await callCreatePost(post)
      if (res.data) {
        message.success('Thêm mới bài đăng thành công!')
        navigate('/admin/post')
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    }
  }

  return (
    <div className={styles['upsert-post-container']}>
      <div className={styles['title']}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/post">Quản lý bài đăng</Link>
            },
            {
              title: (
                <>
                  {dataUpdate?._id ? 'Cập nhật bài đăng' : 'Thêm mới bài đăng'}
                </>
              )
            }
          ]}
        />
      </div>
      <div>
        <ConfigProvider locale={en_US}>
          <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
              searchConfig: {
                resetText: 'Hủy',
                submitText: (
                  <>
                    {dataUpdate?._id
                      ? 'Cập nhật bài đăng'
                      : 'Thêm mới bài đăng'}
                  </>
                )
              },
              onReset: () => navigate('/admin/post'),
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <EditOutlined />,
                disabled: dataUpdate?.status === 'ACTIVE' // Disable button if status is 'ACTIVE'
              }
            }}
          >
            <Row gutter={[20, 20]}>
              <Col span={12} md={12}>
                <ProFormText
                  label="Tiêu đề"
                  name="name"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
                  placeholder="Nhập tiêu đề"
                  disabled={dataUpdate?.status === 'ACTIVE'}
                />
              </Col>
              <Col span={12} md={12}>
                <Form.Item
                  label={'Chủ đề'}
                  name={'threads'}
                  rules={[{required: true, message: 'Vui lòng chọn chủ đề!'}]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    suffixIcon={null}
                    style={{width: '100%'}}
                    placeholder={
                      <>
                        <MonitorOutlined /> Chọn chủ đề...
                      </>
                    }
                    optionLabelProp="label"
                    options={THREADS_LIST}
                    variant="outlined"
                    disabled={dataUpdate?.status === 'ACTIVE'}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[20, 20]}>
              <Col span={24}>
                <ProForm.Item
                  name="description"
                  label="Mô tả bài đăng"
                  rules={[
                    {required: true, message: 'Vui lòng nhập mô tả bài đăng!'}
                  ]}
                >
                  <div
                    ref={quillRef}
                    style={{minHeight: 200, position: 'relative'}}
                  >
                    {dataUpdate?.status === 'ACTIVE' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          cursor: 'not-allowed'
                        }}
                      />
                    )}
                  </div>
                </ProForm.Item>
              </Col>
            </Row>
          </ProForm>
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ViewUpsertPost
