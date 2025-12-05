import React from "react";
import { Typography, Box } from "@mui/material";
import ProductCard from "../widgets/ProductCard";

export default function HomePage({ products }) {
  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
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
          src="https://github.com/soda2611/demo/blob/main/public/banner.png?raw=true"
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
            Chào mừng đến với GreenFarm!
          </Typography>
          <Typography
            variant="body1"
            color="white"
            sx={{ textAlign: "center", marginBottom: 2 }}
          >
            Khám phá nông sản tươi sạch, an toàn và chất lượng cao từ các trang
            trại uy tín. Mua sắm dễ dàng và nhanh chóng ngay hôm nay!
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 1,
          color: "text.primary",
          textAlign: "center",
        }}
      >
        Fruits Party
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
        {Object.entries(products).map(([category, items]) => (
          <>
            {Object.entries(items).map(([name, item]) =>
              category === "Trái cây" && item["sale"] != item["price"] ? (
                <ProductCard name={name} item={item} />
              ) : null
            )}
          </>
        ))}
      </Box>
      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 1,
          color: "text.primary",
          textAlign: "center",
        }}
      >
        Siêu giảm giá
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
        {Object.entries(products).map(([category, items]) => (
          <>
            {Object.entries(items).map(([name, item]) =>
              100 - (item["sale"] / item["price"]) * 100 > 80 ? (
                <ProductCard name={name} item={item} key={name} />
              ) : null
            )}
          </>
        ))}
      </Box>

      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 1,
          color: "text.primary",
          textAlign: "center",
        }}
      >
        Đang giảm giá
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
        {Object.entries(products).map(([category, items]) => (
          <>
            {Object.entries(items).map(([name, item]) =>
              item["sale"] != item["price"] ? (
                <ProductCard name={name} item={item} />
              ) : null
            )}
          </>
        ))}
      </Box>
    </div>
  );
}
