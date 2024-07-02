import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import {
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Row,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import {useState, useEffect} from 'react'
import {
  callCreateUnionist,
  callFetchDepartment,
  callFetchRole,
  callUpdateUnionist
} from '@/config/api'
import {IUnionist} from '@/types/backend'
import {DebounceSelect} from './debouce.select'
import dayjs from 'dayjs'
import en_US from 'antd/lib/locale/en_US'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IUnionist | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

export interface IRoleSelect {
  label: string
  value: string
  key?: string
}

export interface IDepartmentSelect {
  label: string
  value: string
  key?: string
}

const ModalUnionist = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [departments, setDepartments] = useState<IDepartmentSelect[]>([])
  const [roles, setRoles] = useState<IRoleSelect[]>([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (dataInit?._id) {
      if (dataInit.department) {
        setDepartments([
          {
            label: dataInit.department?.name,
            value: dataInit.department?._id,
            key: dataInit.department?._id
          }
        ])
      }
      if (dataInit.role) {
        setRoles([
          {
            label: dataInit.role?.name,
            value: dataInit.role?._id,
            key: dataInit.role?._id
          }
        ])
      }
    }
  }, [dataInit])

  const submitUnionist = async (valuesForm: any) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      address,
      CCCD,
      joiningDate,
      leavingDate,
      unionEntryDate,
      note,
      role,
      department
    } = valuesForm
    if (dataInit?._id) {
      //update
      const unionist = {
        _id: dataInit._id,
        name,
        email,
        password,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        gender,
        address,
        CCCD: CCCD ? CCCD : null,
        joiningDate: joiningDate ? joiningDate.toISOString() : null,
        leavingDate: leavingDate ? leavingDate.toISOString() : null,
        unionEntryDate: unionEntryDate ? unionEntryDate.toISOString() : null,
        note,
        role: role ? role.value : dataInit.role?._id, // Giữ nguyên vai trò nếu đã có
        department:
          department && department.value
            ? {
                _id: department.value,
                name: department.label
              }
            : {
                _id: dataInit.department?._id,
                name: dataInit.department?.name
              } // Giữ nguyên đơn vị nếu đã có
      }

      const res = await callUpdateUnionist(unionist, dataInit._id)
      if (res.data) {
        message.success('Cập nhật công đoàn viên thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    } else {
      //create
      const unionist = {
        name,
        email,
        password,
        dateOfBirth,
        gender,
        address,
        CCCD,
        joiningDate,
        leavingDate,
        unionEntryDate,
        note,
        role: role.value,
        department: {
          _id: department.value,
          name: department.label
        }
      }
      const res = await callCreateUnionist(unionist)
      if (res.data) {
        message.success('Thêm mới công đoàn viên thành công!')
        handleReset()
        reloadTable()
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message
        })
      }
    }
  }

  const handleReset = async () => {
    form.resetFields()
    setDataInit(null)
    setDepartments([])
    setRoles([])
    setOpenModal(false)
  }

  // Usage of DebounceSelect
  async function fetchDepartmentList(
    name: string
  ): Promise<IDepartmentSelect[]> {
    const res = await callFetchDepartment(
      `current=1&pageSize=100&name=/${name}/i`
    )
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string
        }
      })
      return temp
    } else return []
  }

  async function fetchRoleList(name: string): Promise<IRoleSelect[]> {
    const res = await callFetchRole(`current=1&pageSize=100&name=/${name}/i`)
    if (res && res.data) {
      const list = res.data.result
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string
        }
      })
      return temp
    } else return []
  }

  const initialValues = dataInit
    ? {
        ...dataInit,
        dateOfBirth: dataInit.dateOfBirth ? dayjs(dataInit.dateOfBirth) : null,
        joiningDate: dataInit.joiningDate ? dayjs(dataInit.joiningDate) : null,
        leavingDate: dataInit.leavingDate ? dayjs(dataInit.leavingDate) : null,
        unionEntryDate: dataInit.unionEntryDate
          ? dayjs(dataInit.unionEntryDate)
          : null
      }
    : {}

  return (
    <>
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={
            <>
              {dataInit?._id
                ? 'Cập nhật thông tin công đoàn viên'
                : 'Thêm mới công đoàn viên'}
            </>
          }
          open={openModal}
          modalProps={{
            onCancel: () => {
              handleReset()
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            width: isMobile ? '100%' : 900,
            keyboard: false,
            maskClosable: false,
            okText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>,
            cancelText: 'Hủy'
          }}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          onFinish={submitUnionist}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText
                label="Email"
                name="email"
                rules={[
                  {required: true, message: 'Vui lòng không để trống!'},
                  {type: 'email', message: 'Vui lòng nhập email hợp lệ!'}
                ]}
                placeholder="Nhập email"
              />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText.Password
                disabled={dataInit?._id ? true : false}
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: dataInit?._id ? false : true,
                    message: 'Vui lòng không để trống!'
                  }
                ]}
                placeholder="Nhập mật khẩu"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormText
                label="Họ và tên"
                name="name"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập họ và tên"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormSelect
                name="gender"
                label="Giới tính"
                valueEnum={{
                  MALE: 'Nam',
                  FEMALE: 'Nữ',
                  OTHER: 'Khác'
                }}
                placeholder="Chọn giới tính"
                rules={[{required: true, message: 'Vui lòng chọn giới tính!'}]}
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </ProForm.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                label="Ngày vào công đoàn"
                name="unionEntryDate"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </ProForm.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormText
                label="Căn cước công dân"
                name="CCCD"
                rules={[{required: false}]}
                placeholder="Nhập căn cước công dân"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                name="role"
                label="Vai trò"
                rules={[{required: true, message: 'Vui lòng chọn vai trò!'}]}
              >
                <DebounceSelect
                  allowClear
                  showSearch
                  defaultValue={roles}
                  value={roles}
                  placeholder="Chọn vai trò"
                  fetchOptions={fetchRoleList}
                  onChange={(newValue: any) => {
                    if (newValue?.length === 0 || newValue?.length === 1) {
                      setRoles(newValue as IRoleSelect[])
                    }
                  }}
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                label="Ngày chuyển đến"
                name="joiningDate"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </ProForm.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                label="Ngày chuyển đi"
                name="leavingDate"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </ProForm.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProForm.Item
                name="department"
                label="Thuộc đơn vị"
                rules={[{required: true, message: 'Vui lòng chọn đơn vị!'}]}
              >
                <DebounceSelect
                  allowClear
                  showSearch
                  defaultValue={departments}
                  value={departments}
                  placeholder="Chọn đơn vị"
                  fetchOptions={fetchDepartmentList}
                  onChange={(newValue: any) => {
                    if (newValue?.length === 0 || newValue?.length === 1) {
                      setDepartments(newValue as IDepartmentSelect[])
                    }
                  }}
                  style={{width: '100%'}}
                />
              </ProForm.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText
                label="Địa chỉ"
                name="address"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="Nhập địa chỉ"
              />
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
              <ProFormText
                label="Ghi chú"
                name="note"
                rules={[{required: false}]}
                placeholder="Nhập ghi chú"
              />
            </Col>
          </Row>
        </ModalForm>
      </ConfigProvider>
    </>
  )
}

export default ModalUnionist
