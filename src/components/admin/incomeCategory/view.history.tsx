import {formatCurrency} from '@/config/utils'
import {IIncomeCategory} from '@/types/backend'
import {Descriptions, Drawer} from 'antd'
import dayjs from 'dayjs'

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IIncomeCategory | null | any
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ViewDetailIncomeCategoryHistory = (props: IProps) => {
  const {onClose, open, dataInit, setDataInit} = props

  // Lấy 5 phần tử cuối cùng hoặc toàn bộ nếu ít hơn 5
  const latestHistory = dataInit?.history?.slice(-5).reverse() || []

  return (
    <>
      <Drawer
        title="Lịch sử thay đổi"
        placement="right"
        onClose={() => {
          onClose(false)
          setDataInit(null)
        }}
        open={open}
        width={'40vw'}
        maskClosable={true}
        destroyOnClose={true}
      >
        <Descriptions
          title="5 thay đổi gần nhất"
          bordered
          column={1}
          layout="vertical"
          style={{marginTop: '15px'}}
        >
          {latestHistory.length > 1 ? (
            latestHistory.map((item: any, index: number) => (
              <Descriptions.Item key={index} label={`${item.description}`}>
                <p>
                  <strong>Dự toán:</strong> {formatCurrency(item.amount)}
                </p>
                <p>
                  <strong>Năm:</strong> {dayjs(item.time).format('DD/MM/YYYY')}
                </p>
                <p>
                  <strong>Người thực hiện:</strong> {item.updatedBy.email}
                </p>
                <p>
                  <strong>Thay đổi cuối:</strong>{' '}
                  {dayjs(item.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}
                </p>
              </Descriptions.Item>
            ))
          ) : (
            <Descriptions.Item label={`${dataInit?.description}`}>
              <p>Không có lịch sử cập nhật</p>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Drawer>
    </>
  )
}

export default ViewDetailIncomeCategoryHistory
