import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "@nmfs-radfish/react-radfish";
import "./styles/theme.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const queryClient = new QueryClient();

enableMocking().then(() => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.StrictMode>
    </ErrorBoundary>,
  );
});
