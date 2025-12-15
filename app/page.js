"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect, useRef } from "react";
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
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import BookIcon from "@mui/icons-material/Book";
import CallIcon from "@mui/icons-material/Call";
import ProductPage from "./features/ProductSection";
import HomePage from "./features/HomeSection";
import ContactPage from "./features/ContactSection";
import Footer from "./features/FooterSection";
import Blog from "./features/BlogSection";
import CartDialog from "./components/CartDialog";
import SearchPopper from "./components/SearchPopper";
import ProductDialog from "./components/ProductDialog";
import CheckoutDialog from "./components/CheckoutDialog";
import { useIsMobile } from "./hooks/isMobile";
import { useCustomTheme } from "./hooks/theme";

export default function App() {
  const theme = useCustomTheme();
  const [tab, setTab] = useState(0);
  const [CategoryTab, setCategoryTab] = useState(0); // Tab "Tất cả" + từng danh mục

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const isMobile = useIsMobile();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productDialogData, setProductDialogData] = useState({
    name: "",
    item: null,
  });

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

  const cartTotalQty = React.useMemo(
    () => cartItems.reduce((sum, it) => sum + (it.quantity ?? 1), 0),
    [cartItems]
  );

  const addToCart = (product, qty = 1) => {
    const rawId = product.id ?? product.name ?? "";
    const id = String(rawId).trim().toLowerCase();

    let addQty = Number(qty);
    if (!Number.isFinite(addQty)) addQty = 1;
    addQty = Math.max(1, Math.floor(addQty));

    const displayPrice = product.sale != null ? product.sale : product.price;

    setCartItems((prev) => {
      const exists = prev.find((it) => it.id === id);
      let next;

      if (exists) {
        const newQuantity = (exists.quantity ?? 1) + addQty;

        next = prev.map((it) =>
          it.id === id
            ? {
                ...it,
                quantity: newQuantity,
                displayPrice,
                sale: product.sale,
                price: product.price,
                min: it.min ?? product.min ?? 1,
                max: undefined,
              }
            : it
        );

        setQuantities((q) => ({ ...q, [id]: newQuantity }));
      } else {
        const initialQty = Math.max(product.min ?? 1, addQty);

        const toAdd = {
          ...product,
          id,
          quantity: initialQty,
          min: product.min ?? 1,
          max: undefined,
          displayPrice,
        };

        next = [...prev, toAdd];
        setQuantities((q) => ({ ...q, [id]: initialQty }));
      }

      const totalByNext = next.reduce((sum, it) => sum + (it.quantity ?? 1), 0);
      const productName = product.name ?? "Sản phẩm";

      setSnackbarMsg(
        `Đã thêm "${productName}" x${addQty}. Giỏ hàng hiện có ${totalByNext} sản phẩm.`
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

  // Bỏ dấu tiếng Việt + lowercase để so khớp dễ
  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Tạo mảng tất cả sản phẩm từ cấu trúc { category: { name: item } }
  const buildAllProducts = (productsObj) => {
    const arr = [];
    Object.entries(productsObj || {}).forEach(([category, items]) => {
      Object.entries(items || {}).forEach(([name, item]) => {
        // Ảnh lấy từ item.img (hỗ trợ URL hoặc data URI/base64)
        const thumbnail = item?.img ?? null;

        // Giá hiển thị: nếu có sale (hợp lệ) thì dùng sale, ngược lại price
        let displayPrice = item?.price;
        if (item?.sale != null && Number(item.sale) > 0) {
          displayPrice = item.sale;
        }

        arr.push({
          name,
          category,
          price: item?.price ?? null,
          sale: item?.sale ?? null,
          displayPrice,
          thumbnail, // <-- dùng đúng key `img`
          shortDesc: item?.["shortDescription"] ?? "", // key có khoảng trắng cần bracket
          _normName: normalize(name),
        });
      });
    });
    return arr;
  };

  const [searchAnchor, setSearchAnchor] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPopper, setShowPopper] = useState(false);
  const toolbarRef = useRef(null);

  const [banners, setBanners] = useState(null);

  useEffect(() => {
    fetch("data/banners.json")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error("Lỗi khi tải JSON:", err));
  }, []);

  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch("data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi tải JSON:", err));
  }, []);

  const allProducts = React.useMemo(
    () => buildAllProducts(products ?? {}),
    [products]
  );

  useEffect(() => {
    const q = normalize(query);
    if (!q) {
      setSuggestions([]);
      setShowPopper(false);
      return;
    }

    const matched = allProducts
      .filter((p) => p._normName.includes(q))
      .slice(0, 10);

    setSuggestions(matched);
    setShowPopper(matched.length > 0);
  }, [query, allProducts]);

  // --- CHECKOUT DIALOG ---
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const handleOpenCheckout = ({ items, quantities, subtotal }) => {
    setCheckoutData({ items, quantities, subtotal });
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (order) => {
    console.log("Đơn hàng mới:", order);

    // reset giỏ hàng
    setCartItems([]);
    setQuantities({});

    setCheckoutOpen(false);

    setSnackbarMsg("Thanh toán thành công!");
    setSnackbarOpen(true);
  };

  const goHome = React.useCallback(() => {
    setTab(0);
    // Cuộn mượt lên top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

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
          {!products || !banners ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <>
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
                  <HomePage
                    products={products}
                    onAddToCart={addToCart}
                    tab={setTab}
                    setCategoryTab={setCategoryTab}
                  />
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
                  <ProductPage
                    products={products}
                    banners={banners}
                    onAddToCart={addToCart}
                    CategoryTab={CategoryTab}
                    setCategoryTab={setCategoryTab}
                  />
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
              <Footer tab={setTab} />
            </>
          )}
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
                      sx={{
                        "& .MuiDrawer-paper": {
                          width: 250,
                          height: "calc(100% - 44px)",
                          left: 10,
                          top: 22,
                          borderRadius: 2,
                          boxSizing: "border-box",
                          bgcolor: "primary.main",
                          color: "white",
                        },
                      }}
                    >
                      <List sx={{ width: 250 }}>
                        <ListItem
                          onClick={() => {
                            handleTabChange(null, 0);
                            setDrawerOpen(false);
                          }}
                          sx={{ cursor: "pointer", gap: 2 }}
                        >
                          <ListItemText
                            primary="Trang chủ"
                            sx={{ flexGrow: 1 }}
                          />
                          <HomeIcon />
                        </ListItem>
                        <ListItem
                          onClick={() => {
                            handleTabChange(null, 1);
                            setDrawerOpen(false);
                          }}
                          sx={{ cursor: "pointer", gap: 2 }}
                        >
                          <ListItemText
                            primary="Sản phẩm"
                            sx={{ flexGrow: 1 }}
                          />
                          <InventoryIcon />
                        </ListItem>
                        <ListItem
                          onClick={() => {
                            handleTabChange(null, 2);
                            setDrawerOpen(false);
                          }}
                          sx={{ cursor: "pointer", gap: 2 }}
                        >
                          <ListItemText primary="Blog" sx={{ flexGrow: 1 }} />
                          <BookIcon />
                        </ListItem>
                        <ListItem
                          onClick={() => {
                            handleTabChange(null, 3);
                            setDrawerOpen(false);
                          }}
                          sx={{ cursor: "pointer", gap: 2 }}
                        >
                          <ListItemText
                            primary="Liên hệ"
                            sx={{ flexGrow: 1 }}
                          />
                          <CallIcon />
                        </ListItem>
                      </List>
                    </Drawer>
                  </>
                ) : null}

                <Box
                  onClick={goHome}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 0,
                    borderRadius: 2,
                    gap: 2,
                    cursor: "pointer",
                  }}
                  aria-label="Về trang chủ"
                >
                  <img
                    src="images/branding/logo.png"
                    alt="Logo"
                    style={{ height: 40 }}
                  />
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    component="div"
                    sx={{
                      color: "white",
                      "@media (max-width:500px)": {
                        display: "none",
                      },
                    }}
                  >
                    GreenFarm
                  </Typography>
                </Box>

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
                    backgroundColor: isMobile
                      ? undefined
                      : "rgba(255, 255, 255, 0.3)",
                  }}
                  onClick={handleOpen}
                >
                  {isMobile ? (
                    <Badge badgeContent={cartTotalQty} color="success" showZero>
                      <ShoppingCartIcon />
                    </Badge>
                  ) : (
                    <ShoppingCartIcon />
                  )}
                  {!isMobile && (
                    <>
                      <Typography>
                        Giỏ hàng ({cartTotalQty <= 99 ? cartTotalQty : "99+"})
                      </Typography>
                    </>
                  )}
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
                        fontFamily: "Coiny",
                        border: "none",
                      }}
                      placeholder="Tìm kiếm sản phẩm..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSearchAnchor(e.currentTarget);
                      }}
                      onFocus={(e) => {
                        setSearchAnchor(e.currentTarget);
                        if (suggestions.length) setShowPopper(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowPopper(false), 150); // giữ thời gian đóng để click gợi ý không bị mất
                      }}
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
              <Toolbar sx={{ pl: 2, gap: 2 }} ref={toolbarRef}>
                <SearchIcon sx={{ color: "white" }} />
                <InputBase
                  autoFocus
                  placeholder="Tìm kiếm sản phẩm..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchAnchor(e.currentTarget);
                  }}
                  onFocus={(e) => {
                    setSearchAnchor(e.currentTarget);
                    if (suggestions.length) setShowPopper(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowPopper(false), 150); // giữ thời gian đóng để click gợi ý không bị mất
                  }}
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 2,
                    pl: 1,
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
          onCheckout={(payload) => {
            // payload sẽ gồm: { items, quantities, subtotal }
            handleOpenCheckout(payload);
            setOpen(false); // đóng giỏ hàng
          }}
        />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>

      <SearchPopper
        open={showPopper}
        anchorEl={searchAnchor}
        suggestions={suggestions}
        onPick={(sug) => {
          const item = products?.[sug.category]?.[sug.name];
          if (!item) return;
          setProductDialogData({ name: sug.name, item });
          setProductDialogOpen(true);
        }}
        onClose={() => setShowPopper(false)}
      />

      {productDialogOpen && productDialogData.item && (
        <ProductDialog
          name={productDialogData.name}
          item={productDialogData.item}
          open={productDialogOpen}
          handleClose={() => setProductDialogOpen(false)}
          onAddToCart={(product, qty) => {
            const productWithName = {
              ...product,
              name: productDialogData.name,
            };
            addToCart(productWithName, qty);
            setProductDialogOpen(false);
          }}
        />
      )}

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={checkoutData?.items ?? []}
        quantities={checkoutData?.quantities ?? {}}
        subtotal={checkoutData?.subtotal ?? 0}
        onSuccess={handleCheckoutSuccess}
      />
    </ThemeProvider>
  );
}
