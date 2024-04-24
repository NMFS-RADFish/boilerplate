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
import { HomePage } from "./pages/HomePage";

const ApiService = new RadfishAPIService("");

function App() {
  const [toast, setToast] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
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
    if (!isOffline) {
      setIsLoading(true);
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
      setIsLoading(false);
    } else {
      console.log("No network conection, unable to sync with server");
      console.log("Application in offline mode, using cache.");
      console.log(
        `${localStorage.getItem("lastHomebaseSync") ? `Last sync at: ${localStorage.getItem("lastHomebaseSync")}` : "Application has not yet been synced with homebase"}`,
      );
      setIsLoading(false);
    }
  };

  const initializeLaunchSequence = async () => {
    console.log("checking if all data is present...");
    const offlineTripReportData = await findOfflineData("offlineTripReportData");
    const offlineTripReportClamLobsterData = await findOfflineData(
      "offlineTripReportClamLobsterData",
    );
    if (!offlineTripReportData.length || !offlineTripReportClamLobsterData.length) {
      setIsSynced(false);
      throw new Error("data not synced, try resyncing");
    }
    if (offlineTripReportData.length === 7 && offlineTripReportClamLobsterData.length === 7) {
      setIsSynced(true);
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
                <HomePage
                  syncToHomebase={syncToHomebase}
                  isLoading={isLoading}
                  isSynced={isSynced}
                />
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
