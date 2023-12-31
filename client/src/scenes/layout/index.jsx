import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet  } from "react-router-dom";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { asyncGetUser } from "features/users/usersSlice";
import { useDispatch } from "react-redux";
const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(asyncGetUser()).unwrap().then((payload) => {
      setData(payload)
    });
  }, [])
  const [data, setData] = useState();
  const [company, setCompany] = useState({});
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={data || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setCompany={setCompany}
      />
      <Box flexGrow={1}>
        <Navbar
          user={data || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet context={{company}}/>
      </Box>
    </Box>
  );
};

export default Layout;
