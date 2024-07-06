import {IDocument} from '@/types/backend'
import {Descriptions, Drawer} from 'antd'
import dayjs from 'dayjs'
import {useState} from 'react'

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IDocument | null | any
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ViewDetailDocumentHistory = (props: IProps) => {
  const {onClose, open, dataInit, setDataInit} = props

  // Lấy 5 phần tử cuối cùng hoặc toàn bộ nếu ít hơn 5
  const latestHistory = dataInit?.history?.slice(-5).reverse() || []

  return (
    <>
      <Drawer
        title="Lịch sử cập nhật"
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
          title="5 cập nhật gần nhất"
          bordered
          column={1}
          layout="vertical"
          style={{marginTop: '15px'}}
        >
          {latestHistory.length > 0 ? (
            latestHistory.map((item: any, index: number) => (
              <Descriptions.Item key={index} label={`${item.name}`}>
                <p>
                  <strong>Trạng thái:</strong> {item.status}
                </p>
                <p>
                  <strong>Người sửa:</strong> {item.updatedBy.email}
                </p>
                <p>
                  <strong>Cập nhật cuối:</strong>{' '}
                  {dayjs(item.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}
                </p>
              </Descriptions.Item>
            ))
          ) : (
            <Descriptions.Item label={`${dataInit?.name}`}>
              <p>Không có lịch sử cập nhật</p>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Drawer>
    </>
  )
}

export default ViewDetailDocumentHistory
