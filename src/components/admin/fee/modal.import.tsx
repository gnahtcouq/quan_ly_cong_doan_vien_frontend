import {ModalForm, ProForm} from '@ant-design/pro-components'
import {
  Button,
  Col,
  ConfigProvider,
  Row,
  Upload,
  message,
  notification,
  Form // Import Form from 'antd'
} from 'antd'
import en_US from 'antd/lib/locale/en_US'
import {UploadOutlined} from '@ant-design/icons'
import {callUploadFeesFile} from '@/config/api'
import {useState} from 'react'
import {isMobile} from 'react-device-detect'
import styles from 'styles/app.module.scss'

interface IProps {
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
  reloadTable: () => void
}

const ImportModal = (props: IProps) => {
  const {isModalOpen, setIsModalOpen, reloadTable} = props
  const [form] = Form.useForm()

  const [fileList, setFileList] = useState<any[]>([])

  const handleOkButton = async (valuesForm: any) => {
    if (fileList.length > 0) {
      const res = await callUploadFeesFile(fileList[0].originFileObj)
      if (res.data) {
        message.success('Nhập dữ liệu từ file Excel thành công!')
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
    setFileList([])
    setIsModalOpen(false)
  }

  return (
    <>
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={'Nhập dữ liệu từ file Excel'}
          open={isModalOpen}
          modalProps={{
            onCancel: () => {
              handleReset()
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            width: isMobile ? '100%' : 600,
            keyboard: false,
            maskClosable: true,
            okText: 'Nhập',
            cancelText: 'Hủy'
          }}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          onFinish={handleOkButton}
        >
          <Row gutter={16}>
            <Col span={24}>
              <ProForm.Item
                name="file"
                label={'Chọn file Excel'}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng không để trống!'
                  }
                ]}
              >
                <Upload
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={({fileList}) => setFileList([...fileList])}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
              </ProForm.Item>
            </Col>
          </Row>
        </ModalForm>
      </ConfigProvider>
    </>
  )
}
export default ImportModal
