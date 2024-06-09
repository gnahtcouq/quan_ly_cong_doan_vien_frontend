import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IDocument} from '@/types/backend'
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
import {callDeleteDocument} from '@/config/api'
import queryString from 'query-string'
import {useNavigate} from 'react-router-dom'
import {fetchDocument} from '@/redux/slice/documentSlide'
import ViewDetailDocument from '@/components/admin/document/view.document'
import {ALL_PERMISSIONS} from '@/config/permissions'
import Access from '@/components/share/access'

const DocumentPage = () => {
  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.document.isFetching)
  const meta = useAppSelector((state) => state.document.meta)
  const documents = useAppSelector((state) => state.document.result)
  const dispatch = useAppDispatch()

  const [dataInit, setDataInit] = useState<IDocument | null>(null)
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)

  // const handleDeleteDocument = async (_id: string | undefined) => {
  //   if (_id) {
  //     const res = await callDeleteDocument(_id)
  //     if (res && res.data) {
  //       message.success('Xóa văn bản thành công!')
  //       reloadTable()
  //     } else {
  //       notification.error({
  //         message: 'Có lỗi xảy ra',
  //         description: res.message
  //       })
  //     }
  //   }
  // }

  const reloadTable = () => {
    tableRef?.current?.reload()
  }

  const columns: ProColumns<IDocument>[] = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: 250,
      render: (text, record, index, action) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true)
              setDataInit(record)
            }}
          >
            {record._id}
          </a>
        )
      },
      hideInSearch: true
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
            PENDING: 'PENDING',
            REVIEWING: 'REVIEWING',
            APPROVED: 'APPROVED',
            REJECTED: 'REJECTED'
          }}
          placeholder="Chọn trạng thái"
        />
      )
    },

    {
      title: 'Tên văn bản',
      dataIndex: ['postId', 'name'],
      hideInSearch: true
    },
    {
      title: 'Đơn vị',
      dataIndex: ['departmentId', 'name'],
      hideInSearch: true
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'updatedAt',
      width: 150,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
      },
      hideInSearch: true
    }
    // {

    //     title: 'Actions',
    //     hideInSearch: true,
    //     width: 50,
    //     render: (_value, entity, _index, _action) => (
    //         <Space>
    //             <EditOutlined
    //                 style={{
    //                     fontSize: 20,
    //                     color: '#ffa500',
    //                 }}
    //                 type=""
    //                 onClick={() => {
    //                     navigate(`/admin/post/upsert?id=${entity._id}`)
    //                 }}
    //             />

    //             <Popconfirm
    //                 placement="leftTop"
    //                 title={"Xác nhận xóa văn bản"}
    //                 description={"Bạn có chắc chắn muốn xóa văn bản này?"}
    //                 onConfirm={() => handleDeleteDocument(entity._id)}
    //                 okText="Xác nhận"
    //                 cancelText="Hủy"
    //             >
    //                 <span style={{ cursor: "pointer", margin: "0 10px" }}>
    //                     <DeleteOutlined
    //                         style={{
    //                             fontSize: 20,
    //                             color: '#ff4d4f',
    //                         }}
    //                     />
    //                 </span>
    //             </Popconfirm>
    //         </Space>
    //     ),

    // },
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    // if (clone.name) clone.name = `/${clone.name}/i`;
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

    temp +=
      '&populate=departmentId,postId&fields=departmentId._id, departmentId.name, departmentId.logo, postId._id, postId.name'
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
            return <></>
          }}
        />
      </Access>
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
