// app/components/ProductDialog.js
import React, { useCallback, useMemo, useState } from "react";
import { Box, DialogContent, Dialog, Typography, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NumberSpinner from "./NumberSpinner";
import { useIsMobile } from "../hooks/isMobile";

const IMAGE_SX = {
  width: 300,
  height: 400,
  objectFit: "cover",
  borderRadius: 2,
  border: "1px solid black",
};

const ADD_BUTTON_SX = {
  fontSize: 14,
  borderRadius: 2.5,
  backgroundColor: "primary.main",
  color: "white",
  "&:hover": { backgroundColor: "primary.light" },
};

function toSafeQty(value) {
  const qty = Number(value);
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.floor(qty));
}

export default function ProductDialog({ name, item, open, handleClose, onAddToCart }) {
  const isMobile = useIsMobile();
  const [qty, setQty] = useState(1);

  const hasDiscount = useMemo(() => item?.sale !== item?.price, [item]);
  const discountText = useMemo(() => {
    if (!hasDiscount) return null;
    const sale = Number(item?.sale);
    const price = Number(item?.price);
    if (!Number.isFinite(sale) || !Number.isFinite(price) || price <= 0) return null;
    return `-${(100 - (sale / price) * 100).toFixed(1)}%`;
  }, [item, hasDiscount]);

  const handleQtyChange = useCallback((v) => setQty(toSafeQty(v)), []);

  const handleAddClick = useCallback(() => {
    if (!item) return; // edge case: dữ liệu chưa sẵn sàng
    onAddToCart?.(item, qty);
  }, [onAddToCart, item, qty]);

  if (!item) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogContent
        sx={{
          display: "flex",
          gap: isMobile ? 2 : 5,
          minWidth: isMobile ? undefined : 800,
          flexDirection: isMobile ? "column" : undefined,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Box component="img" src={item.img} sx={IMAGE_SX} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: 400,
            borderRadius: 2,
            gap: 2,
            overflowY: !isMobile ? "auto" : undefined,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            {name}
          </Typography>

          <Typography variant={isMobile ? "body2" : "h6"} color="text.secondary">
            {item.shortDescription}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {item.sale?.toLocaleString("vi-VN")}₫
            </Typography>

            {hasDiscount && (
              <>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  component="div"
                  sx={{ fontWeight: "bold", color: "gray", textDecoration: "line-through" }}
                >
                  {item.price?.toLocaleString("vi-VN")}₫
                </Typography>

                {discountText && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ background: "pink", borderRadius: 1, padding: 0.5 }}
                  >
                    {discountText}
                  </Typography>
                )}
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", width: 200, gap: 1.5 }}>
            <NumberSpinner
              label="Số lượng"
              min={1}
              size="small"
              value={qty}
              onChange={handleQtyChange}
            />

            <IconButton color="inherit" aria-label="cart" sx={ADD_BUTTON_SX} onClick={handleAddClick}>
              <ShoppingCartIcon />
              <Typography>Thêm vào giỏ hàng</Typography>
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Thông tin sản phẩm
          </Typography>
          <Typography variant="body1">{item.description}</Typography>

          {isMobile && <br />}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
