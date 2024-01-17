import React, { useState, useEffect } from "react";
import "./App.css";
import { FormWrapper } from "./contexts/FormWrapper";
import Toast, { TOAST_CONFIG } from "./components/Toast";
import DemoForm from "./components/Demo/Demo";
import { BrowserRouter as Router } from "react-router-dom";
import RadfishAPIService from "./services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";

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
      const { status, message } = TOAST_CONFIG.OFFLINE;
      setToast({ status, message });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // need this cleanup, else event listeners are immediately removed
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOffline]);

  // when application mounts, fetch data from endpoint and set the payload to component state
  // this data is then passed into `DemoForm` component and used to prepopulate form fields (eg dropdown) with default options fetched from server
  useEffect(() => {
    if (isOffline) {
      return;
    }
    // this function fetches any data needed for the business requirements in DemoForm
    const fetchFormData = async () => {
      const { data } = await ApiService.get(MSW_ENDPOINT.SPECIES);
      // add any other async requests here
      const newData = { species: data };
      setAsyncFormOptions((prev) => ({ ...prev, ...newData }));
    };
    fetchFormData();
  }, [isOffline]);

  const handleFormSubmit = async (submittedData) => {
    try {
      await ApiService.post(MSW_ENDPOINT.SPECIES, submittedData);
      const { status, message } = TOAST_CONFIG.SUCCESS;
      setToast({ status, message });
    } catch (err) {
      const { status, message } = TOAST_CONFIG.ERROR;
      setToast({ status, message });
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
