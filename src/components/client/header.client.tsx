import {useState, useEffect} from 'react'
import {
  ScheduleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  BankOutlined,
  HomeOutlined,
  MenuOutlined
} from '@ant-design/icons'
import {Avatar, Drawer, Dropdown, MenuProps, Space, message} from 'antd'
import {Menu, ConfigProvider} from 'antd'
import styles from '@/styles/client.module.scss'
import {isMobile} from 'react-device-detect'
import {useLocation, useNavigate} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {callLogout} from '@/config/api'
import {
  fetchAccount,
  setLogoutAction,
  setUserLoginInfo
} from '@/redux/slice/accountSlide'
import ManageAccount from './modal/manage.account'
import logo from '@/assets/logo.webp'

const Header = (props: any) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  )
  const user = useAppSelector((state) => state.account.user)
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)

  const [current, setCurrent] = useState('home')
  const location = useLocation()

  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false)

  useEffect(() => {
    setCurrent(location.pathname)
  }, [location])

  const items: MenuProps['items'] = [
    {
      label: <Link to={'/'}>Trang Chủ</Link>,
      key: '/'
    },
    {
      label: <Link to={'/post'}>Bài Đăng</Link>,
      key: '/post'
    },
    {
      label: <Link to={'/department'}>Đơn Vị</Link>,
      key: '/department'
    }
  ]

  const itemsWithIcons: MenuProps['items'] = [
    {
      label: <Link to={'/'}>Trang Chủ</Link>,
      key: '/',
      icon: <HomeOutlined />
    },
    {
      label: <Link to={'/post'}>Bài Đăng</Link>,
      key: '/post',
      icon: <ScheduleOutlined />
    },
    {
      label: <Link to={'/department'}>Đơn Vị</Link>,
      key: '/department',
      icon: <BankOutlined />
    }
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }

  const handleLogout = async () => {
    const res = await callLogout()
    if (res && res.data) {
      dispatch(setLogoutAction({}))
      message.success('Đăng xuất thành công!')
      navigate('/')
    }
  }

  const itemsDropdown = [
    {
      label: (
        <label
          style={{cursor: 'pointer'}}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: 'manage-account',
      icon: <UserOutlined onClick={() => setOpenManageAccount(true)} />
    },
    {
      label: <Link to={'/admin'}>Trang quản trị</Link>,
      key: 'admin',
      icon: <SettingOutlined />
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

  const itemsMobiles = [...itemsWithIcons, ...itemsDropdown]

  return (
    <>
      <div className={styles['header-section']}>
        <div className={styles['container']}>
          {!isMobile ? (
            <div style={{display: 'flex', gap: 30}}>
              <div className={styles['brand']}>
                <img
                  src={logo}
                  alt="Logo"
                  onClick={() => navigate('/')}
                  title="Saigon Technology University"
                  style={{cursor: 'pointer', maxHeight: 32}}
                />
              </div>
              <div className={styles['top-menu']}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#222831',
                      colorBgContainer: '#fff',
                      colorText: '#a7a7a7'
                    }
                  }}
                >
                  <Menu
                    // onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                    style={{flex: 1}}
                  />
                </ConfigProvider>
                <div className={styles['extra']}>
                  {isAuthenticated === false ? (
                    <Link to={'/login'}>
                      <span>Đăng Nhập</span>
                    </Link>
                  ) : (
                    <Dropdown menu={{items: itemsDropdown}} trigger={['click']}>
                      <Space>
                        <MenuOutlined className={styles['icon-menu']} />
                      </Space>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles['header-mobile']}>
              <div className={styles['brand']}>
                <img
                  src={logo}
                  alt="Logo"
                  onClick={() => navigate('/')}
                  title="Saigon Technology University"
                  style={{cursor: 'pointer', maxHeight: 32}}
                />
              </div>

              <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
            </div>
          )}
        </div>
      </div>
      <Drawer
        title="Chức năng"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="vertical"
          items={itemsMobiles}
        />
      </Drawer>
      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </>
  )
}

export default Header
