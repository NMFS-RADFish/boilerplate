import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { ErrorBoundary, OfflineStorageWrapper } from "@nmfs-radfish/react-radfish";
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";

const app = new Application({
  storage: new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME,
    import.meta.env.VITE_INDEXED_DB_VERSION,
    {
      localData: "value, isSynced",
      lastSyncFromServer: "uuid, time",
    },
  ),
  mocks: {
    handlers: import("./mocks/browser"),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

app.on("ready", () => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
        <App application={app} />
      </React.StrictMode>
    </ErrorBoundary>,
  );
});
