import React, { useState } from "react";
import { createTheme } from "@mui/material/styles";
import {
  Box,
  DialogContent,
  Dialog,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import NumberSpinner from "./NumberSpinner";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductDialog({
  name,
  item,
  open,
  handleClose,
  onAddToCart,
}) {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1faa54ff", light: "#37be3cff" },
      secondary: { main: "#ebff38ff" },
      text: { primary: "#000000" },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h4: { fontWeight: 700 },
    },
    spacing: 8,
  });
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Controlled số lượng
  const [qty, setQty] = useState(1);
  const handleQtyChange = (v) => setQty(Number(v) || 1);

  const handleAddClick = () => {
    onAddToCart?.(item, qty);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
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
        <Box
          component={"img"}
          src={item["img"]}
          sx={{
            width: 300,
            height: 400,
            objectFit: "cover",
            borderRadius: 2,
            border: "1px solid black",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: 400,
            borderRadius: 2,
            gap: 2,
            overflowY: !isMobile ? 'auto' : undefined
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{name}</Typography>

          <Typography
            variant={isMobile ? "body2" : "h6"}
            color="text.secondary"
          >
            {item["shortDescription"]}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {item["sale"]?.toLocaleString("vi-VN")}₫
            </Typography>

            {item["sale"]!=item["price"] && (
              <>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: "gray",
                    textDecoration: "line-through",
                  }}
                >
                  {item["price"]?.toLocaleString("vi-VN")}₫
                </Typography>
                <Typography variant="caption" color="error" sx={{ background: 'pink', borderRadius: 1, padding: 0.5 }}>
                  -{(100-(item["sale"]/item["price"])*100).toFixed(1)}%
                </Typography>
              </>
            )}
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 200,
              gap: 10,
            }}
          >
            <NumberSpinner
              label="Số lượng"
              min={1}
              size="small"
              value={qty}
              onChange={handleQtyChange}
            />
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
              onClick={handleAddClick}
            >
              <ShoppingCartIcon />
              <Typography>Thêm vào giỏ hàng</Typography>
            </IconButton>
          </div>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Thông tin sản phẩm</Typography>
          <Typography variant="body1">{item["description"]}</Typography>
          {isMobile && <br/>}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
