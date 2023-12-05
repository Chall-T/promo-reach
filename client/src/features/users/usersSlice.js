import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {api} from 'state/api'

export const Login = createAsyncThunk('auth/login', async (args, thunkAPI) => {
    const response = await thunkAPI.dispatch(api.endpoints.signIn.initiate(args))
    return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: [],
    loading: 'idle',
    error: null,
  },
  reducers: {
  },
  extraReducers: {
    [Login.rejected]: (state, action) => {
        state.status = 'rejected';
        state.data = null;
        // console.error(action.error);
        action.error.message === 'Unauthorized' ? (state.error = 'Unauthorized') : (state.error = 'an error has occurred');
    },
  }
})
export default userSlice.reducer