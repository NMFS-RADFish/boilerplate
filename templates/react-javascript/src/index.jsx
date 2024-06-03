import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application } from "@nmfs-radfish/radfish";

const root = ReactDOM.createRoot(document.getElementById("root"));

const app = new Application({
  mocks: {
    url:
      import.meta.env.MODE === "development"
        ? "/mockServiceWorker.js"
        : "/service-worker.js",
    handlers: import("../mocks/handlers"),
  },
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
