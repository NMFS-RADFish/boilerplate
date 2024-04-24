import "./index.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Toast } from "./packages/react-components";
import { TableWrapper } from "./contexts/TableWrapper.example";
import Layout from "./components/Layout";
import RadfishAPIService from "./packages/services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";
import { TripReportTable } from "./pages/TripReportTable";
import { TripReportTableClamLobster } from "./pages/TripReportTableClamLobster";
import useOfflineStorage from "./hooks/useOfflineStorage.example";

const ApiService = new RadfishAPIService("");

function App() {
  const [toast, setToast] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const { updateOfflineData, findOfflineData } = useOfflineStorage();

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

  useEffect(() => {
    if (!isOffline) {
      initializeLaunchSequence();
    }
  }, [isOffline]);

  const syncToHomebase = async () => {
    console.log("syncing...");
    await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
    const { data: tripReportData } = await ApiService.get(MSW_ENDPOINT.TRIP_REPORT);

    await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
    const { data: tripReportDataClamLobster } = await ApiService.get(
      MSW_ENDPOINT.TRIP_REPORT_CLAM_LOBSTER,
    );

    await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
    console.log("caching offline data...");

    await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
    await updateOfflineData("offlineTripReportData", tripReportData);
    await updateOfflineData("offlineTripReportClamLobsterData", tripReportDataClamLobster);

    initializeLaunchSequence();
    localStorage.setItem("lastHomebaseSync", Date.now());
  };

  const initializeLaunchSequence = async () => {
    console.log("checking if all data is present...");
    const offlineTripReportData = await findOfflineData("offlineTripReportData");
    const offlineTripReportClamLobsterData = await findOfflineData(
      "offlineTripReportClamLobsterData",
    );
    if (!offlineTripReportData.length || !offlineTripReportClamLobsterData.length) {
      throw new Error("data not synced, try resyncing");
    }
    if (offlineTripReportData.length === 7 && offlineTripReportClamLobsterData.length === 7) {
      console.log("all data cached, ready to launch!");
    }
  };

  return (
    <Router>
      <div className="App">
        <div className="toast-container">
          <Toast toast={toast} />
        </div>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Trip Reporting App</h1>
                  <button onClick={syncToHomebase}>sync to homebase</button>
                </div>
              }
            />
            <Route
              path="/tripReport"
              element={
                <TableWrapper>
                  <TripReportTable />
                </TableWrapper>
              }
            />
            <Route
              path="/tripReportClamLobster"
              element={
                <TableWrapper>
                  <TripReportTableClamLobster />
                </TableWrapper>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
