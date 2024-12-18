import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";
import { ErrorBoundary, OfflineStorageWrapper } from "@nmfs-radfish/react-radfish";

const app = new Application({
  serviceWorker: {
    url: import.meta.env.MODE === "development" ? "/mockServiceWorker.js" : "/service-worker.js",
  },
  storage: new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME,
    import.meta.env.VITE_INDEXED_DB_VERSION,
    {
      formData: "uuid, fullName, numberOfFish, species, computedPrice, isDraft",
    },
  ),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <App application={app} />
    </React.StrictMode>
  </ErrorBoundary>,
);
