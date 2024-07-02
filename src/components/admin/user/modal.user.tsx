import {
  ModalForm,
  ProForm,
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
  callCreateUser,
  callFetchDepartment,
  callFetchRole,
  callUpdateUser
} from '@/config/api'
import {IUser} from '@/types/backend'
import {DebounceSelect} from './debouce.select'
import en_US from 'antd/lib/locale/en_US'
import dayjs from 'dayjs'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IUser | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

export interface IRoleSelect {
  label: string
  value: string
  key?: string
}

const ModalUser = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  // const [departments, setDepartments] = useState<IDepartmentSelect[]>([])
  const [roles, setRoles] = useState<IRoleSelect[]>([])

  const [form] = Form.useForm()

  useEffect(() => {
    if (dataInit?._id) {
      // if (dataInit.department) {
      //   setDepartments([
      //     {
      //       label: dataInit.department.name,
      //       value: dataInit.department._id,
      //       key: dataInit.department._id
      //     }
      //   ])
      // }
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

  const submitUser = async (valuesForm: any) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      address,
      CCCD,
      note,
      role
      // department
    } = valuesForm

    if (dataInit?._id) {
      //update
      const user = {
        _id: dataInit._id,
        name,
        email,
        password,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        gender,
        address,
        CCCD: CCCD ? CCCD : null,
        note,
        role: role ? role.value : dataInit.role?._id // Giữ nguyên vai trò nếu đã có
        // department: {
        //   _id: department.value,
        //   name: department.label
        // }
      }

      const res = await callUpdateUser(user, dataInit._id)
      if (res.data) {
        message.success('Cập nhật thành viên thành công!')
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
      const user = {
        name,
        email,
        password,
        dateOfBirth,
        gender,
        address,
        CCCD,
        note,
        role: role.value
        // department: {
        //   _id: department.value,
        //   name: department.label
        // }
      }
      const res = await callCreateUser(user)
      if (res.data) {
        message.success('Thêm mới thành viên thành công!')
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
    // setDepartments([])
    setRoles([])
    setOpenModal(false)
  }

  // // Usage of DebounceSelect
  // async function fetchDepartmentList(
  //   name: string
  // ): Promise<IDepartmentSelect[]> {
  //   const res = await callFetchDepartment(
  //     `current=1&pageSize=100&name=/${name}/i`
  //   )
  //   if (res && res.data) {
  //     const list = res.data.result
  //     const temp = list.map((item) => {
  //       return {
  //         label: item.name as string,
  //         value: item._id as string
  //       }
  //     })
  //     return temp
  //   } else return []
  // }

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
        dateOfBirth: dataInit.dateOfBirth ? dayjs(dataInit.dateOfBirth) : null
      }
    : {}

  return (
    <>
      <ConfigProvider locale={en_US}>
        <ModalForm
          title={
            <>
              {dataInit?._id
                ? 'Cập nhật thông tin thành viên'
                : 'Thêm mới thành viên'}
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
          onFinish={submitUser}
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
              <ProFormText
                label="Căn cước công dân"
                name="CCCD"
                rules={[{required: false}]}
                placeholder="Nhập căn cước công dân"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProForm.Item
                label="Ngày sinh"
                name="dateOfBirth"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </ProForm.Item>
            </Col>
            {/* <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormDatePicker
                label="Ngày vào công đoàn"
                name="unionEntryDate"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                fieldProps={{
                  format: 'DD/MM/YYYY'
                }}
                // width="auto"
                rules={[
                  {required: true, message: 'Vui lòng chọn không để trống!'}
                ]}
                placeholder="dd/mm/yyyy"
              />
            </Col> */}
            {/* <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormDatePicker
                label="Ngày chuyển đến"
                name="joiningDate"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                fieldProps={{
                  format: 'DD/MM/YYYY'
                }}
                // width="auto"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="dd/mm/yyyy"
              />
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <ProFormDatePicker
                label="Ngày chuyển đi"
                name="leavingDate"
                normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                fieldProps={{
                  format: 'DD/MM/YYYY'
                }}
                // width="auto"
                rules={[{required: true, message: 'Vui lòng không để trống!'}]}
                placeholder="dd/mm/yyyy"
              />
            </Col> */}
            {/* <Col lg={12} md={12} sm={24} xs={24}>
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
            </Col> */}

            <Col lg={18} md={12} sm={24} xs={24}>
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

export default ModalUser
