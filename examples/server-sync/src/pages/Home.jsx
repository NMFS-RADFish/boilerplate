import { useState } from "react";
import { Button, Alert, Link, GridContainer } from "@trussworks/react-uswds";
import { Spinner, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { MSW_ENDPOINT } from "../mocks/handlers";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

const offlineErrorMsg = "No network conection, unable to sync with server";
const noSyncMsg = "Application has not yet been synced with homebase";
const dataNotSyncedMsg = "Data not synced, try resyncing";
const dataIsSyncedMsg = "All data cached, ready to launch!";

const HOME_BASE_DATA = "homebaseData";

export const HomePage = () => {
  const { isOffline } = useOfflineStatus();
  const { updateOfflineData, findOfflineData } = useOfflineStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ message: "" });
  const [lastSynced, setLastSynced] = useState("");

  const getRequestWithFetch = async (endpoint) => {
    try {
      const response = await fetch(`${endpoint}`, {
        headers: { "X-Access-Token": "your-access-token" },
      });

      if (!response.ok) {
        // Set error with the JSON response
        const error = await response.json();
        return error;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      // Set error in case of an exception
      const error = `[GET]: Error fetching data: ${err}`;
      return error;
    }
  };

  const syncToHomebase = async () => {
    const lastSync = await findOfflineData(HOME_BASE_DATA);
    const lastSyncMsg = `Last sync at: ${findOfflineData("lastHomebaseSync")}`;
    const { data: homebaseData } = await getRequestWithFetch(MSW_ENDPOINT.HOMEBASE);
    await updateOfflineData(HOME_BASE_DATA, homebaseData);

    await updateOfflineData("lastHomebaseSync", [{ uuid: "lastSynced", time: Date.now() }]);

    if (!isOffline) {
      setIsLoading(true);
      setTimeout(async () => {
        await updateOfflineData("lastHomebaseSync", [{ uuid: "lastSynced", time: Date.now() }]);
        initializeLaunchSequence();
        setIsLoading(false);
      }, 2000);
    } else {
      console.log(offlineErrorMsg);
      console.log(`${lastSync ? lastSyncMsg : noSyncMsg}`);
      setIsLoading(false);
    }
  };

  const initializeLaunchSequence = async () => {
    const homebaseData = await findOfflineData(HOME_BASE_DATA);
    const lastSynced = await findOfflineData("lastHomebaseSync");
    if (!homebaseData.length) {
      setSyncStatus({ status: false, message: dataNotSyncedMsg });
    }
    // 7 is the amount of data expected from homebase response, but this can be any check
    if (homebaseData.length === 7) {
      setSyncStatus({ status: true, message: dataIsSyncedMsg });
      setLastSynced(new Date(lastSynced[0].time).toLocaleString());
    }
    setTimeout(() => {
      setSyncStatus({ status: null, message: "" });
      setLastSynced("");
    }, 2200);
  };

  return (
    <>
      <h1>Server Sync Example</h1>
      <InfoAnnotation />
      <div className="server-sync">
        {isLoading ? (
          <Spinner width={50} height={50} stroke={8} />
        ) : (
          <Button onClick={syncToHomebase}>Sync from Server</Button>
        )}
        <span
          className={`${syncStatus.status ? "text-green" : "text-red"} margin-left-2 margin-top-2`}
        >
          {syncStatus.message + " " + lastSynced}
        </span>
      </div>
    </>
  );
};

const InfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example that demonstrates a design pattern for syncing data from an API endpoint
      into IndexedDB. The idea is that the application with fetch from the API, and store the
      persistent data in IndexedDB for offline storage.
      <br />
      <br />
      Please note that this is utilizing Mock Service Worker to intercept these API requests. In
      production this would integrate with an external API.
      <br />
      <br />
      The data is cached in index db and you can view it by opening the application tab in the
      browser developer tools.
      <Link href="https://nmfs-radfish.github.io/radfish" target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Documentation</Button>
      </Link>
    </Alert>
  );
};

export default HomePage;
