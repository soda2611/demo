import React from "react";
import { createTheme } from "@mui/material/styles";
import {
  Typography,
  Box,
  Button,
  Grid,
  useMediaQuery,
  TextField,
  Link,
} from "@mui/material";

export default function ContactPage() {
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
      <Typography
        variant="h3"
        component="div"
        sx={{ fontWeight: "bold", marginBottom: 10, color: "text.primary" }}
      >
        Liên hệ
      </Typography>

      {!isMobile ? (
        <Grid
          container
          spacing={{ md: 10 }}
          columns={{ md: 2 }}
          sx={{ width: "70%", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "initial",
              flexGrow: 1,
              gap: 25,
            }}
          >
            <div style={{ display: "flex", gap: 25 }}>
              <TextField
                variant="outlined"
                color="primary"
                label="Họ và tên"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                variant="outlined"
                color="primary"
                label="Số điện thoại"
              />
            </div>
            <TextField variant="outlined" color="primary" label="Email" />
            <TextField variant="outlined" color="primary" label="Chủ đề" />
            <TextField
              multiline
              variant="outlined"
              color="primary"
              label="Nội dung"
              rows={10}
            />
            <div>
              <Button
                variant="contained"
                sx={{ bgcolor: "primary.main", color: "white" }}
              >
                Gửi
              </Button>
            </div>
          </div>
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
                src="https://github.com/soda2611/demo/blob/main/public/image.png?raw=true"
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
      ) : (
        <Grid
          container
          spacing={{ xs: 3, md: 3 }}
          columns={{ xs: 2, sm: 4, md: 4 }}
          sx={{ width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "initial",
              flexGrow: 1,
              gap: 25,
            }}
          >
            <div style={{ display: "flex", gap: 25 }}>
              <TextField
                variant="outlined"
                color="primary"
                label="Họ và tên"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                variant="outlined"
                color="primary"
                label="Số điện thoại"
              />
            </div>
            <TextField variant="outlined" color="primary" label="Email" />
            <TextField variant="outlined" color="primary" label="Chủ đề" />
            <TextField
              multiline
              variant="outlined"
              color="primary"
              label="Nội dung"
              rows={10}
            />
            <div>
              <Button
                variant="contained"
                sx={{ bgcolor: "primary.main", color: "white" }}
              >
                Gửi
              </Button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "self-start",
              flexGrow: 1,
              marginTop: 50,
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
                src="https://github.com/soda2611/demo/blob/main/public/image.png?raw=true"
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
      )}
    </div>
  );
}
