import { Route } from "react-router-dom";
import React from "react";
import { Router } from "../../../lib/electron-router-dom";

import ClippedDrawer from "../components/shared/Sidebar";
import Operacoes from "./Operacoes";
import Ativos from "./Ativos";
import Estrategias from "./Estrategias";
import Dashboards from "./Dashboards";

import { useThemeContext } from "../theme/ThemeContextProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Navigate } from "react-router-dom";

function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router
        main={
          <>
            <Route
              path="/"
              element={<ClippedDrawer />}
              // errorElement={<ErrorScreen />}
            >
              <Route index element={<Navigate to="/dashboards" replace />} />
              <Route path="/operacoes" element={<Operacoes />} />
              <Route path="/ativos" element={<Ativos />} />
              <Route path="/estrategias" element={<Estrategias />} />
              <Route path="/dashboards" element={<Dashboards />} />
            </Route>
          </>
        }
      />
    </ThemeProvider>
  );
}

export default App;
