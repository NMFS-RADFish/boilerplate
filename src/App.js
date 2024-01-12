import React, { useState, useEffect } from "react";
import "./App.css";
import { Alert } from "@trussworks/react-uswds";
import { FormWrapper } from "./contexts/FormWrapper";
import DemoForm from "./components/Demo/Demo";
import { BrowserRouter as Router } from "react-router-dom";

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

  const handleFormSubmit = (submittedData) => {
    console.log("Form Data Submitted:", submittedData);
  };

  return (
    <div className="App">
      {!onlineStatus && (
        <Alert type={"error"} headingLevel={"h1"} hidden={onlineStatus}>
          Application currently offline
        </Alert>
      )}
      <main>
        <Router>
          <FormWrapper onSubmit={handleFormSubmit}>
            <DemoForm />
          </FormWrapper>
        </Router>
      </main>
    </div>
  );
}

export default App;
