import React, { useState, useEffect } from "react";
import "./App.css";
import RADForm from "./components/RadForm/RADForm";
import { Alert } from "@trussworks/react-uswds";

function App() {
  const [onlineStatus, setOnlineStatus] = useState(false);

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
      <Alert
        type={onlineStatus ? "success" : "error"}
        headingLevel={"h1"}
        hidden={false}
      >
        {onlineStatus ? "Application online!" : "Application currently offline"}
      </Alert>
      <main>
        <RADForm />
      </main>
    </div>
  );
}

export default App;
