//app/features/ProductSection.js
import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ProductCard from "../components/ProductCard";
import { useIsMobile } from "../hooks/isMobile";

const SWIPE_THRESHOLD_PX = 50;
const SLIDER_STEP = 1000;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function flattenProducts(productsObj = {}) {
  const out = [];
  Object.entries(productsObj).forEach(([category, items]) => {
    Object.entries(items || {}).forEach(([name, item]) => {
      out.push({ category, name, item });
    });
  });
  return out;
}

function formatVND(v) {
  return (v ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });
}

function getShownPrice(item) {
  return item?.sale ?? item?.price ?? 0;
}

function getDiscountRatio(item) {
  const price = item?.price ?? 0;
  const sale = item?.sale ?? price;
  if (price <= 0) return 0;
  return 1 - sale / price;
}

export default function ProductPage({
  products = {},
  banners,
  onAddToCart,
  CategoryTab,
  setCategoryTab,
}) {
  const isMobile = useIsMobile();

  // ---- Filter states ----
  const [keyword, setKeyword] = useState("");
  const [onlySale, setOnlySale] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => Object.keys(products || {}), [products]);
  const totalTabs = categories.length + 1;
  const minTab = 0;
  const maxTab = categories.length;

  const flat = useMemo(() => flattenProducts(products), [products]);

  const [minPrice, maxPrice] = useMemo(() => {
    if (!flat.length) return [0, 0];
    const prices = flat.map((p) => getShownPrice(p.item));
    return [Math.min(...prices), Math.max(...prices)];
  }, [flat]);

  useEffect(() => {
    if (priceRange[0] < minPrice || priceRange[1] > maxPrice) {
      setPriceRange([minPrice, maxPrice]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const goTab = useCallback(
    (next) => setCategoryTab?.((t) => clamp(next ?? t, minTab, maxTab)),
    [setCategoryTab, minTab, maxTab]
  );

  const goPrev = useCallback(() => {
    setCategoryTab?.((t) => clamp(t - 1, minTab, maxTab));
  }, [setCategoryTab, minTab, maxTab]);

  const goNext = useCallback(() => {
    setCategoryTab?.((t) => clamp(t + 1, minTab, maxTab));
  }, [setCategoryTab, minTab, maxTab]);

  const filtered = useMemo(() => {
    const currentCategory = CategoryTab === 0 ? null : categories[CategoryTab - 1] ?? null;

    let list = currentCategory
      ? flat.filter((p) => p.category === currentCategory)
      : [...flat];

    const kw = keyword.trim().toLowerCase();
    if (kw) {
      list = list.filter(({ name, item }) => {
        const hay = `${name} ${item?.shortDescription ?? ""} ${item?.description ?? ""}`.toLowerCase();
        return hay.includes(kw);
      });
    }

    if (onlySale) {
      list = list.filter(({ item }) => {
        const price = item?.price ?? 0;
        const sale = item?.sale ?? price;
        return sale >= 0 && sale < price;
      });
    }

    list = list.filter(({ item }) => {
      const shown = getShownPrice(item);
      return shown >= priceRange[0] && shown <= priceRange[1];
    });

    switch (sortBy) {
      case "priceAsc":
        list.sort((a, b) => getShownPrice(a.item) - getShownPrice(b.item));
        break;
      case "priceDesc":
        list.sort((a, b) => getShownPrice(b.item) - getShownPrice(a.item));
        break;
      case "nameAsc":
        list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      case "nameDesc":
        list.sort((a, b) => b.name.localeCompare(a.name, "vi"));
        break;
      case "discountDesc":
        list.sort((a, b) => getDiscountRatio(b.item) - getDiscountRatio(a.item));
        break;
      default:
        break;
    }

    return list;
  }, [flat, CategoryTab, categories, keyword, onlySale, priceRange, sortBy]);

  // ---- Swipe / Drag refs ----
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isTouching = useRef(false);

  const mouseStartX = useRef(null);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    isTouching.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isTouching.current) return;

    const t = e.touches[0];
    const dx = t.clientX - (touchStartX.current ?? t.clientX);
    const dy = t.clientY - (touchStartY.current ?? t.clientY);

    // Nếu chủ yếu vuốt ngang thì chặn cuộn dọc để mượt hơn
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isTouching.current) return;

      const ct = e.changedTouches?.[0];
      const dx = (ct?.clientX ?? 0) - (touchStartX.current ?? 0);
      const dy = (ct?.clientY ?? 0) - (touchStartY.current ?? 0);

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD_PX) {
        if (dx < 0) goNext();
        if (dx > 0) goPrev();
      }

      isTouching.current = false;
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [goNext, goPrev]
  );

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    mouseStartX.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(
    (e) => {
      if (!isDragging.current) return;

      const dx = e.clientX - (mouseStartX.current ?? e.clientX);
      if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
        if (dx < 0) goNext();
        if (dx > 0) goPrev();
      }

      isDragging.current = false;
      mouseStartX.current = null;
    },
    [goNext, goPrev]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "80%", alignItems: "center" }}>
      {/* Banner + swipe */}
      <Box
        key={CategoryTab > 0 ? categories[CategoryTab - 1] : "Sản phẩm"}
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
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={
            CategoryTab > 0 ? banners?.[categories[CategoryTab - 1]] : "images/branding/banner.jpg"
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
            borderRadius: 5,
            height: !isMobile ? 200 : 125,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <IconButton
            disabled={CategoryTab === 0}
            sx={{ color: "white", height: "100%", borderRadius: 0 }}
            onClick={goPrev}
            aria-label="Danh mục trước"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography
              onClick={() => goTab(CategoryTab - 1)}
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "#ffffff6c",
                textAlign: "right",
                width: "26%",
                cursor: "pointer",
                "@media (max-width:500px)": { fontSize: 14, textAlign: "center" },
              }}
            >
              {CategoryTab > 0 && (CategoryTab > 1 ? categories[CategoryTab - 2] : "Tất cả")}
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "white",
                width: "48%",
                "@media (max-width:500px)": { fontSize: 24 },
              }}
            >
              {CategoryTab > 0 ? categories[CategoryTab - 1] : "Tất cả"}
            </Typography>

            <Typography
              onClick={() => goTab(CategoryTab + 1)}
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "#ffffff6c",
                textAlign: "left",
                width: "26%",
                cursor: "pointer",
                "@media (max-width:500px)": { fontSize: 14, textAlign: "center" },
              }}
            >
              {CategoryTab < maxTab && categories[CategoryTab]}
            </Typography>
          </Box>

          <IconButton
            disabled={CategoryTab === totalTabs - 1}
            sx={{ color: "white", height: "100%", borderRadius: 0 }}
            onClick={goNext}
            aria-label="Danh mục tiếp theo"
          >
            <KeyboardArrowRightIcon />
          </IconButton>

          {/* Dots */}
          <Box
            sx={{
              position: "absolute",
              bottom: !isMobile ? 8 : 6,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: !isMobile ? 1 : 0.75,
              px: 1,
              py: 0.5,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.3)",
              "@media (max-width:240px)": { display: "none" },
              "@media (max-width:500px)": { transform: "translateX(-50%) scale(0.7)" },
            }}
          >
            {Array.from({ length: totalTabs }).map((_, i) => {
              const isActive = i === CategoryTab;
              return (
                <Box
                  key={`dot-${i}`}
                  role="button"
                  tabIndex={0}
                  aria-label={i === 0 ? "Chuyển tới tab Tất cả" : `Chuyển tới tab ${categories[i - 1]}`}
                  onClick={() => goTab(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goTab(i);
                  }}
                  sx={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    borderRadius: "50%",
                    bgcolor: isActive ? "white" : "rgba(255,255,255,0.5)",
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

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "right",
          gap: 2,
          mb: 5,
        }}
      >
        <TextField
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={isMobile ? "Tìm sản phẩm" : "Tìm sản phẩm (tên, mô tả)..."}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={<Checkbox checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} />}
          label="Hàng đang giảm giá"
        />

        {!isMobile && (
          <Box
            component="hr"
            sx={{ border: "none", width: "2px", height: 24, bgcolor: "black", mr: 2 }}
          />
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select size="small" value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty>
            <MenuItem value="default">Mặc định</MenuItem>
            <MenuItem value="priceAsc">Giá ↑</MenuItem>
            <MenuItem value="priceDesc">Giá ↓</MenuItem>
            <MenuItem value="nameAsc">Tên A–Z</MenuItem>
            <MenuItem value="nameDesc">Tên Z–A</MenuItem>
            <MenuItem value="discountDesc">% giảm ↓</MenuItem>
          </Select>

          <Box sx={{ px: 1 }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
              Khoảng giá: {formatVND(priceRange[0])}₫ – {formatVND(priceRange[1])}₫
            </Typography>
            <Slider
              value={priceRange}
              min={minPrice}
              max={maxPrice}
              step={SLIDER_STEP}
              onChange={(_, v) => setPriceRange(v)}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      </Box>

      {/* Grid products */}
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
            onAddToCart={(product, qty) => {
              // FIX nghiệp vụ snackbar/giỏ: luôn đảm bảo có `name` khi gọi lên trên
              onAddToCart?.({ name, ...product }, qty);
            }}
          />
        ))}
      </Box>

      {filtered.length === 0 && (
        <Box sx={{ py: 6, textAlign: "center", opacity: 0.7 }}>
          <Typography>Không tìm thấy sản phẩm phù hợp bộ lọc.</Typography>
        </Box>
      )}
    </Box>
  );
}
