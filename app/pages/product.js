import React from "react";
import { Typography, Box, IconButton, Grid } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProductPage({ products }) {
  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        backgroundColor: "primary.light",
      }}
    >
      {Object.entries(products).map(([category, items]) => (
        <>
          <Typography
            variant="h3"
            component="div"
            sx={{ fontWeight: "bold", marginBottom: 1, color: "text.primary" }}
          >
            {category}
          </Typography>
          <Box
            sx={{
                width: "100%",
                mb: 15,
                maxWidth: "1200px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, 250px)",
                gap: 5,
                justifyContent: "center"
            }}
          >
            {Object.entries(items).map(([name, item]) => (
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
                    overflow: 'hidden',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <img
                    src={item['img']}
                    alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                        sx={{ position: "relative", bottom: 360, left: -50, backdropFilter: 'blur(10px)'}}
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
                        -
                        {(100 - (item["sale"] / item["price"]) * 100).toFixed(
                          1
                        )}
                        %
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                        sx={{ position: "relative", bottom: 360, left: -50, backdropFilter: 'blur(10px)'}}
                        aria-label="favorite"
                      >
                        <FavoriteBorderIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      ))}
    </div>
  );
}
