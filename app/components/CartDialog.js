// app/components/CartDialog.js
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Box,
  DialogContent,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

import NumberSpinner from "./NumberSpinner";
import { useIsMobile } from "../hooks/isMobile";

const DIALOG_MIN_WIDTH = { mobile: 300, desktop: 800 };
const CART_LIST_HEIGHT = 400;

function getUnitPrice(item) {
  return item?.displayPrice ?? item?.sale ?? item?.price ?? 0;
}

function getItemQty(item, quantities) {
  return quantities?.[item.id] ?? item.quantity ?? 1;
}

function truncateName(name, isMobile) {
  if (!isMobile) return String(name ?? "");
  const value = String(name ?? "");
  return value.length > 5 ? `${value.substring(0, 5)}...` : value;
}

export default function CartDialog({
  open,
  handleClose,
  items = [],
  quantities,
  setQuantities,
  setCartItems,
  onRemove,
  onCheckout,
}) {
  const isMobile = useIsMobile();

  // Đồng bộ quantities nếu thiếu key theo item.id
  useEffect(() => {
    if (!setQuantities) return;

    setQuantities((prev) => {
      const next = { ...(prev || {}) };
      items.forEach((it) => {
        if (next[it.id] == null) next[it.id] = it.quantity ?? 1;
      });
      return next;
    });
  }, [items, setQuantities]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = getUnitPrice(it);
      const q = getItemQty(it, quantities);
      return sum + unit * q;
    }, 0);
  }, [items, quantities]);

  const totalQty = useMemo(() => {
    return items.reduce((sum, it) => sum + getItemQty(it, quantities), 0);
  }, [items, quantities]);

  const setQuantity = useCallback(
    (id, newValue) => {
      if (!setQuantities) return;

      let parsed = Number(newValue);
      if (!Number.isFinite(parsed)) parsed = quantities?.[id] ?? 1;
      parsed = Math.floor(parsed);

      const minOfItem = items.find((it) => it.id === id)?.min ?? 1;
      if (parsed < minOfItem) parsed = minOfItem;

      setQuantities((prev) => ({ ...(prev || {}), [id]: parsed }));

      // Cập nhật luôn quantity trong items để giữ nguyên luồng hiện tại
      setCartItems?.((prev) =>
        prev.map((it) => (it.id === id ? { ...it, quantity: parsed } : it))
      );
    },
    [items, quantities, setCartItems, setQuantities]
  );

  const handleDelete = useCallback(
    (id) => {
      if (onRemove) {
        onRemove(id);
        return;
      }

      // Fallback nếu không truyền onRemove
      setCartItems?.((prev) => prev.filter((it) => it.id !== id));
      setQuantities?.((prev) => {
        const next = { ...(prev || {}) };
        delete next[id];
        return next;
      });
    },
    [onRemove, setCartItems, setQuantities]
  );

  const handleCheckout = useCallback(() => {
    if (!items.length) return;

    onCheckout?.({ items, quantities, subtotal });
    handleClose?.();
  }, [handleClose, items, onCheckout, quantities, subtotal]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ShoppingCartIcon sx={{ color: "#1faa54ff" }} />
        <b>Giỏ hàng</b>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: isMobile ? DIALOG_MIN_WIDTH.mobile : DIALOG_MIN_WIDTH.desktop,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
            width: isMobile ? DIALOG_MIN_WIDTH.mobile : DIALOG_MIN_WIDTH.desktop,
            height: CART_LIST_HEIGHT,
            borderRadius: 2,
            backgroundColor: "#f1f1f1",
            overflowY: "auto",
          }}
        >
          {items.length === 0 ? (
            <Typography
              align="center"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              <ShoppingCartIcon sx={{ color: "#1faa54ff" }} />
              Giỏ hàng đang trống
            </Typography>
          ) : (
            items.map((item) => {
              const unitPrice = getUnitPrice(item);
              const qty = getItemQty(item, quantities);
              const lineTotal = unitPrice * qty;
              const hasSale = item.sale != null && item.sale !== item.price;

              return (
                <Box
                  key={item.id}
                  sx={{
                    mb: 1,
                    borderRadius: 5,
                    bgcolor: "#fafafa",
                    p: 2,
                    boxShadow: "10px 10px 20px #303030aa",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: isMobile ? "center" : "space-between",
                      alignItems: "center",
                      width: "100%",
                      gap: 1.25,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.img}
                      alt={item.name}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 5,
                      }}
                    />

                    <Typography sx={{ flexGrow: 1 }}>
                      <strong>{truncateName(item.name, isMobile)}</strong>
                      {" — "}
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--mui-palette-primary-main, #1faa54)",
                        }}
                      >
                        {unitPrice.toLocaleString("vi-VN")}₫
                      </span>
                      {hasSale && (
                        <>
                          {" "}
                          <span style={{ color: "gray", textDecoration: "line-through" }}>
                            {item.price?.toLocaleString("vi-VN")}₫
                          </span>
                        </>
                      )}
                      <br />
                      {"  ·  Thành tiền: "}
                      <span style={{ fontWeight: 700 }}>
                        {lineTotal.toLocaleString("vi-VN")}₫
                      </span>
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.25,
                      }}
                    >
                      <NumberSpinner
                        min={item.min ?? 1}
                        size="small"
                        value={qty}
                        onChange={(n) => setQuantity(item.id, n)}
                      />
                      <DeleteIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(item.id)}
                      />
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            mt: 2,
            p: 2,
            borderRadius: 2,
            border: "1px solid lightgray",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "left", flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 700, textAlign: "left" }}>
              Tổng số lượng: {totalQty}
            </Typography>
            <Typography sx={{ fontWeight: 700, textAlign: "left" }}>
              Thành tiền: {subtotal.toLocaleString("vi-VN")}₫
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "left" : "center",
              gap: 1,
            }}
          >
            <IconButton
              sx={{
                fontSize: 14,
                borderRadius: 2.5,
                backgroundColor: "white",
                border: "1px solid #1faa54ff",
                color: "primary.main",
                gap: 0.5,
              }}
              onClick={handleClose}
            >
              <Typography>Tiếp tục mua sắm</Typography>
            </IconButton>

            <IconButton
              sx={{
                fontSize: 14,
                borderRadius: 2.5,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.light" },
                gap: 0.5,
              }}
              onClick={handleCheckout}
            >
              <ShoppingBagIcon />
              <Typography>Thanh toán</Typography>
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
