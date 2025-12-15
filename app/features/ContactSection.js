//app/features/ContactSection.js
import React, { useMemo } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useIsMobile } from "../hooks/isMobile";

const CONTAINER_STYLE = {
  width: "90%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  backgroundColor: "primary.light",
};

const FORM_CARD_STYLE = {
  display: "flex",
  flexDirection: "column",
  alignItems: "initial",
  gap: 25,
  backgroundColor: "#f1f1f1",
  padding: 20,
  borderRadius: 10,
};

const INPUT_STYLE = {
  height: 50,
  borderRadius: 10,
  outlineColor: "#1faa54ff",
  border: "none",
  fontFamily: "Calibri",
  padding: 10,
};

const TEXTAREA_STYLE = {
  height: 200,
  borderRadius: 10,
  outlineColor: "#1faa54ff",
  border: "none",
  fontFamily: "Calibri",
  padding: 10,
};

const SOCIAL_ICON_STYLE = {
  width: 36,
  height: 36,
  border: "2px solid #24292e",
  borderRadius: "50%",
  bgcolor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function ContactForm({ compact }) {
  return (
    <div style={{ ...FORM_CARD_STYLE, width: compact ? "100%" : undefined }}>
      <div style={{ display: "flex", gap: 25 }}>
        <input style={{ ...INPUT_STYLE, width: "100%", flexGrow: 1 }} placeholder="Họ và tên" />
        <input
          style={{ ...INPUT_STYLE, width: 135 }}
          placeholder="SĐT"
          maxLength={10}
        />
      </div>

      <input style={INPUT_STYLE} placeholder="Email" />
      <input style={INPUT_STYLE} placeholder="Chủ đề" />
      <textarea style={TEXTAREA_STYLE} placeholder="Nội dung" />

      <div>
        <Button variant="contained" sx={{ bgcolor: "primary.main", color: "white" }}>
          Gửi
        </Button>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const isMobile = useIsMobile();

  const socialLinks = useMemo(
    () => [
      { href: "https://facebook.com", Icon: FacebookIcon, label: "Facebook" },
      { href: "https://instagram.com", Icon: InstagramIcon, label: "Instagram" },
      { href: "https://github.com/soda2611/demo", Icon: GitHubIcon, label: "GitHub" },
    ],
    []
  );

  return (
    <div style={CONTAINER_STYLE}>
      <Typography
        variant="h3"
        component="div"
        sx={{ fontWeight: "bold", marginBottom: 5, color: "text.primary" }}
      >
        Liên hệ
      </Typography>

      {!isMobile ? (
        <Grid
          container
          spacing={{ md: 10 }}
          columns={{ md: 3 }}
          sx={{
            width: "70%",
            justifyContent: "center",
            borderRadius: 5,
            backgroundColor: "#f1f1f1",
            padding: 5,
          }}
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
            {/* Form */}
            <ContactForm />
          </div>

          {/* Thông tin liên hệ */}
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
              <img src="images/branding/logo.png" alt="Logo" style={{ height: 40 }} />
              <Typography variant="h5" fontWeight="bold" component="div">
                GreenFarm
              </Typography>
            </div>

            <Typography variant="body1">
              Hotline: 0123 456 789
              <br />
              Email: example@mail.host
              <br />
              Địa chỉ: 123 đường ABC, phường XYZ, TPHCM
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
              {socialLinks.map(({ href, Icon, label }) => (
                <Box
                  key={href}
                  component="a"
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  sx={SOCIAL_ICON_STYLE}
                >
                  <Icon sx={{ color: "#24292e", fontSize: 20 }} />
                </Box>
              ))}
            </Box>
          </div>
        </Grid>
      ) : (
        <ContactForm compact />
      )}
    </div>
  );
}
