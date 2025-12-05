import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProductCard({ name, item }) {
  return (
    <Box
      sx={{
        backgroundColor: "#f1f1f1",
        width: 250,
        height: 400,
        borderRadius: 2.5,
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
          {name}
        </Typography>
        {item["sale"] != item["price"] ? (
          <>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: 2 }}
            >
              {`${item["description"]}`.length > 24
                ? `${item["description"]}`.substring(0, 22) + "..."
                : `${item["description"]}`}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {item["sale"]}₫
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
                {item["price"]}₫
              </Typography>
            </Box>
            <IconButton
              sx={{ position: "relative", bottom: 13, left: 190 }}
              aria-label="favorite"
            >
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              sx={{
                position: "relative",
                bottom: 360,
                left: -50,
                backdropFilter: "blur(10px)",
              }}
              aria-label="favorite"
            >
              <FavoriteBorderIcon />
            </IconButton>
            <Box
              sx={{
                position: "relative",
                top: -395,
                left: 170,
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
              -{(100 - (item["sale"] / item["price"]) * 100).toFixed(1)}%
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: 2 }}
            >
              {`${item["description"]}`.length > 24
                ? `${item["description"]}`.substring(0, 22) + "..."
                : `${item["description"]}`}
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
            <IconButton
              sx={{ position: "relative", bottom: 13, left: 190 }}
              aria-label="favorite"
            >
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              sx={{
                position: "relative",
                bottom: 360,
                left: -50,
                backdropFilter: "blur(10px)",
              }}
              aria-label="favorite"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
}
