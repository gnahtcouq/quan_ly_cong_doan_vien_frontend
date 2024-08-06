import {
  IBackendRes,
  IDepartment,
  IAccount,
  IUser,
  IUnionist,
  IModelPaginate,
  IGetAccount,
  IPost,
  IDocument,
  IPermission,
  ISubscribers,
  IFee,
  IReceipt,
  IIncomeCategory,
  IExpense,
  IExpenseCategory
} from '@/types/backend'
import axios from 'config/axios-customize'

/**
 * 
Module Auth
 */
export const callRegister = (
  name: string,
  email: string,
  password: string,
  dateOfBirth: string,
  gender: string,
  address: string
) => {
  return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', {
    name,
    email,
    password,
    dateOfBirth,
    gender,
    address
  })
}

export const callLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', {
    username,
    password
  })
}

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
  return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
  const bodyFormData = new FormData()
  bodyFormData.append('fileUpload', file)
  return axios<IBackendRes<{fileName: string}>>({
    method: 'post',
    url: '/api/v1/files/upload',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
      folder_type: folderType
    }
  })
}

/**
 * 
Module Department
 */
export const callCreateDepartment = (
  name: string,
  description: string,
  logo: string
) => {
  return axios.post<IBackendRes<IDepartment>>('/api/v1/departments', {
    name,
    description,
    logo
  })
}

export const callUpdateDepartment = (
  id: string,
  name: string,
  description: string,
  logo: string
) => {
  return axios.patch<IBackendRes<IDepartment>>(`/api/v1/departments/${id}`, {
    name,
    description,
    logo
  })
}

export const callDeleteDepartment = (id: string) => {
  return axios.delete<IBackendRes<IDepartment>>(`/api/v1/departments/${id}`)
}

export const callFetchDepartment = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IDepartment>>>(
    `/api/v1/departments?${query}`
  )
}

export const callFetchDepartmentWithoutDescription = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IDepartment>>>(
    `/api/v1/departments/without-description?${query}`
  )
}

export const callFetchDepartmentById = (id: string) => {
  return axios.get<IBackendRes<IDepartment>>(`/api/v1/departments/${id}`)
}

export const callFetchDepartmentNameByDepartmentId = (id: string) => {
  return axios.get<IBackendRes<IDepartment>>(`/api/v1/departments/name/${id}`)
}

export const callFetchNumberOfDepartments = () => {
  return axios.post<IBackendRes<number>>('/api/v1/departments/count')
}

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
  return axios.post<IBackendRes<IUser>>('/api/v1/users', {...user})
}

export const callUpdateUser = (user: IUser, id: string) => {
  return axios.patch<IBackendRes<IUser>>(`/api/v1/users/${id}`, {...user})
}

export const callUpdateUserPermissions = (user: IUser, id: string) => {
  return axios.put<IBackendRes<IUser>>(`/api/v1/users/${id}`, {...user})
}

export const callUpdateUserEmail = (id: string, newEmail: string) => {
  return axios.post<IBackendRes<IUser>>(
    `/api/v1/users/request-change-email/${id}`,
    {newEmail}
  )
}

export const callConfirmUpdateUserEmail = (
  id: string,
  verificationCode: string,
  newEmail: string
) => {
  return axios.post<IBackendRes<IUser>>(
    `/api/v1/users/confirm-change-email/${id}`,
    {verificationCode, newEmail}
  )
}

export const callForgotUserPassword = (email: string) => {
  return axios.post<IBackendRes<IUser>>(
    `/api/v1/users/request-forgot-password/`,
    {email}
  )
}

export const callConfirmForgotUserPassword = (
  id: string,
  verificationCodePassword: string,
  newPassword: string
) => {
  return axios.post<IBackendRes<IUser>>(
    `/api/v1/users/confirm-forgot-password/${id}`,
    {verificationCodePassword, newPassword}
  )
}

export const callUpdateUserPassword = (
  id: string,
  currentPassword: string,
  newPassword: string
) => {
  return axios.post<IBackendRes<IUser>>(`/api/v1/users/change-password/${id}`, {
    currentPassword,
    newPassword
  })
}

