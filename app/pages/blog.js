import Box from "@mui/material/Box";
import BlogCard from "../widgets/BlogCard";

export default function Blog() {
  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 50,
        backgroundColor: "primary.light",
      }}
    >
    {Array.from({ length: 5 }, (_, i) => (
      <BlogCard key={i} />
    ))}
    </div>
  );
}
