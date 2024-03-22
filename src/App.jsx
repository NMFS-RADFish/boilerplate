import "./index.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Toast, TOAST_CONFIG } from "./react-radfish";
import { FormWrapper } from "./contexts/FormWrapper";
import { TableWrapper } from "./contexts/TableWrapper";
import Layout from "./components/Layout";
import RadfishAPIService from "./services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";
import { ComplexForm } from "./demos/ComplexForm";
import { MultiStepForm } from "./demos/MultiStepForm";
import { DemoTable } from "./components/DemoTable";

const ApiService = new RadfishAPIService("");

// lifespan toast message should be visible in ms
const TOAST_LIFESPAN = 2000;

function App() {
  const [asyncFormOptions, setAsyncFormOptions] = useState({});
  const [toast, setToast] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  // Check if the app is offline
  const checkConnectivity = async () => {
    try {
      const online = navigator.onLine;
      if (online) {
        handleOnline();
      } else {
        handleOffline();
      }
    } catch (error) {
      handleOffline();
    }
  };

  const handleOnline = () => {
    setIsOffline(false);
    setToast(true);
  };

  const handleOffline = () => {
    setIsOffline(true);
    const { status, message } = TOAST_CONFIG.OFFLINE;
    setToast({ status, message });
  };

  useEffect(() => {
    checkConnectivity();

    window.addEventListener("online", checkConnectivity);
    window.addEventListener("offline", checkConnectivity);

    return () => {
      window.removeEventListener("online", checkConnectivity);
      window.removeEventListener("offline", checkConnectivity);
    };
  }, []);

  // when application mounts, fetch data from endpoint and set the payload to component state
  // this data is then passed into `DemoForm` component and used to prepopulate form fields (eg dropdown) with default options fetched from server
  useEffect(() => {
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
    <Router>
      <div className="App">
        <Toast toast={toast} />
        <Layout>
          {/* Route paths for the application. All routes need to be wrapped by `BrowserRouter` and `Routes` */}
          <Routes>
            {/* On root route "/", render the DemoForm component along with it's context for state management */}
            <Route
              path="/"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <ComplexForm asyncFormOptions={asyncFormOptions} />
                </FormWrapper>
              }
            />
            {/* On "/table" route, render the DemoTable component along with it's context for state management */}
            <Route
              path="/table"
              element={
                <TableWrapper>
                  <DemoTable />
                </TableWrapper>
              }
            />
            <Route
              path="/multistep"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <MultiStepForm asyncFormOptions={asyncFormOptions} />
                </FormWrapper>
              }
            />
            <Route
              path="/multistep/:uuid"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <MultiStepForm asyncFormOptions={asyncFormOptions} />
                </FormWrapper>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