export const callDeleteUser = (id: string) => {
  return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`)
}

export const callFetchUser = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`)
}

export const callFetchUserById = (id: string) => {
  return axios.get<IBackendRes<IUser>>(`/api/v1/users/${id}`)
}

export const callFetchUserNameByUserId = (id: string) => {
  return axios.get<IBackendRes<IUser>>(`/api/v1/users/name/${id}`)
}

export const callFetchNumberOfUsers = () => {
  return axios.post<IBackendRes<number>>('/api/v1/users/count')
}

export const callUploadUsersFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>('/api/v1/users/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 
Module Unionist
 */
export const callCreateUnionist = (unionist: IUnionist) => {
  return axios.post<IBackendRes<IUnionist>>('/api/v1/unionists', {...unionist})
}

export const callUpdateUnionist = (unionist: IUnionist, id: string) => {
  return axios.patch<IBackendRes<IUnionist>>(`/api/v1/unionists/${id}`, {
    ...unionist
  })
}

export const callUpdateUnionistPermissions = (user: IUnionist, id: string) => {
  return axios.put<IBackendRes<IUnionist>>(`/api/v1/unionists/${id}`, {...user})
}

export const callUpdateUnionistEmail = (id: string, newEmail: string) => {
  return axios.post<IBackendRes<IUnionist>>(
    `/api/v1/unionists/request-change-email/${id}`,
    {newEmail}
  )
}

export const callConfirmUpdateUnionistEmail = (
  id: string,
  verificationCode: string,
  newEmail: string
) => {
  return axios.post<IBackendRes<IUnionist>>(
    `/api/v1/unionists/confirm-change-email/${id}`,
    {verificationCode, newEmail}
  )
}

export const callForgotUnionistPassword = (email: string) => {
  return axios.post<IBackendRes<IUnionist>>(
    `/api/v1/unionists/request-forgot-password/`,
    {email}
  )
}

export const callConfirmForgotUnionistPassword = (
  id: string,
  verificationCodePassword: string,
  newPassword: string
) => {
  return axios.post<IBackendRes<IUnionist>>(
    `/api/v1/unionists/confirm-forgot-password/${id}`,
    {verificationCodePassword, newPassword}
  )
}

export const callUpdateUnionistPassword = (
  id: string,
  currentPassword: string,
  newPassword: string
) => {
  return axios.post<IBackendRes<IUnionist>>(
    `/api/v1/unionists/change-password/${id}`,
    {
      currentPassword,
      newPassword
    }
  )
}

export const callDeleteUnionist = (id: string) => {
  return axios.delete<IBackendRes<IUnionist>>(`/api/v1/unionists/${id}`)
}

export const callFetchUnionist = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUnionist>>>(
    `/api/v1/unionists?${query}`
  )
}

export const callFetchUnionistById = (id: string) => {
  return axios.get<IBackendRes<IUnionist>>(`/api/v1/unionists/${id}`)
}

export const callFetchUnionistNameByUnionistId = (id: string) => {
  return axios.get<IBackendRes<IUnionist>>(`/api/v1/unionists/name/${id}`)
}

export const callFetchNumberOfUnionists = () => {
  return axios.post<IBackendRes<number>>('/api/v1/unionists/count')
}

export const callUploadUnionistsFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>('/api/v1/unionists/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 
Module Post
 */
export const callCreatePost = (post: IPost) => {
  return axios.post<IBackendRes<IPost>>('/api/v1/posts', {...post})
}

export const callUpdatePost = (post: IPost, id: string) => {
  return axios.patch<IBackendRes<IPost>>(`/api/v1/posts/${id}`, {...post})
}

export const callUpdatePostStatus = (id: any, status: string) => {
  return axios.put<IBackendRes<IPost>>(`/api/v1/posts/${id}`, {
    status
  })
}

export const callDeletePost = (id: string) => {
  return axios.delete<IBackendRes<IPost>>(`/api/v1/posts/${id}`)
}

export const callFetchPost = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IPost>>>(`/api/v1/posts?${query}`)
}

export const callFetchPostsByTime = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IPost>>>(
    `/api/v1/posts/by-time?${query}`
  )
}

