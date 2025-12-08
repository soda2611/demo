import React from "react";
import { createTheme } from "@mui/material/styles";
import { Typography, Box, Link, Grid, useMediaQuery } from "@mui/material";

export default function Footer() {
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
          fontFamily: "Roboto, Arial, sans-serif",
          h4: { fontWeight: 700 },
        },
        spacing: 8,
      }),
    []
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        backgroundColor: "#1faa54ff",
        color: "white",
        objectFit: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={{ md: 10 }}
        columns={{ md: 3 }}
        sx={{
          width: !isMobile ? "70%" : "100%",
          justifyContent: "center",
          borderRadius: 5,
          padding: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "self-start",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              padding: 2,
              gap: 10,
              alignItems: "center",
            }}
          >
            <img
              src="https://github.com/huydhb/greenfarm/blob/main/public/images/branding/logo.png?raw=true"
              alt="Logo"
              style={{ height: 40 }}
            />
            <Typography variant="h5" fontWeight="bold" component="div">
              GreenFarm
            </Typography>
          </div>
          <Typography variant="body1">
            Hotline: 0123456789
            <br />
            Email: example@mail.host
            <br />
            Địa chỉ: 123 đường ABC, phường XYZ, TPHCM
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mt: 2,
            }}
          >
            <Link>
              <Box
                component="img"
                src="https://static.xx.fbcdn.net/rsrc.php/y1/r/ay1hV6OlegS.ico"
                sx={{
                  width: 36,
                  border: "3px solid #0866FF",
                  borderRadius: "25px",
                }}
              />
            </Link>
            <Link>
              <Box
                component="img"
                src="https://static.cdninstagram.com/rsrc.php/v4/yI/r/VsNE-OHk_8a.png"
                sx={{
                  border: "3px solid #fa00a4",
                  borderRadius: "10px",
                }}
              />
            </Link>
            <Link>
              <Box
                component="img"
                src="https://www.tiktok.com/favicon.ico"
                sx={{
                  border: "2px solid #24292e",
                  borderRadius: "25px",
                  bgcolor: "white",
                }}
              />
            </Link>
          </Box>
        </div>
      </Grid>
      <div
        style={{
          position: "relative",
          bottom: 0,
          width: "100%",
          height: 25,
          backgroundColor: "#0b830fff",
          color: "white",
          textAlign: "center",
          fontSize: "small",
        }}
      >
        ©Copyright 2025 GreenFarm
      </div>
    </Box>
  );
}
