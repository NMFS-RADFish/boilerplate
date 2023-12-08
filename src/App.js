import React, { useState, useEffect } from "react";
import "./App.css";
import RADForm from "./components/RADForm.js";
import { Alert } from "@trussworks/react-uswds";

function App() {
  const [onlineStatus, setOnlineStatus] = useState(true);

  // Check if the app is offline
  const isOffline = !navigator.onLine;

  useEffect(() => {
    const handleOnline = () => {
      // You may want to refetch data when the app comes online
      setOnlineStatus(true);
    };

    const handleOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // need this cleanup, else event listeners are immediately removed
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOffline]);

  return (
    <div className="App">
      <Alert type={"error"} headingLevel={"h1"} hidden={onlineStatus}>
        {!onlineStatus && "Application currently offline"}
      </Alert>
      <main>
        <RADForm />
      </main>
    </div>
  );
}

export default App;
