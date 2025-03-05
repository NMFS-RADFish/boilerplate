import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application } from "@nmfs-radfish/radfish";
import { ErrorBoundary } from "@nmfs-radfish/react-radfish";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Initialize the radfish application with network features
const app = new Application({
  serviceWorker: {
    url: "/service-worker.js",
  },
  
  network: {
    // Custom timeout in milliseconds (default is 30000)
    timeout: 5000,
    
    // Fallback URLs to use when primary endpoints fail
    fallbackUrls: {
      "https://nonexistent-endpoint.example.com": "https://jsonplaceholder.typicode.com/users"
    },
    
    // Threshold for detecting network flapping (default is 3)
    flappingThreshold: 2,
    
    // Optional custom network status handler
    setIsOnline: async (networkInfo, callback) => {
      console.log("Checking network with custom handler...");
      
      try {
        // Test connectivity to a reliable endpoint
        // We perform a small HEAD request with a short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch("https://api.github.com/users", {
          method: "HEAD",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log("Network check result:", response.ok);
        callback(response.ok);
      } catch (error) {
        // Any errors indicate we're probably offline
        console.log("Network status check failed:", error.message);
        callback(false);
      }
    }
  }
});

// Listen for all network-related events
app.addEventListener("online", (event) => {
  console.log("%c NETWORK ONLINE ", "background: #4CAF50; color: #fff; font-weight: bold; padding: 4px;");
});

app.addEventListener("offline", (event) => {
  console.log("%c NETWORK OFFLINE ", "background: #F44336; color: #fff; font-weight: bold; padding: 4px;");
});

// Listen for flapping and retry events with more prominent logging
app.addEventListener("networkFlapping", (event) => {
  console.warn("%c NETWORK FLAPPING DETECTED ", "background: #FFC107; color: #000; font-weight: bold; padding: 4px;", event.detail);
});

app.addEventListener("networkRetry", (event) => {
  console.warn("%c NETWORK RETRY ", "background: #3F51B5; color: #fff; font-weight: bold; padding: 4px;", event.detail);
  
  // Show an alert for first retry attempt
  if (event.detail.attempt === 1) {
    alert(`Network retry initiated! Will retry ${event.detail.maxRetries} times.`);
  }
});

app.on("ready", () => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
        <App app={app} />
      </React.StrictMode>
    </ErrorBoundary>
  );
});
