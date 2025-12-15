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
    fontFamily: "Calibri, Arial, sans-serif",
    h1: { fontFamily: "Coiny, Calibri, Arial, sans-serif" },
    h2: { fontFamily: "Coiny, Calibri, Arial, sans-serif" },
    h3: { fontFamily: "Coiny, Calibri, Arial, sans-serif" },
    h4: { fontFamily: "Coiny, Calibri, Arial, sans-serif" },
    h5: { fontFamily: "Coiny, Calibri, Arial, sans-serif" },
    h6: { fontFamily: "Coiny, Calibri, Arial, sans-serif" },
  },
  spacing: 8,
};

export function useCustomTheme() {
  return useMemo(() => createTheme(THEME_OPTIONS), []);
}
