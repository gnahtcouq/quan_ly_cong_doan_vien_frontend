import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import accountReducer from './slice/accountSlide'
import departmentReducer from './slice/departmentSlide'
import userReducer from './slice/userSlide'
import postReducer from './slice/postSlide'
import documentReducer from './slice/documentSlide'
import permissionReducer from './slice/permissionSlide'
import roleReducer from './slice/roleSlide'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    department: departmentReducer,
    user: userReducer,
    post: postReducer,
    document: documentReducer,
    permission: permissionReducer,
    role: roleReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
