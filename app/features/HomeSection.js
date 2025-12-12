// app/features/HomeSection.js
import React from "react";
import { Typography, Box, Grid, Button, Stack, Chip } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "../components/ProductCard";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useIsMobile } from "../hooks/isMobile";

export default function HomePage({ products, onAddToCart, tab }) {
  const categoryNames = React.useMemo(
    () => (products ? Object.keys(products) : []),
    [products]
  );

  const isMobile = useIsMobile();

  const go = (index) => {
    if (typeof tab === "function") tab(index);
  };

  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        borderRadius: 10,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 350, md: 320 },
          borderRadius: 5,
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <img
          src="images/branding/banner.jpg"
          alt="Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)",
            color: "white",
            px: { xs: 3, md: 6 },
            py: { xs: 3, md: 4 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Text + CTA */}
            <Grid item xs={12} md={7}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                Chào mừng đến với GreenFarm! 🥕
              </Typography>
              <Typography
                variant={isMobile ? "body2" : "body1"}
                sx={{
                  mb: 2.5,
                  maxWidth: 500,
                  opacity: 0.95,
                }}
              >
                Khám phá nông sản tươi sạch, an toàn và chất lượng cao từ các
                nông trại địa phương uy tín. Đặt rau chỉ với vài cú click, giao
                nhanh tới tận bếp nhà bạn.
              </Typography>

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                flexWrap="wrap"
                sx={{ width: isMobile ? "200px" : undefined }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIosIcon />}
                  href="#fruits-party"
                  sx={{ borderRadius: 999, fontWeight: "bold", px: 3 }}
                  onClick={(e) => {
                    // Nếu giữ href để hiển thị URL hash, ta chặn hành vi cuộn mặc định
                    e.preventDefault();

                    // Nếu cần đổi sang tab Sản phẩm trước khi cuộn, gọi go(1) (tuỳ vào app của bạn)
                    // go?.(1);

                    // Đợi layout/tab render xong rồi cuộn
                    setTimeout(() => {
                      const el = document.getElementById("fruits-party");
                      if (!el) return;
                      const headerOffset = 100;
                      const y =
                        el.getBoundingClientRect().top +
                        window.pageYOffset -
                        headerOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }, 50);
                  }}
                >
                  Đặt ngay
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => go(1)}
                  sx={{
                    borderRadius: 999,
                    borderColor: "rgba(255,255,255,0.7)",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Xem sản phẩm
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* CATEGORY CHIPS */}
      {categoryNames.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ maxWidth: "1000px" }}
        >
          {categoryNames.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              icon={<AgricultureIcon fontSize="small" />}
              sx={{
                borderRadius: 999,
                fontWeight: 500,
                backgroundColor: "rgba(31,170,84,0.06)",
              }}
            />
          ))}
        </Stack>
      )}

      {/* WHY GREENFARM */}
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
          }}
        >
          Vì sao chọn GreenFarm?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 4,
                p: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <LocalShippingIcon fontSize="large" color="success" />
              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                Giao nhanh trong ngày
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đặt hàng trước 15h sẽ được giao ngay trong ngày, bảo đảm độ tươi
                ngon từ nông trại tới bàn ăn.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 4,
                p: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <AgricultureIcon fontSize="large" color="success" />
              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                Nông sản địa phương
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hỗ trợ nông dân Việt, ưu tiên nông trại hữu cơ và mô hình canh
                tác bền vững, thân thiện với môi trường.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 4,
                p: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <VerifiedUserIcon fontSize="large" color="success" />
              <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                An toàn & minh bạch
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thông tin nguồn gốc, giá cả và khuyến mãi rõ ràng, giúp bạn yên
                tâm lựa chọn cho gia đình.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 🍓 BỮA TIỆC TRÁI CÂY */}
      <SectionCardSection
        id="fruits-party"
        icon={<EmojiFoodBeverageIcon />}
        label="Bộ sưu tập trái cây"
        title="Bữa tiêc trái cây"
        subtitle="Bùng nổ sắc màu trái cây theo mùa – tươi giòn, ngọt thanh cho mọi bữa ăn."
        gradient="linear-gradient(135deg, #ff9a3c, #ffd166)"
      >
        {Object.entries(products).map(([category, items]) => (
          <React.Fragment key={category}>
            {Object.entries(items).map(([name, item]) =>
              item.sale != item.price && category === "Trái cây" ? (
                <ProductCard
                  key={`${category}-${name}`} // cho chắc ăn luôn
                  name={name}
                  item={{ ...item, name, id: `${category}__${name}` }}
                  onAddToCart={onAddToCart}
                />
              ) : null
            )}
          </React.Fragment>
        ))}
      </SectionCardSection>

      {/* ⚡ SIÊU GIẢM GIÁ */}
      <SectionCardSection
        id="section-sale"
        icon={<LocalOfferIcon />}
        label="Flash deals"
        title="Siêu giảm giá"
        subtitle="Săn deal sốc với mức giảm trên 80% – số lượng có hạn, hết là thôi!"
        gradient="linear-gradient(135deg, #ff6a3d, #ff414d)"
      >
        {Object.entries(products).map(([category, items]) => (
          <React.Fragment key={`super-sale-${category}`}>
            {Object.entries(items).map(([name, item]) => {
              const percent =
                item.price > 0 ? 100 - (item.sale / item.price) * 100 : 0;
              return percent >= 80 ? (
                <ProductCard
                  key={`${category}-${name}-super`}
                  name={name}
                  item={{ ...item, name, id: `${category}__${name}` }}
                  onAddToCart={onAddToCart}
                />
              ) : null;
            })}
          </React.Fragment>
        ))}
      </SectionCardSection>

      {/* 🛍️ ĐANG GIẢM GIÁ */}
      <SectionCardSection
        id="section-discount"
        icon={<ShoppingBagIcon />}
        label="Ưu đãi hôm nay"
        title="Đang giảm giá"
        subtitle="Rau củ tươi ngon với mức giá dễ chịu, phù hợp mua dự trữ cho cả tuần."
        gradient="linear-gradient(135deg, #25b66f, #7ce08a)"
      >
        {Object.entries(products).map(([category, items]) => (
          <React.Fragment key={`discount-${category}`}>
            {Object.entries(items).map(([name, item]) =>
              item.sale !== item.price ? (
                <ProductCard
                  key={`${category}-${name}-discount`}
                  name={name}
                  item={{ ...item, name, id: `${category}__${name}` }}
                  onAddToCart={onAddToCart}
                />
              ) : null
            )}
          </React.Fragment>
        ))}
      </SectionCardSection>
    </div>
  );
}

