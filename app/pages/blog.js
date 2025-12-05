import Box from "@mui/material/Box";

export default function DemoBox() {
  const htmlContent = "<p style='color:red'>Nội dung HTML trong Box</p>";

  return (
    <Box
      sx={{ padding: 2, backgroundColor: "#f1f1f1" }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
