import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IFee} from '@/types/backend'
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  HistoryOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import {callDeleteFee, callFetchUnionist} from '@/config/api'
import queryString from 'query-string'
import {fetchFee} from '@/redux/slice/feeSlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalFee, {IUnionistSelect} from '@/components/admin/fee/modal.fee'
import {formatCurrency} from '@/config/utils'
import ImportModal from '@/components/admin/fee/modal.import'
import ViewDetailFeeHistory from '@/components/admin/fee/view.history'

const FeePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openViewDetailHistory, setOpenViewDetailHistory] =
    useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IFee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [unionists, setUnionists] = useState<IUnionistSelect[]>([])

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.fee.isFetching)
  const meta = useAppSelector((state) => state.fee.meta)
  const fees = useAppSelector((state) => state.fee.result)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchUnionists = async () => {
      const unionists = await fetchUnionistList('')
      setUnionists(unionists)
    }
    fetchUnionists()
  }, [])

  const handleDeleteFee = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteFee(_id)
      if (res && res.data) {
        message.success('Xóa công đoàn phí thành công!')
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

  async function fetchUnionistList(name: string): Promise<IUnionistSelect[]> {
    const res = await callFetchUnionist(
      `current=1&pageSize=100&name=/${name}/i`
    )
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => ({
        label: item.name as string,
        value: item.id as string
      }))
      return temp
    } else return []
  }

  const columns: ProColumns<IFee>[] = [
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
      title: 'Họ và tên',
      dataIndex: 'unionistId',
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: unionists,
        mode: 'multiple'
      },
      render: (text, record) => {
        const unionist = unionists.find(
          (cat) => cat.value === record.unionistId
        )
        return <>{unionist ? unionist.label : ''}</>
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'fee',
      sorter: true,
      render: (text, record) => formatCurrency(record.fee),
      hideInSearch: true
    },
    {
      title: 'Thời gian',
      dataIndex: 'monthYear',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.monthYear).format('MM/YYYY')}</>
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
          <Access permission={ALL_PERMISSIONS.FEES.UPDATE} hideChildren>
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

          <Access permission={ALL_PERMISSIONS.FEES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa công đoàn phí'}
              description={'Bạn có chắc chắn muốn xóa công đoàn phí này?'}
              onConfirm={() => handleDeleteFee(entity._id)}
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

          <a
            href="#"
            onClick={() => {
              setOpenViewDetailHistory(true)
              setDataInit(entity)
            }}
          >
            <HistoryOutlined
              style={{
                fontSize: 20,
                color: '#000'
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
    if (clone.unionistId) clone.unionistId = clone.unionistId.join(',')
    if (clone.monthYear) {
      const [month, year] = clone.monthYear.split('/')
      clone.monthYear = `${year}/${month}`
    }
    if (clone.fee) clone.fee = `/${clone.fee}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.unionistId) {
      sortBy =
        sort.unionistId === 'ascend' ? 'sort=unionistId' : 'sort=-unionistId'
    }
    if (sort && sort.monthYear) {
      sortBy =
        sort.monthYear === 'ascend' ? 'sort=monthYear' : 'sort=-monthYear'
    }
    if (sort && sort.fee) {
      sortBy = sort.fee === 'ascend' ? 'sort=fee' : 'sort=-fee'
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
      <Access permission={ALL_PERMISSIONS.FEES.GET_PAGINATE}>
        <DataTable<IFee>
          actionRef={tableRef}
          headerTitle="Danh sách công đoàn phí"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={fees}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchFee({query}))
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
      <ModalFee
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ViewDetailFeeHistory
        open={openViewDetailHistory}
        onClose={setOpenViewDetailHistory}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={reloadTable}
      />
      <ImportModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        reloadTable={reloadTable}
      />
    </div>
  )
}

export default FeePage
