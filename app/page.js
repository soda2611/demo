'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState, useEffect } from 'react';
import { Typography,
         Box,
         AppBar,
         Toolbar,
         Tab,
         Tabs,
         IconButton,
         Drawer,
         List,
         ListItem,
         ListItemText,
         InputBase,
         useMediaQuery,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ProductPage from './pages/product';
import HomePage from './pages/home';

export default function App() {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1faa54ff',
        light: '#37be3cff',
      },
      secondary: {
        main: '#ebff38ff',
      },
      text: {
        primary: '#000000',
      },
    },
    typography: {
      fontFamily: 'Coiny, Roboto, Arial, sans-serif',
      h4: { fontWeight: 700 },
    },
    spacing: 8,
  });
  const [tab, setTab] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);
  
  const handleTabChange = (event, newValue) => {
      setTab(newValue);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // màn hình nhỏ hơn md
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [openSearch, setOpenSearch] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 16 }}>
        <CssBaseline />
        <Box sx={{ height: '100%', width: '100%', borderRadius: 5, gap: 10, display: 'flex', alignItems: 'center', flexDirection: 'column', flexGrow: 1, marginTop: 15 }}>
            {tab === 0 && <div style={{ overflowY: 'hidden', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <HomePage/>
            </div>}
            {tab === 1 && <div style={{ overflowY: 'hidden', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <ProductPage/>
            </div>}
            {tab === 2 && <div style={{ overflowY: 'hidden', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <p style={{ color: '#1faa54ff', fontWeight: 'bold', fontSize: 50, marginTop: 5, textAlign: 'center' }}>Liên hệ </p>
            </div>}
        </Box>

        <div style={{ backdropFilter: 'blur(5px)', width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0 }}>
          <AppBar position='static' sx={{ borderRadius: 4, display: 'flex', justifyContent: 'center', width: '95%', backgroundColor: 'primary.main'}}>
            {!openSearch ? (<Toolbar sx={{ p: 1, gap: 2 }}>
              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                    <List sx={{ width: 250 }}>
                      <ListItem onClick={() => handleTabChange(null, 0)} sx={{ cursor: 'pointer' }}>
                        <ListItemText primary="Trang chủ" />
                      </ListItem>
                      <ListItem onClick={() => handleTabChange(null, 1)} sx={{ cursor: 'pointer' }}>
                        <ListItemText primary="Sản phẩm" />
                      </ListItem>
                      <ListItem onClick={() => handleTabChange(null, 2)} sx={{ cursor: 'pointer' }}>
                        <ListItemText primary="Liên hệ" />
                      </ListItem>
                    </List>
                  </Drawer>
                </>
              ) : null}

              <img
                src="https://github.com/soda2611/tkw/blob/main/public/demo/images/image.png?raw=true"
                alt="Logo"
                style={{ height: 40 }}
              />
              <Typography variant="h5" fontWeight="bold" component="div">
                GreenFarm
              </Typography>

              {!isMobile ? (
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  textColor="white"
                  indicatorColor="secondary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Trang chủ" />
                  <Tab label="Sản phẩm" />
                  <Tab label="Liên hệ" />
                </Tabs>
              ) : null}

              <Box sx={{ flexGrow: 1 }} />

              <IconButton
                color="inherit"
                aria-label="cart"
                sx={{
                  fontSize: 14,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <ShoppingCartIcon />
                {!isMobile && <Typography>Giỏ hàng</Typography>}
              </IconButton>

              {!isMobile ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 200,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    paddingLeft: 8,
                  }}
                >
                  <SearchIcon sx={{ color: 'gray' }} />
                  <input
                    style={{
                      height: 40,
                      borderRadius: 10,
                      outline: 'none',
                      width: '100%',
                      border: 'none',
                      fontFamily: 'Coiny'
                    }}
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                </div>
              ) : (
                <IconButton color="inherit" aria-label="search" onClick={() => setOpenSearch(true)}>
                  <SearchIcon />
                </IconButton>
              )}
            </Toolbar>) : (
            <Toolbar sx={{ p: 1, gap: 2 }}>
              <InputBase
                autoFocus
                placeholder="Nhập từ khóa..."
                sx={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 2,
                  paddingLeft: 2,
                }}
              />
              <IconButton onClick={() => setOpenSearch(false)}>
                <CloseIcon sx={{ color: "white" }} />
              </IconButton>
            </Toolbar>)}
          </AppBar>
        </div>
      </div>
    </ThemeProvider>
  );
}
