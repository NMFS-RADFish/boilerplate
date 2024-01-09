import React, { useState, useEffect } from "react";
import "./App.css";
import RADForm from "./components/RadForm/RADForm";
import { Alert } from "@trussworks/react-uswds";
import RadfishAPIService from "./services/APIService";

const ApiService = new RadfishAPIService("");

function App() {
  const [onlineStatus, setOnlineStatus] = useState(true);

  // should this be a reusable hook?
  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiService.get("/species");
      console.log("response data to populate species dropdown ", response);
    };
    fetchData();
  }, []);

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
      {!onlineStatus && (
        <Alert type={"error"} headingLevel={"h1"} hidden={onlineStatus}>
          Application currently offline
        </Alert>
      )}
      <main>
        <RADForm />
      </main>
    </div>
  );
}

export default App;
