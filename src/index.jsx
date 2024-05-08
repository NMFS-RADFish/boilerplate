import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { OfflineStorageWrapper } from "./packages/contexts/OfflineStorageWrapper";

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

const offlineStorageConfig = {
  type: "indexedDB",
  name: import.meta.env.VITE_INDEXED_DB_NAME || "radfish_dev",
  version: import.meta.env.VITE_INDEXED_DB_VERSION || 1,
  stores: {
    formData: "uuid, fullName, numberOfFish, species, computedPrice",
    species: "name, price",
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <OfflineStorageWrapper config={offlineStorageConfig}>
        <App />
      </OfflineStorageWrapper>
    </React.StrictMode>,
  );
});
