//app/components/CheckoutDialog.js
import React, { useState, useMemo, useEffect } from "react";
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
  Checkbox,
} from "@mui/material";

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
    address: "",
    note: "",
    coupon: "",
    paymentMethod: "cod",
    transferred: false,
  });

  const [error, setError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // ❗ Tính toán tiền đúng cách — KHÔNG ghi đè subtotal
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

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

  // SUBMIT
  const handleSubmit = () => {
    if (!form.fullName || !form.phone || !form.address) {
      setError("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
      return;
    }

    if (form.paymentMethod === "transfer" && !form.transferred) {
      setError('Vui lòng chuyển khoản và tick "Tôi đã chuyển khoản".');
      return;
    }

    onSuccess?.({
      customer: { ...form },
      payment: {
        method: form.paymentMethod,
        coupon: appliedVoucher,
        discountPercent,
        subtotal,
        total,
      },
      items,
    });
  };

  // ❗ RESET giảm giá + form mỗi khi dialog ĐÓNG
  useEffect(() => {
    if (!open) {
      setDiscountPercent(0);
      setAppliedVoucher(null);
      setForm({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: "",
        coupon: "",
        paymentMethod: "cod",
        transferred: false,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span" fontWeight={700}>
          Thanh toán
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 3,
          }}
        >
          {/* CỘT TRÁI: Thông tin khách hàng */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Thông tin người nhận
            </Typography>

            <TextField
              fullWidth
              label="Họ và tên"
              margin="dense"
              value={form.fullName}
              onChange={handleChange("fullName")}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              margin="dense"
              value={form.phone}
              onChange={handleChange("phone")}
            />
            <TextField
              fullWidth
              label="Email (tuỳ chọn)"
              margin="dense"
              value={form.email}
              onChange={handleChange("email")}
            />
            <TextField
              fullWidth
              label="Địa chỉ nhận hàng (số nhà, tên đường, phường/xã, quận/huyện, TP)"
              margin="dense"
              value={form.address}
              onChange={handleChange("address")}
              multiline
              minRows={2}
            />
            <TextField
              fullWidth
              label="Ghi chú cho đơn hàng"
              margin="dense"
              value={form.note}
              onChange={handleChange("note")}
              multiline
              minRows={2}
            />
          </Box>

          {/* CỘT PHẢI: Thanh toán + tóm tắt */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Hình thức thanh toán
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Chọn phương thức</FormLabel>
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
                  label="Chuyển khoản ngân hàng"
                />
              </RadioGroup>
            </FormControl>

            {form.paymentMethod === "transfer" && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  border: "1px dashed #ccc",
                }}
              >
                <Typography variant="body2" mb={1}>
                  Vui lòng quét mã QR bên dưới để chuyển khoản. Nội dung:
                  <b> &quot;Thanh toan GreenFarm&quot;</b>
                </Typography>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    mx: "auto",
                    mb: 1.5,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "#f5f5f5",
                  }}
                >
                  {/* Bạn thay đường dẫn QR thật của shop vào đây */}
                  <img
                    src="/images/payment/qr-greenfarm.png"
                    alt="QR thanh toán"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.transferred}
                      onChange={handleChange("transferred")}
                    />
                  }
                  label="Tôi đã chuyển khoản xong"
                />
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Mã giảm giá
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập mã (GREEN10)"
                value={form.coupon}
                onChange={handleChange("coupon")}
              />
              <Button variant="outlined" onClick={handleApplyCoupon}>
                Áp dụng
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Tóm tắt tiền */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography>Tạm tính</Typography>
              <Typography>{subtotal.toLocaleString("vi-VN")} đ</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography>Giảm giá</Typography>
              <Typography>
                {discountPercent > 0 ? `- ${discountPercent}%` : "0%"}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="h6" fontWeight={700}>
                Tổng thanh toán
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {total.toLocaleString("vi-VN")} đ
              </Typography>
            </Box>

            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Xác nhận thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}
