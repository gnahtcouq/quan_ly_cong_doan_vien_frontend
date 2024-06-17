import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {callFetchUnionist} from '@/config/api'
import {IUnionist} from '@/types/backend'

interface IState {
  isFetching: boolean
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IUnionist[]
}
// First, create the thunk
export const fetchUnionist = createAsyncThunk(
  'unionist/fetchUnionist',
  async ({query}: {query: string}) => {
    const response = await callFetchUnionist(query)
    return response
  }
)

const initialState: IState = {
  isFetching: true,
  meta: {
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0
  },
  result: []
}

export const unionistSlide = createSlice({
  name: 'unionist',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setActiveMenu: (state, action) => {
      // state.activeMenu = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUnionist.pending, (state, action) => {
      state.isFetching = true
      // Add unionist to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchUnionist.rejected, (state, action) => {
      state.isFetching = false
      // Add unionist to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchUnionist.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false
        state.meta = action.payload.data.meta
        state.result = action.payload.data.result
      }
      // Add unionist to the state array

      // state.courseOrder = action.payload;
    })
  }
})

export const {setActiveMenu} = unionistSlide.actions

export default unionistSlide.reducer
