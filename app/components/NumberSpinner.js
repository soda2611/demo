// app/components/NumberSpinner.js
import React, { useCallback, useMemo } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const BUTTON_SX = { bgcolor: "#d1d1d1ff", borderRadius: 1 };

export default function NumberSpinner({
  value,
  onChange,
  min = 0,
  max = Infinity,
  size = "small",
}) {
  const hasMax = Number.isFinite(max);

  const toNumber = useCallback(
    (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? min : n;
    },
    [min]
  );

  const clamp = useCallback(
    (n) => {
      const boundedMin = Math.max(min, n);
      return hasMax ? Math.min(max, boundedMin) : boundedMin;
    },
    [hasMax, max, min]
  );

  const handleMinus = useCallback(() => {
    onChange?.(clamp(toNumber(value) - 1));
  }, [clamp, onChange, toNumber, value]);

  const handlePlus = useCallback(() => {
    onChange?.(clamp(toNumber(value) + 1));
  }, [clamp, onChange, toNumber, value]);

  const handleInput = useCallback(
    (e) => {
      onChange?.(clamp(toNumber(e.target.value)));
    },
    [clamp, onChange, toNumber]
  );

  const inputProps = useMemo(() => (hasMax ? { min, max } : { min }), [hasMax, max, min]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton size={size} onClick={handleMinus} aria-label="decrement" sx={BUTTON_SX}>
        <RemoveIcon />
      </IconButton>

      <TextField
        type="number"
        size={size}
        value={value}
        onChange={handleInput}
        inputProps={inputProps}
        sx={{
          width: 60,
          "& input": { textAlign: "center" },
          "& input[type=number]::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
          "& input[type=number]::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
          "& input[type=number]": { MozAppearance: "textfield" },
        }}
      />

      <IconButton size={size} onClick={handlePlus} aria-label="increment" sx={BUTTON_SX}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}
