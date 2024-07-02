import {IUser} from '@/types/backend'
import {Badge, Descriptions, Drawer} from 'antd'
import dayjs from 'dayjs'

interface IProps {
  onClose: (v: boolean) => void
  open: boolean
  dataInit: IUser | null
  setDataInit: (v: any) => void
}
const ViewDetailUser = (props: IProps) => {
  const {onClose, open, dataInit, setDataInit} = props

  return (
    <>
      <Drawer
        title="Thông tin thành viên"
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
          <Descriptions.Item label="Họ và tên">
            {dataInit?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>

          <Descriptions.Item label="Ngày sinh">
            {dataInit && dataInit.dateOfBirth
              ? dayjs(dataInit.dateOfBirth).format('DD/MM/YYYY')
              : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Căn cước công dân">
            {dataInit?.CCCD ?? ''}
          </Descriptions.Item>

          <Descriptions.Item label="Vai trò">
            <Badge status="processing" text={<>{dataInit?.role?.name}</>} />
          </Descriptions.Item>

          <Descriptions.Item label="Giới Tính">
            {(() => {
              switch (dataInit?.gender) {
                case 'MALE':
                  return 'Nam'
                case 'FEMALE':
                  return 'Nữ'
                default:
                  return 'Khác'
              }
            })()}
          </Descriptions.Item>

          <Descriptions.Item label="Địa chỉ">
            {dataInit?.address ?? ''}
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú">
            {dataInit?.note ?? ''}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {dataInit && dataInit.createdAt
              ? dayjs(dataInit.createdAt).format('DD/MM/YYYY HH:mm:ss')
              : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày sửa">
            {dataInit && dataInit.updatedAt
              ? dayjs(dataInit.updatedAt).format('DD/MM/YYYY HH:mm:ss')
              : ''}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  )
}

export default ViewDetailUser
