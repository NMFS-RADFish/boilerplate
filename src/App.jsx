import "./index.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Toast, ToastStatus } from "./packages/react-components";
import { FormWrapper } from "./contexts/FormWrapper.example";
import { TableWrapper } from "./contexts/TableWrapper.example";
import Layout from "./components/Layout";
import RadfishAPIService from "./packages/services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";
import { ComplexForm } from "./pages/ComplexForm.example";
import { MultiStepForm } from "./pages/MultiStepForm.example";
import { SimpleTable } from "./pages/Table.example";
import useOfflineStorage from "./hooks/useOfflineStorage.example";

const ApiService = new RadfishAPIService("");

// lifespan toast message should be visible in ms
const TOAST_LIFESPAN = 2000;

function App() {
  const { updateOfflineData, findOfflineData } = useOfflineStorage();
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
    const { status, message } = ToastStatus.OFFLINE;
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
      const milisecondsIn24Hours = 86400000;
      const currentTimeStamp = Date.now();
      const speciesLastUpdated = localStorage.getItem("speciesLastUpdated");
      const isSpeciesLastUpdateOver24Hours =
        speciesLastUpdated + milisecondsIn24Hours > currentTimeStamp;

      // if offline, fetch species data from indexedDB
      if (!navigator.onLine) {
        const species = await findOfflineData("species");
        const speciesList = species?.map((item) => item?.name);
        setAsyncFormOptions((prev) => ({ ...prev, species: speciesList }));
      } else {
        // add any other async requests here
        const newData = { species: data };
        setAsyncFormOptions((prev) => ({ ...prev, ...newData }));
      }

      if (!speciesLastUpdated || isSpeciesLastUpdateOver24Hours) {
        const species = data.map((item) => ({ name: item }));
        const updated = await updateOfflineData("species", species);
        // if all data is updated, set the last updated timestamp
        if (updated.length === data.length) {
          localStorage.setItem("speciesLastUpdated", currentTimeStamp);
        }
      }
    };
    fetchFormData();
  }, [isOffline]);

  const handleFormSubmit = async (submittedData) => {
    try {
      await ApiService.post(MSW_ENDPOINT.SPECIES, submittedData);
      const { status, message } = ToastStatus.SUCCESS;
      setToast({ status, message });
    } catch (err) {
      const { status, message } = ToastStatus.ERROR;
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
        <div className="toast-container">
          <Toast toast={toast} />
        </div>
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
                  <SimpleTable />
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
              path="/multistep/:id"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <MultiStepForm asyncFormOptions={asyncFormOptions} />
                </FormWrapper>
              }
            />
            <Route
              path="/complexform"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <ComplexForm asyncFormOptions={asyncFormOptions} />
                </FormWrapper>
              }
            />
            <Route
              path="/complexform/:id"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <ComplexForm asyncFormOptions={asyncFormOptions} />
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
