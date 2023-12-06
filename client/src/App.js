import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useEffect, useState } from "react";
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
  // console.log(useSelector((state)=> state.adminApi))
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('logged_user') !== null
  );

  useEffect(() => {
    localStorage.setItem('logged_user', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);
  const logIn = () => setIsLoggedIn(true);
  const logOut = () => setIsLoggedIn(false);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout logOut={logOut}/>}>
              <Route path="/" element={<Navigate to="/dashboard" replace /> } />
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/products" element={isLoggedIn ? <Products logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/customers" element={isLoggedIn ? <Customers logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/transactions" element={isLoggedIn ? <Transactions logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/geography" element={isLoggedIn ? <Geography logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/overview" element={isLoggedIn ? <Overview logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/daily" element={isLoggedIn ? <Daily logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/monthly" element={isLoggedIn ? <Monthly logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/breakdown" element={isLoggedIn ? <Breakdown logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/admin" element={isLoggedIn ? <Admin logOut={logOut}/> : <Navigate to='/SignIn'/>} />
              <Route path="/performance" element={isLoggedIn ? <Performance logOut={logOut}/> : <Navigate to='/SignIn'/>} />
            </Route>
            <Route path="/SignUp" element={<SignUp logIn={logIn} />} />
            <Route path="/SignIn" element={<SignIn logIn={logIn} />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
