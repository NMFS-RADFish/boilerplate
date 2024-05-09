import "./index.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Toast } from "./packages/react-components";
import { FormWrapper } from "./contexts/FormWrapper.example";
import { TableWrapper } from "./contexts/TableWrapper.example";
import Layout from "./components/Layout";
import RadfishAPIService from "./packages/services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";
import { SimpleTable } from "./pages/Table.example";
import { Form } from "./pages/Form.example";
import { useOfflineStatus } from "./hooks/useOfflineStatus";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";
import { ServerSync } from "./components/ServerSync";
import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "./hooks/useToast";
import { useOfflineStatus } from "./hooks/useOfflineStatus";

const ApiService = new RadfishAPIService("");

function App() {
  const { updateOfflineData, findOfflineData, createOfflineData } = useOfflineStorage();
  const [asyncFormOptions, setAsyncFormOptions] = useState({});
  const { toast, showToast, dismissToast } = useToast();
  const { isOffline } = useOfflineStatus();

  useEffect(() => {
    if (isOffline) {
      showToast(TOAST_CONFIG.OFFLINE);
      setTimeout(() => {
        dismissToast();
      }, TOAST_LIFESPAN);
    }
  }, [isOffline]);

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
    const existingForm =
      submittedData.uuid && (await findOfflineData("formData", { uuid: submittedData.uuid }));
    try {
      if (!isOffline) {
        const { data } = await ApiService.post(MSW_ENDPOINT.FORM, { formData: submittedData });
        existingForm
          ? await updateOfflineData("formData", [{ uuid: data.uuid, ...data }])
          : await createOfflineData("formData", submittedData);
        showToast(TOAST_CONFIG.SUCCESS);
      } else {
        existingForm
          ? await updateOfflineData("formData", [{ uuid: submittedData.uuid, ...submittedData }])
          : await createOfflineData("formData", submittedData);
        showToast(TOAST_CONFIG.OFFLINE_SUBMIT);
      }
    } catch (error) {
      showToast(TOAST_CONFIG.ERROR);
    } finally {
      setTimeout(() => {
        dismissToast();
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
          <ServerSync />
          {/* Route paths for the application. All routes need to be wrapped by `BrowserRouter` and `Routes` */}
          <Routes>
            <Route
              path="/"
              element={
                <TableWrapper>
                  <SimpleTable />
                </TableWrapper>
              }
            />
            <Route
              path="/table"
              element={
                <TableWrapper>
                  <SimpleTable />
                </TableWrapper>
              }
            />
            <Route
              path="/form"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <Form asyncFormOptions={asyncFormOptions} />
                </FormWrapper>
              }
            />
            <Route
              path="/form/:id"
              element={
                <FormWrapper onSubmit={handleFormSubmit}>
                  <Form asyncFormOptions={asyncFormOptions} />
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
