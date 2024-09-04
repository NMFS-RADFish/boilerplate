import "./index.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { Toast, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { FormWrapper } from "./contexts/FormWrapper.example";
import { TableWrapper } from "./contexts/TableWrapper.example";
import { MSW_ENDPOINT } from "./mocks/handlers";
import { Table } from "./pages/Table.example";
import { Form } from "./pages/Form.example";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { ServerSync } from "./components/ServerSync";
import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "./hooks/useToast";
import HeaderNav from "./components/HeaderNav";
import { GridContainer } from "@trussworks/react-uswds";

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
      const species = await findOfflineData("species");
      const speciesList = species?.map((item) => item?.name);
      setAsyncFormOptions((prev) => ({ ...prev, species: speciesList }));
    };
    fetchFormData();
  }, []);

  const postRequestWithFetch = async (endpoint, submittedData) => {
    try {
      const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Token": "your-access-token",
          },
          body: JSON.stringify({
            ...{ formData: submittedData },
          }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        return error;
      }
  
      const data = await response.json();
      return data;
  
    } catch (err) {
      const error = `[GET]: Error fetching data: ${err}`;
      return error;
    }
  };

  const handleFormSubmit = async (submittedData) => {
    const existingForm =
      submittedData.uuid && (await findOfflineData("formData", { uuid: submittedData.uuid }));
    try {
      if (!isOffline) {
        const {data} = await postRequestWithFetch(MSW_ENDPOINT.FORM, submittedData)

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
        <HeaderNav>
          <Link to="/">Home</Link>
          <Link to="/form">Form</Link>
          <Link to="/table">Table</Link>
        </HeaderNav>
        <GridContainer>
          <ServerSync />
          {/* Route paths for the application. All routes need to be wrapped by `BrowserRouter` and `Routes` */}
          <Routes>
            <Route
              path="/"
              element={
                <TableWrapper>
                  <Table />
                </TableWrapper>
              }
            />
            <Route
              path="/table"
              element={
                <TableWrapper>
                  <Table />
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
        </GridContainer>
      </div>
    </Router>
  );
}

export default App;
