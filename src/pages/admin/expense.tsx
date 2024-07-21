import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IExpense} from '@/types/backend'
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import {callDeleteExpense, callFetchExpenseCategory} from '@/config/api'
import queryString from 'query-string'
import {fetchExpense} from '@/redux/slice/expenseSlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalExpense, {
  IExpenseCategorySelect
} from '@/components/admin/expense/modal.expense'
import {formatCurrency} from '@/config/utils'
import ImportModal from '@/components/admin/expense/modal.import'

const ExpensePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IExpense | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [expenseCategories, setExpenseCategories] = useState<
    IExpenseCategorySelect[]
  >([])

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.expense.isFetching)
  const meta = useAppSelector((state) => state.expense.meta)
  const expenses = useAppSelector((state) => state.expense.result)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await fetchExpenseCategoryList('')
      setExpenseCategories(categories)
    }

    fetchCategories()
  }, [])

  const handleDeleteExpense = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteExpense(_id)
      if (res && res.data) {
        message.success('Xóa phiếu chi thành công!')
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

  async function fetchExpenseCategoryList(
    description: string
  ): Promise<IExpenseCategorySelect[]> {
    const res = await callFetchExpenseCategory(
      `current=1&pageSize=100&description=/${description}/i`
    )
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => ({
        label: item.description as string,
        value: item._id as string
      }))
      return temp
    } else return []
  }

  const columns: ProColumns<IExpense>[] = [
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
      title: 'Mã PC',
      dataIndex: 'receiptId',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{record.expenseId}</>
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
      title: 'Danh mục',
      dataIndex: 'expenseCategoryId',
      sorter: true,
      render: (text, record) => {
        const category = expenseCategories.find(
          (cat) => cat.value === record.expenseCategoryId
        )
        return <>{category ? category.label : 'Trống'}</>
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
      title: 'Người sửa',
      dataIndex: 'updatedBy.email',
      sorter: true,
      render: (text, record, index, action) => {
        return (
          <>{record?.updatedBy?.email ? record.updatedBy.email : 'Trống'}</>
        )
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
          <Access permission={ALL_PERMISSIONS.EXPENSES.UPDATE} hideChildren>
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

          <Access permission={ALL_PERMISSIONS.EXPENSES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa phiếu chi'}
              description={'Bạn có chắc chắn muốn xóa phiếu chi này?'}
              onConfirm={() => handleDeleteExpense(entity._id)}
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
    if (clone.description) clone.description = `/${clone.description}/i`
    if (clone.time) clone.time = `/${clone.time}/i`
    if (clone.amount) clone.amount = `/${clone.amount}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
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
      <Access permission={ALL_PERMISSIONS.EXPENSES.GET_PAGINATE}>
        <DataTable<IExpense>
          actionRef={tableRef}
          headerTitle="Danh sách phiếu chi"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={expenses}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchExpense({query}))
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
      <ModalExpense
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

export default ExpensePage
