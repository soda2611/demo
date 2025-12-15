//app/features/FooterSection.js
import React, { useCallback, useMemo } from "react";
import { Typography, Box, Link, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";

const BRAND = {
  name: "GreenFarm",
  logo: "images/branding/logo.png",
  hotline: "0123 456 789",
  email: "example@mail.host",
  address: "123 đường ABC, phường XYZ, TP.HCM",
};

const SOCIALS = [
  {
    href: "https://facebook.com",
    border: "3px solid #0866FF",
    color: "#0866FF",
    Icon: FacebookIcon,
    label: "Facebook",
  },
  {
    href: "https://instagram.com",
    border: "3px solid #fa00a4",
    color: "#fa00a4",
    Icon: InstagramIcon,
    label: "Instagram",
  },
  {
    href: "https://github.com/soda2611/demo",
    border: "2px solid #24292e",
    color: "#24292e",
    Icon: GitHubIcon,
    label: "GitHub",
  },
];

export default function FooterSection({ tab }) {
  const goToTab = useCallback(
    (index) => {
      if (typeof tab === "function") tab(index);
    },
    [tab]
  );

  const quickLinks = useMemo(
    () => [
      { text: "Trang chủ", onClick: () => goToTab(0) },
      { text: "Sản phẩm", onClick: () => goToTab(1) },
      { text: "Tin tức", onClick: () => goToTab(2) },
      { text: "Liên hệ", onClick: () => goToTab(3) },
    ],
    [goToTab]
  );

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        mt: 6,
        backgroundColor: "#1faa54ff",
        color: "white",
        pt: 4,
        pb: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 8 }}
        sx={{ maxWidth: 1200, mx: "auto", px: 2, pb: 4 }}
      >
        {/* Cột 1 */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box component="img" src={BRAND.logo} alt={BRAND.name} sx={{ height: 40 }} />
            <Typography variant="h6" fontWeight="bold">
              {BRAND.name}
            </Typography>
          </Box>

          <Typography variant="body2">
            Hotline: {BRAND.hotline}
            <br />
            Email: {BRAND.email}
            <br />
            Địa chỉ: {BRAND.address}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
            {SOCIALS.map(({ href, border, color, Icon, label }) => (
              <Box
                key={href}
                component="a"
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                sx={{
                  width: 36,
                  height: 36,
                  border,
                  borderRadius: "50%",
                  bgcolor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ color, fontSize: 20 }} />
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Cột 2 */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Liên kết nhanh
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {quickLinks.map((it) => (
              <Link
                key={it.text}
                color="inherit"
                underline="hover"
                onClick={it.onClick}
                sx={{ cursor: "pointer" }}
              >
                {it.text}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Cột 3 */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Chính sách & hỗ trợ
          </Typography>
          <Typography variant="body2">• Giao hàng nội thành trong ngày.</Typography>
          <Typography variant="body2">• Hỗ trợ đổi trả trong 24 giờ.</Typography>
          <Typography variant="body2">• Nông sản sạch, nguồn gốc rõ ràng.</Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          width: "100%",
          py: 1,
          backgroundColor: "#0b830fff",
          textAlign: "center",
          fontSize: "small",
          mt: "auto",
        }}
      >
        ©Copyright 2025 {BRAND.name}
      </Box>
    </Box>
  );
}
