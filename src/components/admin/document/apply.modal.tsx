import {IDocument} from '@/types/backend'
import {ModalForm, ProForm, ProFormText} from '@ant-design/pro-components'
import {
  Button,
  Col,
  ConfigProvider,
  Form,
  Row,
  Upload,
  message,
  notification
} from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import {UploadOutlined} from '@ant-design/icons'
import type {UploadProps} from 'antd'
import {
  callCreateDocument,
  callUpdateDocumentName,
  callUploadSingleFile
} from '@/config/api'
import {useState} from 'react'
import {isMobile} from 'react-device-detect'

interface IProps {
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
  dataInit?: IDocument | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ApplyModal = (props: IProps) => {
  const {isModalOpen, setIsModalOpen, reloadTable, dataInit, setDataInit} =
    props
  const [urlDoc, setUrlDoc] = useState<string>('')
  const [form] = Form.useForm()

  const handleOkButton = async (valuesForm: any) => {
    if (!urlDoc && !dataInit) {
      message.error('Vui lòng upload file CV/VB!')
      return
    }

    const {id, name} = valuesForm
    const status = dataInit?.status || ''
    const currentId = dataInit?.id || ''
    const currentName = dataInit?.name || ''

    if (dataInit?._id) {
      const newId = id !== currentId ? id : currentId
      const newName = name !== currentName ? name : currentName
      const res = await callUpdateDocumentName(
        dataInit._id,
        newId,
        newName,
        status
      )
      if (res.data) {
        message.success('Cập nhật thông tin CV/VB thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      const res = await callCreateDocument(urlDoc, name, id)
      if (res.data) {
        message.success('Upload file CV/VB thành công!')
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

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: 'application/pdf, .pdf',
    async customRequest({file, onSuccess, onError}: any) {
      const res = await callUploadSingleFile(file, 'document')
      if (res && res.data) {
        setUrlDoc(res.data.fileName)
        if (onSuccess) onSuccess('ok')
      } else {
        if (onError) {
          setUrlDoc('')
          const error = new Error(res.message)
          onError({event: error})
        }
      }
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`Upload file ${info.file.name} thành công`)
      } else if (info.file.status === 'error') {
        message.error(
          info?.file?.error?.event?.message ??
            'Đã có lỗi xảy ra khi upload file CV/VB'
        )
      }
    }
  }

  const handleReset = async () => {
    form.resetFields()
    setDataInit(null)
    setIsModalOpen(false)
  }

  const initialValues = dataInit ? {...dataInit} : {}

  return (
    <>
      <ConfigProvider locale={vi_VN}>
        <ModalForm
          title={
            <>{dataInit?._id ? 'Cập nhật thông tin CV/VB' : 'Thêm mới CV/VB'}</>
          }
          open={isModalOpen}
          modalProps={{
            onCancel: () => {
              handleReset()
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            width: isMobile ? '100%' : 600,
            keyboard: false,
            maskClosable: false,
            okText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>,
            cancelText: 'Hủy'
          }}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          onFinish={handleOkButton}
          initialValues={initialValues}
        >
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <ProFormText
                label="Tên CV/VB"
                name="name"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập tên CV/VB"
              />
            </Col>
            <Col span={24}>
              <ProFormText
                label="Số CV/VB"
                name="id"
                rules={[{required: false}]}
                placeholder="Nhập số CV/VB"
              />
            </Col>
            {!dataInit?._id && (
              <Col span={24}>
                <ProForm.Item
                  label={'Upload file CV/VB'}
                  rules={[
                    {
                      required: dataInit?._id ? true : false,
                      message: 'Vui lòng upload file CV/VB!'
                    }
                  ]}
                >
                  <Upload {...propsUpload}>
                    <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                  </Upload>
                </ProForm.Item>
              </Col>
            )}
          </Row>
        </ModalForm>
      </ConfigProvider>
    </>
  )
}
export default ApplyModal
