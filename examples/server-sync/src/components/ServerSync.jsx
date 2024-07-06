import { useState } from "react";
import { Button } from "@trussworks/react-uswds";
import { Spinner, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import RADFishAPIService from "../packages/services/APIService";
import { MSW_ENDPOINT } from "../mocks/handlers";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

const ApiService = new RADFishAPIService("");

const offlineErrorMsg = "No network conection, unable to sync with server";
const noSyncMsg = "Application has not yet been synced with homebase";
const dataNotSyncedMsg = "Data not synced, try resyncing";
const dataIsSyncedMsg = "All data cached, ready to launch!";

const HOME_BASE_DATA = "homebaseData";

export const ServerSync = () => {
  const { isOffline } = useOfflineStatus();
  const { updateOfflineData, findOfflineData } = useOfflineStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ message: "" });
  const [lastSynced, setLastSynced] = useState("");

  const syncToHomebase = async () => {
    const lastSync = await findOfflineData(HOME_BASE_DATA);
    const lastSyncMsg = `Last sync at: ${findOfflineData("lastHomebaseSync")}`;
    const { data: homebaseData } = await ApiService.get(MSW_ENDPOINT.HOMEBASE);
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
  );
};
