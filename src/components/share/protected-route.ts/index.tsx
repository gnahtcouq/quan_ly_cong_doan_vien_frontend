import {Navigate} from 'react-router-dom'
import {useAppSelector} from '@/redux/hooks'
import NotPermitted from './not-permitted'
import Loading from '../loading'

const PermissionBaseRoute = (props: any) => {
  const account = useAppSelector((state) => state.account)
  const user = account?.user
  const unionist = account?.unionist
  const userHasPermission = user?.permissions?.some(
    (permission) => permission.method === 'ACCESS_TO_ADMIN_PAGE'
  )
  const unionistHasPermission = unionist?.permissions?.some(
    (permission) => permission.method === 'ACCESS_TO_ADMIN_PAGE'
  )

  if ((user && userHasPermission) || (unionist && !unionistHasPermission)) {
    return <>{props.children}</>
  } else {
    return <NotPermitted />
  }
}

const ProtectedRoute = (props: any) => {
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  )
  const isLoading = useAppSelector((state) => state.account.isLoading)

  return (
    <>
      {isLoading === true ? (
        <Loading />
      ) : (
        <>
          {isAuthenticated === true ? (
            <>
              <PermissionBaseRoute>{props.children}</PermissionBaseRoute>
            </>
          ) : (
            <Navigate to="/login" replace />
          )}
        </>
      )}
    </>
  )
}

export default ProtectedRoute
