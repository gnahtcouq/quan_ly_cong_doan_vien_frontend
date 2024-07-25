import {callUpdateDocumentStatus, callUpdatePostStatus} from '@/config/api'
import {IPost} from '@/types/backend'
import {
  Badge,
  Button,
  Descriptions,
  Drawer,
  Form,
  Select,
  message,
  notification
} from 'antd'
import dayjs from 'dayjs'
import {useState, useEffect} from 'react'
const {Option} = Select

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IPost | null | any
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ViewDetailPost = (props: IProps) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const {onClose, open, dataInit, setDataInit, reloadTable} = props
  const [form] = Form.useForm() // Create form instance

  const handleChangeStatus = async () => {
    setIsSubmit(true)

    const status = form.getFieldValue('status') // Access form field value
    const res = await callUpdatePostStatus(dataInit?._id, status)
    if (res.data) {
      message.success('Cập nhật trạng thái bài đăng thành công!')
      setDataInit(null)
      onClose(false)
      reloadTable()
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.message
      })
    }

    setIsSubmit(false)
  }

  useEffect(() => {
    if (dataInit) {
      form.setFieldsValue({status: dataInit.status}) // Set form field value
    }
  }, [dataInit, form])

  return (
    <>
      <Drawer
        title="Thông tin bài đăng"
        placement="right"
        onClose={() => {
          onClose(false)
          setDataInit(null)
        }}
        open={open} // Use open instead of visible
        width={'40vw'}
        maskClosable={true}
        destroyOnClose
        extra={
          <Button
            loading={isSubmit}
            type="primary"
            onClick={handleChangeStatus}
          >
            Cập nhật
          </Button>
        }
      >
        <Form
          form={form}
          initialValues={{status: dataInit?.status}} // Set initial values
        >
          <Descriptions title="" bordered column={2} layout="vertical">
            <Descriptions.Item label="Tiêu đề" span={2}>
              {dataInit?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Người tạo">
              {dataInit?.createdBy?.email ?? ''}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Form.Item name="status">
                <Select>
                  <Option value="ACTIVE">ACTIVE</Option>
                  <Option value="INACTIVE">INACTIVE</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dataInit && dataInit.createdAt
                ? dayjs(dataInit.createdAt).format('DD/MM/YYYY - HH:mm:ss')
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sửa">
              {dataInit && dataInit.updatedAt
                ? dayjs(dataInit.updatedAt).format('DD/MM/YYYY - HH:mm:ss')
                : ''}
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </Drawer>
    </>
  )
}

export default ViewDetailPost
