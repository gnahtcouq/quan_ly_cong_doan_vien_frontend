import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {callFetchAccount} from '@/config/api'

// First, create the thunk
export const fetchAccount = createAsyncThunk(
  'account/fetchAccount',
  async () => {
    const response = await callFetchAccount()
    return response.data
  }
)

interface IState {
  isAuthenticated: boolean
  isLoading: boolean
  isRefreshToken: boolean
  errorRefreshToken: string
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
    type: string
  }
  activeMenu: string
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: '',
  user: {
    _id: '',
    id: '',
    email: '',
    name: '',
    permissions: [],
    type: ''
  },
  unionist: {
    _id: '',
    id: '',
    email: '',
    name: '',
    permissions: [],
    type: ''
  },

  activeMenu: 'home'
}

export const accountSlide = createSlice({
  name: 'account',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload
    },
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.user._id = action?.payload?._id
      state.user.id = action?.payload?.id
      state.user.email = action.payload.email
      state.user.name = action.payload.name
      state.user.permissions = action?.payload?.permissions
      state.user.type = action?.payload?.type
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      state.isAuthenticated = false
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false
      state.errorRefreshToken = action.payload?.message ?? ''
    },
    updateUserInfo: (state, action) => {
      state.user = {...state.user, ...action.payload}
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false
        state.isLoading = true
      }
    })

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true
        state.isLoading = false
        state.user._id = action?.payload?.user?._id
        state.user.id = action?.payload?.user?.id
        state.user.email = action.payload.user?.email
        state.user.name = action.payload.user?.name
        state.user.permissions = action?.payload?.user?.permissions
        state.user.type = action?.payload?.user?.type
      }
    })

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false
        state.isLoading = false
      }
    })
  }
})

export const {
  setActiveMenu,
  setUserLoginInfo,
  setLogoutAction,
  setRefreshTokenAction,
  updateUserInfo
} = accountSlide.actions

export default accountSlide.reducer
