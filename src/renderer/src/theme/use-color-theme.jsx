import { createTheme } from "@mui/material";
import React from "react";
import theme, { getDesignTokens } from "./theme";

export default function useColorTheme() {
  const [mode, setMode] = React.useState("dark");

  const toggleColorMode = () =>
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));

  const modifiedTheme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return {
    theme: modifiedTheme,
    mode,
    toggleColorMode,
  };
};