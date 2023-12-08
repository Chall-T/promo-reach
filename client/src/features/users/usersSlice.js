import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {api} from 'state/api'

export const Login = createAsyncThunk('user/login', async (args, thunkAPI) => {
    const response = await thunkAPI.dispatch(api.endpoints.signIn.initiate(args))
    return response.data
})

export const asyncGetUser = createAsyncThunk('user/getData', async (args, thunkAPI ) => {
  const { currentRequestId, loading } = thunkAPI.getState().user
  if (loading !== 'pending' || thunkAPI.requestId !== currentRequestId) {
    return
  }
  const response = await thunkAPI.dispatch(api.endpoints.getUser.initiate());
  return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {},
    loading: 'idle',
    currentRequestId: undefined,
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetUser.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(asyncGetUser.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          state.data = action.payload
          state.currentRequestId = undefined
        }
      })
      .addCase(asyncGetUser.rejected, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          state.error = action.error
          state.currentRequestId = undefined
        }
      })
  },
})

export default userSlice.reducer