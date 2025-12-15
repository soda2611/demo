// app/page.js
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Tab,
  Tabs,
  Toolbar,
  Typography,
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

const POPPER_CLOSE_DELAY_MS = 150;
const MAX_SUGGESTIONS = 10;
const MAX_CART_QTY_DISPLAY = 99;

const APP_CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
};

const TAB_SECTION_STYLE = {
  overflowY: "hidden",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 10,
};

const HEADER_WRAPPER_STYLE = {
  backdropFilter: "blur(5px)",
  width: "100%",
  height: 100,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  top: 0,
};

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toSafeId(value) {
  return String(value ?? "").trim().toLowerCase();
}

function toSafeQuantity(value, fallback = 1) {
  let qty = Number(value);
  if (!Number.isFinite(qty)) qty = fallback;
  return Math.max(1, Math.floor(qty));
}

/**
 * Chuyển cấu trúc { category: { name: item } } -> mảng sản phẩm để tìm kiếm.
 * Lưu thêm _normName để so khớp nhanh (không dấu + lowercase).
 */
function buildAllProducts(productsByCategory = {}) {
  const result = [];

  Object.entries(productsByCategory).forEach(([category, items]) => {
    Object.entries(items ?? {}).forEach(([name, item]) => {
      const thumbnail = item?.img ?? null;

      // Giá hiển thị: nếu có sale (hợp lệ) thì dùng sale, ngược lại dùng price.
      let displayPrice = item?.price ?? null;
      if (item?.sale != null && Number(item.sale) > 0) {
        displayPrice = item.sale;
      }

      result.push({
        name,
        category,
        price: item?.price ?? null,
        sale: item?.sale ?? null,
        displayPrice,
        thumbnail,
        shortDesc: item?.["shortDescription"] ?? "",
        _normName: normalizeText(name),
      });
    });
  });

  return result;
}

