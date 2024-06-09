import {EditOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons'
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import {
  Col,
  ConfigProvider,
  Form,
  Modal,
  Row,
  Upload,
  message,
  notification
} from 'antd'
import 'styles/reset.scss'
import {isMobile} from 'react-device-detect'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useEffect, useState} from 'react'
import {
  callCreateDepartment,
  callUpdateDepartment,
  callUploadSingleFile
} from '@/config/api'
import {IDepartment} from '@/types/backend'
import {v4 as uuidv4} from 'uuid'
import en_US from 'antd/lib/locale/en_US'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IDepartment | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

interface IDepartmentForm {
  name: string
}

interface IDepartmentLogo {
  name: string
  uid: string
}

const ModalDepartment = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props

  //modal animation
  const [animation, setAnimation] = useState<string>('open')

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  const [dataLogo, setDataLogo] = useState<IDepartmentLogo[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const [value, setValue] = useState<string>('')
  const [form] = Form.useForm()

  useEffect(() => {
    if (dataInit?._id && dataInit?.description) {
      setValue(dataInit.description)
    }
  }, [dataInit])

  const submitDepartment = async (valuesForm: IDepartmentForm) => {
    const {name} = valuesForm

    if (dataLogo.length === 0) {
      message.error('Vui lòng tải lên ảnh Logo!')
      return
    }

    if (dataInit?._id) {
      //update
      const res = await callUpdateDepartment(
        dataInit._id,
        name,
        value,
        dataLogo[0].name
      )
      if (res.data) {
        message.success('Cập nhật đơn vị thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      //create
      const res = await callCreateDepartment(name, value, dataLogo[0].name)
      if (res.data) {
        message.success('Thêm mới đơn vị thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    }
  }

  const handleReset = async () => {
    form.resetFields()
    setValue('')
    setDataInit(null)

    //add animation when closing modal
    setAnimation('close')
    await new Promise((r) => setTimeout(r, 400))
    setOpenModal(false)
    setAnimation('open')
  }

  const handleRemoveFile = (file: any) => {
    setDataLogo([])
  }

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url)
      setPreviewOpen(true)
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
      )
      return
    }
    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url)
      setPreviewOpen(true)
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
      )
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
    const res = await callUploadSingleFile(file, 'department')
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4()
        }
      ])
      if (onSuccess) onSuccess('ok')
    } else {
      if (onError) {
        setDataLogo([])
        const error = new Error(res.message)
        onError({event: error})
      }
    }
  }

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={<>{dataInit?._id ? 'Cập nhật đơn vị' : 'Tạo mới đơn vị'}</>}
            open={openModal}
            modalProps={{
              onCancel: () => {
                handleReset()
              },
              afterClose: () => handleReset(),
              destroyOnClose: true,
              width: isMobile ? '100%' : 900,
              footer: null,
              keyboard: false,
              maskClosable: false,
              className: `modal-department ${animation}`,
              rootClassName: `modal-department-root ${animation}`
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitDepartment}
            initialValues={dataInit?._id ? dataInit : {}}
            submitter={{
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <EditOutlined />
              },
              searchConfig: {
                resetText: 'Hủy',
                submitText: <>{dataInit?._id ? 'Cập nhật' : 'Tạo mới'}</>
              }
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  labelCol={{span: 24}}
                  label="Ảnh Logo"
                  name="logo"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng không để trống!',
                      validator: () => {
                        if (dataLogo.length > 0) return Promise.resolve()
                        else return Promise.reject(false)
                      }
                    }
                  ]}
                >
                  <ConfigProvider locale={en_US}>
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
                      defaultFileList={
                        dataInit?._id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.logo ?? '',
                                status: 'done',
                                url: `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/files/department/${dataInit?.logo}`
                              }
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{marginTop: 8}}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>
              <Col span={16}>
                <ProFormText
                  label="Tên đơn vị"
                  name="name"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
                  placeholder="Nhập tên đơn vị"
                />
              </Col>

              <ProCard
                title="Mô tả"
                // subTitle="mô tả đơn vị"
                headStyle={{color: '#d81921'}}
                style={{marginBottom: 20}}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
              </ProCard>
            </Row>
          </ModalForm>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{zIndex: 1500}}
          >
            <img alt="example" style={{width: '100%'}} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  )
}

export default ModalDepartment
