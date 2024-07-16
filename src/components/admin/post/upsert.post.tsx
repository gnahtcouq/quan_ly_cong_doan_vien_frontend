import {
  Breadcrumb,
  Col,
  ConfigProvider,
  DatePicker,
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
// import {IDepartmentSelect} from '../user/modal.user'
import {useState, useEffect} from 'react'
import {
  callCreatePost,
  callFetchDepartment,
  callFetchPostById,
  callUpdatePost
} from '@/config/api'
import {useQuill} from 'react-quilljs'
import {quillFormats, quillModules} from '@/config/quill'
import 'quill/dist/quill.snow.css'
import {EditOutlined, MonitorOutlined} from '@ant-design/icons'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'
import {IPost} from '@/types/backend'

const ViewUpsertPost = (props: any) => {
  // const [departments, setDepartments] = useState<IDepartmentSelect[]>([])

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
          // setDepartments([
          //   {
          //     label: res.data.department?.name as string,
          //     value:
          //       `${res.data.department?._id}@#$${res.data.department?.logo}` as string,
          //     key: res.data.department?._id
          //   }
          // ])

          form.setFieldsValue({
            ...res.data,
            // department: {
            //   label: res.data.department?.name as string,
            //   value:
            //     `${res.data.department?._id}@#$${res.data.department?.logo}` as string,
            //   key: res.data.department?._id
            // },
            isActive: res.data.isActive
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

  // // Usage of DebounceSelect
  // async function fetchDepartmentList(
  //   name: string
  // ): Promise<IDepartmentSelect[]> {
  //   const res = await callFetchDepartment(
  //     `current=1&pageSize=100&name=/${name}/i`
  //   )
  //   if (res && res.data) {
  //     const list = res.data.result
  //     const temp = list.map((item) => {
  //       return {
  //         label: item.name as string,
  //         value: `${item._id}@#$${item.logo}` as string
  //       }
  //     })
  //     return temp
  //   } else return []
  // }

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
      // const cp = values?.department?.value?.split('@#$')
      const post = {
        name: values.name,
        threads: values.threads,
        // department: {
        //   _id: cp && cp.length > 0 ? cp[0] : '',
        //   name: values.department.label,
        //   logo: cp && cp.length > 1 ? cp[1] : ''
        // },
        description: JSON.stringify(delta),
        // startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate)
        //   ? dayjs(values.startDate, 'DD/MM/YYYY').toDate()
        //   : values.startDate,
        // endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate)
        //   ? dayjs(values.endDate, 'DD/MM/YYYY').toDate()
        //   : values.endDate,
        isActive: values.isActive
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
      // const cp = values?.department?.value?.split('@#$')
      const post = {
        name: values.name,
        threads: values.threads,
        // department: {
        //   _id: cp && cp.length > 0 ? cp[0] : '',
        //   name: values.department.label,
        //   logo: cp && cp.length > 1 ? cp[1] : ''
        // },
        description: value,
        // startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
        // endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
        isActive: values.isActive
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
                icon: <EditOutlined />
              }
            }}
          >
            <Row gutter={[20, 20]}>
              <Col span={24} md={12}>
                <ProFormText
                  label="Tiêu đề"
                  name="name"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
                  placeholder="Nhập tiêu đề"
                />
              </Col>
              <Col span={24} md={6}>
                <ProFormSwitch
                  label="Trạng thái"
                  name="isActive"
                  checkedChildren="ACTIVE"
                  unCheckedChildren="INACTIVE"
                  initialValue={true}
                  fieldProps={{
                    defaultChecked: true
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[20, 20]}>
              <Col span={24} md={12}>
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
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <ProForm.Item
                  name="description"
                  label="Mô tả bài đăng"
                  rules={[
                    {required: true, message: 'Vui lòng nhập mô tả bài đăng!'}
                  ]}
                >
                  <div ref={quillRef} style={{minHeight: 200}} />
                </ProForm.Item>
              </Col>
            </Row>
            <Divider />
          </ProForm>
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ViewUpsertPost
