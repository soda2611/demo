import React from "react";
import { Typography, Box, Link, Grid } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        backgroundColor: "#1faa54ff",
        color: 'white',
        objectFit: "cover",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={{ md: 10 }}
        columns={{ md: 3 }}
        sx={{
          width: "70%",
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
      <div style={{ position: 'relative', bottom: 0, width: '100%', height: 25, backgroundColor: '#0b830fff', color: 'white', textAlign: 'center', fontSize: 'small' }}>©Copyright 2025 GreenFarm</div>
    </Box>
  );
}
