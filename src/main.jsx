import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.jsx";
import { ErrorBoundary } from "./app/ErrorBoundary.jsx";
import "./styles/index.css";
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
