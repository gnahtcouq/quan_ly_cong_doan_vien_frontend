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
import {useState, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import {callDeleteReceipt, callFetchIncomeCategory} from '@/config/api'
import queryString from 'query-string'
import {fetchReceipt} from '@/redux/slice/receiptSlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalReceipt, {
  IIncomeCategorySelect
} from '@/components/admin/receipt/modal.receipt'
import {formatCurrency} from '@/config/utils'
import ImportModal from '@/components/admin/receipt/modal.import'
import ViewDetailReceipt from '@/components/admin/receipt/view.receipt'

const ReceiptPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IReceipt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [incomeCategories, setIncomeCategories] = useState<
    IIncomeCategorySelect[]
  >([])

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.receipt.isFetching)
  const meta = useAppSelector((state) => state.receipt.meta)
  const receipts = useAppSelector((state) => state.receipt.result)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await fetchIncomeCategoryList('')
      setIncomeCategories(categories)
    }

    fetchCategories()
  }, [])

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

  const handleViewDetail = (record) => {
    const category = incomeCategories.find(
      (cat) => cat.value === record.incomeCategoryId
    )
    setDataInit({
      ...record,
      incomeCategory: category ? category.label : ''
    })
    setOpenViewDetail(true)
  }

  const reloadTable = () => {
    tableRef?.current?.reload()
  }

  async function fetchIncomeCategoryList(
    description: string
  ): Promise<IIncomeCategorySelect[]> {
    const res = await callFetchIncomeCategory(
      `current=1&pageSize=100&description=/${description}/i`
    )
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => ({
        label: item.description as string,
        value: item.incomeCategoryId as string
      }))
      return temp
    } else return []
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
      title: 'Mã PT',
      dataIndex: 'receiptId',
      sorter: true,
      render: (text, record, index, action) => {
        return (
          <>
            {' '}
            <a href="#" onClick={() => handleViewDetail(record)}>
              {record.receiptId}
            </a>
          </>
        )
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
      dataIndex: 'incomeCategoryId',
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: incomeCategories,
        mode: 'multiple'
      },
      render: (text, record) => {
        const category = incomeCategories.find(
          (cat) => cat.value === record.incomeCategoryId
        )
        return <>{category ? category.label : ''}</>
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
        return <>{record?.updatedBy?.email ? record.updatedBy.email : ''}</>
      },
      hideInSearch: true
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

  const convertDateFormat = (dateStr) => {
    // Tách ngày, tháng, năm từ chuỗi ngày
    const [day, month, year] = dateStr.split('/')
    // Tạo đối tượng ngày với định dạng yyyy-mm-dd
    const formattedDate = dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD')

    return formattedDate
  }

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    if (clone.description) clone.description = `/${clone.description}/i`
    if (clone.time) {
      // Chuyển đổi ngày thành định dạng YYYY-MM-DD
      const formattedDate = convertDateFormat(clone.time)
      clone.time = `/${formattedDate}/i`
    }
    if (clone.amount) clone.amount = `/${clone.amount}/i`
    if (clone.incomeCategoryId)
      clone.incomeCategoryId = clone.incomeCategoryId.join(',')

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
    if (sort && sort.incomeCategoryId) {
      sortBy =
        sort.incomeCategoryId === 'ascend'
          ? 'sort=incomeCategoryId'
          : 'sort=-incomeCategoryId'
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
      <ViewDetailReceipt
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

export default ReceiptPage
