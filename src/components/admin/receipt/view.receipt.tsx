import {callExportReceiptToPdf} from '@/config/api'
import {ALL_PERMISSIONS} from '@/config/permissions'
import {formatCurrency} from '@/config/utils'
import {useAppSelector} from '@/redux/hooks'
import {IReceipt} from '@/types/backend'
import {Badge, Descriptions, Drawer, Button, message, notification} from 'antd'
import dayjs from 'dayjs'
import {saveAs} from 'file-saver'
import {useEffect, useState} from 'react'

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IReceipt | null
  setDataInit: (v: any) => void
}

const ViewDetailReceipt = (props: IProps) => {
  const user = useAppSelector((state) => state?.account?.user)
  const [canExportPdf, setCanExportPdf] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {onClose, open, dataInit, setDataInit} = props

  useEffect(() => {
    if (
      user.permissions?.length &&
      user.permissions.some(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.RECEIPTS.EXPORT_PDF.apiPath &&
          item.method === ALL_PERMISSIONS.RECEIPTS.EXPORT_PDF.method
      )
    ) {
      setCanExportPdf(true)
    }
  }, [])

  const handleExportPdf = async () => {
    if (dataInit && dataInit.id) {
      setIsLoading(true)
      try {
        const res = await callExportReceiptToPdf(dataInit.id)
        if (res) {
          saveAs(res, `receipt-${dataInit.id}.pdf`)
          message.success('Tải file PDF phiếu thu thành công!')
        }
      } catch (error) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Không thể tải file PDF phiếu thu!'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

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
        extra={
          <Button
            type="primary"
            onClick={handleExportPdf}
            loading={isLoading}
            disabled={!canExportPdf || isLoading}
          >
            Xuất PDF
          </Button>
        }
      >
        <Descriptions title="" bordered column={2} layout="vertical">
          <Descriptions.Item label="Mã phiếu thu">
            {dataInit?.id}
          </Descriptions.Item>
          <Descriptions.Item label="Thành viên">
            {dataInit?.userName}
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung phiếu thu" span={2}>
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
