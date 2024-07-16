import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {callFetchIncomeCategory} from '@/config/api'
import {IIncomeCategory} from '@/types/backend'

interface IState {
  isFetching: boolean
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IIncomeCategory[]
}
// First, create the thunk
export const fetchIncomeCategory = createAsyncThunk(
  'incomeCategory/fetchIncomeCategory',
  async ({query}: {query: string}) => {
    const response = await callFetchIncomeCategory(query)
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

export const incomeCategorySlide = createSlice({
  name: 'incomeCategory',
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
    builder.addCase(fetchIncomeCategory.pending, (state, action) => {
      state.isFetching = true
      // Add user to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchIncomeCategory.rejected, (state, action) => {
      state.isFetching = false
      // Add user to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchIncomeCategory.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false
        state.meta = action.payload.data.meta
        state.result = action.payload.data.result
      }
      // Add user to the state array

      // state.courseOrder = action.payload;
    })
  }
})

export const {setActiveMenu} = incomeCategorySlide.actions

export default incomeCategorySlide.reducer
