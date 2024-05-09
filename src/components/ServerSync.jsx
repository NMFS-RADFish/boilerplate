import { useState } from "react";
import { Button } from "../packages/react-components";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import RadfishAPIService from "../packages/services/APIService";
import { MSW_ENDPOINT } from "../mocks/handlers";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";

const ApiService = new RadfishAPIService("");

const offlineErrorMsg = "No network conection, unable to sync with server";
const lastSyncMsg = `Last sync at: ${localStorage.getItem("lastHomebaseSync")}`;
const noSyncMsg = "Application has not yet been synced with homebase";
const dataNotSyncedMsg = "Data not synced, try resyncing";
const dataIsSyncedMsg = "All data cached, ready to launch!";

const HOME_BASE_DATA = "homebaseData";
const LAST_HOMEBASE_SYNC = "lastHomebaseSync";

export const ServerSync = () => {
  const { isOffline } = useOfflineStatus();
  const { updateOfflineData, findOfflineData } = useOfflineStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  const syncToHomebase = async () => {
    if (!isOffline) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 250)); // mock throttle
      const { data: homebaseData } = await ApiService.get(MSW_ENDPOINT.HOMEBASE);
      await updateOfflineData(HOME_BASE_DATA, homebaseData);

      await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
      const { data: tableData } = await ApiService.get(MSW_ENDPOINT.TABLE);
      await updateOfflineData("formData", tableData);

      localStorage.setItem(LAST_HOMEBASE_SYNC, Date.now());

      initializeLaunchSequence();
      setIsLoading(false);
    } else {
      console.log(offlineErrorMsg);
      console.log(`${localStorage.getItem(LAST_HOMEBASE_SYNC) ? lastSyncMsg : noSyncMsg}`);
      setIsLoading(false);
    }
  };

  const initializeLaunchSequence = async () => {
    const homebaseData = await findOfflineData(HOME_BASE_DATA);

    if (!homebaseData.length) {
      setSyncStatus({ status: false, message: dataNotSyncedMsg });
    }
    // 7 is the amount of data expected from homebase response, but this can be any check
    if (homebaseData.length === 7) {
      setSyncStatus({ status: true, message: dataIsSyncedMsg });
    }
    setTimeout(() => {
      setSyncStatus({ status: null, message: "" });
    }, 1200);
  };

  if (isLoading) {
    return <Button onClick={syncToHomebase}>Syncing to Server...</Button>;
  }

  return (
    <>
      <Button onClick={syncToHomebase}>Sync to Server</Button>
      <span className={`${syncStatus.status ? "text-green" : "text-red"} margin-left-2`}>
        {syncStatus.message}
      </span>
    </>
  );
};
