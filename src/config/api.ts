import {
  IBackendRes,
  IDepartment,
  IAccount,
  IUser,
  IModelPaginate,
  IGetAccount,
  IPost,
  IDocument,
  IPermission,
  IRole,
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
  age: number,
  gender: string,
  address: string
) => {
  return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', {
    name,
    email,
    password,
    age,
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

export const callDeleteUser = (id: string) => {
  return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`)
}

export const callFetchUser = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`)
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
Module Role
 */
export const callCreateRole = (role: IRole) => {
  return axios.post<IBackendRes<IRole>>('/api/v1/roles', {...role})
}

export const callUpdateRole = (role: IRole, id: string) => {
  return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, {...role})
}

export const callDeleteRole = (id: string) => {
  return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`)
}

export const callFetchRole = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`)
}

export const callFetchRoleById = (id: string) => {
  return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`)
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
