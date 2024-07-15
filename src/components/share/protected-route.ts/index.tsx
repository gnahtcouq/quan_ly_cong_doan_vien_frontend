import {Navigate} from 'react-router-dom'
import {useAppSelector} from '@/redux/hooks'
import NotPermitted from './not-permitted'
import Loading from '../loading'

const PermissionBaseRoute = (props: any) => {
  const user = useAppSelector((state) => state.account.user)
  // const unionist = useAppSelector((state) => state.account.unionist)
  const userPermission = user.permissions[0].method
  // const unionistPermission = unionist.permissions[0].method

  if (
    userPermission === 'ACCESS_TO_ADMIN_PAGE'
    // unionistPermission !== 'ACCESS_TO_ADMIN_PAGE'
  ) {
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
