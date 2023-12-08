import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserId } from "state";
import { useDispatch } from "react-redux";
import { authActions } from "features/users/authSlice";
import  { Navigate } from 'react-router-dom';

const baseQueryWithReauth = (baseQuery) => async (args, apiRequest, extraOptions) => {
  // const dispatch = useDispatch();
  let result = await baseQuery(args, apiRequest, extraOptions)
  // const [logOutTriggered, setSetlogOutTriggered] = useState(false);
  if (!result.error) return result
  
  const status = result.error.status || result.error.originalStatus
  if ((result.error && status === 401) || (result.error && status === 403)) {
    localStorage.setItem('logged_user', JSON.stringify(false));
      // authActions.logout()
      if (window.location.href.indexOf("SignIn")>-1 || window.location.href.indexOf("SignUp") >-1) {
        window.location.href ="/signIn";
      }
  }
  
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
      query: () => `general/user`,
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

export const SignInQuery = (value) =>{
  const dashboardResult = useGetDashboardQuery()
  const result = useSignInQuery(value)
  const dispatch = useDispatch();
  if (dashboardResult.data) {
    console.log(dashboardResult.data)
    window.location.href ="/dashboard";
  }
  if (!result.data) return result;
  dispatch(setUserId(result.data._id))
  dispatch(authActions.login())
  window.location.href ="/dashboard";
}
export const GetProductsQuery = () =>{
  return useGetProductsQuery()
}
export const GetUserQuery = () =>{
  return useGetUserQuery()
}
export const GetCustomersQuery = () =>{
  return useGetCustomersQuery()
}
export const GetTransactionsQuery = ({ page, pageSize, sort, search }) =>{
  return useGetTransactionsQuery({ page, pageSize, sort, search })
}
export const GetGeographyQuery = () =>{
  return useGetGeographyQuery()
}
export const GetAdminsQuery = () =>{
  return useGetAdminsQuery()
}
export const GetUserPerformanceQuery = (userId) =>{
  return useGetUserPerformanceQuery(userId)
}

export const GetSalesQuery = () =>{
  return useGetSalesQuery()
}

export const GetDashboardQuery = () =>{
  return useGetDashboardQuery()
}
