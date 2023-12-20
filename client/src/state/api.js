import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserId } from "state";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "features/users/authSlice";
import logger from "helpers/logger";
const baseQueryWithReauth = (baseQuery) => async (args, apiRequest, extraOptions) => {
  // const dispatch = useDispatch();
  let result = await baseQuery(args, apiRequest, extraOptions)
  // const [logOutTriggered, setSetlogOutTriggered] = useState(false);
  if (!result.error) return result
  
  const status = result.error.status || result.error.originalStatus
  if ((result.error && status === 401) || (result.error && status === 403)) {
    localStorage.setItem('logged_user', JSON.stringify(false));
      // authActions.logout()
      if (window.location.href.indexOf("signIn")===-1 && window.location.href.indexOf("signUp") ===-1) {
        window.location.href ="/signIn";
      }
  }
  
  return result
}

const adminApiBaseQuery = fetchBaseQuery({ 
  baseUrl: process.env.REACT_APP_BASE_URL, 
  credentials: 'include', 
  onError: (error) => {
    logger.error('An error occurred:', error);
  },
})

export const api = createApi({
  baseQuery: baseQueryWithReauth(adminApiBaseQuery),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Company",
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
      query: () => ({url: "auth/logout", method: "POST",}),
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
      query: (id) => `client/customers/${id}`,
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ id, page, pageSize, sort, search }) => ({
        url: `client/transactions/${id}`,
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
      query: (id) => `sales/sales/${id}`,
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
      query: (id) => `general/dashboard/${id}`,
      providesTags: ["Dashboard"],
    }),
    createCompany: build.query({
      query: ({ companyName }) => ({
        url: "company/create",
        method: "POST",
        body: {
          name: companyName
        }
      }),
      providesTags: ["Company"]
    }),
    getCompanyById: build.query({
      query: ({ companyId }) => ({
        url: `company/${companyId}`,
        method: "GET",
      }),
      providesTags: ["Company"]
    }),
    getCompanyUsersById: build.query({
      query: ({ company }) => ({
        url: `company/users/${company.id}`,
        method: "GET",
      }),
      providesTags: ["Company"]
    }),
    getAllJoinedCompanies: build.query({
      query: () => ({
        url: `company/allJoined/`,
        method: "GET",
      }),
      providesTags: ["Company"]
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
  useCreateCompanyQuery,
  useGetCompanyByIdQuery
} = api;

export const SignInQuery = (value) =>{
  const lastSelectedCompany = useSelector((state) => state.company.data.lastCompanySelected);
  const dashboardResult = useGetDashboardQuery(lastSelectedCompany)
  const result = useSignInQuery(value)
  const dispatch = useDispatch();
  if (dashboardResult.data) {
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
export const GetCustomersQuery = (data) =>{
  return useGetCustomersQuery(data)
}
export const GetTransactionsQuery = ({ id, page, pageSize, sort, search }) =>{
  return useGetTransactionsQuery({ id, page, pageSize, sort, search })
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

export const GetSalesQuery = (data) =>{
  return useGetSalesQuery(data)
}

export const GetDashboardQuery = (data) =>{
  return useGetDashboardQuery(data)
}
