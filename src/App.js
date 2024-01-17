import React, { useState, useEffect } from "react";
import "./App.css";
import { FormWrapper } from "./contexts/FormWrapper";
import Toast from "./components/Toast";
import DemoForm from "./components/Demo/Demo";
import { BrowserRouter as Router } from "react-router-dom";
import RadfishAPIService from "./services/APIService";

const ApiService = new RadfishAPIService("");

function App() {
  const [asyncFormOptions, setAsyncFormOptions] = useState({});
  const [toast, setToast] = useState(null);

  // Check if the app is offline
  const isOffline = !navigator.onLine;

  useEffect(() => {
    const handleOnline = () => {
      // You may want to refetch data when the app comes online
      setToast(true);
    };

    const handleOffline = () => {
      setToast({ status: "offline", message: "Application currently offline" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // need this cleanup, else event listeners are immediately removed
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOffline]);

  useEffect(() => {
    if (isOffline) {
      return;
    }
    const fetchData = async () => {
      const { data } = await ApiService.get("/species");
      // add any other async requests here
      const newData = { species: data };
      setAsyncFormOptions((prev) => ({ ...prev, ...newData }));
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (submittedData) => {
    try {
      const { data } = await ApiService.post("/species", submittedData);
      setToast({ status: "success", message: "Successful form submission" });
    } catch (err) {
      setToast({ status: "error", message: "Error submitting form" });
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 2000);
    }
  };

  return (
    <div className="App">
      <Toast toast={toast} />
      <main>
        <Router>
          <FormWrapper onSubmit={handleFormSubmit}>
            <DemoForm asyncFormOptions={asyncFormOptions} />
          </FormWrapper>
        </Router>
      </main>
    </div>
  );
}

export default App;
