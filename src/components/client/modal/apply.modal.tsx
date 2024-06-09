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
import {useNavigate} from 'react-router-dom'
import en_US from 'antd/lib/locale/en_US'
import {UploadOutlined} from '@ant-design/icons'
import type {UploadProps} from 'antd'
import {callCreateDocument, callUploadSingleFile} from '@/config/api'
import {useState} from 'react'

interface IProps {
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
  postDetail: IPost | null
}

const ApplyModal = (props: IProps) => {
  const {isModalOpen, setIsModalOpen, postDetail} = props
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  )
  const user = useAppSelector((state) => state.account.user)
  const [urlDoc, setUrlDoc] = useState<string>('')

  const navigate = useNavigate()

  const handleOkButton = async () => {
    if (!urlDoc && isAuthenticated) {
      message.error('Vui lòng upload file văn bản!')
      return
    }

    if (!isAuthenticated) {
      setIsModalOpen(false)
      navigate(`/login?callback=${window.location.href}`)
    } else {
      //todo
      if (postDetail) {
        const res = await callCreateDocument(
          urlDoc,
          postDetail?.department?._id,
          postDetail?._id
        )
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
    }
  }

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: 'application/pdf,application/msword, .doc, .docx, .pdf',
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
        title="Upload file Văn Bản"
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        okText={isAuthenticated ? 'Gửi' : 'Đăng Nhập'}
        cancelButtonProps={{style: {display: 'none'}}}
        destroyOnClose={true}
      >
        <Divider />
        {isAuthenticated ? (
          <div>
            <ConfigProvider locale={en_US}>
              <ProForm
                submitter={{
                  render: () => <></>
                }}
              >
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <div>
                      Bạn đang upload văn bản <b>{postDetail?.name} </b>tại{' '}
                      <b>{postDetail?.department?.name}</b>
                    </div>
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      fieldProps={{
                        type: 'email'
                      }}
                      label="Email"
                      name={'email'}
                      labelAlign="right"
                      disabled
                      initialValue={user?.email}
                    />
                  </Col>
                  <Col span={24}>
                    <ProForm.Item
                      label={'Upload file văn bản'}
                      rules={[
                        {required: true, message: 'Vui lòng upload file!'}
                      ]}
                    >
                      <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                          Tải lên văn bản của bạn ( Hỗ trợ *.doc, *.docx, *.pdf,
                          and &lt; 5MB )
                        </Button>
                      </Upload>
                    </ProForm.Item>
                  </Col>
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        ) : (
          <div>Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập!</div>
        )}
        <Divider />
      </Modal>
    </>
  )
}
export default ApplyModal
