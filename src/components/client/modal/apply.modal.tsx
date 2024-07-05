import {useAppSelector} from '@/redux/hooks'
import {IDocument, IPost} from '@/types/backend'
import {ModalForm, ProForm, ProFormText} from '@ant-design/pro-components'
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Modal,
  Row,
  Upload,
  message,
  notification
} from 'antd'
import en_US from 'antd/lib/locale/en_US'
import {UploadOutlined} from '@ant-design/icons'
import type {UploadProps} from 'antd'
import {
  callCreateDocument,
  callUpdateDocumentName,
  callUploadSingleFile
} from '@/config/api'
import {useEffect, useState} from 'react'
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
      message.error('Vui lòng upload file văn bản!')
      return
    }

    const {name} = valuesForm
    const status = dataInit?.status || ''

    if (dataInit?._id) {
      const res = await callUpdateDocumentName(dataInit._id, name, status)
      if (res.data) {
        message.success('Cập nhật thông tin văn bản thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      const res = await callCreateDocument(urlDoc, name)
      if (res.data) {
        message.success('Upload file văn bản thành công!')
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
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(
          info?.file?.error?.event?.message ??
            'Đã có lỗi xảy ra khi upload file văn bản'
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
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={
            <>
              {dataInit?._id
                ? 'Cập nhật thông tin văn bản'
                : 'Thêm mới văn bản'}
            </>
          }
          open={isModalOpen}
          modalProps={{
            onCancel: () => {
              handleReset()
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            width: isMobile ? '100%' : 900,
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
                label="Tên văn bản"
                name="name"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập tên văn bản"
              />
            </Col>
            <Col span={24}>
              <ProForm.Item
                label={'Upload file văn bản'}
                rules={[
                  {
                    required: dataInit?._id ? true : false,
                    message: 'Vui lòng upload file văn bản!'
                  }
                ]}
              >
                <Upload
                  {...propsUpload}
                  disabled={dataInit?._id ? true : false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    disabled={dataInit?._id ? true : false}
                  >
                    Upload file văn bản (Hỗ trợ *.pdf và nhỏ hơn 10MB)
                  </Button>
                </Upload>
              </ProForm.Item>
            </Col>
          </Row>
        </ModalForm>
      </ConfigProvider>
    </>
  )
}
export default ApplyModal
