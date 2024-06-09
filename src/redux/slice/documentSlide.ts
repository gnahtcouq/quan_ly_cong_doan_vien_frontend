import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {callFetchPost, callFetchDocument} from '@/config/api'
import {IDocument} from '@/types/backend'

interface IState {
  isFetching: boolean
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  result: IDocument[]
}
// First, create the thunk
export const fetchDocument = createAsyncThunk(
  'document/fetchDocument',
  async ({query}: {query: string}) => {
    const response = await callFetchDocument(query)
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

export const documentSlide = createSlice({
  name: 'document',
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
    builder.addCase(fetchDocument.pending, (state, action) => {
      state.isFetching = true
      // Add user to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchDocument.rejected, (state, action) => {
      state.isFetching = false
      // Add user to the state array
      // state.courseOrder = action.payload;
    })

    builder.addCase(fetchDocument.fulfilled, (state, action) => {
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

export const {setActiveMenu} = documentSlide.actions

export default documentSlide.reducer
