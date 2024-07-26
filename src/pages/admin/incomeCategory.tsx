import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {IIncomeCategory} from '@/types/backend'
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  HistoryOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {Button, Popconfirm, Space, message, notification} from 'antd'
import {useState, useRef} from 'react'
import dayjs from 'dayjs'
import {callDeleteIncomeCategory} from '@/config/api'
import queryString from 'query-string'
import {fetchIncomeCategory} from '@/redux/slice/incomeCategorySlide'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalIncomeCategory from '@/components/admin/incomeCategory/modal.incomeCategory'
import {formatCurrency} from '@/config/utils'
import ImportModal from '@/components/admin/incomeCategory/modal.import'
import ViewDetailIncomeCategoryHistory from '@/components/admin/incomeCategory/view.history'

const IncomeCategoryPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IIncomeCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [openViewDetailHistory, setOpenViewDetailHistory] =
    useState<boolean>(false)

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.incomeCategory.isFetching)
  const meta = useAppSelector((state) => state.incomeCategory.meta)
  const incomeCategorys = useAppSelector((state) => state.incomeCategory.result)
  const dispatch = useAppDispatch()

  const handleDeleteIncomeCategory = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteIncomeCategory(_id)
      if (res && res.data) {
        message.success('Xóa danh mục thu thành công!')
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

  const columns: ProColumns<IIncomeCategory>[] = [
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
        return <>{record.id}</>
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
      title: 'Dự toán',
      dataIndex: 'budget',
      sorter: true,
      render: (text, record) => formatCurrency(record.budget)
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.year).format('YYYY')}</>
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
          <Access
            permission={ALL_PERMISSIONS.INCOMECATEGORIES.UPDATE}
            hideChildren
          >
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

          <Access
            permission={ALL_PERMISSIONS.INCOMECATEGORIES.DELETE}
            hideChildren
          >
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa danh mục thu'}
              description={'Bạn có chắc chắn muốn xóa danh mục thu này?'}
              onConfirm={() => handleDeleteIncomeCategory(entity._id)}
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
    if (clone.id) clone.id = `/${clone.id}/i`
    if (clone.description) clone.description = `/${clone.description}/i`
    if (clone.budget) clone.budget = `/${clone.budget}/i`
    if (clone.year) clone.year = `/${clone.year}/i`

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.id) {
      sortBy = sort.id === 'ascend' ? 'sort=id' : 'sort=-id'
    }
    if (sort && sort.description) {
      sortBy =
        sort.description === 'ascend' ? 'sort=description' : 'sort=-description'
    }
    if (sort && sort.budget) {
      sortBy = sort.budget === 'ascend' ? 'sort=budget' : 'sort=-budget'
    }
    if (sort && sort.year) {
      sortBy = sort.year === 'ascend' ? 'sort=year' : 'sort=-year'
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
      <Access permission={ALL_PERMISSIONS.INCOMECATEGORIES.GET_PAGINATE}>
        <DataTable<IIncomeCategory>
          actionRef={tableRef}
          headerTitle="Danh sách danh mục thu"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={incomeCategorys}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchIncomeCategory({query}))
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
      <ModalIncomeCategory
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ViewDetailIncomeCategoryHistory
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

export default IncomeCategoryPage
