# 🌿 **GreenFarm – Website Nông Sản Sạch & Đặc Sản Địa Phương**

Website giới thiệu & bán nông sản sạch, thân thiện môi trường. Dự án được xây dựng theo kiến trúc hiện đại, tối ưu giao diện – tốc độ – trải nghiệm người dùng.



## 🚀 **1. Giới thiệu**

GreenFarm là website trưng bày và kinh doanh nông sản sạch, bao gồm các nhóm sản phẩm:

* Rau
* Củ
* Nấm
* Trái cây
* Đậu hủ

Website cung cấp trải nghiệm xem sản phẩm, lọc nâng cao, đọc tin tức, xem blog, xem chi tiết sản phẩm và giỏ hàng demo.

Dự án được xây dựng theo yêu cầu báo cáo Thiết kế Web  và hướng đến trải nghiệm thực tế như một website thương mại điện tử mini.



## 🖼️ **2. Tính năng nổi bật**

### 🌟 **Trang chủ (Home)**

* Banner giới thiệu thương hiệu GreenFarm
* Khu vực *Siêu giảm giá*: tự động lọc sản phẩm có mức giảm lớn
* Gợi ý sản phẩm theo danh mục
* Giao diện hiện đại, tối ưu trải nghiệm người dùng



### 🥬 **Trang Sản phẩm (Products)**

* Tabs danh mục (Rau, Củ, Nấm, Trái cây, Đậu hủ)
* Banner lớn theo từng danh mục
* Bộ lọc nâng cao:

  * Lọc theo danh mục
  * Lọc theo từ khóa
  * Lọc sản phẩm giảm giá
  * Khoảng giá
  * Sắp xếp theo giá, tên, % giảm
* Grid sản phẩm responsive
* Popup xem chi tiết (Product Dialog)



### 🛒 **Giỏ hàng (Cart)**

* Thêm sản phẩm từ Home, Products, Popup chi tiết
* Tăng/giảm số lượng qua Number Spinner
* Tự động tính tổng tiền
* Xóa sản phẩm
* Thanh toán demo (hiển thị Snackbar thành công)



### 📰 **Trang Blog**

* Danh sách bài viết từ JSON
* Xem chi tiết bài viết với HTML render
* Ảnh lớn + nội dung trình bày rõ ràng
* Nút quay lại danh sách
* Icon “favorite” và “comment” mô phỏng UX mạng xã hội



### 📞 **Trang Liên hệ (Contact)**

* Form liên hệ gồm:

  * Họ tên
  * Email
  * Chủ đề
  * Nội dung
* Thông tin liên hệ: địa chỉ, email, hotline
* Hình minh họa/bản đồ
* Icon mạng xã hội



### 🔍 **Tìm kiếm gợi ý (SearchPopper)**

* Search theo tên (bỏ dấu tiếng Việt)
* Xuất hiện gợi ý dạng Popper
* Click gợi ý → mở Product Dialog



## 🎨 **3. Công nghệ sử dụng**

| Công nghệ                                | Vai trò                                     |
| ---------------------------------------- | ------------------------------------------- |
| **Next.js 16 (App Router)**              | Cấu trúc project, tối ưu SEO                |
| **React 19**                             | Xây dựng UI component-based                 |
| **Material UI v7**                       | UI chính: AppBar, Tabs, Card, Dialog, Grid… |
| **MUI Icons**                            | Icon cho điều hướng & hành động             |
| **CSS + globals.css**                    | Style chung, scrollbar, font                |
| **JSON tĩnh (products, blogs, banners)** | Lưu trữ dữ liệu sản phẩm & bài viết         |



## 📁 **4. Cấu trúc thư mục**


greenfarm/
│
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   ├── components/
│   │   ├── ProductCard.js
│   │   ├── ProductDialog.js
│   │   ├── CartDialog.js
│   │   ├── SearchPopper.js
│   │   ├── NumberSpinner.js
│   │   ├── BlogCard.js
│   │   └── Footer.js
│   └── features/
│       ├── HomeSection.js
│       ├── ProductSection.js
│       ├── BlogSection.js
│       └── ContactSection.js
│
├── public/
│   ├── images/
│   └── data/
│       ├── products.json
│       ├── banners.json
│       └── blogs.json
│
├── package.json
└── README.md
```



## 🧠 **5. Kiến trúc & Quy trình hoạt động**

* Dữ liệu được load từ JSON → build thành mảng sản phẩm → truyền cho các section.
* Bộ lọc hoạt động bằng cách:

  * Lọc danh mục
  * Lọc keyword
  * Lọc giá / khuyến mãi
  * Sắp xếp dữ liệu
* Mọi thao tác thêm giỏ hàng đều thông qua `addToCart()` trong `page.js`.
* ProductDialog & CartDialog là component reuse toàn trang.



## 📱 **6. Responsive Design**

* Header tùy chỉnh:

  * Desktop: Tabs + Search Bar
  * Mobile: Drawer + Search Icon
* Grid sản phẩm tự co giãn `auto-fill`
* Banner, filter, blog được tối ưu theo breakpoint của MUI



## 🧩 **7. Cách chạy dự án**

### ✔ Cài đặt thư viện

```sh
npm install
```

### ✔ Chạy development server

```sh
npm run dev
```

### ✔ Build production

```sh
npm run build
```

### ✔ Deploy (GitHub Pages)

```sh
npm run deploy
```



## 💡 **8. Hướng phát triển tương lai**

* Thêm Đăng ký / Đăng nhập user
* Lưu giỏ hàng bằng localStorage
* Kết nối backend thật (Node.js + MongoDB)
* Tính năng yêu thích sản phẩm
* Thêm thanh toán thật (VNPay / Momo)



## 🧑‍💻 **9. Tác giả & Liên hệ**

Dự án được thực hiện phục vụ học phần **Thiết kế Web – HCMUE**
Mọi thông tin chi tiết vui lòng liên hệ tại trang Contact của website.



# 🌱 **GreenFarm – Ăn sạch, sống xanh!**

