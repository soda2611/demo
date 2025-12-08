import React, { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { Typography, Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import ProductCard from "../widgets/ProductCard";

export default function ProductPage({ products, banners, onAddToCart }) {
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

  const [tab, setTab] = useState(0);
  const [label, setLabel] = useState("");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setLabel(event.currentTarget.textContent ?? "");
  };

  useEffect(() => {
    window.scrollTo({ top: 70, behavior: "smooth" });
  }, [tab]);

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
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="white"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ width: isMobile? '70%' : undefined }}
      >
        <Tab label="Tất cả"/>
        {Object.entries(products).map(([category, items]) => (<Tab label={category} key={category}/>))}
      </Tabs>
      {Object.entries(products).map(([category, items]) => (
        ((tab===0 || label===category) ? (
          <>
            <Box
              key={category}
              sx={{
                backgroundColor: "primary.main",
                height: !isMobile ? 200 : 75,
                width: "70%",
                overflow: "hidden",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 5,
              }}
            >
              <img
                src={banners[`${category}`]}
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
                  height: !isMobile ? 200 : 75,
                  width: "63%",
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
      ) : (null))
      ))}
    </div>
  );
}