export const callFetchPostById = (id: string) => {
  return axios.get<IBackendRes<IPost>>(`/api/v1/posts/${id}`)
}

export const callFetchNumberOfPosts = () => {
  return axios.post<IBackendRes<number>>('/api/v1/posts/count')
}

/**
 * 
Module Document
 */
export const callCreateDocument = (url: string, name: string, id: string) => {
  return axios.post<IBackendRes<IDocument>>('/api/v1/documents', {
    url,
    name,
    id
  })
}

export const callUpdateDocumentName = (
  _id: any,
  id: string,
  name: string,
  status: string
) => {
  return axios.put<IBackendRes<IDocument>>(`/api/v1/documents/${_id}`, {
    id,
    name,
    status
  })
}

export const callUpdateDocumentStatus = (id: any, status: string) => {
  return axios.patch<IBackendRes<IDocument>>(`/api/v1/documents/${id}`, {
    status
  })
}

export const callDeleteDocument = (id: string) => {
  return axios.delete<IBackendRes<IDocument>>(`/api/v1/documents/${id}`)
}

export const callFetchDocument = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IDocument>>>(
    `/api/v1/documents?${query}`
  )
}

export const callFetchDocumentById = (id: string) => {
  return axios.get<IBackendRes<IDocument>>(`/api/v1/documents/${id}`)
}

export const callFetchDocumentByUser = () => {
  return axios.post<IBackendRes<IDocument[]>>(`/api/v1/documents/by-user`)
}

export const callFetchNumberOfDocuments = () => {
  return axios.post<IBackendRes<number>>('/api/v1/documents/count')
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
  return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', {
    ...permission
  })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
  return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, {
    ...permission
  })
}

export const callDeletePermission = (id: string) => {
  return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`)
}

export const callFetchPermission = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IPermission>>>(
    `/api/v1/permissions?${query}`
  )
}

export const callFetchPermissionById = (id: string) => {
  return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`)
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
  return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', {...subs})
}

export const callGetSubscriberThreads = () => {
  return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/threads')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
  return axios.patch<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, {
    ...subs
  })
}

export const callDeleteSubscriber = (id: string) => {
  return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`)
}

export const callFetchSubscriber = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(
    `/api/v1/subscribers?${query}`
  )
}

export const callFetchSubscriberById = (id: string) => {
  return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`)
}

/**
 * 
Module Fees
 */
export const callCreateFee = (fee: IFee) => {
  return axios.post<IBackendRes<IFee>>('/api/v1/fees', {
    ...fee
  })
}

export const callUpdateFee = (fee: IFee, id: string) => {
  return axios.patch<IBackendRes<IFee>>(`/api/v1/fees/${id}`, {
    ...fee
  })
}

export const callDeleteFee = (id: string) => {
  return axios.delete<IBackendRes<IFee>>(`/api/v1/fees/${id}`)
}

export const callFetchFee = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IFee>>>(`/api/v1/fees?${query}`)
}

export const callFetchFeeById = (id: string) => {
  return axios.get<IBackendRes<IFee>>(`/api/v1/fees/${id}`)
}

export const callFetchFeesByUnionist = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IFee>>>(
    `/api/v1/fees/by-unionist?${query}`
  )
}

export const callUploadFeesFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>('/api/v1/fees/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 
Module Receipts
 */
export const callCreateReceipt = (receipt: IReceipt) => {
  return axios.post<IBackendRes<IReceipt>>('/api/v1/receipts', {
    ...receipt
  })
}

export const callUpdateReceipt = (receipt: IReceipt, id: string) => {
  return axios.patch<IBackendRes<IReceipt>>(`/api/v1/receipts/${id}`, {
    ...receipt
  })
}

export const callDeleteReceipt = (id: string) => {
  return axios.delete<IBackendRes<IReceipt>>(`/api/v1/receipts/${id}`)
}

export const callFetchReceipt = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IReceipt>>>(
    `/api/v1/receipts?${query}`
  )
}

export const callFetchReceiptById = (id: string) => {
  return axios.get<IBackendRes<IReceipt>>(`/api/v1/receipts/${id}`)
}

export const callFetchReceiptsByTime = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IReceipt>>>(
    `/api/v1/receipts/by-time?${query}`
  )
}

