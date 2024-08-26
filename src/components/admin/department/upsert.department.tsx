import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Modal,
  Row,
  Spin,
  Upload,
  message,
  notification
} from 'antd'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {FooterToolbar, ProForm, ProFormText} from '@ant-design/pro-components'
import styles from 'styles/admin.module.scss'
import {useState, useEffect, useCallback} from 'react'
import {
  callFetchDepartmentById,
  callUpdateDepartment,
  callCreateDepartment,
  callUploadSingleFile
} from '@/config/api'
import {useQuill} from 'react-quilljs'
import {quillFormats, quillModules, uploadToCloudinary} from '@/config/quill'
import 'quill/dist/quill.snow.css'
import {EditOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons'
import vi_VN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import {IDepartment} from '@/types/backend'
import {v4 as uuidv4} from 'uuid'

const ViewUpsertDepartment = (props: any) => {
  const navigate = useNavigate()
  const [value, setValue] = useState<string>('')
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const id = params?.get('id') // department id
  const [dataUpdate, setDataUpdate] = useState<IDepartment | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const {quill, quillRef} = useQuill({
    modules: quillModules,
    formats: quillFormats
  }) as any

  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        setIsUploading(true)
        const url = await uploadToCloudinary(file, 'Department')
        setIsUploading(false)
        if (quill) {
          const range = quill.getSelection()
          range && quill.insertEmbed(range.index, 'image', url)
        }
      }
    }
  }, [quill])

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', imageHandler)
    }
  }, [quill, imageHandler])

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await callFetchDepartmentById(id)
        if (res && res.data) {
          setDataUpdate(res.data)
          setValue(res.data.description as string)
          form.setFieldsValue({
            ...res.data
          })

          if (res.data.logo) {
            setFileList([
              {
                uid: uuidv4(),
                name: res.data.logo,
                status: 'done',
                url: res.data.logo
              }
            ])
          } else {
            setFileList([])
          }
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
    const logo = fileList.length > 0 ? fileList[0].name : dataUpdate?.logo

    if (!logo) {
      message.error('Vui lòng tải lên ảnh Logo!')
      return
    }

    if (delta.ops.length === 1 && delta.ops[0].insert === '\n') {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: 'Vui lòng nhập mô tả bài đăng!'
      })
      return
    }

    if (dataUpdate?._id) {
      const department = {
        name: values.name,
        description: JSON.stringify(delta),
        logo: logo
      }

      const res = await callUpdateDepartment(
        dataUpdate._id,
        department.name,
        department.description,
        department.logo
      )
      if (res.data) {
        message.success('Cập nhật đơn vị thành công!')
        navigate('/admin/department')
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      const department = {
        name: values.name,
        description: value,
        logo: logo
      }

      const res = await callCreateDepartment(
        department.name,
        department.description,
        department.logo
      )
      if (res.data) {
        message.success('Thêm mới đơn vị thành công!')
        navigate('/admin/department')
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    }
  }

  const handleRemoveFile = (file: any) => {
    setFileList([])
    setDataUpdate((prevDataUpdate: IDepartment | null) => {
      if (prevDataUpdate) {
        return {
          ...prevDataUpdate,
          logo: ''
        }
      }
      return null
    })
  }

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url)
      setPreviewOpen(true)
      return
    }
    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url)
      setPreviewOpen(true)
    })
  }

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Hình ảnh phải có kích thước nhỏ hơn 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoadingUpload(true)
    }
    if (info.file.status === 'done') {
      setLoadingUpload(false)
      setFileList([info.file])
    }
    if (info.file.status === 'error') {
      setLoadingUpload(false)
      message.error(
        info?.file?.error?.event?.message ??
          'Đã có lỗi xảy ra khi tải lên hình ảnh!'
      )
    }
  }

  const handleUploadFileLogo = async ({file, onSuccess, onError}: any) => {
    try {
      const res = await uploadToCloudinary(file, 'Logo-Department')
      console.log(res)
      if (res) {
        setFileList([
          {
            uid: uuidv4(),
            name: res,
            status: 'done',
            url: res
          }
        ])
        setLoadingUpload(false)
        if (onSuccess) onSuccess('ok')
      } else {
        throw new Error('Upload failed!')
      }
    } catch (error) {
      setLoadingUpload(false)
      setFileList([])
      if (onError) onError({event: error})
    }
  }

  return (
    <div className={styles['upsert-post-container']}>
      <div className={styles['title']}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/department">Quản lý đơn vị</Link>
            },
            {
              title: (
                <>{dataUpdate?._id ? 'Cập nhật đơn vị' : 'Thêm mới đơn vị'}</>
              )
            }
          ]}
        />
      </div>
      <div>
        <ConfigProvider locale={vi_VN}>
          <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
              searchConfig: {
                resetText: 'Hủy',
                submitText: (
                  <>{dataUpdate?._id ? 'Cập nhật đơn vị' : 'Thêm mới đơn vị'}</>
                )
              },
              onReset: () => navigate('/admin/department'),
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <EditOutlined />
              }
            }}
          >
            <Row gutter={[20, 20]}>
              <Col span={24} md={6}>
                <Form.Item
                  labelCol={{span: 24}}
                  label="Ảnh Logo"
                  name="logo"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng không để trống!',
                      validator: () => {
                        if (fileList.length > 0 || dataUpdate?.logo)
                          return Promise.resolve()
                        return Promise.reject('Vui lòng tải lên ảnh Logo!')
                      }
                    }
                  ]}
                >
                  <ConfigProvider locale={vi_VN}>
                    <Upload
                      name="logo"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file)}
                      onPreview={handlePreview}
                      fileList={fileList}
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{marginTop: 8}}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <ProFormText
                  label="Tên đơn vị"
                  name="name"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
                  placeholder="Nhập tên đơn vị"
                />
              </Col>
            </Row>
            <Row gutter={[20, 20]}>
              <Col span={24}>
                <ProForm.Item
                  name="description"
                  label="Mô tả đơn vị"
                  rules={[
                    {required: true, message: 'Vui lòng nhập mô tả đơn vị!'}
                  ]}
                >
                  <div
                    ref={quillRef}
                    style={{
                      minHeight: 200,
                      position: 'relative',
                      filter: isUploading ? 'blur(4px)' : 'none'
                    }}
                  >
                    {isUploading && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.00001)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Spin />
                      </div>
                    )}
                  </div>
                </ProForm.Item>
              </Col>
            </Row>
            <Divider />
          </ProForm>
          <Modal
            open={previewOpen}
            title={'Logo'}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{zIndex: 1500}}
          >
            <img alt="logo" style={{width: '100%'}} src={previewImage} />
          </Modal>
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ViewUpsertDepartment
