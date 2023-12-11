import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";
import SignUp from "scenes/SignUp";
import SignIn from "scenes/SignIn";
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const isLoggedIn = true 
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace />  : <Navigate to='/SignIn'/>} />
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to='/SignIn'/>} />
              <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to='/SignIn'/>} />
              <Route path="/customers" element={isLoggedIn ? <Customers /> : <Navigate to='/SignIn'/>} />
              <Route path="/transactions" element={isLoggedIn ? <Transactions /> : <Navigate to='/SignIn'/>} />
              <Route path="/geography" element={isLoggedIn ? <Geography /> : <Navigate to='/SignIn'/>} />
              <Route path="/overview" element={isLoggedIn ? <Overview /> : <Navigate to='/SignIn'/>} />
              <Route path="/daily" element={isLoggedIn ? <Daily /> : <Navigate to='/SignIn'/>} />
              <Route path="/monthly" element={isLoggedIn ? <Monthly /> : <Navigate to='/SignIn'/>} />
              <Route path="/breakdown" element={isLoggedIn ? <Breakdown /> : <Navigate to='/SignIn'/>} />
              <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to='/SignIn'/>} />
              <Route path="/performance" element={isLoggedIn ? <Performance /> : <Navigate to='/SignIn'/>} />
            </Route>
            <Route path="/SignUp" element={<SignUp  />} />
            <Route path="/SignIn" element={<SignIn  />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
