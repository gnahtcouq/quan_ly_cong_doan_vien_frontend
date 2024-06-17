import {useEffect, useRef, useState} from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation
} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import NotFound from 'components/share/not.found'
import Loading from 'components/share/loading'
import LoginPage from 'pages/auth/login'
import RegisterPage from 'pages/auth/register'
import LayoutAdmin from 'components/admin/layout.admin'
import ProtectedRoute from 'components/share/protected-route.ts'
import Header from 'components/client/header.client'
import Footer from 'components/client/footer.client'
import HomePage from 'pages/home'
import styles from 'styles/app.module.scss'
import DashboardPage from './pages/admin/dashboard'
import DepartmentPage from './pages/admin/department'
import PermissionPage from './pages/admin/permission'
import DocumentPage from './pages/admin/document'
import RolePage from './pages/admin/role'
import UserPage from './pages/admin/user'
import UnionistPage from './pages/admin/unionist'
import {fetchAccount} from './redux/slice/accountSlide'
import LayoutApp from './components/share/layout.app'
import PostPage from './pages/admin/post'
import ViewUpsertPost from './components/admin/post/upsert.post'
import ClientPostPage from './pages/post'
import ClientPostDetailPage from './pages/post/detail'
import ClientDepartmentPage from './pages/department'
import ClientDepartmentDetailPage from './pages/department/detail'

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [location])

  return (
    <div className="layout-app" ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state) => state.account.isLoading)

  useEffect(() => {
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    )
      return
    dispatch(fetchAccount())
  }, [])

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        {index: true, element: <HomePage />},
        {path: 'post', element: <ClientPostPage />},
        {path: 'post/:id', element: <ClientPostDetailPage />},
        {path: 'department', element: <ClientDepartmentPage />},
        {path: 'department/:id', element: <ClientDepartmentDetailPage />}
      ]
    },

    {
      path: '/admin',
      element: (
        <LayoutApp>
          <LayoutAdmin />{' '}
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'department',
          element: (
            <ProtectedRoute>
              <DepartmentPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'user',
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'unionist',
          element: (
            <ProtectedRoute>
              <UnionistPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'post',
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  {' '}
                  <PostPage />
                </ProtectedRoute>
              )
            },
            {
              path: 'upsert',
              element: (
                <ProtectedRoute>
                  <ViewUpsertPost />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'document',
          element: (
            <ProtectedRoute>
              <DocumentPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'permission',
          element: (
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'role',
          element: (
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
          )
        }
      ]
    },

    {
      path: '/login',
      element: <LoginPage />
    },

    {
      path: '/register',
      element: <RegisterPage />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
