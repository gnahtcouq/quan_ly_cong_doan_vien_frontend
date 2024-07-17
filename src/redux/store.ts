import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import accountReducer from './slice/accountSlide'
import departmentReducer from './slice/departmentSlide'
import userReducer from './slice/userSlide'
import unionistReducer from './slice/unionistSlide'
import postReducer from './slice/postSlide'
import documentReducer from './slice/documentSlide'
import permissionReducer from './slice/permissionSlide'
import feeReducer from './slice/feeSlide'
import receiptReducer from './slice/receiptSlide'
import incomeCategoryReducer from './slice/incomeCategorySlide'
import expenseReducer from './slice/expenseSlide'
import expenseCategoryReducer from './slice/expenseCategorySlide'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    department: departmentReducer,
    user: userReducer,
    unionist: unionistReducer,
    post: postReducer,
    document: documentReducer,
    permission: permissionReducer,
    fee: feeReducer,
    receipt: receiptReducer,
    incomeCategory: incomeCategoryReducer,
    expense: expenseReducer,
    expenseCategory: expenseCategoryReducer
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