export default function App() {
  const theme = useCustomTheme();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState(0);
  const [categoryTab, setCategoryTab] = useState(0); // Tab "Tất cả" + từng danh mục

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = useCallback((open) => () => setIsDrawerOpen(open), []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const closeSnackbar = useCallback((_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  }, []);

  const showSnackbar = useCallback((message) => {
    setSnackbarMsg(message);
    setSnackbarOpen(true);
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  const cartTotalQty = useMemo(
    () => cartItems.reduce((sum, it) => sum + (it.quantity ?? 1), 0),
    [cartItems]
  );

  /**
   * Thêm sản phẩm vào giỏ:
   * - Chuẩn hóa id để tránh trùng lặp do khác hoa/thường hoặc có khoảng trắng.
   * - Đảm bảo số lượng là số nguyên >= 1.
   */
  const addToCart = useCallback(
    (product, qty = 1) => {
      const id = toSafeId(product?.id ?? product?.name ?? "");
      if (!id) return;

      const addQty = toSafeQuantity(qty, 1);
      const displayPrice =
        product?.sale != null ? product.sale : product?.price;

      setCartItems((prevItems) => {
        const existing = prevItems.find((it) => it.id === id);

        let nextItems = prevItems;
        let nextQuantity = addQty;

        if (existing) {
          nextQuantity = (existing.quantity ?? 1) + addQty;

          nextItems = prevItems.map((it) =>
            it.id === id
              ? {
                  ...it,
                  quantity: nextQuantity,
                  displayPrice,
                  sale: product.sale,
                  price: product.price,
                  min: it.min ?? product.min ?? 1,
                  max: undefined,
                }
              : it
          );
        } else {
          nextQuantity = Math.max(product?.min ?? 1, addQty);

          nextItems = [
            ...prevItems,
            {
              ...product,
              id,
              quantity: nextQuantity,
              min: product?.min ?? 1,
              max: undefined,
              displayPrice,
            },
          ];
        }

        setQuantities((prev) => ({ ...prev, [id]: nextQuantity }));

        const totalByNext = nextItems.reduce(
          (sum, it) => sum + (it.quantity ?? 1),
          0
        );
        const productName = product?.name ?? "Sản phẩm";

        showSnackbar(
          `Đã thêm "${productName}" x${addQty}. Giỏ hàng hiện có ${totalByNext} sản phẩm.`
        );

        return nextItems;
      });
    },
    [showSnackbar]
  );

  const removeItem = useCallback((id) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    setQuantities((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const [searchAnchor, setSearchAnchor] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPopper, setShowPopper] = useState(false);

  const [banners, setBanners] = useState(null);
  const [products, setProducts] = useState(null);

  // Scroll to top when switching tab
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleTabChange = useCallback((_, newValue) => {
    setActiveTab(newValue);
  }, []);

  const goHome = useCallback(() => {
    setActiveTab(0);

    // Khi đang ở tab 0 vẫn cần cuộn lên top nếu user đã scroll xuống
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadBanners = async () => {
      try {
        const res = await fetch("data/banners.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isActive) setBanners(data);
      } catch (err) {
        console.error("Lỗi khi tải banners.json:", err);
      }
    };

    loadBanners();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const res = await fetch("data/products.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isActive) setProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải products.json:", err);
      }
    };

    loadProducts();
    return () => {
      isActive = false;
    };
  }, []);

  const allProducts = useMemo(
    () => buildAllProducts(products ?? {}),
    [products]
  );

  useEffect(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      setSuggestions([]);
      setShowPopper(false);
      return;
    }

    const matched = allProducts
      .filter((p) => p._normName.includes(normalizedQuery))
      .slice(0, MAX_SUGGESTIONS);

    setSuggestions(matched);
    setShowPopper(matched.length > 0);
  }, [query, allProducts]);

  const handleSearchChange = useCallback((e) => {
    setQuery(e.target.value);
    setSearchAnchor(e.currentTarget);
  }, []);

  const handleSearchFocus = useCallback(
    (e) => {
      setSearchAnchor(e.currentTarget);
      if (suggestions.length) setShowPopper(true);
    },
    [suggestions.length]
  );

  const handleSearchBlur = useCallback(() => {
    // Giữ thời gian đóng để click gợi ý không bị mất
    setTimeout(() => setShowPopper(false), POPPER_CLOSE_DELAY_MS);
  }, []);

  // --- PRODUCT DIALOG ---
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productDialogData, setProductDialogData] = useState({
    name: "",
    item: null,
  });

  // --- CHECKOUT DIALOG ---
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const openCheckout = useCallback(({ items, quantities, subtotal }) => {
    setCheckoutData({ items, quantities, subtotal });
    setCheckoutOpen(true);
  }, []);

  const handleCheckoutSuccess = useCallback(
    (order) => {
      console.log("Đơn hàng mới:", order);

      // Reset giỏ hàng sau khi thanh toán thành công
      setCartItems([]);
      setQuantities({});
      setCheckoutOpen(false);

      showSnackbar("Thanh toán thành công!");
    },
    [showSnackbar]
  );

  const navItems = useMemo(
    () => [
      { label: "Trang chủ", value: 0, Icon: HomeIcon },
      { label: "Sản phẩm", value: 1, Icon: InventoryIcon },
      { label: "Blog", value: 2, Icon: BookIcon },
      { label: "Liên hệ", value: 3, Icon: CallIcon },
    ],
    []
  );

  const isLoading = !products || !banners;

  return (
    <ThemeProvider theme={theme}>
      <div style={APP_CONTAINER_STYLE}>
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
          {isLoading ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <>
              {activeTab === 0 && (
                <div style={TAB_SECTION_STYLE}>
                  <HomePage
                    products={products}
                    onAddToCart={addToCart}
                    tab={setActiveTab}
                    setCategoryTab={setCategoryTab}
                  />
                </div>
              )}

              {activeTab === 1 && (
                <div style={TAB_SECTION_STYLE}>
                  <ProductPage
                    products={products}
                    banners={banners}
                    onAddToCart={addToCart}
                    CategoryTab={categoryTab}
                    setCategoryTab={setCategoryTab}
                  />
                </div>
              )}

              {activeTab === 2 && (
                <div style={TAB_SECTION_STYLE}>
                  <Blog />
                </div>
              )}

              {activeTab === 3 && (
                <div style={TAB_SECTION_STYLE}>
                  <ContactPage />
                </div>
              )}

              <Footer tab={setActiveTab} />
            </>
          )}
        </Box>

        <div style={HEADER_WRAPPER_STYLE}>
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
            {!isSearchOpen ? (
              <Toolbar
                sx={{
                  p: 1,
                  gap: 2,
                  "@media (max-width:500px)": {
                    gap: 0,
                  },
                }}
              >
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
                      open={isDrawerOpen}
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
                        {navItems.map(({ label, value, Icon }) => (
                          <ListItem
                            key={value}
                            onClick={() => {
                              handleTabChange(null, value);
                              setIsDrawerOpen(false);
                            }}
                            sx={{ cursor: "pointer", gap: 2 }}
                          >
                            <ListItemText
                              primary={label}
                              sx={{ flexGrow: 1 }}
                            />
                            <Icon />
                          </ListItem>
                        ))}
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
                    gap: 1,
                    cursor: "pointer",
                  }}
                  aria-label="Về trang chủ"
                >
                  <Box
                    component="img"
                    src="images/branding/logo.png"
                    alt="Logo"
                    sx={{
                      height: 40,
                      "@media (max-width:500px)": {
                        height: "20",
                      },
                      "@media (max-width:350px)": {
                        display: "none",
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    component="div"
                    sx={{
                      color: "white",
                    }}
                  >
                    GreenFarm
                  </Typography>
                </Box>

                {!isMobile ? (
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="white"
                    indicatorColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {navItems.map(({ label, value }) => (
                      <Tab key={value} label={label} />
                    ))}
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
                  onClick={openCart}
                >
                  {isMobile ? (
                    <Badge badgeContent={cartTotalQty} color="success" showZero>
                      <ShoppingCartIcon />
                    </Badge>
                  ) : (
                    <ShoppingCartIcon />
                  )}

                  {!isMobile && (
                    <Typography>
                      Giỏ hàng (
                      {cartTotalQty <= MAX_CART_QTY_DISPLAY
                        ? cartTotalQty
                        : `${MAX_CART_QTY_DISPLAY}+`}
                      )
                    </Typography>
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
                      placeholder="Tìm sản phẩm..."
                      value={query}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                    />
                  </div>
                ) : (
                  <IconButton
                    color="inherit"
                    aria-label="search"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </Toolbar>
            ) : (
              <Toolbar sx={{ pl: 2, gap: 2 }}>
                <SearchIcon sx={{ color: "white" }} />
                <InputBase
                  autoFocus
                  placeholder="Tìm sản phẩm..."
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 2,
                    pl: 1,
                  }}
                />
                <IconButton
                  onClick={() => {
                    setIsSearchOpen(false);
                    setShowPopper(false);
                  }}
                  aria-label="Đóng tìm kiếm"
                >
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
          open={isCartOpen}
          handleClose={closeCart}
          onCheckout={(payload) => {
            // payload sẽ gồm: { items, quantities, subtotal }
            openCheckout(payload);
            closeCart(); // đóng giỏ hàng
          }}
        />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: "100%" }}>
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
            // Bổ sung name từ dialog để snackbar hiển thị đúng tên
            addToCart({ ...product, name: productDialogData.name }, qty);
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
