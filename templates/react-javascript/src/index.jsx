import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application } from "@nmfs-radfish/radfish";

const root = ReactDOM.createRoot(document.getElementById("root"));

const app = new Application({
  serviceWorker: {
    url:
      import.meta.env.MODE === "development"
        ? "/mockServiceWorker.js"
        : "/service-worker.js",
  },
  mocks: {
    handlers: import("../mocks/browser.js"),
  },
  network: {
    // Health check configuration
    health: {
      // Endpoint URL for health checks
      endpointUrl: "https://api.github.com/zen",
      // Custom timeout in milliseconds
      timeout: 3000
    },
    
    // Example fallback URLs for resilient requests
    fallbackUrls: {
      // Map primary URLs to fallback URLs
      "https://api.example.com/primary": "https://api.example.com/backup"
    },
    
    // Custom network status handler
    setIsOnline: async (networkInformation, callback) => {
      try {
        // First check basic connection status
        if (!navigator.onLine) {
          return callback(false);
        }

        // Simple ping test to verify actual connectivity
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('https://api.github.com/zen', { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return callback(response.ok);
      } catch (error) {
        console.warn('Network check failed:', error);
        return callback(false);
      }
    }
  }
});

app.on("ready", async () => {
  root.render(
    <React.StrictMode>
      <App application={app} />
    </React.StrictMode>,
  );
});
