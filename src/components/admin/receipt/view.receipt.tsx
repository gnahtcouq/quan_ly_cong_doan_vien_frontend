import {formatCurrency} from '@/config/utils'
import {IReceipt} from '@/types/backend'
import {Badge, Descriptions, Drawer} from 'antd'
import dayjs from 'dayjs'

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IReceipt | null
  setDataInit: (v: any) => void
}
const ViewDetailReceipt = (props: IProps) => {
  const {onClose, open, dataInit, setDataInit} = props

  return (
    <>
      <Drawer
        title="Thông tin phiếu thu"
        placement="right"
        onClose={() => {
          onClose(false)
          setDataInit(null)
        }}
        open={open}
        width={'40vw'}
        maskClosable={true}
      >
        <Descriptions title="" bordered column={2} layout="vertical">
          <Descriptions.Item label="Mã phiếu thu">
            {dataInit?.receiptId}
          </Descriptions.Item>

          <Descriptions.Item label="Nội dung phiếu thu">
            {dataInit?.description}
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền">
            {formatCurrency(dataInit?.amount) ?? ''}
          </Descriptions.Item>

          <Descriptions.Item label="Danh mục thu">
            {dataInit?.incomeCategory ?? ''}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian">
            {dataInit && dataInit.time
              ? dayjs(dataInit.time).format('DD/MM/YYYY')
              : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Người sửa">
            {dataInit?.updatedBy?.email}
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

export default ViewDetailReceipt
