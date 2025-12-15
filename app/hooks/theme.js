"use client";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";

export function useCustomTheme() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#1faa54ff", light: "#37be3cff" },
          secondary: { main: "#ebff38ff" },
          text: { primary: "#000000" },
        },
        typography: {
          fontFamily: "Roboto, Arial, sans-serif",
          h1: { fontFamily: "Coiny, Roboto, Arial, sans-serif" },
          h2: { fontFamily: "Coiny, Roboto, Arial, sans-serif" },
          h3: { fontFamily: "Coiny, Roboto, Arial, sans-serif" },
          h4: { fontFamily: "Coiny, Roboto, Arial, sans-serif" },
          h5: { fontFamily: "Coiny, Roboto, Arial, sans-serif" },
          h6: { fontFamily: "Coiny, Roboto, Arial, sans-serif" },
        },
        spacing: 8,
      }),
    []
  );

  return theme;
}
