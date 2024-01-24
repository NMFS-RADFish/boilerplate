import "./index.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toast, TOAST_CONFIG } from "./react-radfish";
import { FormWrapper } from "./contexts/FormWrapper";
import Layout from "./components/Layout";
import RadfishAPIService from "./services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";
import { DemoForm } from "./components/DemoForm";

const ApiService = new RadfishAPIService("");

// lifespan toast message should be visible in ms
const TOAST_LIFESPAN = 2000;

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
      }, TOAST_LIFESPAN);
    }
  };

  return (
    <div className="App">
      <Toast toast={toast} />
      <Layout>
        <Router>
          <FormWrapper onSubmit={handleFormSubmit}>
            <DemoForm asyncFormOptions={asyncFormOptions} />
          </FormWrapper>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
