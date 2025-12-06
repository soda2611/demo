"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";
import {
  Typography,
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
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ProductPage from "./pages/product";
import HomePage from "./pages/home";
import ContactPage from "./pages/contact";
import Footer from "./widgets/Footer";
import Blog from "./pages/blog";
import CartDialog from "./widgets/CartDialog";

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1faa54ff",
        light: "#37be3cff",
      },
      secondary: {
        main: "#ebff38ff",
      },
      text: {
        primary: "#000000",
      },
    },
    typography: {
      fontFamily: "Coiny, Roboto, Arial, sans-serif",
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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openSearch, setOpenSearch] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const initialCartItems = [];

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [quantities, setQuantities] = useState(() => {
    const q = {};
    initialCartItems.forEach((it) => (q[it.id] = it.quantity ?? 1));
    return q;
  });

  const addToCart = (product, qty = 1) => {
    const id = product.id ?? product.name;
    const displayPrice = product.sale != null ? product.sale : product.price;

    setCartItems((prev) => {
      const exists = prev.find((it) => it.id === id);
      let next;

      if (exists) {
        // Cộng dồn số lượng
        setQuantities((q) => ({
          ...q,
          [id]: (q[id] ?? exists.quantity ?? 1) + qty,
        }));
        next = prev.map((it) =>
          it.id === id
            ? {
                ...it,
                quantity: (it.quantity ?? 1) + qty,
                displayPrice,
                sale: product.sale,
                price: product.price,
              }
            : it
        );
      } else {
        const toAdd = {
          ...product,
          id,
          quantity: qty,
          min: product.min ?? 1,
          max: product.max ?? 40,
          displayPrice,
        };
        setQuantities((q) => ({ ...q, [id]: qty }));
        next = [...prev, toAdd];
      }
      const totalByNext = next.reduce((sum, it) => sum + (it.quantity ?? 1), 0);
      const productName = product.name ?? "Sản phẩm";
      setSnackbarMsg(
        `Đã thêm "${productName}" x${qty}. Giỏ hàng hiện có ${totalByNext} sản phẩm.`
      );
      setSnackbarOpen(true);

      return next;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    setQuantities((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/soda2611/demo/refs/heads/main/app/data/products.json"
    )
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi tải JSON:", err));
  }, []);

  if (!products) return <div>Đang tải dữ liệu...</div>;

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            height: "100%",
            width: "100%",
            borderRadius: 5,
            gap: 10,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            flexGrow: 1,
            marginTop: 15,
          }}
        >
          {tab === 0 && (
            <div
              style={{
                overflowY: "hidden",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <HomePage products={products} onAddToCart={addToCart} />
            </div>
          )}
          {tab === 1 && (
            <div
              style={{
                overflowY: "hidden",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <ProductPage products={products} onAddToCart={addToCart} />
            </div>
          )}
          {tab === 2 && (
            <div
              style={{
                overflowY: "hidden",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Blog />
            </div>
          )}
          {tab === 3 && (
            <div
              style={{
                overflowY: "hidden",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <ContactPage />
            </div>
          )}
          <Footer />
        </Box>
        <div
          style={{
            backdropFilter: "blur(5px)",
            width: "100%",
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
          }}
        >
          <AppBar
            position="static"
            sx={{
              borderRadius: 4,
              display: "flex",
              justifyContent: "center",
              width: "95%",
              backgroundColor: "primary.main",
            }}
          >
            {!openSearch ? (
              <Toolbar sx={{ p: 1, gap: 2 }}>
                {isMobile ? (
                  <>
                    <IconButton
                      color="inherit"
                      aria-label="menu"
                      onClick={toggleDrawer(true)}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Drawer
                      anchor="left"
                      open={drawerOpen}
                      onClose={toggleDrawer(false)}
                    >
                      <List sx={{ width: 250 }}>
                        <ListItem
                          onClick={() => handleTabChange(null, 0)}
                          sx={{ cursor: "pointer" }}
                        >
                          <ListItemText primary="Trang chủ" />
                        </ListItem>
                        <ListItem
                          onClick={() => handleTabChange(null, 1)}
                          sx={{ cursor: "pointer" }}
                        >
                          <ListItemText primary="Sản phẩm" />
                        </ListItem>
                        <ListItem
                          onClick={() => handleTabChange(null, 2)}
                          sx={{ cursor: "pointer" }}
                        >
                          <ListItemText primary="Blog" />
                        </ListItem>
                        <ListItem
                          onClick={() => handleTabChange(null, 3)}
                          sx={{ cursor: "pointer" }}
                        >
                          <ListItemText primary="Liên hệ" />
                        </ListItem>
                      </List>
                    </Drawer>
                  </>
                ) : null}

                <img
                  src="https://github.com/soda2611/demo/blob/main/public/image.png?raw=true"
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
                    <Tab label="Blog" />
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
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  }}
                  onClick={handleOpen}
                >
                  <ShoppingCartIcon />
                  {!isMobile && <Typography>Giỏ hàng</Typography>}
                </IconButton>

                {!isMobile ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 200,
                      backgroundColor: "white",
                      borderRadius: 10,
                      paddingLeft: 8,
                    }}
                  >
                    <SearchIcon sx={{ color: "gray" }} />
                    <input
                      style={{
                        height: 40,
                        borderRadius: 10,
                        outline: "none",
                        width: "100%",
                        border: "none",
                        fontFamily: "Coiny",
                      }}
                      placeholder="Tìm kiếm sản phẩm..."
                    />
                  </div>
                ) : (
                  <IconButton
                    color="inherit"
                    aria-label="search"
                    onClick={() => setOpenSearch(true)}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </Toolbar>
            ) : (
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
              </Toolbar>
            )}
          </AppBar>
        </div>
        <CartDialog
          items={cartItems}
          quantities={quantities}
          setQuantities={setQuantities}
          setCartItems={setCartItems}
          onRemove={removeItem}
          open={open}
          handleClose={handleClose}
        />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
