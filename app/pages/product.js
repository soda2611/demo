import React from "react";
import { Typography, Box } from "@mui/material";
import ProductCard from "../widgets/ProductCard";

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
              justifyContent: "center",
            }}
          >
            {Object.entries(items).map(([name, item]) => (
              <ProductCard name={name} item={item} />
            ))}
          </Box>
        </>
      ))}
    </div>
  );
}
