import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import RADFishApplication from "./components/RADFishApplication";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RADFishApplication />
  </React.StrictMode>,
);
