import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { OfflineStorageWrapper } from "./contexts/OfflineStorageWrapper.example";

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

const root = ReactDOM.createRoot(document.getElementById("root"));

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <OfflineStorageWrapper>
        <App />
      </OfflineStorageWrapper>
    </React.StrictMode>,
  );
});
