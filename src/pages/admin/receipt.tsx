import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IReceipt} from '@/types/backend'
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef} from 'react'
import dayjs from 'dayjs'
import {callDeleteReceipt} from '@/config/api'
import queryString from 'query-string'
import {fetchReceipt} from '@/redux/slice/receiptSlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalReceipt from '@/components/admin/receipt/modal.receipt'
import {formatCurrency} from '@/config/utils'
import ImportModal from '@/components/admin/receipt/modal.import'

const ReceiptPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IReceipt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.receipt.isFetching)
  const meta = useAppSelector((state) => state.receipt.meta)
  const receipts = useAppSelector((state) => state.receipt.result)
  const dispatch = useAppDispatch()

  const handleDeleteReceipt = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteReceipt(_id)
      if (res && res.data) {
        message.success('Xóa phiếu thu thành công!')
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

  const columns: ProColumns<IReceipt>[] = [
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
      title: 'Thành viên',
      dataIndex: 'name',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{record.user?.name}</>
      }
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{record.description}</>
      }
    },
    {
      title: 'Danh mục thu',
      dataIndex: 'receiptCategory',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{record.incomeCategory?.description}</>
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      sorter: true,
      render: (text, record) => formatCurrency(record.amount),
      hideInSearch: true
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.time).format('DD/MM/YYYY')}</>
      }
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
          <Access permission={ALL_PERMISSIONS.RECEIPTS.UPDATE} hideChildren>
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

          <Access permission={ALL_PERMISSIONS.RECEIPTS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa phiếu thu'}
              description={'Bạn có chắc chắn muốn xóa phiếu thu này?'}
              onConfirm={() => handleDeleteReceipt(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{cursor: 'pointer', margin: '0 10px'}}>
                <DeleteOutlined
                  style={{
                    fontSize: 20,
                    color: '#ff4d4f'
                  }}
                />
              </span>
            </Popconfirm>
          </Access>
        </Space>
      )
    }
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    // if (clone.name) clone.name = `/${clone.name}/i`
    if (clone.description) clone.description = `/${clone.description}/i`
    if (clone.time) clone.time = `/${clone.time}/i`
    if (clone.amount) clone.amount = `/${clone.amount}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
    // if (sort && sort.name) {
    //   sortBy = sort.name === 'ascend' ? 'sort=name' : 'sort=-name'
    // }
    if (sort && sort.description) {
      sortBy =
        sort.description === 'ascend' ? 'sort=description' : 'sort=-description'
    }
    if (sort && sort.time) {
      sortBy = sort.time === 'ascend' ? 'sort=time' : 'sort=-time'
    }
    if (sort && sort.amount) {
      sortBy = sort.amount === 'ascend' ? 'sort=amount' : 'sort=-amount'
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
      <Access permission={ALL_PERMISSIONS.RECEIPTS.GET_PAGINATE}>
        <DataTable<IReceipt>
          actionRef={tableRef}
          headerTitle="Danh sách phiếu thu"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={receipts}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchReceipt({query}))
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
      <ModalReceipt
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
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

export default ReceiptPage
