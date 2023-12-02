import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import  { Navigate } from 'react-router-dom';


export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_BASE_URL, 
    credentials: 'include', 
    onError: (error) => {
      console.log('An error occurred:', error);
    },
  }),
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
