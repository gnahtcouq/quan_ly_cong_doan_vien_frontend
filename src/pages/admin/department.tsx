import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {fetchDepartment} from '@/redux/slice/departmentSlide'
import {IDepartment} from '@/types/backend'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef, forwardRef} from 'react'
import dayjs from 'dayjs'
import {callDeleteDepartment} from '@/config/api'
import queryString from 'query-string'
import {useNavigate} from 'react-router-dom'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'

const DepartmentPage = forwardRef<any>((props, ref) => {
  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.department.isFetching)
  const meta = useAppSelector((state) => state.department.meta)
  const departments = useAppSelector((state) => state.department.result)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDeleteDepartment = async (id: string | undefined) => {
    if (id) {
      const res = await callDeleteDepartment(id)
      if (res && res.data) {
        message.success('Xóa đơn vị thành công!')
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

  const columns: ProColumns<IDepartment>[] = [
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
      sorter: true
    },
    {
      title: 'Tên đơn vị',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format('DD/MM/YYYY - HH:mm:ss')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updatedAt',
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
          <Access permission={ALL_PERMISSIONS.DEPARTMENTS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: '#ffa500'
              }}
              type=""
              onClick={() => {
                navigate(`/admin/department/upsert?id=${entity._id}`)
              }}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.DEPARTMENTS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa đơn vị'}
              description={'Bạn có chắc chắn muốn xóa đơn vị này?'}
              onConfirm={() => handleDeleteDepartment(entity.id)}
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
        </Space>
      )
    }
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    if (clone.id) clone.id = `/${clone.id}/i`
    if (clone.name) clone.name = `/${clone.name}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.id) {
      sortBy = sort.id === 'ascend' ? 'sort=id' : 'sort=-id'
    }
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name' : 'sort=-name'
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
      <Access permission={ALL_PERMISSIONS.DEPARTMENTS.GET_PAGINATE}>
        <DataTable<IDepartment>
          actionRef={ref}
          headerTitle="Danh sách đơn vị"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={departments}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchDepartment({query}))
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
              <Access
                permission={ALL_PERMISSIONS.DEPARTMENTS.CREATE}
                hideChildren
              >
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => navigate('upsert')}
                >
                  Thêm mới
                </Button>
              </Access>
            )
          }}
        />
      </Access>
    </div>
  )
})

export default DepartmentPage
