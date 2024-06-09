import {useAppSelector} from '@/redux/hooks'
import {IPost} from '@/types/backend'
import {ProForm, ProFormText} from '@ant-design/pro-components'
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Modal,
  Row,
  Upload,
  message,
  notification
} from 'antd'
import en_US from 'antd/lib/locale/en_US'
import {UploadOutlined} from '@ant-design/icons'
import type {UploadProps} from 'antd'
import {callCreateDocument, callUploadSingleFile} from '@/config/api'
import {useState} from 'react'

interface IProps {
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
}

const ApplyModal = (props: IProps) => {
  const {isModalOpen, setIsModalOpen} = props
  const user = useAppSelector((state) => state.account.user)
  const [urlDoc, setUrlDoc] = useState<string>('')
  const [documentName, setDocumentName] = useState<string>('')

  const handleOkButton = async () => {
    if (!urlDoc) {
      message.error('Vui lòng upload file văn bản!')
      return
    }

    const res = await callCreateDocument(urlDoc, documentName)
    if (res.data) {
      message.success('Upload file văn bản thành công!')
      setIsModalOpen(false)
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message
      })
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

  return (
    <>
      <Modal
        title="Thêm mới văn bản"
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        okText={'Thêm mới'}
        cancelButtonProps={{style: {display: 'none'}}}
        destroyOnClose={true}
      >
        <Divider />
        {
          <div>
            <ConfigProvider locale={en_US}>
              <ProForm
                submitter={{
                  render: () => <></>
                }}
              >
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <ProFormText
                      label="Tên văn bản"
                      name="name"
                      rules={[
                        {required: true, message: 'Vui lòng không để trống!'}
                      ]}
                      placeholder="Nhập tên văn bản"
                      fieldProps={{
                        onChange: (e) => setDocumentName(e.target.value)
                      }}
                    />
                  </Col>

                  <Col span={24}>
                    <ProForm.Item
                      label={'Upload file văn bản'}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng upload file văn bản!'
                        }
                      ]}
                    >
                      <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                          Upload file văn bản (Hỗ trợ *.pdf và nhỏ hơn 5MB)
                        </Button>
                      </Upload>
                    </ProForm.Item>
                  </Col>
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        }
        <Divider />
      </Modal>
    </>
  )
}
export default ApplyModal
