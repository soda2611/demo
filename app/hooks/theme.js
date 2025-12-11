"use client";
import { createTheme } from "@mui/material/styles";

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
          fontFamily: "Coiny, Roboto, Arial, sans-serif",
          h4: { fontWeight: 700 },
        },
        spacing: 8,
      }),
    []
  );

  return theme;
}
