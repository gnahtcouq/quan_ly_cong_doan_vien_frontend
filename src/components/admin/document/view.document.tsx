import {callUpdateDocumentStatus} from '@/config/api'
import {IDocument} from '@/types/backend'
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
  dataInit: IDocument | null | any
  setDataInit: (v: any) => void
  reloadTable: () => void
}
const ViewDetailDocument = (props: IProps) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const {onClose, open, dataInit, setDataInit, reloadTable} = props
  const [form] = Form.useForm()

  const handleChangeStatus = async () => {
    setIsSubmit(true)

    const status = form.getFieldValue('status')
    const res = await callUpdateDocumentStatus(dataInit?._id, status)
    if (res.data) {
      message.success('Cập nhật trạng thái văn bản thành công!')
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
      form.setFieldValue('status', dataInit.status)
    }
    return () => form.resetFields()
  }, [dataInit])

  return (
    <>
      <Drawer
        title="Thông tin văn bản"
        placement="right"
        onClose={() => {
          onClose(false)
          setDataInit(null)
        }}
        open={open}
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
        <Descriptions title="" bordered column={2} layout="vertical">
          <Descriptions.Item label="Tên văn bản">
            {dataInit?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" style={{width: '50%'}}>
            <Form form={form}>
              <Form.Item name={'status'}>
                <Select style={{width: '50%'}} defaultValue={dataInit?.status}>
                  <Option value="ACTIVE">ACTIVE</Option>
                  <Option value="INACTIVE">INACTIVE</Option>
                </Select>
              </Form.Item>
            </Form>
          </Descriptions.Item>
          <Descriptions.Item label="Tên file">
            {dataInit?.url}
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {dataInit?.email ?? ''}
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
      </Drawer>
    </>
  )
}

export default ViewDetailDocument
