
// ./NumberSpinner.jsx
import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function NumberSpinner({
  value,
  onChange,
  min = 0,
  // CHO PHÉP VÔ HẠN: dùng Infinity là không giới hạn
  max = Infinity,
  size = "small",
}) {
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? min : n;
  };

  // Nếu max = Infinity hoặc undefined => bỏ giới hạn trên
  const clamp = (n) => {
    const boundedMin = Math.max(min, n);
    const hasMax = Number.isFinite(max); // chỉ clamp max nếu là số hữu hạn
    return hasMax ? Math.min(max, boundedMin) : boundedMin;
  };

  const handleMinus = () => {
    const n = clamp(toNumber(value) - 1);
    onChange?.(n);
  };

  const handlePlus = () => {
    // KHÔNG giới hạn max khi vô hạn
    const current = toNumber(value);
    const next = current + 1;
    onChange?.(clamp(next));
  };

  const handleInput = (e) => {
    const n = clamp(toNumber(e.target.value));
    onChange?.(n);
  };

  // Không set inputProps.max khi max là vô hạn để tránh browser chặn
  const inputProps = Number.isFinite(max)
    ? { min, max }
    : { min };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        size={size}
        onClick={handleMinus}
        aria-label="decrement"
        sx={{ bgcolor: '#d1d1d1ff', borderRadius: 1 }}
      >
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        size={size}
        value={value} // controlled
        onChange={handleInput}
        inputProps={inputProps}
        sx={{
          width: 60,
          "& input": { textAlign: "center" },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
      />
      <IconButton
        size={size}
        onClick={handlePlus}
        aria-label="increment"
        sx={{ bgcolor: '#d1d1d1ff', borderRadius: 1 }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
