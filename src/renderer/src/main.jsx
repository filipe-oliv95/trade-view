import ReactDOM from "react-dom/client";
import React from "react";

import { DataProvider } from "./context/DataContext";
import { ThemeContextProvider } from "./theme/ThemeContextProvider";

import App from "./App/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
