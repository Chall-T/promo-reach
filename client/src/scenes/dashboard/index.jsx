import React from "react";
import { useEffect, useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { api } from "state/api";
import StatBox from "components/StatBox";
import {useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const {company} = useOutletContext()
  const dispatch = useDispatch();
  
  const [dashboardData, setDashboardData] = useState(false);
  const [dashboardIsLoading, setDashboardIsLoading] = useState(true);
  useEffect(() => {
    if (company._id){
      dispatch(api.endpoints.getDashboard.initiate(company._id, {forceRefetch: true})).unwrap().then((payload)=>{
        setDashboardIsLoading(false)
        setDashboardData(payload)
      })
    }
  }, [company, dispatch]);

  // const { data, isLoading } = dispatch(api.endpoints.getDashboard.initiate(company._id, {forceRefetch: true}))
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");


  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Customers"
          value={dashboardData && dashboardData.totalCustomers}
          increase={dashboardData?`+${(dashboardData.totalCustomers===0? 1:dashboardData.totalCustomers)/(dashboardData.lastMonthData.totalCustomers===0?1:dashboardData.lastMonthData.totalCustomers)*100}%`:''}
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales Today"
          value={dashboardData && dashboardData.todayStats.totalSales}
          increase={dashboardData?`+${(dashboardData.todayStats.totalSales===0? 1:dashboardData.todayStats.totalSales)/(dashboardData.lastMonthData.daylySales===0?1:dashboardData.lastMonthData.daylySales)*100}%`:''}
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {
            dashboardData ? <OverviewChart view="sales" isDashboard={true} declaredData={dashboardData} /> : ''
          }
          
        </Box>
        <StatBox
          title="Monthly Sales"
          value={dashboardData && dashboardData.thisMonthStats.totalSales}
          increase={dashboardData?`+${(dashboardData.thisMonthStats.totalSales===0? 1:dashboardData.thisMonthStats.totalSales)/(dashboardData.lastMonthData.monthlySales===0?1:dashboardData.lastMonthData.monthlySales)*100}%`:''}
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Yearly Sales"
          value={dashboardData && dashboardData.yearlySalesTotal}
          increase="+100%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={dashboardIsLoading || !dashboardData}
            getRowId={(row) => row._id}
            rows={(dashboardData && dashboardData.transactions) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales By Category
          </Typography>

          <BreakdownChart isDashboard={true}/>
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
