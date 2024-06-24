import React, {useState, useEffect} from 'react'
import {
  AppstoreOutlined,
  ExceptionOutlined,
  ApiOutlined,
  UserOutlined,
  BankOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  LogoutOutlined,
  HeartTwoTone,
  ScheduleOutlined,
  TeamOutlined,
  HomeOutlined
} from '@ant-design/icons'
import {Layout, Menu, Dropdown, Space, message, Avatar, Button} from 'antd'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {callLogout} from 'config/api'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {isMobile} from 'react-device-detect'
import type {MenuProps} from 'antd'
import {setLogoutAction} from '@/redux/slice/accountSlide'
import {ALL_PERMISSIONS} from '@/config/permissions'
import logo from '@/assets/logo.webp'

const {Content, Footer, Sider} = Layout

const LayoutAdmin = () => {
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('')
  const user = useAppSelector((state) => state.account.user)

  const permissions = useAppSelector((state) => state.account.user.permissions)
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (permissions?.length) {
      const viewDepartment = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.DEPARTMENTS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.DEPARTMENTS.GET_PAGINATE.method
      )

      const viewUser = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      )

      const viewUnionist = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.UNIONISTS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.UNIONISTS.GET_PAGINATE.method
      )

      const viewPost = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.POSTS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.POSTS.GET_PAGINATE.method
      )

      const viewDocument = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.DOCUMENTS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.DOCUMENTS.GET_PAGINATE.method
      )

      const viewRole = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
      )

      const viewPermission = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      )

      const full = [
        {
          label: <Link to="/admin">Tổng quan</Link>,
          key: '/admin',
          icon: <AppstoreOutlined />
        },
        ...(viewDepartment
          ? [
              {
                label: <Link to="/admin/department">Đơn vị</Link>,
                key: '/admin/department',
                icon: <BankOutlined />
              }
            ]
          : []),

        ...(viewUser
          ? [
              {
                label: <Link to="/admin/user">Thành viên</Link>,
                key: '/admin/user',
                icon: <UserOutlined />
              }
            ]
          : []),

        ...(viewUnionist
          ? [
              {
                label: <Link to="/admin/unionist">Công đoàn viên</Link>,
                key: '/admin/unionist',
                icon: <TeamOutlined />
              }
            ]
          : []),

        ...(viewPost
          ? [
              {
                label: <Link to="/admin/post">Bài đăng</Link>,
                key: '/admin/post',
                icon: <ScheduleOutlined />
              }
            ]
          : []),

        ...(viewDocument
          ? [
              {
                label: <Link to="/admin/document">Văn bản</Link>,
                key: '/admin/document',
                icon: <FileTextOutlined />
              }
            ]
          : []),

        ...(viewPermission
          ? [
              {
                label: <Link to="/admin/permission">Quyền hạn</Link>,
                key: '/admin/permission',
                icon: <ApiOutlined />
              }
            ]
          : []),

        ...(viewRole
          ? [
              {
                label: <Link to="/admin/role">Vai trò</Link>,
                key: '/admin/role',
                icon: <ExceptionOutlined />
              }
            ]
          : [])
      ]

      setMenuItems(full)
    }
  }, [permissions])
  useEffect(() => {
    setActiveMenu(location.pathname)
  }, [location])

  const handleLogout = async () => {
    const res = await callLogout()
    if (res && res.data) {
      dispatch(setLogoutAction({}))
      message.success('Đăng xuất thành công!')
      navigate('/')
    }
  }

  // if (isMobile) {
  //     items.push({
  //         label: <label
  //             style={{ cursor: 'pointer' }}
  //             onClick={() => handleLogout()}
  //         >Đăng xuất</label>,
  //         key: 'logout',
  //         icon: <LogoutOutlined />
  //     })
  // }

  const itemsDropdown = [
    {
      label: <Link to={'/'}>Trang chủ</Link>,
      key: 'home',
      icon: <HomeOutlined />
    },
    {
      label: (
        <label style={{cursor: 'pointer'}} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: 'logout',
      icon: <LogoutOutlined onClick={() => handleLogout()} />
    }
  ]

  return (
    <>
      <Layout style={{minHeight: '100vh'}} className="layout-admin">
        {!isMobile ? (
          <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div style={{height: 32, margin: 16, textAlign: 'center'}}>
              <img
                src={logo}
                alt="Logo"
                style={{maxHeight: '100%', maxWidth: '100%'}}
              />
            </div>
            <Menu
              selectedKeys={[activeMenu]}
              mode="inline"
              items={menuItems}
              onClick={(e) => setActiveMenu(e.key)}
            />
          </Sider>
        ) : (
          <Menu
            selectedKeys={[activeMenu]}
            items={menuItems}
            onClick={(e) => setActiveMenu(e.key)}
            mode="horizontal"
          />
        )}

        <Layout>
          {!isMobile && (
            <div
              className="admin-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginRight: 20
              }}
            >
              <Button
                type="text"
                icon={
                  collapsed
                    ? React.createElement(MenuUnfoldOutlined)
                    : React.createElement(MenuFoldOutlined)
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64
                }}
              />

              <Dropdown menu={{items: itemsDropdown}} trigger={['click']}>
                <Space style={{cursor: 'pointer'}}>
                  Xin chào, {user?.name?.split(' ').pop()}
                  <Avatar>
                    {' '}
                    {user?.name
                      ?.split(' ')
                      .pop()
                      ?.substring(0, 2)
                      ?.toUpperCase()}{' '}
                  </Avatar>
                </Space>
              </Dropdown>
            </div>
          )}
          <Content style={{padding: '15px'}}>
            <Outlet />
          </Content>
          {/* <Footer style={{padding: 10, textAlign: 'center'}}>
            Made by Saigon Technology University <HeartTwoTone />
          </Footer> */}
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin
