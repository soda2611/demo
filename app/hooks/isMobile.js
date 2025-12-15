//app/hooks/isMobile.js
"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const MOBILE_BREAKPOINT = "md";

export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(MOBILE_BREAKPOINT));
}
