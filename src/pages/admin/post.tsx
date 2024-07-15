import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IPost} from '@/types/backend'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {ActionType, ProColumns, ProFormSelect} from '@ant-design/pro-components'
import {
  Button,
  Popconfirm,
  Select,
  Space,
  Tag,
  message,
  notification
} from 'antd'
import {useState, useRef} from 'react'
import dayjs from 'dayjs'
import {callDeletePost} from '@/config/api'
import queryString from 'query-string'
import {useNavigate} from 'react-router-dom'
import {fetchPost} from '@/redux/slice/postSlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'

const PostPage = () => {
  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.post.isFetching)
  const meta = useAppSelector((state) => state.post.meta)
  const posts = useAppSelector((state) => state.post.result)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDeletePost = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeletePost(_id)
      if (res && res.data) {
        message.success('Xóa bài đăng thành công!')
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

  const columns: ProColumns<IPost>[] = [
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
      title: 'Tiêu đề',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: 100,
      sorter: true,
      renderFormItem: (item, props, form) => (
        <Select
          showSearch
          mode="multiple"
          allowClear
          placeholder="Chọn trạng thái"
        >
          <Select.Option value="true">ACTIVE</Select.Option>
          <Select.Option value="false">INACTIVE</Select.Option>
        </Select>
      ),
      render(value, record, index) {
        return (
          <>
            <Tag color={value ? 'lime' : 'red'}>
              {value ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
          </>
        )
      }
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
          <Access permission={ALL_PERMISSIONS.POSTS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: '#ffa500'
              }}
              type=""
              onClick={() => {
                navigate(`/admin/post/upsert?id=${entity._id}`)
              }}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.POSTS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa bài đăng'}
              description={'Bạn có chắc chắn muốn xóa bài đăng này?'}
              onConfirm={() => handleDeletePost(entity._id)}
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
    if (clone.name) clone.name = `/${clone.name}/i`
    if (clone.salary) clone.salary = `/${clone.salary}/i`
    if (clone?.level?.length) {
      clone.level = clone.level.join(',')
    }

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name' : 'sort=-name'
    }
    if (sort && sort.salary) {
      sortBy = sort.salary === 'ascend' ? 'sort=salary' : 'sort=-salary'
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
      <Access permission={ALL_PERMISSIONS.POSTS.GET_PAGINATE}>
        <DataTable<IPost>
          actionRef={tableRef}
          headerTitle="Danh sách bài đăng"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={posts}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchPost({query}))
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
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => navigate('upsert')}
              >
                Thêm mới
              </Button>
            )
          }}
        />
      </Access>
    </div>
  )
}

export default PostPage
