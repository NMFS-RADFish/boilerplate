import { useState } from "react";
import { Button } from "radfish-react";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import RadfishAPIService from "../packages/services/APIService";
import { MSW_ENDPOINT } from "../mocks/handlers";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";

const ApiService = new RadfishAPIService("");

const offlineErrorMsg = "No network conection, unable to sync with server";
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
    const lastSync = await findOfflineData(HOME_BASE_DATA);
    const lastSyncMsg = `Last sync at: ${findOfflineData("lastHomebaseSync")}`;

    if (!isOffline) {
      setIsLoading(true);

      await updateOfflineData("lastHomebaseSync", [{ uuid: "lastSynced", time: Date.now() }]);
      initializeLaunchSequence();
      setIsLoading(false);
    } else {
      console.log(offlineErrorMsg);
      console.log(`${lastSync ? lastSyncMsg : noSyncMsg}`);
      setIsLoading(false);
    }
  };

  const initializeLaunchSequence = async () => {
    const lastHomebaseSyncData = await findOfflineData(LAST_HOMEBASE_SYNC);
    const time = lastHomebaseSyncData[lastHomebaseSyncData.length - 1].time;
    const date = new Date(time).toLocaleString();

    setSyncStatus({ status: true, message: `Last home base sync set to: ${date}` });
    setTimeout(() => {
      setSyncStatus({ status: null, message: "" });
    }, 4000);
  };

  if (isLoading) {
    return <Button onClick={syncToHomebase}>Syncing to Server...</Button>;
  }

  return (
    <div className="server-sync">
      <Button onClick={syncToHomebase}>Sync to Server</Button>
      <span
        className={`${syncStatus.status ? "text-green" : "text-red"} margin-left-2 margin-top-2`}
      >
        {syncStatus.message}
      </span>
    </div>
  );
};
