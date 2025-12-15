// app/components/ProductCard.js
import React, { useCallback, useMemo, useState } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ProductDialog from "./ProductDialog";

const CARD_WIDTH = 250;
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT_RATIO = 0.6;

const CARD_SX = {
  backgroundColor: "#f1f1f1",
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  borderRadius: 2.5,
  border: "2px solid #37be3cff",
  boxShadow: "10px 10px 20px #303030aa",
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": { transform: "scale(1.1)" },
};

const IMAGE_WRAP_STYLE = {
  backgroundColor: "#e0e0e0",
  width: "100%",
  height: `${IMAGE_HEIGHT_RATIO * 100}%`,
  overflow: "hidden",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
};

const PRODUCT_IMAGE_SX = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "0.3s",
  "&:hover": { transform: "scale(1.2)" },
};

function truncateText(text, maxLen, suffix = "...") {
  const value = String(text ?? "");
  return value.length > maxLen ? `${value.substring(0, maxLen)}${suffix}` : value;
}

function formatVnd(value) {
  return value?.toLocaleString("vi-VN");
}

function hasDiscount(item) {
  // Giữ hành vi hiển thị: sale khác price thì xem là giảm giá
  const sale = formatVnd(item?.sale);
  const price = formatVnd(item?.price);
  return sale != null && price != null && sale !== price;
}

function discountPercent(item) {
  const sale = Number(item?.sale);
  const price = Number(item?.price);
  if (!Number.isFinite(sale) || !Number.isFinite(price) || price <= 0) return 0;
  return 100 - (sale / price) * 100;
}

export default function ProductCard({ name, item, onAddToCart }) {
  const [open, setOpen] = useState(false);

  const isOnSale = useMemo(() => hasDiscount(item), [item]);
  const displayName = useMemo(() => truncateText(name, 16), [name]);
  const displayDesc = useMemo(() => {
    const base = item?.shortDescription ?? "";
    return isOnSale ? truncateText(base, 20) : truncateText(base, 22);
  }, [item, isOnSale]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleQuickAdd = useCallback(
    (e) => {
      e.stopPropagation(); // không mở dialog khi bấm icon
      onAddToCart?.(item, 1);
    },
    [onAddToCart, item]
  );

  return (
    <>
      <ProductDialog
        name={name}
        item={item}
        open={open}
        handleClose={handleClose}
        onAddToCart={(product, qty) => {
          onAddToCart?.(product, qty);
          handleClose();
        }}
      />

      <Box onClick={handleOpen} sx={CARD_SX}>
        <div style={IMAGE_WRAP_STYLE}>
          <Box component="img" src={item?.img} alt={name} sx={PRODUCT_IMAGE_SX} />
        </div>

        <Box sx={{ padding: 2, height: `${(1 - IMAGE_HEIGHT_RATIO) * 100}%` }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {displayName}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
            {displayDesc}
          </Typography>

          {isOnSale ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {formatVnd(item?.sale)}₫
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{ fontWeight: "bold", color: "gray", textDecoration: "line-through" }}
              >
                {formatVnd(item?.price)}₫
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {formatVnd(item?.price)}₫
              </Typography>
            </Box>
          )}
        </Box>

        {isOnSale ? (
          <>
            <Box
              sx={{
                position: "relative",
                top: -385,
                left: 180,
                fontWeight: "bold",
                color: "white",
                backgroundColor: "primary.main",
                padding: 0.5,
                borderRadius: 2,
                fontSize: 12,
                textAlign: "center",
                width: 55,
              }}
            >
              -{discountPercent(item).toFixed(1)}%
            </Box>

            <IconButton
              sx={{ position: "relative", bottom: 70, right: -205 }}
              aria-label="add-to-cart"
              onClick={handleQuickAdd}
            >
              <ShoppingCartIcon />
            </IconButton>

            <IconButton
              sx={{ position: "relative", top: -415, left: -35, backdropFilter: "blur(10px)" }}
              aria-label="favorite"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              sx={{ position: "relative", bottom: 45, right: -205 }}
              aria-label="add-to-cart"
              onClick={handleQuickAdd}
            >
              <ShoppingCartIcon />
            </IconButton>

            <IconButton
              sx={{ position: "relative", top: -390, left: -35, backdropFilter: "blur(10px)" }}
              aria-label="favorite"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </>
        )}
      </Box>
    </>
  );
}
