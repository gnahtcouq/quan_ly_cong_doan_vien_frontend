export interface IBackendRes<T> {
  error?: string | string[]
  message: string
  statusCode: number | string
  data?: T
}

export interface IModelPaginate<T> {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: T[]
}

export interface IAccount {
  access_token: string
  user: {
    _id: string
    email: string
    name: string
    permissions: {
      _id: string
      name: string
      apiPath: string
      method: string
      module: string
    }[]
  }
  unionist: {
    _id: string
    email: string
    name: string
    permissions: {
      _id: string
      name: string
      apiPath: string
      method: string
      module: string
    }[]
  }
}

export interface IGetAccount extends Omit<IAccount, 'access_token'> {}

export interface IDepartment {
  _id?: string
  name?: string
  logo: string
  description?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  dateOfBirth: string
  gender: string
  address: string
  CCCD?: string
  note?: string
  permissions: IPermission[] | string[]
  verificationCode?: string
  verificationExpires?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IUnionist {
  _id?: string
  name: string
  email: string
  password?: string
  dateOfBirth: string
  gender: string
  address: string
  CCCD?: string
  joiningDate?: string
  leavingDate?: string
  unionEntryDate?: string
  note?: string
  permissions: IPermission[] | string[]
  department?: {
    _id: string
    name: string
  }
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IPost {
  _id?: string
  name: string
  threads: string[]
  description: string
  isActive: boolean

  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IDocument {
  _id?: string
  name: string
  email: string
  userId: string
  url: string
  status: string
  history?: {
    status: string
    updatedAt: Date
    updatedBy: {_id: string; email: string}
  }[]
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IPermission {
  _id?: string
  name?: string
  apiPath?: string
  method?: string
  module?: string

  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}
export interface ISubscribers {
  _id?: string
  name?: string
  email?: string
  threads: string[]
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}
