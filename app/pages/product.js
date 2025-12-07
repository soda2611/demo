import React from "react";
import { Typography, Box } from "@mui/material";
import ProductCard from "../widgets/ProductCard";

export default function ProductPage({ products, banners, onAddToCart }) {
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
          <Box
                  sx={{
                    backgroundColor: "primary.main",
                    height: 300,
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={banners[{category}]}
                    alt="Banner"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      color: "white",
                      textAlign: "center",
                      padding: 2,
                      borderRadius: 5,
                      height: 300,
                      width: "90%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold", marginBottom: 1, color: "white" }}
                    >
                      {category}
                    </Typography>
                  </Box>
                </Box>
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
            {Object.entries(items).map(([name, item]) => (
              <ProductCard
                key={name}
                name={name}
                item={{ ...item, name, id: `${category}__${name}` }} // ID ổn định
                onAddToCart={(product, qty) => onAddToCart?.(product, qty)}
              />
            ))}
          </Box>
        </>
      ))}
    </div>
  );
}

