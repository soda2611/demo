import React from "react";
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

export default function ProductDialog({ name, item, open, handleClose }) {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1faa54ff",
        light: "#37be3cff",
      },
      secondary: {
        main: "#ebff38ff",
      },
      text: {
        primary: "#000000",
      },
    },
    typography: {
      fontFamily: "Coiny, Roboto, Arial, sans-serif",
      h4: { fontWeight: 700 },
    },
    spacing: 8,
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
      {!isMobile ? (
        <DialogContent sx={{ display: "flex", gap: 2, minWidth: 800, overflowY: 'auto', overflowX: 'hidden' }}>
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
            }}
          >
            <Typography variant="h3">{name}</Typography>
            {item["sale"] != item["price"] ? (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  {item["description"]}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {item["sale"]}₫
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color: "gray",
                      textDecoration: "line-through",
                    }}
                  >
                    {item["price"]}₫
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  {item["description"]}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {item["price"]}₫
                  </Typography>
                </Box>
              </>
            )}
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
                max={40}
                size="small"
                defaultValue={1}
              />
              <IconButton
                color="inherit"
                aria-label="cart"
                sx={{
                  fontSize: 14,
                  borderRadius: 2.5,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <ShoppingCartIcon />
                <Typography>Thêm vào giỏ hàng</Typography>
              </IconButton>
            </div>
            <Typography variant='h6'>Thông tin sản phẩm</Typography>
            <Typography variant='body1'>[content]</Typography>
          </Box>
        </DialogContent>
      ) : (
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
            }}
          >
            <Typography variant="h3">{name}</Typography>
            {item["sale"] != item["price"] ? (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  {item["description"]}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {item["sale"]}₫
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color: "gray",
                      textDecoration: "line-through",
                    }}
                  >
                    {item["price"]}₫
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ marginBottom: 2 }}
                >
                  {item["description"]}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {item["price"]}₫
                  </Typography>
                </Box>
              </>
            )}
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
                max={40}
                size="small"
                defaultValue={1}
              />
              <IconButton
                color="inherit"
                aria-label="cart"
                sx={{
                  fontSize: 14,
                  borderRadius: 2.5,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <ShoppingCartIcon />
                <Typography>Thêm vào giỏ hàng</Typography>
              </IconButton>
            </div>
            <Typography variant='h6'>Thông tin sản phẩm</Typography>
            <Typography variant='body1'>[content]</Typography>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}
