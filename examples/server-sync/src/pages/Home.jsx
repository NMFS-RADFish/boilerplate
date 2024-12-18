import React, { useState, useEffect } from "react";
import { Button, Alert, Link } from "@trussworks/react-uswds";
import { Spinner, Table, useOfflineStatus, useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { MSW_ENDPOINT } from "../mocks/handlers";

// Constants for status messages
const OFFLINE_ALREADY_SYNCED = "Offline data is already up-to-date.";
const SERVER_SYNC_FAILED = "App is offline. Unable to sync with the server.";
const SERVER_SYNC_SUCCESS = "Data synced with the server.";

// IndexedDB table names
const LOCAL_DATA = "localData";
const LAST_SERVER_SYNC = "lastSyncFromServer";

export const HomePage = () => {
  // Check if the app is offline using the `useOfflineStatus` hook
  const { isOffline } = useOfflineStatus();

  // Hooks to interact with offline storage (IndexedDB)
  const storage = useOfflineStorage();

  // State for loading spinner, sync status, and data to display in the table
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ message: "", lastSynced: "" });
  const [data, setData] = useState([]);

  // Effect to set up the mock server's offline state and load the last synced time
  useEffect(() => {
    // Load the last synced time from IndexedDB on component mount
    const loadLastSyncedTime = async () => {
      const [lastSyncRecord] = await storage.find(LAST_SERVER_SYNC);
      if (lastSyncRecord?.time) {
        const lastSyncTime = new Date(lastSyncRecord.time).toLocaleString();
        setSyncStatus((prev) => ({
          ...prev,
          lastSynced: lastSyncTime,
        }));
      }
    };

    loadLastSyncedTime();
  }, [isOffline]);

  useEffect(() => {
    async function fetchData() {
      const data = await storage.find(LOCAL_DATA);
      setData(data);
    }
    fetchData();
  }, [data]);

  // Helper function to make a GET request using the Fetch API
  const getRequestWithFetch = async (endpoint) => {
    try {
      const response = await fetch(`${endpoint}`, {
        // Example header for token-based authentication
        // Replace or extend with required headers for your API
        headers: { "X-Access-Token": "your-access-token" },
      });

      if (!response.ok) {
        // Set error with the JSON response
        const error = await response.json();
        return error;
      }

      return await response.json();
    } catch (err) {
      // Set error in case of an exception
      return { error: `[GET]: Error fetching data: ${err}` };
    }
  };

  // Function to sync data with the server
  const syncToServer = async () => {
    if (isOffline) {
      // Show an error if the app is offline
      setSyncStatus({ message: SERVER_SYNC_FAILED, lastSynced: syncStatus.lastSynced });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch data from the mock server
      const { data: serverData } = await getRequestWithFetch(MSW_ENDPOINT.GET);

      // Retrieve existing data from IndexedDB
      const offlineData = await find(LOCAL_DATA);

      // Compare offline data with server data
      if (JSON.stringify(offlineData) !== JSON.stringify(serverData)) {
        // Update IndexedDB with the latest server data
        debugger;
        await storage.update(LOCAL_DATA, serverData);

        // Save the current timestamp as the last sync time
        const currentTimestamp = Date.now();
        await storage.update(LAST_SERVER_SYNC, [{ uuid: "lastSynced", time: currentTimestamp }]);

        const lastSyncTime = new Date(currentTimestamp).toLocaleString();
        setSyncStatus({ message: SERVER_SYNC_SUCCESS, lastSynced: lastSyncTime });
        setData(serverData); // Update table data with the latest server data
      } else {
        // If data is already up-to-date, show a relevant message
        setSyncStatus({ message: OFFLINE_ALREADY_SYNCED, lastSynced: syncStatus.lastSynced });
      }
    } catch (error) {
      console.error("An error occurred during sync:", error);
      setSyncStatus({ message: "Sync failed due to an error.", lastSynced: syncStatus.lastSynced });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Server Sync Example</h1>
      <InfoAnnotation />
      <div className="server-sync">
        <Button onClick={syncToServer} disabled={isLoading}>
          {isLoading ? <Spinner width={20} height={20} stroke={2} /> : "Sync with Server"}
        </Button>
        <div
          className={`${
            syncStatus.message.includes("offline") ? "text-red" : "text-green"
          } margin-left-2 margin-top-2`}
        >
          {syncStatus.message}
        </div>
        <div className="margin-left-2">
          {syncStatus.lastSynced && (
            <strong>
              <span>Last Synced: {syncStatus.lastSynced}</span>
            </strong>
          )}
        </div>
        <Table
          data={data}
          columns={[
            { key: "uuid", label: "UUID", sortable: true },
            { key: "value", label: "Value", sortable: true },
            { key: "isSynced", label: "Synced with Server", sortable: false },
          ]}
        />
      </div>
    </>
  );
};

const InfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example that demonstrates a design pattern for syncing data from an API endpoint
      into IndexedDB. The idea is that the application will fetch from the API, and store the
      persistent data in IndexedDB for offline storage.
      <br />
      <br />
      Please note that this is utilizing Mock Service Worker to intercept these API requests. In
      production this would integrate with an external API.
      <br />
      <br />
      The data is cached in index db and you can view it by opening the application tab in the
      browser developer tools.
      <br />
      <br />
      <Link href="https://nmfs-radfish.github.io/radfish" target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Documentation</Button>
      </Link>
    </Alert>
  );
};

export default HomePage;
