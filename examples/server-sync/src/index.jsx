import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";
import { ErrorBoundary, OfflineStorageWrapper } from "@nmfs-radfish/react-radfish";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  const onUnhandledRequest = "bypass";

  if (import.meta.env.MODE === "development") {
    return worker.start({
      onUnhandledRequest,
      serviceWorker: {
        url: `/mockServiceWorker.js`,
      },
    });
  }

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest,
    serviceWorker: {
      url: `/service-worker.js`,
    },
  });
}

const app = new Application({
  storage: new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME,
    import.meta.env.VITE_INDEXED_DB_VERSION,
    {
      localData: "value, isSynced",
      lastSyncFromServer: "uuid, time",
    },
  ),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

enableMocking().then(() => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
        <App application={app} />
      </React.StrictMode>
    </ErrorBoundary>,
  );
});
