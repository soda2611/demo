// app/components/CheckoutDialog.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddressForm from "./AddressForm";

const BANK_INFO = {
  bankId: "MB",
  accountNo: "79797979",
  accountName: "GREENFARM STORE",
  template: "compact",
};

const COUPON_RULES = {
  GREEN10: 10,
  GREEN20: 20,
  GREEN50: 50,
  GREEN90: 90,
  GREEN100: 100,
};

const PAYMENT_CHECK_DELAY_MS = 5000;

const INITIAL_FORM = {
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
};

function buildFullAddress(form) {
  return `${form.street}, ${form.ward}, ${form.district}, ${form.province}`;
}

function buildVietQrUrl({ total, phone }) {
  const amount = Math.floor(total);
  const addInfo = `GREENFARM ${phone || ""}`.trim();
  return `https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${amount}&addInfo=${encodeURIComponent(
    addInfo
  )}`;
}

export default function CheckoutDialog({
  open,
  onClose,
  items = [],
  subtotal = 0,
  onSuccess,
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  const [error, setError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const discountAmount = useMemo(
    () => subtotal * (discountPercent / 100),
    [subtotal, discountPercent]
  );

  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const qrCodeUrl = useMemo(
    () => buildVietQrUrl({ total, phone: form.phone }),
    [total, form.phone]
  );

  const handleChange = useCallback(
    (field) => (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleApplyCoupon = useCallback(() => {
    const code = String(form.coupon || "").trim().toUpperCase();

    if (!code) {
      setDiscountPercent(0);
      setAppliedVoucher(null);
      setError("");
      return;
    }

    const percent = COUPON_RULES[code];
    if (!percent) {
      setDiscountPercent(0);
      setAppliedVoucher(null);
      setError("Mã giảm giá không hợp lệ.");
      return;
    }

    setDiscountPercent(percent);
    setAppliedVoucher(code);
    setError("");
  }, [form.coupon]);

  const handleCheckPayment = useCallback(() => {
    setIsCheckingPayment(true);
    setError("");

    setTimeout(() => {
      setIsCheckingPayment(false);
      setIsPaid(true);
    }, PAYMENT_CHECK_DELAY_MS);
  }, []);

  const handleSubmit = useCallback(() => {
    const hasAddress = form.street && form.province && form.district && form.ward;

    if (!form.fullName || !form.phone || !hasAddress) {
      setError("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
      return;
    }

    if (form.paymentMethod === "transfer" && !isPaid) {
      setError("Vui lòng hoàn tất chuyển khoản trước khi đặt hàng.");
      return;
    }

    const fullAddress = buildFullAddress(form);

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
        status: isPaid ? "paid" : "pending",
      },
      items,
    });
  }, [appliedVoucher, discountPercent, form, isPaid, items, onSuccess, subtotal, total]);

  // Reset state khi đóng dialog
  useEffect(() => {
    if (open) return;

    setDiscountPercent(0);
    setAppliedVoucher(null);
    setIsPaid(false);
    setIsCheckingPayment(false);
    setError("");
    setForm(INITIAL_FORM);
  }, [open]);

  // Reset trạng thái thanh toán khi đổi phương thức hoặc tổng tiền thay đổi
  useEffect(() => {
    if (!open) return;          // chỉ reset khi dialog đang mở
    setIsPaid(false);
  }, [total, form.paymentMethod, open]);
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
          {/* CỘT TRÁI */}
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
                onChange={(addr) => setForm((prev) => ({ ...prev, ...addr }))}
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

          {/* CỘT PHẢI */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2} color="primary">
              2. Phương thức thanh toán
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
              <RadioGroup value={form.paymentMethod} onChange={handleChange("paymentMethod")}>
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
                        p: 1,
                      }}
                    />

                    <Typography variant="caption" display="block" mb={2}>
                      Nội dung: <b>GREENFARM {form.phone}</b>
                      <br />
                      (Hệ thống tự động kiểm tra sau khi bạn bấm nút dưới)
                    </Typography>

                    <Button
                      variant="contained"
                      color="warning"
                      fullWidth
                      onClick={handleCheckPayment}
                      disabled={isCheckingPayment}
                      startIcon={
                        isCheckingPayment ? <CircularProgress size={20} color="inherit" /> : null
                      }
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
                    <Typography variant="body2">Đơn hàng đã được xác nhận thanh toán.</Typography>
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" fontWeight={600} mb={1} display="block">
              Mã giảm giá
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                placeholder="Nhập mã (GREEN10)"
                value={form.coupon}
                onChange={handleChange("coupon")}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="outlined" onClick={handleApplyCoupon} size="small">
                Áp dụng
              </Button>
            </Box>

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
          disabled={form.paymentMethod === "transfer" && !isPaid}
        >
          Hoàn tất đơn hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
