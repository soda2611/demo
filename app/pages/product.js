// product.js
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme } from "@mui/material/styles";
import ProductCard from "../widgets/ProductCard";

// Helper: chuyển object {category: {name: item}} -> mảng dễ lọc
const flattenProducts = (productsObj) => {
  const out = [];
  Object.entries(productsObj || {}).forEach(([category, items]) => {
    Object.entries(items || {}).forEach(([name, item]) => {
      out.push({ category, name, item });
    });
  });
  return out;
};

// Helper: định dạng tiền VND ngắn gọn
const formatVND = (v) =>
  (v ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function ProductPage({ products = {}, banners, onAddToCart }) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#1faa54ff", light: "#37be3cff" },
          secondary: { main: "#ebff38ff" },
          text: { primary: "#000000" },
        },
        typography: {
          fontFamily: "Coiny, Roboto, Arial, sans-serif",
          h4: { fontWeight: 700 },
        },
        spacing: 8,
      }),
    []
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ---- Trạng thái UI bộ lọc ----
  const [tab, setTab] = useState(0); // Tab "Tất cả" + từng danh mục
  const [keyword, setKeyword] = useState(""); // Tìm theo tên/ mô tả
  const [onlySale, setOnlySale] = useState(false); // Chỉ hiển thị mặt hàng đang giảm (sale < price)
  const [priceRange, setPriceRange] = useState([0, 200000]); // Khoảng giá VND
  const [sortBy, setSortBy] = useState("default"); // Sắp xếp

  // Danh sách danh mục từ products
  const categories = useMemo(() => Object.keys(products || {}), [products]);

  // Dữ liệu phẳng để lọc
  const flat = useMemo(() => flattenProducts(products), [products]);

  // Tự động xác định min-max giá để slider hợp lý
  const [minPrice, maxPrice] = useMemo(() => {
    if (!flat.length) return [0, 0];
    const prices = flat.map((p) => p.item?.sale ?? p.item?.price ?? 0);
    return [Math.min(...prices), Math.max(...prices)];
  }, [flat]);

  // Khi dữ liệu/giá trị min-max thay đổi, hiệu chỉnh priceRange nếu cần
  useEffect(() => {
    if (priceRange[0] < minPrice || priceRange[1] > maxPrice) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Lọc theo bộ tiêu chí ----
  const filtered = useMemo(() => {
    // 1) Theo danh mục (tab = 0: tất cả; >0: theo category)
    const currentCategory = tab === 0 ? null : categories[tab - 1] ?? null;

    let list = flat.filter((p) =>
      !currentCategory ? true : p.category === currentCategory
    );

    // 2) Từ khóa (name + shortDescription + description)
    const kw = keyword.trim().toLowerCase();
    if (kw) {
      list = list.filter(({ name, item }) => {
        const hay = `${name} ${item?.shortDescription ?? ""} ${
          item?.description ?? ""
        }`.toLowerCase();
        return hay.includes(kw);
      });
    }

    // 3) Chỉ hàng giảm giá
    if (onlySale) {
      list = list.filter(({ item }) => {
        const price = item?.price ?? 0;
        const sale = item?.sale ?? price;
        return sale >= 0 && sale < price;
      });
    }

    // 4) Khoảng giá (dựa vào giá hiển thị: nếu có sale thì dùng sale)
    list = list.filter(({ item }) => {
      const shown = item?.sale ?? item?.price ?? 0;
      return shown >= priceRange[0] && shown <= priceRange[1];
    });

    // 5) Sắp xếp
    const comp = (a, b) => 0;
    switch (sortBy) {
      case "priceAsc":
        list.sort(
          (a, b) =>
            (a.item?.sale ?? a.item?.price ?? 0) -
            (b.item?.sale ?? b.item?.price ?? 0)
        );
        break;
      case "priceDesc":
        list.sort(
          (a, b) =>
            (b.item?.sale ?? b.item?.price ?? 0) -
            (a.item?.sale ?? a.item?.price ?? 0)
        );
        break;
      case "nameAsc":
        list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      case "nameDesc":
        list.sort((a, b) => b.name.localeCompare(a.name, "vi"));
        break;
      case "discountDesc":
        // sắp xếp theo % giảm (cao -> thấp)
        list.sort((a, b) => {
          const pa = a.item?.price ?? 0;
          const sa = a.item?.sale ?? pa;
          const pb = b.item?.price ?? 0;
          const sb = b.item?.sale ?? pb;
          const da = pa > 0 ? 1 - sa / pa : 0;
          const db = pb > 0 ? 1 - sb / pb : 0;
          return db - da;
        });
        break;
      default:
        break; // giữ nguyên
    }

    return list;
  }, [flat, tab, categories, keyword, onlySale, priceRange, sortBy]);

  const shouldCenter = useMemo(() => categories.length <= 5, [categories]);

  // ---- Render ----
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Sản phẩm
      </Typography>

      {/* Tabs danh mục */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ mb: 2, width: isMobile ? "100%" : undefined }}
      >
        <Tab label="Tất cả" />
        {categories.map((c) => (
          <Tab key={c} label={c} />
        ))}
      </Tabs>

      {tab > 0 && banners?.[categories[tab - 1]] ? (
        <>
          <Box
            key={tab > 0 ? categories[tab - 1] : "Sản phẩm"}
            sx={{
              backgroundColor: "primary.main",
              height: !isMobile ? 200 : 100,
              width: !isMobile ? "70%" : "100%",
              overflow: "hidden",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 5,
            }}
          >
            <img
              src={banners[`${categories[tab - 1]}`]}
              alt="Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                color: "white",
                textAlign: "center",
                padding: 2,
                borderRadius: 5,
                height: !isMobile ? 200 : 100,
                width: !isMobile ? "56%" : "80%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold", marginBottom: 1, color: "white" }}
              >
                {categories[tab - 1]}
              </Typography>
            </Box>
          </Box>
        </>
      ) : null}

      {/* Khu vực bộ lọc */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile && "column",
          gap: 2,
          mb: 5,
          alignItems: "center",
        }}
      >
        {/* Tìm kiếm */}
        <TextField
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm sản phẩm (tên, mô tả)..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Chỉ hàng giảm giá */}
        <FormControlLabel
          control={
            <Checkbox
              checked={onlySale}
              onChange={(e) => setOnlySale(e.target.checked)}
            />
          }
          label="Hàng đang giảm giá"
        />

        {!isMobile && (
          <Box
            component="hr"
            sx={{
              border: "none",
              width: "2px",
              height: 24,
              bgcolor: "black",
              mr: 2,
              display: "inline-block",
            }}
          />
        )}

        {/* Sắp xếp */}
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          displayEmpty
        >
          <MenuItem value="default">Mặc định</MenuItem>
          <MenuItem value="priceAsc">Giá ↑</MenuItem>
          <MenuItem value="priceDesc">Giá ↓</MenuItem>
          <MenuItem value="nameAsc">Tên A–Z</MenuItem>
          <MenuItem value="nameDesc">Tên Z–A</MenuItem>
          <MenuItem value="discountDesc">% giảm ↓</MenuItem>
        </Select>

        {/* Khoảng giá */}
        <Box sx={{ px: 1 }}>
          <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
            Khoảng giá: {formatVND(priceRange[0])}₫ – {formatVND(priceRange[1])}
            ₫
          </Typography>
          <Slider
            value={priceRange}
            min={minPrice}
            max={maxPrice}
            step={1000}
            onChange={(_, v) => setPriceRange(v)}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      {/* Lưới sản phẩm */}
      <Box
        sx={{
          width: "100%",
          mb: 15,
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 250px)",
          gap: 5,
          justifyContent: "center",
        }}
      >
        {filtered.map(({ category, name, item }) => (
          <ProductCard
            key={`${category}__${name}`}
            name={name}
            item={item}
            // FIX: gắn name vào object product trước khi gọi lên trên
            onAddToCart={(product, qty) => {
              // product ở đây thường là `item` từ ProductDialog
              // Ta chuẩn hóa lại để luôn có `name`
              const normalized = { name, ...product };
              onAddToCart?.(normalized, qty);
            }}
          />
        ))}
      </Box>

      {/* Trạng thái rỗng */}
      {filtered.length === 0 && (
        <Box sx={{ py: 6, textAlign: "center", opacity: 0.7 }}>
          <Typography>Không tìm thấy sản phẩm phù hợp bộ lọc.</Typography>
        </Box>
      )}
    </Box>
  );
}
