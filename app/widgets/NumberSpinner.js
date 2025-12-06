// ./NumberSpinner.jsx
import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function NumberSpinner({
  value,
  onChange,
  min = 0,
  max = 100,
  size = "small",
}) {
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? min : n;
  };

  const clamp = (n) => Math.min(max, Math.max(min, n));

  const handleMinus = () => {
    const n = clamp(toNumber(value) - 1);
    onChange?.(n);
  };

  const handlePlus = () => {
    const n = clamp(toNumber(value) + 1);
    onChange?.(n);
  };

  const handleInput = (e) => {
    const n = clamp(toNumber(e.target.value));
    onChange?.(n);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton size={size} onClick={handleMinus} aria-label="decrement" sx={{ bgcolor: '#f1f1f1', borderRadius: 1 }}>
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        size={size}
        value={value} // controlled
        onChange={handleInput}
        inputProps={{ min, max }}
        sx={{
          width: 60,
          "& input": {
            textAlign: "center",
          },
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
      <IconButton size={size} onClick={handlePlus} aria-label="increment" sx={{ bgcolor: '#f1f1f1', borderRadius: 1 }}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}
