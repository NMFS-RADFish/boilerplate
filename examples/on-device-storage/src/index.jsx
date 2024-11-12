import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { ErrorBoundary } from "@nmfs-radfish/react-radfish";
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";

const offlineStorageConfig = {
  type: "indexedDB",
  name: import.meta.env.VITE_INDEXED_DB_NAME,
  version: import.meta.env.VITE_INDEXED_DB_VERSION,
  stores: {
    formData:
      "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
    species: "name, price",
    homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
  },
};

const app = new Application({
  storage: new IndexedDBMethod(
    offlineStorageConfig.name,
    offlineStorageConfig.version,
    offlineStorageConfig.stores,
  ),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

app.on("ready", () => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
          <App application={app}/>
      </React.StrictMode>
    </ErrorBoundary>,
  );
});