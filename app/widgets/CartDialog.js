// widgets/CartDialog.js
import React, { useMemo, useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import {
  Box,
  DialogContent,
  Dialog,
  Typography,
  useMediaQuery,
  IconButton,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import NumberSpinner from "./NumberSpinner";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartDialog({
  open,
  handleClose,
  items = [],
  quantities,
  setQuantities,
  setCartItems,
  onRemove,
}) {
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

  useEffect(() => {
    if (!setQuantities) return;
    setQuantities((prev) => {
      const next = { ...prev };
      items.forEach((it) => {
        if (next[it.id] == null) next[it.id] = it.quantity ?? 1;
      });
      return next;
    });
  }, [items, setQuantities]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const setQuantity = (id, newValue) => {
    if (!setQuantities) return;
    const parsed = Number(newValue);
    setQuantities((prev) => ({
      ...prev,
      [id]: Number.isNaN(parsed) ? prev[id] ?? 1 : parsed,
    }));
  };

  const handleDelete = (id) => {
    if (onRemove) {
      onRemove(id);
    } else if (setCartItems) {
      setCartItems((prev) => prev.filter((it) => it.id !== id));
      setQuantities?.((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleCheckout = () => {
    const totalQty = items.reduce(
      (sum, it) => sum + (quantities?.[it.id] ?? it.quantity ?? 1),
      0
    );
    const msg = `Thanh toán thành công`;
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
    
    setCartItems?.(() => []);
    setQuantities?.(() => ({})); 

  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const subtotal = items.reduce((sum, it) => {
    const unit = it.displayPrice ?? it.sale ?? it.price ?? 0;
    const q = quantities?.[it.id] ?? it.quantity ?? 1;
    return sum + unit * q;
  }, 0);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
        <DialogTitle>Giỏ hàng</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: isMobile ? 300 : 800,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              width: isMobile ? 300 : 800,
              height: 400,
              borderRadius: 2,
              border: "1px solid black",
              overflowY: "auto",
            }}
          >
            {items.length === 0 ? (
              <Typography align="center">Giỏ hàng đang trống</Typography>
            ) : (
              items.map((item) => {
                const unitPrice =
                  item.displayPrice ?? item.sale ?? item.price ?? 0;
                const hasSale = item.sale != null && item.sale !== item.price;

                const qty = quantities?.[item.id] ?? item.quantity ?? 1;

                const lineTotal = unitPrice * qty;

                return (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography sx={{ flexGrow: 1 }}>
                        <strong>{item.name}</strong>
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
                            <span
                              style={{
                                color: "gray",
                                textDecoration: "line-through",
                              }}
                            >
                              {item.price?.toLocaleString("vi-VN")}₫
                            </span>
                          </>
                        )}
                        {isMobile && <br />}
                        {"  ·  Thành tiền: "}
                        <span style={{ fontWeight: 700 }}>
                          {lineTotal.toLocaleString("vi-VN")}₫
                        </span>
                      </Typography>

                      <DeleteIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                    <NumberSpinner
                      min={item.min ?? 1}
                      max={item.max ?? 40}
                      size="small"
                      value={qty}
                      onChange={(n) => setQuantity(item.id, n)}
                    />
                  </Box>
                );
              })
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
            <Typography sx={{ fontWeight: 700, textAlign: "right" }}>
              Tổng thanh toán: {subtotal.toLocaleString("vi-VN")}₫
            </Typography>
            <IconButton
              color="inherit"
              aria-label="cart"
              sx={{
                fontSize: 14,
                borderRadius: 2.5,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.light" },
              }}
              onClick={handleCheckout}
            >
              <ShoppingBagIcon />
              <Typography>Thanh toán</Typography>
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
