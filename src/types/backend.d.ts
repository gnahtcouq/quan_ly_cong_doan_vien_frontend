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
    totalFee?: number
    totalAmount?: number
    totalBudget?: number
  }
  result: T[]
}

export interface IAccount {
  access_token: string
  user: {
    _id: string
    id: string
    email: string
    name: string
    permissions: {
      _id: string
      name: string
      apiPath: string
      method: string
      module: string
    }[]
    type: string
  }
  unionist: {
    _id: string
    id: string
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
  id?: string
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
  id?: string
  name: string
  email: string
  password?: string
  dateOfBirth: string
  gender: string
  phoneNumber?: string
  address?: string
  CCCD?: string
  note?: string
  permissions?: IPermission[] | string[]
  verificationCode?: string
  verificationExpires?: string
  verificationCodePassword?: string
  verificationExpiresPassword?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IUnionist {
  _id?: string
  id?: string
  name: string
  email: string
  password?: string
  dateOfBirth: string
  gender: string
  phoneNumber?: string
  address?: string
  CCCD?: string
  joiningDate?: string
  leavingDate?: string
  unionEntryDate?: string
  note?: string
  permissions?: IPermission[] | string[]
  departmentId?: string
  departmentName?: string
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
  status?: string

  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IDocument {
  _id?: string
  id?: string
  name: string
  email: string
  userId: string
  url: string
  status: string
  history?: {
    status: string
    updatedAt: string
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

export interface IFee {
  _id?: string
  unionistId?: string
  monthYear?: string
  fee?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IReceipt {
  _id?: string
  id?: string
  userId?: string
  userName?: string
  description?: string
  time?: string
  amount?: string
  incomeCategoryId?: string
  incomeCategory?: string
  // documentId?: string
  documentName?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
  updatedBy?: {
    _id: string
    email: string
  }
}

export interface IIncomeCategory {
  _id?: string
  id?: string
  description?: string
  budget?: string
  year?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IExpense {
  _id?: string
  id?: string
  userId?: string
  userName?: string
  description?: string
  time?: string
  amount?: string
  expenseCategoryId?: string
  expenseCategory?: string
  // documentId?: string
  documentName?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
  updatedBy?: {
    _id: string
    email: string
  }
}

export interface IExpenseCategory {
  _id?: string
  id?: string
  description?: string
  budget?: string
  year?: string
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}
