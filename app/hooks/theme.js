//app/hooks/theme.js
"use client";

import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";

const THEME_OPTIONS = {
  palette: {
    mode: "light",
    primary: { main: "#1faa54ff", light: "#37be3cff" },
    secondary: { main: "#ebff38ff" },
    text: { primary: "#000000" },
  },
  typography: {
    fontFamily: "Coiny, Roboto, Arial, sans-serif",
    h4: { fontWeight: 700 },
  },
  spacing: 8,
};

export function useCustomTheme() {
  return useMemo(() => createTheme(THEME_OPTIONS), []);
}
