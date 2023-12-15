import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {api} from 'state/api'
import { isAnyOf } from '@reduxjs/toolkit'

export const getCompanyById = createAsyncThunk('company/getById', async (companyId, thunkAPI ) => {
    const { currentRequestId, loading } = thunkAPI.getState().company
    if (loading !== 'pending' || thunkAPI.requestId !== currentRequestId) {
      return
    }
    const response = await thunkAPI.dispatch(api.endpoints.getCompanyById.initiate(companyId));
    return response
  })


export const createCompany = createAsyncThunk('company/create', async (companyName, thunkAPI ) => {
    const { currentRequestId, loading } = thunkAPI.getState().company
  if (loading !== 'pending' || thunkAPI.requestId !== currentRequestId) {
    return
  }
  const response = await thunkAPI.dispatch(api.endpoints.createCompany.initiate({companyName}));
  return response
})
export const getCompanyUsersById = createAsyncThunk('company/getUsersById', async (companyId, thunkAPI ) => {
    const { currentRequestId, loading } = thunkAPI.getState().company
    if (loading !== 'pending' || thunkAPI.requestId !== currentRequestId) {
      return
    }
    const response = await thunkAPI.dispatch(api.endpoints.getCompanyUsersById.initiate(companyId));
    return response
})
export const getAllJoinedCompanies = createAsyncThunk('company/getAllJoined', async (a=1, thunkAPI ) => {
    const { currentRequestId, loading } = thunkAPI.getState().company
    if (loading !== 'pending' || thunkAPI.requestId !== currentRequestId) {
        return
    }
    const response = await thunkAPI.dispatch(api.endpoints.getAllJoinedCompanies.initiate());
    return response
})


export const companySlice = createSlice({
  name: 'company',
  initialState: {
    data: {
        lastCompanySelected: window.localStorage.getItem("lastCompanySelected") || null,
        companies: [],
        users: []
    },
    loading: 'idle',
    currentRequestId: undefined,
    error: null,
  },
  reducers: {
    setLastCompanySelected: (state, companyId) => {
        state.data.lastCompanySelected = companyId.payload;
        window.localStorage.setItem("lastCompanySelected", companyId.payload);
        // cookies.set('lastCompanySelected', companyId, { path: '/' });
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(getCompanyUsersById.fulfilled, (state, action) => {
            const { requestId } = action.meta
            if (
            state.loading === 'pending' &&
            state.currentRequestId === requestId
            ) {
            state.loading = 'idle'
            state.currentRequestId = undefined

            state.data.users.forEach((company)=>{
                if (company._id === action.payload.data._id){
                    company = action.payload.data;
                    return 0;
                }
            }) 
            state.data.users.push(action.payload.data)
            }
        })
        .addCase(getAllJoinedCompanies.fulfilled, (state, action) => {
            const { requestId } = action.meta
            if (
            state.loading === 'pending' &&
            state.currentRequestId === requestId
            ) {
            state.loading = 'idle'
            state.currentRequestId = undefined
            state.data.companies = action.payload.data.companies
            
            }
        })
        .addMatcher(
            isAnyOf(
                getCompanyById.pending,
                createCompany.pending,
                getCompanyUsersById.pending,
                getAllJoinedCompanies.pending
            ),
            (state, action) => {
                if (state.loading === 'idle') {
                    state.loading = 'pending'
                    state.currentRequestId = action.meta.requestId
                }
            }
        )
        .addMatcher(
            isAnyOf(
                getCompanyById.fulfilled,
                createCompany.fulfilled
            ),
            (state, action) => {
                const { requestId } = action.meta
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === requestId
                ){
                    state.loading = 'idle'
                    state.currentRequestId = undefined
                    state.data.companies.forEach((company)=>{
                        if (company._id === action.payload.data._id){
                            company = action.payload.data;
                            return 0;
                        }
                    }) 
                    state.data.companies.push(action.payload.data)
                }
            }
        )
        .addMatcher(
            isAnyOf(
                getCompanyById.rejected,
                createCompany.rejected,
                getCompanyUsersById.rejected,
                getAllJoinedCompanies.rejected
            ),
            (state, action) => {
                const { requestId } = action.meta
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === requestId
                ) {
                    state.loading = 'idle'
                    state.error = action.error
                    state.currentRequestId = undefined
                }
            }
        )
  },
})
export const { setLastCompanySelected } = companySlice.actions;
export default companySlice.reducer