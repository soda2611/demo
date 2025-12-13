// product.js
import React, { useMemo, useState, useEffect, useRef } from "react";
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
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ProductCard from "../components/ProductCard";
import { useIsMobile } from "../hooks/isMobile";

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
  const isMobile = useIsMobile();

  // ---- Trạng thái UI bộ lọc ----
  const [tab, setTab] = useState(0); // Tab "Tất cả" + từng danh mục
  const [keyword, setKeyword] = useState(""); // Tìm theo tên/ mô tả
  const [onlySale, setOnlySale] = useState(false); // Chỉ hiển thị mặt hàng đang giảm (sale < price)
  const [priceRange, setPriceRange] = useState([0, 200000]); // Khoảng giá VND
  const [sortBy, setSortBy] = useState("default"); // Sắp xếp

  // Danh sách danh mục từ products
  const categories = useMemo(() => Object.keys(products || {}), [products]);
  const totalTabs = (categories?.length ?? 0) + 1;

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

  // --- SWIPE CONFIG & REFS ---
  const SWIPE_THRESHOLD = 50; // ngưỡng px để tính là vuốt
  const MIN_TAB = 0;
  const MAX_TAB = categories.length; // tab = 0..categories.length (0 = Tất cả)

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isTouching = useRef(false);

  const mouseStartX = useRef(null);
  const isDragging = useRef(false);

  // Mobile: touch handlers
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    isTouching.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isTouching.current) return;
    const t = e.touches[0];
    const dx = t.clientX - (touchStartX.current ?? t.clientX);
    const dy = t.clientY - (touchStartY.current ?? t.clientY);
    // Nếu chủ yếu vuốt ngang, hạn chế cuộn dọc mặc định cho mượt
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (!isTouching.current) return;
    const ct = e.changedTouches?.[0];
    const dx = (ct?.clientX ?? 0) - (touchStartX.current ?? 0);
    const dy = (ct?.clientY ?? 0) - (touchStartY.current ?? 0);

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && tab < MAX_TAB) {
        // Vuốt sang trái -> Next
        setTab((t) => Math.min(MAX_TAB, t + 1));
      } else if (dx > 0 && tab > MIN_TAB) {
        // Vuốt sang phải -> Prev
        setTab((t) => Math.max(MIN_TAB, t - 1));
      }
    }
    isTouching.current = false;
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Desktop: mouse drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    // Có thể thêm hiệu ứng kéo nếu muốn (parallax, translateX...), để trống cho nhẹ
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - (mouseStartX.current ?? e.clientX);
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && tab < MAX_TAB) {
        setTab((t) => Math.min(MAX_TAB, t + 1));
      } else if (dx > 0 && tab > MIN_TAB) {
        setTab((t) => Math.max(MIN_TAB, t - 1));
      }
    }
    isDragging.current = false;
    mouseStartX.current = null;
  };

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
      <Box
        key={tab > 0 ? categories[tab - 1] : "Sản phẩm"}
        sx={{
          backgroundColor: "primary.main",
          height: !isMobile ? 200 : 125,
          width: "100%",
          overflow: "hidden",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 5,
          position: "relative",
          userSelect: "none",
          touchAction: "pan-y",
          cursor: "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={
            tab > 0
              ? banners[`${categories[tab - 1]}`]
              : "images/branding/banner.jpg"
          }
          alt="Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            color: "white",
            textAlign: "center",
            padding: 0,
            borderRadius: 5,
            height: !isMobile ? 200 : 125,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <IconButton
            disabled={tab === 0}
            sx={{ color: "white", height: "100%", borderRadius: 0 }}
            onClick={() => setTab((t) => Math.max(0, t - 1))}
            aria-label="Danh mục trước"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>

          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", mb: 1, color: "white", flexGrow: 1, "@media (max-width:500px)": {fontSize: 24} }}
          >
            {tab > 0 ? categories[tab - 1] : "Tất cả sản phẩm"}
          </Typography>

          <IconButton
            disabled={tab === totalTabs - 1}
            sx={{ color: "white", height: "100%", borderRadius: 0 }}
            onClick={() => setTab((t) => Math.min(totalTabs - 1, t + 1))}
            aria-label="Danh mục tiếp theo"
          >
            <KeyboardArrowRightIcon />
          </IconButton>

          {/* Indicator dạng chấm */}
          <Box
            sx={{
              position: "absolute",
              bottom: !isMobile ? 8 : 6,
              transform: "translateX(-50%)",
              display: "flex",
              gap: !isMobile ? 1 : 0.75,
              px: 1,
              py: 0.5,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.3)",
              alignItems: "center",
              justifyContent: "center",
              "@media (max-width:240px)": { display: "none" },
              "@media (max-width:500px)": { transform: "scale(0.7)" },
              "@media (min-width:500px)": { left: "50%" }
            }}
          >
            {Array.from({ length: totalTabs }).map((_, i) => {
              const isActive = i === tab;
              return (
                <Box
                  key={`dot-${i}`}
                  role="button"
                  aria-label={
                    i === 0
                      ? "Chuyển tới tab Tất cả"
                      : `Chuyển tới tab ${categories[i - 1]}`
                  }
                  tabIndex={0}
                  onClick={() => setTab(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setTab(i);
                  }}
                  sx={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    borderRadius: "50%",
                    bgcolor: isActive ? "white" : "rgba(255,255,255,0.5)",
                    outline: "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: isActive ? "white" : "rgba(255,255,255,0.75)",
                      transform: isActive ? "scale(1.05)" : "scale(1.1)",
                    },
                    "&:focus-visible": {
                      boxShadow: "0 0 0 2px rgba(255,255,255,0.8)",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

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
