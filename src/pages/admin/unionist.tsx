import DataTable from '@/components/client/data-table'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {fetchUnionist} from '@/redux/slice/unionistSlide'
import {IUnionist} from '@/types/backend'
import {
  ApiOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {ActionType, ProColumns} from '@ant-design/pro-components'
import {
  Button,
  Checkbox,
  Popconfirm,
  Space,
  Spin,
  message,
  notification
} from 'antd'
import {useState, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import {
  callDeleteUnionist,
  callFetchDepartmentWithoutDescription
} from '@/config/api'
import queryString from 'query-string'
import ModalUnionist, {
  IDepartmentSelect
} from '@/components/admin/unionist/modal.unionist'
import ViewDetailUnionist from '@/components/admin/unionist/view.unionist'
import Access from '@/components/share/access'
import {ALL_PERMISSIONS} from '@/config/permissions'
import ModalPermission from '@/components/admin/unionist/modal.permission'
import ImportModal from '@/components/admin/unionist/modal.import'

const UnionistPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalPermissions, setOpenModalPermissions] =
    useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataInit, setDataInit] = useState<IUnionist | null>(null)
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
  const [departments, setDepartments] = useState<IDepartmentSelect[]>([])
  const [showNotLeft, setShowNotLeft] = useState<boolean>(false)
  const [showLeft, setShowLeft] = useState<boolean>(false)

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.unionist.isFetching)
  const meta = useAppSelector((state) => state.unionist.meta)
  const unionists = useAppSelector((state) => state.unionist.result)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await fetchDepartmentList('')
      setDepartments(departments)
    }
    fetchDepartments()
  }, [])

  const handleDeleteUnionist = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteUnionist(_id)
      if (res && res.data) {
        message.success('Xóa công đoàn viên thành công!')
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
    const department = departments.find(
      (cat) => cat.value === record.departmentId
    )
    setDataInit({
      ...record,
      departmentName: department ? department.label : ''
    })
    setOpenViewDetail(true)
  }

  const reloadTable = () => {
    tableRef?.current?.reload()
  }

  async function fetchDepartmentList(
    name: string
  ): Promise<IDepartmentSelect[]> {
    const res = await callFetchDepartmentWithoutDescription(
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

  const columns: ProColumns<IUnionist>[] = [
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
        return (
          <a href="#" onClick={() => handleViewDetail(record)}>
            {record.id}
          </a>
        )
      }
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 200,
      sorter: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true
    },
    {
      title: 'Đơn vị',
      dataIndex: 'departmentId',
      width: 250,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: departments,
        mode: 'multiple'
      },
      render: (text, record) => {
        const department = departments.find(
          (cat) => cat.value === record.departmentId
        )
        return <>{department ? department.label : ''}</>
      }
    },
    {
      title: 'Ngày vào công đoàn',
      dataIndex: 'unionEntryDate',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.unionEntryDate).format('DD/MM/YYYY')}</>
      },
      hideInSearch: true
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
          <Access permission={ALL_PERMISSIONS.UNIONISTS.UPDATE} hideChildren>
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

          <Access permission={ALL_PERMISSIONS.UNIONISTS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={'Xác nhận xóa thành viên'}
              description={'Bạn có chắc chắn muốn xóa công đoàn viên này?'}
              onConfirm={() => handleDeleteUnionist(entity._id)}
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

          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <ApiOutlined
              style={{
                fontSize: 20,
                color: '#85b970'
              }}
              type=""
              onClick={() => {
                setOpenModalPermissions(true)
                setDataInit(entity)
              }}
            />
          </Access>
        </Space>
      )
    }
  ]

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone: any = {...params}
    if (clone.id) clone.id = `/${clone.id}/i`
    if (clone.name) clone.name = `/${clone.name}/i`
    if (clone.email) clone.email = `/${clone.email}/i`

    if (showNotLeft) clone.leaving = 1
    else if (showLeft) clone.leaving = 2
    else delete clone.leaving

    let temp = queryString.stringify(clone)

    let sortBy = ''
    if (sort && sort.id) {
      sortBy = sort.id === 'ascend' ? 'sort=id' : 'sort=-id'
    }
    if (sort && sort.name) {
      sortBy = sort.name === 'ascend' ? 'sort=name' : 'sort=-name'
    }
    if (sort && sort.email) {
      sortBy = sort.email === 'ascend' ? 'sort=email' : 'sort=-email'
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

  const handleCheckboxChange = (e) => {
    const {name, checked} = e.target

    if (name === 'showNotLeft') {
      setShowNotLeft(checked)
      if (checked) setShowLeft(false)
    } else if (name === 'showLeft') {
      setShowLeft(checked)
      if (checked) setShowNotLeft(false)
    }

    reloadTable()
  }

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.UNIONISTS.GET_PAGINATE}>
        <div
          style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}
        >
          <Checkbox
            name="showNotLeft"
            checked={showNotLeft}
            onChange={handleCheckboxChange}
            style={{marginBottom: 10}}
          >
            Công đoàn viên đang hoạt động
          </Checkbox>
          <Checkbox
            name="showLeft"
            checked={showLeft}
            onChange={handleCheckboxChange}
          >
            Công đoàn viên đã chuyển đi
          </Checkbox>
        </div>
        <DataTable<IUnionist>
          actionRef={tableRef}
          headerTitle="Danh sách công đoàn viên"
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={unionists}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter)
            dispatch(fetchUnionist({query}))
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
      <ModalUnionist
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ModalPermission
        openModal={openModalPermissions}
        setOpenModal={setOpenModalPermissions}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
      <ViewDetailUnionist
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

export default UnionistPage
