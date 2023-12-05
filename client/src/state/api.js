import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import  { Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const baseQueryWithReauth = (baseQuery) => async (args, apiRequest, extraOptions) => {
  let result = await baseQuery(args, apiRequest, extraOptions)
  
  useEffect(()=>{
    if (result.error && result.error.status === 401 || result.error.status === 403) {
      
      const result = GetTokenQuery()
    }
  }, [])
  
  return result
}

const adminApiBaseQuery = fetchBaseQuery({ 
  baseUrl: process.env.REACT_APP_BASE_URL, 
  credentials: 'include', 
  onError: (error) => {
    console.log('An error occurred:', error);
  },
})

export const api = createApi({
  baseQuery: baseQueryWithReauth(adminApiBaseQuery),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "LogOut",
    "Token"
  ],
  endpoints: (build) => ({
    signIn:  build.query({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          email: email,
          password: password
        }
      }),
      providesTags: ["User"]
    }),
    signUp:  build.query({
      query: ({ firstName, lastName, email, password, terms }) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          name: firstName,
          lastName: lastName,
          email: email,
          password: password,
          terms: terms
        }
      }),
      providesTags: ["User"]
    }),
    logOut: build.query({
      query: () => ({url: "/auth/logout", method: "POST",}),
      providesTags: ["LogOut"],
    }),
    getToken: build.query({
      query: () => ({url: "/auth/refreshToken", method: "POST",}),
      providesTags: ["Token"],
    }),
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useSignInQuery,
  useLogOutQuery,
  useGetTokenQuery,
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;

function HandleNotAuthorized(error){
  return 0;
  console.log(error)
  if(!error) return;
  if(error.status){
    if (error.status == 403) window.location.href ="/signIn";
  }
  if(error.originalStatus){
    if (error.originalStatus == 403) window.location.href ="/signIn";
  }
}

export const SignInQuery = (value) =>{
  const result = useSignInQuery(value)
  HandleNotAuthorized(result.error)
  if (!result.data) return result;
  window.location.href ="/dashboard";
}
export const GetTokenQuery = (value) =>{
  const result = useGetTokenQuery(value)
  HandleNotAuthorized(result.error)
  return result;
}
export const GetProductsQuery = () =>{
  const result = useGetProductsQuery()
  HandleNotAuthorized(result.error)
  return result;
}
export const GetUserQuery = () =>{
  const result = useGetUserQuery()
  HandleNotAuthorized(result.error)
  return result;
}
export const GetCustomersQuery = () =>{
  const result = useGetCustomersQuery()
  HandleNotAuthorized(result.error)
  return result;
}
export const GetTransactionsQuery = () =>{
  const result = useGetTransactionsQuery()
  HandleNotAuthorized(result.error)
  return result;
}
export const GetGeographyQuery = () =>{
  const result = useGetGeographyQuery()
  HandleNotAuthorized(result.error)
  return result;
}
export const GetAdminsQuery = () =>{
  const result = useGetAdminsQuery()
  HandleNotAuthorized(result.error)
  return result;
}
export const GetUserPerformanceQuery = () =>{
  const result = useGetUserPerformanceQuery()
  HandleNotAuthorized(result.error)
  return result;
}

export const GetSalesQuery = () =>{
  const result = useGetSalesQuery()
  HandleNotAuthorized(result.error)
  return result;
}

export const GetDashboardQuery = () =>{
  const result = useGetDashboardQuery()
  HandleNotAuthorized(result.error)
  return result;
}
