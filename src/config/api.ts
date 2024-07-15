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
  ISubscribers
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

export const callFetchDepartmentById = (id: string) => {
  return axios.get<IBackendRes<IDepartment>>(`/api/v1/departments/${id}`)
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

export const callFetchNumberOfUsers = () => {
  return axios.post<IBackendRes<number>>('/api/v1/users/count')
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

export const callDeleteUnionist = (id: string) => {
  return axios.delete<IBackendRes<IUnionist>>(`/api/v1/unionists/${id}`)
}

export const callFetchUnionist = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUnionist>>>(
    `/api/v1/unionists?${query}`
  )
}

export const callFetchNumberOfUnionists = () => {
  return axios.post<IBackendRes<number>>('/api/v1/unionists/count')
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

export const callDeletePost = (id: string) => {
  return axios.delete<IBackendRes<IPost>>(`/api/v1/posts/${id}`)
}

export const callFetchPost = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IPost>>>(`/api/v1/posts?${query}`)
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
export const callCreateDocument = (url: string, name: string) => {
  return axios.post<IBackendRes<IDocument>>('/api/v1/documents', {
    url,
    name
  })
}

export const callUpdateDocumentName = (
  id: any,
  name: string,
  status: string
) => {
  return axios.put<IBackendRes<IDocument>>(`/api/v1/documents/${id}`, {
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
