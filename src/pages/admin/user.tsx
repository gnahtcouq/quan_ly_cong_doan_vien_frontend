import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {fetchUser} from '@/redux/slice/userSlide'
import {IUser} from '@/types/backend'
import {
  ApiOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef} from 'react'
import dayjs from 'dayjs'
import {callDeleteUser} from '@/config/api'
import queryString from 'query-string'
import ModalUser from '@/components/admin/user/modal.user'
import ViewDetailUser from '@/components/admin/user/view.user'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalPermission from '@/components/admin/user/modal.permission'
import ImportModal from '@/components/admin/user/modal.import'

const UserPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalPermissions, setOpenModalPermissions] =
    useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IUser | null>(null)
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.user.isFetching)
  const meta = useAppSelector((state) => state.user.meta)
  const users = useAppSelector((state) => state.user.result)
  const dispatch = useAppDispatch()

  const handleDeleteUser = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteUser(_id)
      if (res && res.data) {
        message.success('Xóa thành viên thành công!')
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    }
  }

  const reloadTable = () => {
    tableRef?.current?.reload()
  }

  const columns: ProColumns<IUser>[] = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>
      },
      hideInSearch: true
    },
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      render: (text, record, index, action) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true)
              setDataInit(record)
            }}
          >
            {record.id}
          </a>
        )
      }
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format('DD/MM/YYYY - HH:mm:ss')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updatedAt',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Hành động',
      hideInSearch: true,
      width: 100,
      render: (_value, entity, _index, _action) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.USERS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: '#ffa500'
              }}
              type=""
              onClick={() => {
                setOpenModal(true)
                setDataInit(entity)
              }}
            />
          </Access>

          <Access permission={ALL_PERMISSIONS.USERS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa thành viên'}
              description={'Bạn có chắc chắn muốn xóa thành viên này?'}
              onConfirm={() => handleDeleteUser(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: '#ff4d4f'
                }}
              />
            </Popconfirm>
          </Access>

          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <ApiOutlined
              style={{
                fontSize: 20,
                color: '#85b970'
              }}
              type=""
              onClick={() => {
                setOpenModalPermissions(true)
                setDataInit(entity)
              }}
            />
          </Access>
        </Space>
      )
    }
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    if (clone.id) clone.id = `/${clone.id}/i`
    if (clone.name) clone.name = `/${clone.name}/i`
    if (clone.email) clone.email = `/${clone.email}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.id) {
      sortBy = sort.id === 'ascend' ? 'sort=id' : 'sort=-id'
    }
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name' : 'sort=-name'
    }
    if (sort && sort.email) {
      sortBy = sort.email === 'ascend' ? 'sort=email' : 'sort=-email'
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === 'ascend' ? 'sort=createdAt' : 'sort=-createdAt'
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === 'ascend' ? 'sort=updatedAt' : 'sort=-updatedAt'
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-updatedAt`
    } else {
      temp = `${temp}&${sortBy}`
    }

    return temp
  }

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
        <DataTable<IUser>
          actionRef={tableRef}
          headerTitle="Danh sách thành viên"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={users}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchUser({query}))
          }}
          scroll={{x: true}}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>
                  {' '}
                  {range[0]}-{range[1]} trên {total} hàng
                </div>
              )
            }
          }}
          rowSelection={false}
          toolBarRender={(_action, _rows): any => {
            return (
              <>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => setOpenModal(true)}
                >
                  Thêm mới
                </Button>
                <Button
                  icon={<FileExcelOutlined />}
                  type="dashed"
                  onClick={() => setIsModalOpen(true)}
                >
                  Nhập Excel
                </Button>
              </>
            )
          }}
        />
      </Access>
      <ModalUser
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ModalPermission
        openModal={openModalPermissions}
        setOpenModal={setOpenModalPermissions}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ViewDetailUser
        onClose={setOpenViewDetail}
        open={openViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ImportModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        reloadTable={reloadTable}
      />
    </div>
  )
}

export default UserPage
