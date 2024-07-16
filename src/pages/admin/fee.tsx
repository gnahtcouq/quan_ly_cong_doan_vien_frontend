import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IFee} from '@/types/backend'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef} from 'react'
import dayjs from 'dayjs'
import {callDeleteFee} from '@/config/api'
import queryString from 'query-string'
import {fetchFee} from '@/redux/slice/feeSlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalFee from '@/components/admin/fee/modal.fee'
import {formatCurrency} from '@/config/utils'

const FeePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IFee | null>(null)
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.fee.isFetching)
  const meta = useAppSelector((state) => state.fee.meta)
  const fees = useAppSelector((state) => state.fee.result)
  const dispatch = useAppDispatch()

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
      dataIndex: 'name',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{record.unionist?.name}</>
      }
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
      title: 'Số tiền',
      dataIndex: 'fee',
      sorter: true,
      render: (text, record) => formatCurrency(record.fee),
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
        </Space>
      )
    }
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = {...params}
    if (clone.name) clone.name = `/${clone.name}/i`
    if (clone.monthYear) clone.monthYear = `/${clone.monthYear}/i`
    if (clone.fee) clone.fee = `/${clone.fee}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name' : 'sort=-name'
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
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setOpenModal(true)}
              >
                Thêm mới
              </Button>
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
      {/* <ViewDetailFee
        onClose={setOpenViewDetail}
        open={openViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
      /> */}
    </div>
  )
}

export default FeePage
