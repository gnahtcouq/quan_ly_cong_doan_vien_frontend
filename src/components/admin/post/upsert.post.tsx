import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Row,
  message,
  notification
} from 'antd'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {DebounceSelect} from '../user/debouce.select'
import {
  FooterToolbar,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
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
import 'quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react'
import {EditOutlined} from '@ant-design/icons'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'
import {IPost} from '@/types/backend'
import Quill from 'quill'

Quill.register('modules/imageResize', ImageResize)

const ViewUpsertPost = (props: any) => {
  // const [departments, setDepartments] = useState<IDepartmentSelect[]>([])

  const navigate = useNavigate()
  const [value, setValue] = useState<string>('')

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const id = params?.get('id') // post id
  const [dataUpdate, setDataUpdate] = useState<IPost | null>(null)
  const [form] = Form.useForm()

  // Custom toolbar options
  const modules = {
    toolbar: [
      [{header: '1'}, {header: '2'}, {font: []}],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
      [{color: []}, {background: []}],
      ['link', 'image'],
      ['clean']
    ],
    // Include the ImageResize module
    imageResize: {
      modules: ['Resize', 'Toolbar']
    }
  }

  // Quill configuration
  const {quill, quillRef} = useQuill({modules}) // Quill instance and ref

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
      // Giả sử `dataUpdate.description` là một chuỗi Delta từ CSDL
      // Chuyển đổi chuỗi Delta thành object Delta
      const delta = JSON.parse(dataUpdate.description)
      // Sử dụng Quill để chuyển đổi Delta sang HTML và hiển thị nó
      quill.setContents(delta)
    }
  }, [quill, dataUpdate?.description])

  useEffect(() => {
    if (quill) {
      const handleChange = () => {
        const delta = quill.getContents() // Get Delta from Quill
        const deltaString = JSON.stringify(delta)
        setValue(deltaString) // Assuming `setValue` updates some state. Ensure this function is defined or remove this line if unnecessary.
        form.setFieldsValue({description: deltaString}) // Update form value
      }

      quill.on('text-change', handleChange)

      // Cleanup function to remove event listener
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
        startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate)
          ? dayjs(values.startDate, 'DD/MM/YYYY').toDate()
          : values.startDate,
        endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate)
          ? dayjs(values.endDate, 'DD/MM/YYYY').toDate()
          : values.endDate,
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
        startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
        endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
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
                <ProFormSelect
                  name="threads"
                  label="Chủ đề"
                  options={THREADS_LIST}
                  placeholder="Chọn chủ đề"
                  rules={[{required: true, message: 'Vui lòng chọn chủ đề!'}]}
                  allowClear
                  mode="multiple"
                  fieldProps={{
                    showArrow: false
                  }}
                />
              </Col>

              {/*{(dataUpdate?._id || !id) && (
                <Col span={24} md={6}>
                  <ProForm.Item
                    name="department"
                    label="Thuộc đơn vị"
                    rules={[{required: true, message: 'Vui lòng chọn đơn vị!'}]}
                  >
                    <DebounceSelect
                      allowClear
                      showSearch
                      defaultValue={departments}
                      value={departments}
                      placeholder="Chọn đơn vị"
                      fetchOptions={fetchDepartmentList}
                      onChange={(newValue: any) => {
                        if (newValue?.length === 0 || newValue?.length === 1) {
                          setDepartments(newValue as IDepartmentSelect[])
                        }
                      }}
                      style={{width: '100%'}}
                    />
                  </ProForm.Item>
                </Col>
              )} */}
            </Row>
            <Row gutter={[20, 20]}>
              <Col span={24} md={6}>
                <ProFormDatePicker
                  label="Ngày bắt đầu"
                  name="startDate"
                  normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                  fieldProps={{
                    format: 'DD/MM/YYYY'
                  }}
                  rules={[
                    {required: true, message: 'Vui lòng chọn ngày bắt đầu!'}
                  ]}
                  placeholder="dd/mm/yyyy"
                />
              </Col>
              {/* <Col span={24} md={6}>
                <ProFormDatePicker
                  label="Ngày kết thúc"
                  name="endDate"
                  normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                  fieldProps={{
                    format: 'DD/MM/YYYY'
                  }}
                  // width="auto"
                  rules={[
                    {required: true, message: 'Vui lòng chọn ngày kết thúc!'}
                  ]}
                  placeholder="dd/mm/yyyy"
                />
              </Col> */}
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
