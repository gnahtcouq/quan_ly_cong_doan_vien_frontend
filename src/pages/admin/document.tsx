import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IDocument} from '@/types/backend'
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined
} from '@ant-design/icons'
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
import {callDeleteDocument} from '@/config/api'
import queryString from 'query-string'
import {fetchDocument} from '@/redux/slice/documentSlide'
import ViewDetailDocument from '@/components/admin/document/view.document'
import {ALL_PERMISSIONS} from '@/config/permissions'
import Access from '@/components/share/access'
import ApplyModal from '@/components/client/modal/apply.modal'

const DocumentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.document.isFetching)
  const meta = useAppSelector((state) => state.document.meta)
  const documents = useAppSelector((state) => state.document.result)
  const dispatch = useAppDispatch()

  const [dataInit, setDataInit] = useState<IDocument | null>(null)
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)

  const reloadTable = () => {
    tableRef?.current?.reload()
  }

  const columns: ProColumns<IDocument>[] = [
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
    // {
    //   title: 'ID',
    //   dataIndex: '_id',
    //   width: 200,
    //   render: (text, record, index, action) => {
    //     return (
    //       <a
    //         href="#"
    //         onClick={() => {
    //           setOpenViewDetail(true)
    //           setDataInit(record)
    //         }}
    //       >
    //         {record._id}
    //       </a>
    //     )
    //   },
    //   hideInSearch: true
    // },
    {
      title: 'Tên văn bản',
      dataIndex: ['name'],
      hideInSearch: false,
      render: (text, record, index, action) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true)
              setDataInit(record)
            }}
          >
            {record.name}
          </a>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      sorter: true,
      renderFormItem: (item, props, form) => (
        <ProFormSelect
          showSearch
          mode="multiple"
          allowClear
          valueEnum={{
            ACTIVE: 'ACTIVE',
            INACTIVE: 'INACTIVE'
          }}
          placeholder="Chọn trạng thái"
        />
      ),
      render(value, record, index) {
        return (
          <>
            <Tag color={record.status === 'ACTIVE' ? 'lime' : 'red'}>
              {record.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
          </>
        )
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format('DD/MM/YYYY - HH:mm:ss')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updatedAt',
      width: 150,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Hành động',
      dataIndex: '',
      hideInSearch: true,
      width: 100,
      render: (value, record, index) => (
        <Space>
          <CopyOutlined
            style={{
              fontSize: 20,
              color: '#85b970'
            }}
            type=""
            onClick={() => {
              navigator.clipboard.writeText(
                `${import.meta.env.VITE_BACKEND_URL}/files/document/${
                  record?.url
                }`
              )
              message.success('Đã lưu đường dẫn vào bảng nhớ tạm!')
            }}
          />

          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/files/document/${
              record?.url
            }`}
            target="_blank"
          >
            <ExportOutlined
              style={{
                fontSize: 20,
                color: '#ffa500'
              }}
              type=""
            />
          </a>
        </Space>
      )
    }
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    if (clone.name) clone.name = `/${clone.name}/i`
    if (clone?.status?.length) {
      clone.status = clone.status.join(',')
    }

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.status) {
      sortBy = sort.status === 'ascend' ? 'sort=status' : 'sort=-status'
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
      <Access permission={ALL_PERMISSIONS.DOCUMENTS.GET_PAGINATE}>
        <DataTable<IDocument>
          actionRef={tableRef}
          headerTitle="Danh sách văn bản"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={documents}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchDocument({query}))
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
                onClick={() => setIsModalOpen(true)}
              >
                Thêm mới
              </Button>
            )
          }}
        />
      </Access>
      <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ViewDetailDocument
        open={openViewDetail}
        onClose={setOpenViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={reloadTable}
      />
    </div>
  )
}

export default DocumentPage
