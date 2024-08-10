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
  Spin,
  message,
  notification
} from 'antd'
import {isMobile} from 'react-device-detect'
import {useState, useEffect} from 'react'
import {
  callCreateUnionist,
  callFetchDepartment,
  callFetchDepartmentNameByDepartmentId,
  callUpdateUnionist
} from '@/config/api'
import {IUnionist} from '@/types/backend'
import {DebounceSelect} from '@/config/debouce.select'
import dayjs from 'dayjs'
import vi_VN from 'antd/lib/locale/vi_VN'
import {
  disabledDateBirthday,
  disabledDate,
  validateDateOfBirth
} from '@/config/utils'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IUnionist | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

export interface IDepartmentSelect {
  label: string | undefined
  value: string | undefined
  key?: string | undefined
}

const ModalUnionist = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [departments, setDepartments] = useState<IDepartmentSelect[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (dataInit?._id) {
          if (dataInit.departmentId) {
            const res = await callFetchDepartmentNameByDepartmentId(
              dataInit.departmentId
            )
            if (res && res.data) {
              setDepartments([
                {
                  label: res.data.name,
                  value: res.data.id,
                  key: res.data.id
                }
              ])
            }
          }
        }
      } catch (error) {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: 'Đã xảy ra lỗi khi tìm nạp dữ liệu'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dataInit])

  const submitUnionist = async (valuesForm: any) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      CCCD,
      joiningDate,
      leavingDate,
      unionEntryDate,
      note,
      permissions,
      departmentId
    } = valuesForm
    if (dataInit?._id) {
      //update
      const unionist = {
        _id: dataInit._id,
        name,
        email,
        password,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        phoneNumber: phoneNumber ? phoneNumber : null,
        gender,
        address,
        CCCD: CCCD ? CCCD : null,
        joiningDate: joiningDate ? joiningDate.toISOString() : null,
        leavingDate: leavingDate ? leavingDate.toISOString() : null,
        unionEntryDate: unionEntryDate ? unionEntryDate.toISOString() : null,
        note,
        permissions: dataInit.permissions,
        departmentId:
          departmentId && departmentId.value
            ? departmentId.value
            : dataInit.departmentId
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
        phoneNumber,
        address,
        CCCD,
        joiningDate,
        leavingDate,
        unionEntryDate,
        note,
        permissions,
        departmentId: departmentId ? departmentId.value : null
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
          value: item.id as string
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
      <ConfigProvider locale={vi_VN}>
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
          {isLoading ? (
            <Spin />
          ) : (
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
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      message:
                        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.'
                    }
                  ]}
                  placeholder="Nhập mật khẩu"
                />
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProFormText
                  label="Họ và tên"
                  name="name"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'}
                  ]}
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
                  rules={[
                    {required: true, message: 'Vui lòng chọn giới tính!'}
                  ]}
                />
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProForm.Item
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[
                    {required: true, message: 'Vui lòng không để trống!'},
                    {validator: validateDateOfBirth}
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="dd/mm/yyyy"
                    disabledDate={disabledDateBirthday}
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProForm.Item
                  label="Ngày vào công đoàn"
                  name="unionEntryDate"
                  rules={[{required: false}]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="dd/mm/yyyy"
                    disabledDate={disabledDate}
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <ProForm.Item
                  name="departmentId"
                  label="Thuộc đơn vị"
                  rules={[{required: false}]}
                >
                  <DebounceSelect
                    showSearch
                    allowClear
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
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProFormText
                  label="Căn cước công dân"
                  name="CCCD"
                  rules={[
                    {
                      required: false,
                      pattern: /^[0-9]{9,12}$/,
                      message: 'Vui lòng nhập CCCD hợp lệ!'
                    }
                  ]}
                  placeholder="Nhập căn cước công dân"
                />
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProForm.Item
                  label="Ngày chuyển đến"
                  name="joiningDate"
                  rules={[{required: false}]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="dd/mm/yyyy"
                    disabledDate={disabledDate}
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProForm.Item
                  label="Ngày chuyển đi"
                  name="leavingDate"
                  rules={[{required: false}]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="dd/mm/yyyy"
                    disabledDate={disabledDate}
                    style={{width: '100%'}}
                  />
                </ProForm.Item>
              </Col>
              <Col lg={6} md={6} sm={24} xs={24}>
                <ProFormText
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: false,
                      pattern: /^(03|05|07|08|09)[0-9]{8}$/,
                      message: 'Vui lòng nhập số điện thoại hợp lệ!'
                    }
                  ]}
                  placeholder="Nhập số điện thoại"
                />
              </Col>
              <Col lg={18} md={24} sm={24} xs={24}>
                <ProFormText
                  label="Ghi chú"
                  name="note"
                  rules={[{required: false}]}
                  placeholder="Nhập ghi chú"
                />
              </Col>
              <Col lg={24} md={12} sm={24} xs={24}>
                <ProFormText
                  label="Địa chỉ"
                  name="address"
                  rules={[{required: false}]}
                  placeholder="Nhập địa chỉ"
                />
              </Col>
            </Row>
          )}
        </ModalForm>
      </ConfigProvider>
    </>
  )
}

export default ModalUnionist
