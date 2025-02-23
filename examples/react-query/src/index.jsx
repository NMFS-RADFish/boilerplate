import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "@nmfs-radfish/react-radfish";
import "./styles/theme.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Application } from "@nmfs-radfish/radfish";

const app = new Application({
  serviceWorker: {
    url:
      import.meta.env.MODE === "development"
        ? "/mockServiceWorker.js"
        : "/service-worker.js",
  },
  mocks: {
    handlers: import("../mocks/handlers.js"),
  },
  network: {
    setIsOnline: async (networkInformation, callback) => {
      const response = await fetch("https://example.com")
      return callback(response.status === 200);
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();

app.on("ready", () => {
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
