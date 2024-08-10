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
import {ActionType, ProColumns, ProForm} from '@ant-design/pro-components'
import {
  Button,
  Checkbox,
  DatePicker,
  Popconfirm,
  Select,
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
import {set} from 'lodash'
import {disabledMonthYear} from '@/config/utils'

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
  const [showJoining, setShowJoining] = useState<boolean>(false)

  const tableRef = useRef<ActionType>()

  const isFetching = useAppSelector((state) => state.unionist.isFetching)
  const meta = useAppSelector((state) => state.unionist.meta)
  const unionists = useAppSelector((state) => state.unionist.result)
  const dispatch = useAppDispatch()

  const {Option} = Select
  const [year, setYear] = useState<string | null>(null)
  const [joiningStartMonthYear, setJoiningStartMonthYear] = useState<
    string | null
  >(null)
  const [joiningEndMonthYear, setJoiningEndMonthYear] = useState<string | null>(
    null
  )
  const [leavingStartMonthYear, setLeavingStartMonthYear] = useState<
    string | null
  >(null)
  const [leavingEndMonthYear, setLeavingEndMonthYear] = useState<string | null>(
    null
  )
  const [datePickerKey, setDatePickerKey] = useState<number>(0) // Thêm state để buộc DatePicker làm mới

  const [searchType, setSearchType] = useState<'all' | 'year' | 'range'>('all')
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

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
      title: 'Ngày chuyển đến',
      dataIndex: 'joiningDate',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.joiningDate).format('DD/MM/YYYY')}</>
      },
      hideInSearch: true
    },
    {
      title: 'Ngày chuyển đi',
      dataIndex: 'leavingDate',
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.leavingDate).format('DD/MM/YYYY')}</>
      },
      hideInSearch: true
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

    // Thêm điều kiện năm hoặc khoảng thời gian
    if (searchType === 'year' && year) {
      clone.year = year
    } else if (searchType === 'range') {
      if (showNotLeft) {
        if (joiningStartMonthYear && joiningEndMonthYear) {
          clone.joiningStartMonthYear = joiningStartMonthYear
          clone.joiningEndMonthYear = joiningEndMonthYear
        }
      } else if (showLeft) {
        if (leavingStartMonthYear && leavingEndMonthYear) {
          clone.leavingStartMonthYear = leavingStartMonthYear
          clone.leavingEndMonthYear = leavingEndMonthYear
        }
      }
    }

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

  const handleTableChange = (pagination) => {
    setCurrent(pagination.current)
    setPageSize(pagination.pageSize)
  }

  const handleCheckboxChange = (e) => {
    const {name, checked} = e.target

    if (name === 'showNotLeft') {
      setShowNotLeft(checked)
      if (checked) {
        setShowLeft(false)
        setShowJoining(false)
      }
    } else if (name === 'showLeft') {
      setShowLeft(checked)
      if (checked) {
        setShowNotLeft(false)
        setShowJoining(false)
      }
    } else if (name === 'showJoining') {
      setShowJoining(checked)
      if (checked) {
        setShowLeft(false)
        setShowNotLeft(false)
      }
    }

    // Kiểm tra nếu không có checkbox nào được chọn, đặt searchType là 'all'
    if (
      name !== 'showNotLeft' &&
      name !== 'showLeft' &&
      name !== 'showJoining'
    ) {
      setSearchType('all')
    } else if (name === 'showJoining') {
      setSearchType('year') // Nếu chọn showJoining, mặc định chọn year
    } else {
      setSearchType('range') // Nếu có checkbox khác, chọn range
    }

    // Reset các giá trị ngày khi checkbox thay đổi
    setYear(null)
    setJoiningStartMonthYear(null)
    setJoiningEndMonthYear(null)
    setLeavingStartMonthYear(null)
    setLeavingEndMonthYear(null)

    setCurrent(1)
    setDatePickerKey((prev) => prev + 1) // Thay đổi key để buộc DatePicker làm mới
    reloadTable()
  }

  const handleDateChange = (date, dateStrings) => {
    if (searchType === 'year') {
      if (date) {
        const formattedDate = date.format('YYYY')
        setYear(formattedDate)
        setJoiningEndMonthYear(null)
        setJoiningStartMonthYear(null)
        setLeavingEndMonthYear(null)
        setLeavingStartMonthYear(null)
      } else {
        setYear(null)
      }
    } else if (searchType === 'range') {
      if (date && date.length === 2) {
        if (showNotLeft) {
          setJoiningStartMonthYear(date[0].format('YYYY/MM'))
          setJoiningEndMonthYear(date[1].format('YYYY/MM'))
        } else if (showLeft) {
          setLeavingStartMonthYear(date[0].format('YYYY/MM'))
          setLeavingEndMonthYear(date[1].format('YYYY/MM'))
        }
      } else {
        // Reset nếu khoảng thời gian không đầy đủ
        setJoiningStartMonthYear(null)
        setJoiningEndMonthYear(null)
        setLeavingStartMonthYear(null)
        setLeavingEndMonthYear(null)
      }
    }
    setCurrent(1)
    reloadTable()
  }

  const handleSearchTypeChange = (value) => {
    setSearchType(value)
    if (value === 'year') {
      setYear(dayjs().format('YYYY')) // Mặc định năm hiện tại khi chọn year
      setJoiningStartMonthYear(null)
      setJoiningEndMonthYear(null)
      setLeavingStartMonthYear(null)
      setLeavingEndMonthYear(null)
    } else if (value === 'range') {
      setYear(null)
    } else {
      setYear(null)
      setJoiningStartMonthYear(null)
      setJoiningEndMonthYear(null)
      setLeavingStartMonthYear(null)
      setLeavingEndMonthYear(null)
    }

    setCurrent(1)
    setDatePickerKey((prev) => prev + 1) // Thay đổi key để buộc DatePicker làm mới
  }

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.UNIONISTS.GET_PAGINATE}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 10,
            width: '50%'
          }}
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
            style={{marginBottom: 10}}
          >
            Công đoàn viên đã chuyển đi
          </Checkbox>
          <Checkbox
            name="showJoining"
            checked={showJoining}
            onChange={handleCheckboxChange}
          >
            Công đoàn viên chuyển đến trong năm
          </Checkbox>
          <ProForm.Item label="Lọc" style={{marginTop: 10}}>
            <Select
              value={searchType} // Đặt giá trị của Select
              style={{width: '50%', paddingRight: '5px'}}
              onChange={handleSearchTypeChange}
            >
              <Option value="all">Tất cả</Option>
              <Option value="year">Năm</Option>
              <Option value="range">Khoảng thời gian</Option>
            </Select>

            <DatePicker
              key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
              format="YYYY"
              placeholder={
                searchType === 'all'
                  ? '*'
                  : searchType === 'year'
                  ? 'chọn năm'
                  : 'chọn năm/tháng'
              }
              picker={searchType === 'year' ? 'year' : 'month'}
              onChange={handleDateChange}
              disabled={
                searchType === 'all' || searchType === 'range' || !showJoining
              } // Disabled nếu không chọn checkbox
              disabledDate={disabledMonthYear}
              style={{width: '50%'}}
            />
          </ProForm.Item>

          {searchType === 'range' && (
            <ProForm.Item label="Với">
              <DatePicker.RangePicker
                key={datePickerKey} // Sử dụng key để buộc làm mới DatePicker
                format="YYYY/MM"
                placeholder={['Từ năm/tháng', 'Đến năm/tháng']}
                picker="month"
                onChange={handleDateChange}
                disabled={!showNotLeft && !showLeft} // Disabled nếu không chọn checkbox
                disabledDate={disabledMonthYear}
                style={{width: '100%'}}
              />
            </ProForm.Item>
          )}
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
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            total: meta.total,
            onChange: (page, pageSize) =>
              handleTableChange({current: page, pageSize}),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} hàng`
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