/** Tiêu đề section chung */
function SectionTitle({ title }) {
  return (
    <Typography
      variant="h3"
      component="div"
      sx={{
        fontWeight: "bold",
        mt: 4,
        mb: 3,
        color: "text.primary",
        textAlign: "center",
      }}
    >
      {title}
    </Typography>
  );
}
// Card section header + body dùng chung
function SectionCardSection({
  id,
  icon,
  label,
  title,
  subtitle,
  gradient,
  children,
}) {
  return (
    <Box id={id} sx={{ width: "100%", maxWidth: "1200px", mb: 5 }}>
      <Box
        sx={{
          borderRadius: 5,
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
          overflow: "hidden",
          background: gradient,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: { xs: 2.5, md: 3 },
            py: { xs: 2, md: 2.5 },
            color: "white",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.1))",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.18)",
              boxShadow: "0 0 0 3px rgba(255,255,255,0.25)",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            {label && (
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  opacity: 0.9,
                }}
              >
                {label}
              </Typography>
            )}
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", lineHeight: 1.25 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{ opacity: 0.92, mt: 0.5, maxWidth: 480 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* BODY: grid sản phẩm */}
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            backgroundColor: "white",
          }}
        >
          <ProductGrid>{children}</ProductGrid>
        </Box>
      </Box>
    </Box>
  );
}

// Grid dùng chung (nếu file của bạn chưa có)
function ProductGrid({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: 4,
        justifyItems: "center",
      }}
    >
      {children}
    </Box>
  );
}
