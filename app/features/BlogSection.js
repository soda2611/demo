//app/features/BlogSection.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BlogCard from "../components/BlogCard";

const BLOGS_JSON_PATH = "data/blogs.json";

const LIST_CONTAINER_SX = {
  width: "90%",
  maxWidth: "1200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 5,
  my: 6,
};

const DETAIL_CONTAINER_SX = {
  width: "90%",
  maxWidth: "900px",
  mb: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const BLOG_IMAGE_SX = {
  width: "100%",
  height: 350,
  objectFit: "cover",
  borderRadius: 3,
  border: "2px solid #37be3c",
};

const HTML_CONTENT_SX = {
  mt: 2,
  "& h3": { color: "#1faa54", mt: 3, mb: 1, fontWeight: "bold" },
  "& p": {
    lineHeight: 1.8,
    fontSize: "1.1rem",
    mb: 2,
    textAlign: "justify",
  },
  "& ul": { mb: 2, paddingLeft: 3 },
  "& li": { mb: 1 },
  "& img": { maxWidth: "100%", borderRadius: 2 },
};

async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const data = await fetchJson(BLOGS_JSON_PATH);
        if (isActive) setBlogData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải blogs.json:", err);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPost || typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  const handleBackToList = useCallback(() => setSelectedPost(null), []);
  const handlePickPost = useCallback((post) => setSelectedPost(post), []);

  const listView = useMemo(
    () => (
      <Box sx={LIST_CONTAINER_SX}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: "primary.main", mb: 2 }}
        >
          Góc chia sẻ
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 4,
            width: "100%",
            justifyItems: "center",
          }}
        >
          {blogData.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              date={post.date}
              author={post.author}
              onClick={() => handlePickPost(post)}
            />
          ))}
        </Box>
      </Box>
    ),
    [blogData, handlePickPost]
  );

  if (!selectedPost) return listView;

  return (
    <Box sx={DETAIL_CONTAINER_SX}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToList}
        sx={{
          alignSelf: "flex-start",
          mb: 2,
          textTransform: "none",
          fontSize: "1rem",
          borderRadius: 5,
          px: 2,
        }}
      >
        Quay lại danh sách
      </Button>

      <Typography variant="h4" fontWeight="bold" color="primary.main">
        {selectedPost.title}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Đăng bởi {selectedPost.author} - {selectedPost.date}
      </Typography>

      <Box component="img" src={selectedPost.image} sx={BLOG_IMAGE_SX} />

      {/* Nội dung HTML (đã có sẵn trong JSON) */}
      <Box
        sx={HTML_CONTENT_SX}
        dangerouslySetInnerHTML={{ __html: selectedPost.content }}
      />
    </Box>
  );
}
