import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {callFetchPost} from '@/config/api'
import {IPost} from '@/types/backend'

interface IState {
  isFetching: boolean
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IPost[]
}
// First, create the thunk
export const fetchPost = createAsyncThunk(
  'post/fetchPost',
  async ({query}: {query: string}) => {
    const response = await callFetchPost(query)
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

export const postSlide = createSlice({
  name: 'post',
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
    builder.addCase(fetchPost.pending, (state, action) => {
      state.isFetching = true
      // Add user to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchPost.rejected, (state, action) => {
      state.isFetching = false
      // Add user to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchPost.fulfilled, (state, action) => {
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

export const {setActiveMenu} = postSlide.actions

export default postSlide.reducer
