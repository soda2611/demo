# 🌱 GreenFarm – Website Bán Nông Sản Sạch & Đặc Sản Địa Phương


![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![MUI](https://img.shields.io/badge/MUI-v7-007FFF?style=for-the-badge&logo=mui)
![Status](https://img.shields.io/badge/Status-Development-green?style=for-the-badge)
**GreenFarm** là một website bán nông sản sạch được xây dựng theo hướng **Single Page Application (SPA)**, tập trung vào **trải nghiệm người dùng (UX)**, **giao diện hiện đại**, và **tính tương tác cao**.
Dự án được thực hiện phục vụ **báo cáo môn Thiết kế Web (COMP1802)** tại **Trường Đại học Sư phạm TP. Hồ Chí Minh (HCMUE)**.


## 📌 Mục tiêu dự án

* Xây dựng website giới thiệu & bán nông sản sạch, rõ nguồn gốc
* Mô phỏng quy trình mua hàng:
  **xem sản phẩm → tìm kiếm → lọc → thêm giỏ → thanh toán**
* Ứng dụng **React + Next.js + Material UI** để tạo giao diện chuyên nghiệp
* Tối ưu trải nghiệm trên **Desktop / Tablet / Mobile**


## 👥 Đối tượng người dùng

* Người tiêu dùng quan tâm đến thực phẩm sạch
* Sinh viên, nhân viên văn phòng, hộ gia đình
* Giảng viên & sinh viên tham khảo mô hình website thương mại điện tử cơ bản


## 🚀 Công nghệ sử dụng (Tech Stack)

* **Next.js 16** (App Router)
* **React 19**
* **Material UI (MUI v7)** + Emotion
* **JavaScript (ES6+)**
* **JSON tĩnh** (quản lý dữ liệu sản phẩm, banner, blog)
* **GitHub Actions** (CI/CD – Deploy GitHub Pages)


## 🧱 Kiến trúc & Cấu trúc thư mục

```bash
greenfarm/
├── app/
│   ├── layout.js              # Layout chung + metadata
│   ├── page.js                # App chính (Tabs, AppBar, Cart, Search)
│   ├── features/              # Các trang/section
│   │   ├── HomeSection.js
│   │   ├── ProductSection.js
│   │   ├── BlogSection.js
│   │   ├── ContactSection.js
│   │   └── FooterSection.js
│   ├── components/            # Component tái sử dụng
│   │   ├── ProductCard.js
│   │   ├── ProductDialog.js
│   │   ├── CartDialog.js
│   │   ├── CheckoutDialog.js
│   │   ├── SearchPopper.js
│   │   └── AddressForm.js
│   └── hooks/
│       ├── isMobile.js        # Hook responsive
│       └── theme.js           # Custom MUI Theme
│
├── public/
│   ├── data/
│   │   ├── products.json
│   │   ├── banners.json
│   │   ├── blogs.json
│   │   └── locations.json
│   └── images/
│
├── styles/
│   └── globals.css
│
├── .github/workflows/
│   └── nextjs.yml             # CI/CD GitHub Actions
├── package.json
└── README.md
```


## ✨ Các tính năng nổi bật

### 🔍 Tìm kiếm & Gợi ý sản phẩm

* Tìm kiếm theo tên, mô tả
* Gợi ý sản phẩm realtime (Search Popper)
* Chuẩn hóa từ khóa (bỏ dấu tiếng Việt)

### 🧺 Giỏ hàng thông minh

* Thêm / xoá / cập nhật số lượng
* Snackbar thông báo trực quan
* Tự động tính tổng tiền

### 🎯 Lọc & Sắp xếp sản phẩm

* Lọc theo danh mục (Rau, Củ, Trái cây, …)
* Lọc theo khoảng giá
* Lọc **“Siêu giảm giá”**
* Sắp xếp theo giá, tên, % giảm

### 💳 Thanh toán mô phỏng

* Thanh toán **COD**
* Thanh toán **Chuyển khoản QR (VietQR)**
* Áp dụng **mã giảm giá**
* Reset trạng thái khi đóng cửa sổ thanh toán

### 📱 Responsive Design

* Desktop: Menu ngang + Grid nhiều cột
* Mobile: Drawer menu + layout tối ưu
* Áp dụng breakpoint chuẩn của Material UI


## 📊 Quản lý dữ liệu

Dữ liệu được lưu dưới dạng **JSON tĩnh**, giúp:

* Dễ demo
* Không cần backend
* Phù hợp đồ án học phần

Ví dụ `products.json`:

```json
{
  "Rau": {
    "Rau muống": {
      "img": "/images/products/rau/rau-muong.jpg",
      "shortDescription": "Rau xanh tươi",
      "description": "Rau muống tươi, sạch, an toàn...",
      "price": 15000,
      "sale": 12000
    }
  }
}
```


## ⚙️ Cài đặt & Chạy dự án

```bash
# Cài đặt thư viện
npm install

# Chạy môi trường development
npm run dev
```

Truy cập:
👉 `http://localhost:3000`


## 🌐 Deploy GitHub Pages

Dự án đã cấu hình **GitHub Actions** để tự động build & deploy.

```bash
npm run build
npm run deploy
```


## 📌 Định hướng phát triển (Future Improvements)

* Tích hợp Backend (Firebase / Node.js)
* Thanh toán online thật (VNPay / Momo)
* Trang quản trị Admin
* Lưu đơn hàng & người dùng
* Đánh giá & bình luận sản phẩm


## 🎓 Thông tin học phần

* **Môn học:** Thiết kế Web (COMP1802)
* **Trường:** Đại học Sư phạm TP. Hồ Chí Minh (HCMUE)
* **Loại dự án:** Đồ án học phần – Frontend Web


## 📄 License

Dự án phục vụ **mục đích học tập**.
Không sử dụng cho mục đích thương mại.


> 💚 *GreenFarm – Kết nối nông sản sạch với người tiêu dùng bằng công nghệ hiện đại.*


