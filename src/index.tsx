import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import ThemeManager from "./components/ThemeManager";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeManager />
      <App />
    </Provider>
  </React.StrictMode>
);
