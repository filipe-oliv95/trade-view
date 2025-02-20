import { blueGrey, deepOrange, grey, red } from "@mui/material/colors";

const theme = {
  palette: {
    primary: deepOrange,
  },
};

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "dark"
      ? {
          // Paleta para o modo escuro
          primary: grey,
          divider: grey[700],
          background: {
            default: grey[900],
            paper: grey[900],
          },
          text: {
            primary: "#fff",
            secondary: grey[500],
            terciary: grey[900],
          },
          success: {
            main: "#4CAF50",
          },
          error: {
            main: "#FF6B6B",
          },

        }
      : {
          // Paleta para o modo claro
          primary: blueGrey,
          divider: blueGrey[200],
          background: {
            default: grey[100],
            paper: grey[50],
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
            terciary: grey[900],
          },
          success: {
            main: "#4CAF50",
          },
          error: {
            main: "#FF6B6B",
          },
        }),
  },
});

export default theme;