export const callUploadReceiptsFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>('/api/v1/receipts/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const callExportReceiptToPdf = (id: string) => {
  return axios.get<IBackendRes<any>>(`/api/v1/receipts/pdf/${id}`, {
    responseType: 'blob'
  })
}

/**
 * 
Module Income Categories
 */
export const callCreateIncomeCategory = (incomeCategory: IIncomeCategory) => {
  return axios.post<IBackendRes<IIncomeCategory>>('/api/v1/income-categories', {
    ...incomeCategory
  })
}

export const callUpdateIncomeCategory = (
  incomeCategory: IIncomeCategory,
  id: string
) => {
  return axios.patch<IBackendRes<IIncomeCategory>>(
    `/api/v1/income-categories/${id}`,
    {
      ...incomeCategory
    }
  )
}

export const callDeleteIncomeCategory = (id: string) => {
  return axios.delete<IBackendRes<IIncomeCategory>>(
    `/api/v1/income-categories/${id}`
  )
}

export const callFetchIncomeCategory = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IIncomeCategory>>>(
    `/api/v1/income-categories?${query}`
  )
}

export const callFetchIncomeCategoriesByTime = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IIncomeCategory>>>(
    `/api/v1/income-categories/by-time?${query}`
  )
}

export const callFetchIncomeCategoryById = (id: string) => {
  return axios.get<IBackendRes<IIncomeCategory>>(
    `/api/v1/income-categories/${id}`
  )
}

export const callUploadIncomeCategoryFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>(
    '/api/v1/income-categories/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

/**
 * 
Module Expenses
 */
export const callCreateExpense = (expense: IExpense) => {
  return axios.post<IBackendRes<IExpense>>('/api/v1/expenses', {
    ...expense
  })
}

export const callUpdateExpense = (expense: IExpense, id: string) => {
  return axios.patch<IBackendRes<IExpense>>(`/api/v1/expenses/${id}`, {
    ...expense
  })
}

export const callDeleteExpense = (id: string) => {
  return axios.delete<IBackendRes<IExpense>>(`/api/v1/expenses/${id}`)
}

export const callFetchExpense = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IExpense>>>(
    `/api/v1/expenses?${query}`
  )
}

export const callFetchExpenseById = (id: string) => {
  return axios.get<IBackendRes<IExpense>>(`/api/v1/expenses/${id}`)
}

export const callFetchExpensesByTime = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IExpense>>>(
    `/api/v1/expenses/by-time?${query}`
  )
}

export const callUploadExpensesFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>('/api/v1/expenses/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const callExportExpenseToPdf = (id: string) => {
  return axios.get<IBackendRes<any>>(`/api/v1/expenses/pdf/${id}`, {
    responseType: 'blob'
  })
}

/**
 * 
Module Expense Categories
 */
export const callCreateExpenseCategory = (
  expenseCategory: IExpenseCategory
) => {
  return axios.post<IBackendRes<IExpenseCategory>>(
    '/api/v1/expense-categories',
    {
      ...expenseCategory
    }
  )
}

export const callUpdateExpenseCategory = (
  expenseCategory: IExpenseCategory,
  id: string
) => {
  return axios.patch<IBackendRes<IExpenseCategory>>(
    `/api/v1/expense-categories/${id}`,
    {
      ...expenseCategory
    }
  )
}

export const callDeleteExpenseCategory = (id: string) => {
  return axios.delete<IBackendRes<IExpenseCategory>>(
    `/api/v1/expense-categories/${id}`
  )
}

export const callFetchExpenseCategory = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IExpenseCategory>>>(
    `/api/v1/expense-categories?${query}`
  )
}

export const callFetchExpenseCategoriesByTime = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IExpenseCategory>>>(
    `/api/v1/expense-categories/by-time?${query}`
  )
}

export const callFetchExpenseCategoryById = (id: string) => {
  return axios.get<IBackendRes<IExpenseCategory>>(
    `/api/v1/expense-categories/${id}`
  )
}

export const callUploadExpenseCategoryFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post<IBackendRes<any>>(
    '/api/v1/expense-categories/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
