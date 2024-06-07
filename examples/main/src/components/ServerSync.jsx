import { useState } from "react";
import { Button } from "@trussworks/react-uswds";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import RADFishAPIService from "../packages/services/APIService";
import { MSW_ENDPOINT } from "../mocks/handlers";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";

const ApiService = new RADFishAPIService("");

const offlineErrorMsg = "No network conection, unable to sync with server";
const noSyncMsg = "Application has not yet been synced with homebase";
const dataNotSyncedMsg = "Data not synced, try resyncing";
const dataIsSyncedMsg = "All data cached, ready to launch!";

const HOME_BASE_DATA = "homebaseData";
const LAST_HOMEBASE_SYNC = "lastHomebaseSync";
const SPECIES = "species";
const FORM_DATA = "formData";

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
      await new Promise((resolve) => setTimeout(resolve, 250)); // mock throttle
      const { data: homebaseData } = await ApiService.get(MSW_ENDPOINT.HOMEBASE);
      await updateOfflineData(HOME_BASE_DATA, homebaseData);

      await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
      const { data: tableData } = await ApiService.get(MSW_ENDPOINT.TABLE);
      await updateOfflineData(FORM_DATA, tableData);

      const { data: species } = await ApiService.get(MSW_ENDPOINT.SPECIES);
      await updateOfflineData(SPECIES, species);

      await updateOfflineData(LAST_HOMEBASE_SYNC, [{ uuid: "lastSynced", time: Date.now() }]);
      initializeLaunchSequence();
      setIsLoading(false);
    } else {
      console.log(offlineErrorMsg);
      console.log(`${lastSync ? lastSyncMsg : noSyncMsg}`);
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
