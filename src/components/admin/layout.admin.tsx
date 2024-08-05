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
  HomeOutlined,
  MenuOutlined,
  DollarOutlined,
  DatabaseOutlined,
  HddOutlined,
  ContainerOutlined
} from '@ant-design/icons'
import {Layout, Menu, Dropdown, Space, message, Button} from 'antd'
import styles from '@/styles/admin.module.scss'
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
  const user = useAppSelector((state) => state?.account?.user)

  const permissions = useAppSelector(
    (state) => state?.account?.user?.permissions
  )
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (permissions?.length) {
      const hasAccessToDashboard = permissions.some(
        (item) =>
          item.apiPath ===
            ALL_PERMISSIONS.PERMISSIONS.ACCESS_TO_DASHBOARD.apiPath &&
          item.method === ALL_PERMISSIONS.PERMISSIONS.ACCESS_TO_DASHBOARD.method
      )

      const hasAccessToAdminPage = permissions.some(
        (item) =>
          item.apiPath ===
            ALL_PERMISSIONS.PERMISSIONS.ACCESS_TO_ADMIN_PAGE.apiPath &&
          item.method ===
            ALL_PERMISSIONS.PERMISSIONS.ACCESS_TO_ADMIN_PAGE.method
      )

      // Kiểm tra nếu người dùng có cả hai quyền
      const canViewDashboard = hasAccessToDashboard && hasAccessToAdminPage

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

      const viewFee = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.FEES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.FEES.GET_PAGINATE.method
      )

      const viewReceipt = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.RECEIPTS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.RECEIPTS.GET_PAGINATE.method
      )

      const viewIncomeCategory = permissions.find(
        (item) =>
          item.apiPath ===
            ALL_PERMISSIONS.INCOMECATEGORIES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.INCOMECATEGORIES.GET_PAGINATE.method
      )

      const viewExpense = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.EXPENSES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.EXPENSES.GET_PAGINATE.method
      )

      const viewExpenseCategory = permissions.find(
        (item) =>
          item.apiPath ===
            ALL_PERMISSIONS.EXPENSECATEGORIES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.EXPENSECATEGORIES.GET_PAGINATE.method
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

      const viewPermission = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      )

      const full = [
        ...(canViewDashboard
          ? [
              {
                label: <Link to="/admin/dashboard">Tổng quan</Link>,
                key: '/admin/dashboard',
                icon: <AppstoreOutlined />
              }
            ]
          : []),

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

        ...(viewFee
          ? [
              {
                label: <Link to="/admin/fee">Công đoàn phí</Link>,
                key: '/admin/fee',
                icon: <DollarOutlined />
              }
            ]
          : []),

        ...(viewReceipt
          ? [
              {
                label: <Link to="/admin/receipt">Phiếu thu</Link>,
                key: '/admin/receipt',
                icon: <FileTextOutlined />
              }
            ]
          : []),

        ...(viewIncomeCategory
          ? [
              {
                label: <Link to="/admin/income-category">Danh mục thu</Link>,
                key: '/admin/income-category',
                icon: <DatabaseOutlined />
              }
            ]
          : []),

        ...(viewExpense
          ? [
              {
                label: <Link to="/admin/expense">Phiếu chi</Link>,
                key: '/admin/expense',
                icon: <ContainerOutlined />
              }
            ]
          : []),

        ...(viewExpenseCategory
          ? [
              {
                label: <Link to="/admin/expense-category">Danh mục chi</Link>,
                key: '/admin/expense-category',
                icon: <HddOutlined />
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
                label: <Link to="/admin/document">CV/VB</Link>,
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
      <Layout className={styles['admin-layout']}>
        {
          <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className={styles['admin-logo']}>
              <img src={logo} alt="Logo" onClick={() => navigate('/admin')} />
            </div>
            <Menu
              selectedKeys={[activeMenu]}
              mode="inline"
              items={menuItems}
              onClick={(e) => setActiveMenu(e.key)}
            />
          </Sider>
        }

        <Layout>
          {
            <div className={styles['admin-header']}>
              <Button
                type="text"
                icon={
                  collapsed
                    ? React.createElement(MenuUnfoldOutlined)
                    : React.createElement(MenuFoldOutlined)
                }
                onClick={() => setCollapsed(!collapsed)}
                className={styles['btn-collapse']}
              />

              <Dropdown menu={{items: itemsDropdown}} trigger={['click']}>
                <Space>
                  <MenuOutlined className={styles['icon-menu']} />
                </Space>
              </Dropdown>
            </div>
          }
          <Content className={styles['admin-content']}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin
