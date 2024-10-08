import {formatCurrency} from '@/config/utils'
import {IExpense} from '@/types/backend'
import {Badge, Button, Descriptions, Drawer} from 'antd'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'
import {message, notification} from 'antd'
import {saveAs} from 'file-saver'
import {callExportExpenseToPdf} from '@/config/api'
import {useAppSelector} from '@/redux/hooks'
import {ALL_PERMISSIONS} from '@/config/permissions'

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IExpense | null
  setDataInit: (v: any) => void
}
const ViewDetailExpense = (props: IProps) => {
  const user = useAppSelector((state) => state?.account?.user)
  const [canExportPdf, setCanExportPdf] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {onClose, open, dataInit, setDataInit} = props

  useEffect(() => {
    if (
      user.permissions?.length &&
      user.permissions.some(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.EXPENSES.EXPORT_PDF.apiPath &&
          item.method === ALL_PERMISSIONS.EXPENSES.EXPORT_PDF.method
      )
    ) {
      setCanExportPdf(true)
    }
  }, [])

  const handleExportPdf = async () => {
    if (dataInit && dataInit.id) {
      setIsLoading(true)
      try {
        const res = await callExportExpenseToPdf(dataInit.id)
        if (res) {
          saveAs(res, `expense-${dataInit.id}.pdf`)
          message.success('Tải file PDF phiếu chi thành công!')
        }
      } catch (error) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Không thể tải file PDF phiếu chi!'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <Drawer
        title="Thông tin phiếu chi"
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
          <Descriptions.Item label="Mã phiếu chi">
            {dataInit?.id}
          </Descriptions.Item>

          <Descriptions.Item label="Thành viên">
            {dataInit?.userName}
          </Descriptions.Item>

          <Descriptions.Item label="Nội dung phiếu chi" span={2}>
            {dataInit?.description}
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền">
            {formatCurrency(dataInit?.amount) ?? ''}
          </Descriptions.Item>

          <Descriptions.Item label="Danh mục chi">
            {dataInit?.expenseCategory ?? ''}
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

export default ViewDetailExpense
