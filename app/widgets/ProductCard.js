import React, { useState } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ProductDialog from "./ProductDialog";

export default function ProductCard({ name, item, onAddToCart }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  return (
    <>
      <ProductDialog
        name={name}
        item={item}
        open={open}
        handleClose={() => setOpen(false)}
        onAddToCart={(product, qty) => {
          onAddToCart?.(product, qty);
          setOpen(false);
        }}
      />
      <Box
        onClick={handleOpen}
        sx={{
          backgroundColor: "#f1f1f1",
          width: 250,
          height: 400,
          borderRadius: 2.5,
          border: "2px solid #37be3cff",
          boxShadow: "10px 10px 20px #303030aa",
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <div
          style={{
            backgroundColor: "#e0e0e0",
            width: "100%",
            height: "60%",
            overflow: "hidden",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Box
            component="img"
            src={item["img"]}
            alt={name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.2)",
              },
            }}
          />
        </div>
        <Box sx={{ padding: 2, height: "40%" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", marginBottom: 1 }}
          >
            {`${name}`.length > 16
              ? `${name}`.substring(0, 16) + "..."
              : `${name}`}
          </Typography>
          {item["sale"]?.toLocaleString("vi-VN") != item["price"]?.toLocaleString("vi-VN") ? (
            <>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 2 }}
              >
                {`${item["shortDescription"]}`.length > 24
                  ? `${item["shortDescription"]}`.substring(0, 20) + "..."
                  : `${item["shortDescription"]}`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {item["sale"]?.toLocaleString("vi-VN")}₫
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: "gray",
                    textDecoration: "line-through",
                  }}
                >
                  {item["price"]?.toLocaleString("vi-VN")}₫
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
                {`${item["shortDescription"]}`.length > 24
                  ? `${item["shortDescription"]}`.substring(0, 22) + "..."
                  : `${item["shortDescription"]}`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {item["price"]?.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>
            </>
          )}
        </Box>
        {item["sale"]?.toLocaleString("vi-VN") != item["price"]?.toLocaleString("vi-VN") ? (
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
              -{(100 - (item["sale"]?.toLocaleString("vi-VN") / item["price"]?.toLocaleString("vi-VN")) * 100).toFixed(1)}%
            </Box>
            <IconButton
              sx={{
                position: "relative",
                top: -415,
                left: 5,
                backdropFilter: "blur(10px)",
              }}
              aria-label="favorite"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              sx={{
                position: "relative",
                top: -390,
                left: 5,
                backdropFilter: "blur(10px)",
              }}
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
