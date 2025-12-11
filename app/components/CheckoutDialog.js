// app/components/CheckoutDialog.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Nhớ cài @mui/icons-material
import AddressForm from "./AddressForm";

// Cấu hình thông tin ngân hàng của bạn (Demo)
const BANK_INFO = {
  bankId: "MB", // Ví dụ: MB, VCB, ACB, TPB...
  accountNo: "4579444444", // Thay số tài khoản của bạn vào đây
  accountName: "DANG HOANG BAO HUY", // Tên chủ tài khoản
  template: "compact", // Kiểu hiển thị QR
};

export default function CheckoutDialog({
  open,
  onClose,
  items = [],
  subtotal = 0,
  onSuccess,
}) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    province: "",
    district: "",
    ward: "",
    note: "",
    coupon: "",
    paymentMethod: "cod",
  });

  const [error, setError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // State mới cho việc xử lý thanh toán QR
  const [isCheckingPayment, setIsCheckingPayment] = useState(false); // Đang loading
  const [isPaid, setIsPaid] = useState(false); // Đã thanh toán thành công chưa

  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  // Tạo Link QR động dựa trên số tiền (API VietQR)
  // Cấu trúc: https://img.vietqr.io/image/<BANK_ID>-<TK>-<TEMPLATE>.png?amount=<TIEN>&addInfo=<NOIDUNG>
  const qrCodeUrl = `https://img.vietqr.io/image/${BANK_INFO.bankId}-${
    BANK_INFO.accountNo
  }-${BANK_INFO.template}.png?amount=${Math.floor(total)}&addInfo=GREENFARM ${
    form.phone
  }`;

  // FORM CHANGE
  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // APPLY COUPON
  const handleApplyCoupon = () => {
    const code = form.coupon.trim().toUpperCase();
    if (code === "GREEN10") {
      setDiscountPercent(10);
      setAppliedVoucher("GREEN10");
      setError("");
    } else if (code === "GREEN20") {
      setDiscountPercent(20);
      setAppliedVoucher("GREEN20");
      setError("");
    } else if (!code) {
      setDiscountPercent(0);
      setAppliedVoucher(null);
      setError("");
    } else {
      setDiscountPercent(0);
      setAppliedVoucher(null);
      setError("Mã giảm giá không hợp lệ.");
    }
  };

  // Giả lập kiểm tra thanh toán (Simulation)
  const handleCheckPayment = () => {
    setIsCheckingPayment(true);
    setError("");

    // Giả vờ đợi 3 giây để kiểm tra giao dịch
    setTimeout(() => {
      setIsCheckingPayment(false);
      setIsPaid(true); // Gán trạng thái đã thanh toán
    }, 3000);
  };

  // SUBMIT
  const handleSubmit = () => {
    const hasAddress =
      form.street && form.province && form.district && form.ward;

    if (!form.fullName || !form.phone || !hasAddress) {
      setError("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
      return;
    }

    // Logic chặn nếu chọn chuyển khoản mà chưa "thành công"
    if (form.paymentMethod === "transfer" && !isPaid) {
      setError("Vui lòng hoàn tất chuyển khoản trước khi đặt hàng.");
      return;
    }

    const fullAddress = `${form.street}, ${form.ward}, ${form.district}, ${form.province}`;

    onSuccess?.({
      customer: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: fullAddress,
        note: form.note,
      },
      payment: {
        method: form.paymentMethod,
        coupon: appliedVoucher,
        discountPercent,
        subtotal,
        total,
        status: isPaid ? "paid" : "pending", // Lưu trạng thái thanh toán
      },
      items,
    });
  };

  // RESET form khi đóng dialog
  useEffect(() => {
    if (!open) {
      setDiscountPercent(0);
      setAppliedVoucher(null);
      setIsPaid(false); // Reset trạng thái thanh toán
      setIsCheckingPayment(false);
      setForm({
        fullName: "",
        phone: "",
        email: "",
        street: "",
        province: "",
        district: "",
        ward: "",
        note: "",
        coupon: "",
        paymentMethod: "cod",
      });
    }
  }, [open]);

  // Reset trạng thái thanh toán nếu người dùng đổi phương thức hoặc đổi tiền
  useEffect(() => {
    if (isPaid) setIsPaid(false);
  }, [total, form.paymentMethod]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span" fontWeight={700}>
          Thanh toán đơn hàng
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
            gap: 4,
          }}
        >
          {/* CỘT TRÁI: Thông tin khách hàng */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2} color="primary">
              1. Thông tin giao hàng
            </Typography>

            <TextField
              fullWidth
              label="Họ và tên"
              size="small"
              sx={{ mb: 2 }}
              value={form.fullName}
              onChange={handleChange("fullName")}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              size="small"
              sx={{ mb: 2 }}
              value={form.phone}
              onChange={handleChange("phone")}
            />
            <TextField
              fullWidth
              label="Email (tuỳ chọn)"
              size="small"
              sx={{ mb: 2 }}
              value={form.email}
              onChange={handleChange("email")}
            />
            
            <Box sx={{ mb: 2 }}>
                <AddressForm
                value={{
                    street: form.street,
                    province: form.province,
                    district: form.district,
                    ward: form.ward,
                }}
                onChange={(addr) =>
                    setForm((prev) => ({ ...prev, ...addr }))
                }
                />
            </Box>

            <TextField
              fullWidth
              label="Ghi chú (Ví dụ: Giao giờ hành chính)"
              size="small"
              value={form.note}
              onChange={handleChange("note")}
              multiline
              minRows={2}
            />
          </Box>

          {/* CỘT PHẢI: Thanh toán */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2} color="primary">
              2. Phương thức thanh toán
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
              <RadioGroup
                value={form.paymentMethod}
                onChange={handleChange("paymentMethod")}
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Thanh toán khi nhận hàng (COD)"
                />
                <FormControlLabel
                  value="transfer"
                  control={<Radio />}
                  label="Chuyển khoản ngân hàng (QR Code)"
                />
              </RadioGroup>
            </FormControl>

            {/* LOGIC QR CODE */}
            {form.paymentMethod === "transfer" && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#f0f9f0",
                  border: "1px dashed #4caf50",
                  textAlign: "center",
                }}
              >
                {!isPaid ? (
                  <>
                    <Typography variant="body2" mb={1} fontWeight="bold">
                      Quét mã để thanh toán {total.toLocaleString("vi-VN")}đ
                    </Typography>
                    
                    {/* HÌNH ẢNH QR ĐỘNG TỪ VIETQR */}
                    <Box
                      component="img"
                      src={qrCodeUrl}
                      alt="VietQR"
                      sx={{
                        width: 200,
                        height: 200,
                        objectFit: "contain",
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: "white",
                        p: 1
                      }}
                    />

                    <Typography variant="caption" display="block" mb={2}>
                        Nội dung: <b>GREENFARM {form.phone}</b>
                        <br/>
                        (Hệ thống tự động kiểm tra sau khi bạn bấm nút dưới)
                    </Typography>

                    <Button
                      variant="contained"
                      color="warning"
                      fullWidth
                      onClick={handleCheckPayment}
                      disabled={isCheckingPayment}
                      startIcon={isCheckingPayment && <CircularProgress size={20} color="inherit" />}
                    >
                      {isCheckingPayment ? "Đang kiểm tra giao dịch..." : "Tôi đã chuyển khoản"}
                    </Button>
                  </>
                ) : (
                  <Box sx={{ py: 3 }}>
                    <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 1 }} />
                    <Typography variant="h6" color="green" fontWeight="bold">
                      Thanh toán thành công!
                    </Typography>
                    <Typography variant="body2">
                      Đơn hàng đã được xác nhận thanh toán.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* MÃ GIẢM GIÁ */}
            <Typography variant="caption" fontWeight={600} mb={1} display="block">
              Mã giảm giá
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập mã (GREEN10)"
                value={form.coupon}
                onChange={handleChange("coupon")}
              />
              <Button variant="outlined" onClick={handleApplyCoupon} size="small">
                Áp dụng
              </Button>
            </Box>

            {/* TỔNG KẾT */}
            <Box sx={{ bgcolor: "#fafafa", p: 2, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">Tạm tính</Typography>
                <Typography variant="body2">{subtotal.toLocaleString("vi-VN")} đ</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">Giảm giá</Typography>
                <Typography variant="body2" color="error">
                    {discountPercent > 0 ? `-${discountPercent}%` : "0đ"}
                </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" fontWeight={700}>
                    Tổng cộng
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary">
                    {total.toLocaleString("vi-VN")} đ
                </Typography>
                </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        <Button 
            variant="contained" 
            color="success" 
            size="large"
            onClick={handleSubmit}
            disabled={form.paymentMethod === 'transfer' && !isPaid} // Disable nếu chưa thanh toán
        >
          Hoàn tất đơn hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
}