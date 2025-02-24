import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary, ApplicationContext } from "@nmfs-radfish/react-radfish";
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
      try {
        // First check basic connection status
        console.log('navigator.onLine:', !navigator.onLine);
        if (!navigator.onLine) {
          return callback(false);
        }

        // Simple ping test to verify actual connectivity
        const response = await fetch('https://api.github.com/zen', { 
          method: 'HEAD',
          timeout: 3000 
        });

        return callback(response.ok);
      } catch (error) {
        console.warn('Network check failed:', error);
        return callback(false);
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();

app.on("ready", () => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
        <ApplicationContext.Provider value={app}>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ApplicationContext.Provider>
      </React.StrictMode>
    </ErrorBoundary>,
  );
});
