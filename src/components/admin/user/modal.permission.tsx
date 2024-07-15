import {FooterToolbar, ModalForm, ProCard} from '@ant-design/pro-components'
import {Col, Form, Row, message, notification} from 'antd'
import {isMobile} from 'react-device-detect'
import {callFetchPermission, callUpdateUserPermissions} from '@/config/api'
import {IPermission, IUser} from '@/types/backend'
import {EditOutlined} from '@ant-design/icons'
import ModuleApi from './module.api'
import {useState, useEffect} from 'react'
import _ from 'lodash'

interface IProps {
  openModal: boolean
  setOpenModal: (v: boolean) => void
  dataInit?: IUser | null
  setDataInit: (v: any) => void
  reloadTable: () => void
}

const ModalPermission = (props: IProps) => {
  const {openModal, setOpenModal, reloadTable, dataInit, setDataInit} = props
  const [form] = Form.useForm()

  const [listPermissions, setListPermissions] = useState<
    | {
        module: string
        permissions: IPermission[]
      }[]
    | null
  >(null)

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return {module: key, permissions: value as IPermission[]}
      })
      .value()
  }

  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission(`current=1&pageSize=100`)
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result))
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (listPermissions?.length && dataInit?._id) {
      const userPermissions = listPermissions.map((listItem) => {
        const matchedPermissions = dataInit.permissions.filter((permissionId) =>
          listItem.permissions.some(
            (permission) => (permission as IPermission)._id === permissionId
          )
        )
        return {module: listItem.module, permissions: matchedPermissions}
      })

      setTimeout(() => {
        listPermissions.forEach((x) => {
          let allCheck = true
          const temp = userPermissions.find((z) => z.module === x.module)

          x.permissions?.forEach((y) => {
            const isExist = temp?.permissions?.includes(y._id as string)
            if (isExist) {
              form.setFieldValue(['permissions', y._id as string], true)
            } else {
              allCheck = false
            }
          })
          form.setFieldValue(['permissions', x.module], allCheck)
        })
      }, 0)
    }
  }, [listPermissions, dataInit?._id])

  const submitPermissions = async (valuesForm: any) => {
    const {permissions} = valuesForm
    const checkedPermissions: string[] = []

    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
          checkedPermissions.push(key)
        }
      }
    }

    if (dataInit?._id) {
      //update
      const permissions = {
        permissions: checkedPermissions
      }
      const res = await callUpdateUserPermissions(
        permissions as any,
        dataInit._id
      )
      if (res.data) {
        message.success('Cập nhật quyền hạn thành công!')
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
    setOpenModal(false)
  }

  return (
    <>
      <ModalForm
        title={
          <>{dataInit?._id ? 'Cập nhật quyền hạn' : 'Thêm mới quyền hạn'}</>
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
          maskClosable: true
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitPermissions}
        submitter={{
          render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
          submitButtonProps: {
            icon: <EditOutlined />
          },
          searchConfig: {
            resetText: 'Hủy',
            submitText: <>{dataInit?._id ? 'Cập nhật' : 'Thêm mới'}</>
          }
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProCard
              title="Quyền hạn"
              subTitle="Các quyền hạn được phép cho thành viên này"
              headStyle={{color: '#d81921'}}
              style={{marginBottom: 20}}
              headerBordered
              size="small"
              bordered
            >
              <ModuleApi form={form} listPermissions={listPermissions} />
            </ProCard>
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}

export default ModalPermission
