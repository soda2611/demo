// app/components/BlogCard.js
import React from "react";
import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";

const DEFAULTS = {
  title: "Tiêu đề bài viết GreenFarm",
  excerpt: "Đây là đoạn mô tả ngắn về bài viết, giới thiệu nội dung chính cho người đọc…",
  image: "images/blog/blog-default.jpg",
  author: "GreenFarm",
  date: "00:00, 1 tháng 1 năm 2026",
};

const CARD_SX = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  border: "2px solid #37be3c",
  borderRadius: 3,
  overflow: "hidden",
  backgroundColor: "#f1f1f1",
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 3,
  },
};

const HEADER_SX = {
  display: "flex",
  alignItems: "center",
  width: "95%",
  height: 50,
  gap: 2,
};

const IMAGE_SX = {
  width: "95%",
  borderRadius: 2,
  border: "1px solid #1faa54ff",
  objectFit: "cover",
  height: 200,
};

const FOOTER_SX = {
  display: "flex",
  alignItems: "center",
  height: 45,
  justifyContent: "space-between",
  backgroundColor: "#37be3cff",
  color: "white",
  px: 3,
};

export default function BlogCard({ title, excerpt, image, date, author, onClick }) {
  const safeTitle = title || DEFAULTS.title;
  const safeExcerpt = excerpt || DEFAULTS.excerpt;
  const safeImage = image || DEFAULTS.image;
  const safeAuthor = author || DEFAULTS.author;
  const safeDate = date || DEFAULTS.date;

  // Giữ nguyên hành vi hiện tại: số like/comment ngẫu nhiên theo mỗi lần render
  const likeCount = Math.floor(Math.random() * 10000) + 10;
  const commentCount = Math.floor(Math.random() * 1000);

  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      sx={CARD_SX}
    >
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", p: 2, gap: 2 }}>
        <Box sx={HEADER_SX}>
          <Box
            component="img"
            src="images/branding/logo.png"
            alt="Avatar"
            sx={{ borderRadius: 2, width: 40, height: 40, objectFit: "cover" }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {safeAuthor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {safeDate}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "95%" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.3, mb: 1 }}>
            {safeTitle}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {safeExcerpt}
          </Typography>
        </Box>

        <Box component="img" src={safeImage} alt={safeTitle} sx={IMAGE_SX} />
      </Box>

      <Box sx={FOOTER_SX}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FavoriteIcon fontSize="small" />
          <Typography variant="body2">{likeCount}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CommentIcon fontSize="small" />
          <Typography variant="body2">{commentCount}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
