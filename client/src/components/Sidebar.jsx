import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Menu,
  MenuItem
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.jpeg";
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CompanyCreateForm from "./CompanyCreateForm";
import { useSelector, useDispatch } from "react-redux";
import { getAllJoinedCompanies, setLastCompanySelected } from "features/companies/companySlice";
const navItems = [
  {
    text: null,
    icon: null,
    type: "companies"
  },
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Client Facing",
    icon: null,
  },
  {
    text: "Products",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Customers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Transactions",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Geography",
    icon: <PublicOutlined />,
  },
  {
    text: "Sales",
    icon: null,
  },
  {
    text: "Overview",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Daily",
    icon: <TodayOutlined />,
  },
  {
    text: "Monthly",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Breakdown",
    icon: <PieChartOutlined />,
  },
  {
    text: "Management",
    icon: null,
  },
  {
    text: "Admin",
    icon: <AdminPanelSettingsOutlined />,
  },
  {
    text: "Performance",
    icon: <TrendingUpOutlined />,
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);
  const [openCompanyCreateForm, setOpenCompanyCreateForm] = useState(false);
  const lastSelectedCompany = useSelector((state) => state.company.data.lastSelectedCompany);
  useEffect(() => {
    dispatch(getAllJoinedCompanies()).unwrap().then((payload)=>{
      console.log(payload)
      if(payload && payload.status === "fulfilled"){
        payload.data.companies.forEach((company, index) => {
          console.log(lastSelectedCompany, company._id, lastSelectedCompany)
          if (lastSelectedCompany && company._id === lastSelectedCompany){
            setSelectedIndex(index)
          }
        })
      }
    })
  }, []);
  const companyData = useSelector((state) => state.company.data);
  
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index, elementList) => {
    
    setSelectedIndex(index);
    setAnchorEl(null);
    console.log(companyData.companies)
    if (index !== (elementList.length-1)) {
      dispatch(setLastCompanySelected(companyData.companies[index]._id));

    }
    if (index === (elementList.length-1)) {
      setOpenCompanyCreateForm(true)
    }

  };

  const companiesElementList = []
  if (JSON.stringify(companyData.companies) !== '[]'){
    // setselectedCompany(1)
    companyData.companies.forEach((company, index) => {
    companiesElementList.push(<MenuItem key={index} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index, companiesElementList)} sx={{width: "100%", paddingLeft: "1rem !important", bgcolor: "transparent"}}><StorefrontIcon sx={{mr: "1rem"}}/> {company.name}</MenuItem>)
    }
    )
  }
  companiesElementList.push(<MenuItem key={"New company"} selected={companiesElementList.length-1 === selectedIndex} onClick={(event) => handleMenuItemClick(event, companiesElementList.length-1, companiesElementList)} sx={{width: "100%", paddingLeft: "1rem !important", bgcolor: "transparent"}}><AddIcon sx={{mr: "1rem" }}/> New company</MenuItem>)
  const renderCompanyCombobox = () => {
    return (
      
      <ListItem width="100%" disablePadding sx={{bgcolor: "transparent"}} key="selectedCompany">
        
        <CompanyCreateForm openCompanyCreateForm={openCompanyCreateForm} setOpenCompanyCreateForm={setOpenCompanyCreateForm} />
        
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
          sx={{ 
            bgcolor: "transparent",
            width: "100vw",
            height: "3rem",
            mb: "2rem"
          }}
          width="100%"
        >
          <Box sx={{
            width: "100%", 
            paddingLeft: "1rem !important", 
            bgcolor: "transparent",
            display: "flex",
            alignItems: "center"
          }}>{companiesElementList[selectedIndex].props.children}</Box>
          
          
        </ListItemButton>
      <Menu
      id="lock-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        role: 'listbox',
      }}
    >
      {companiesElementList}
    </Menu>
    </ListItem>
    )
  }

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    PROMO REACH
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, type }) => {

                if (!text && type === "companies"){
                  return (
                    renderCompanyCombobox()
                  )
                }

                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();
                
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px ",
                }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
