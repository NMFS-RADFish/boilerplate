import { useState } from "react";
import { Button } from "../packages/react-components";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import RadfishAPIService from "../packages/services/APIService";
import { MSW_ENDPOINT } from "../mocks/handlers";
import useOfflineStorage from "../hooks/useOfflineStorage.example";

const ApiService = new RadfishAPIService("");

export const ServerSync = () => {
  const { isOffline } = useOfflineStatus();
  const { updateOfflineData, findOfflineData } = useOfflineStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  const syncToHomebase = async () => {
    if (!isOffline) {
      setIsLoading(true);

      console.log("syncing...");
      await new Promise((resolve) => setTimeout(resolve, 250)); // mock throttle
      const { data: homebaseData } = await ApiService.get(MSW_ENDPOINT.HOMEBASE);

      console.log("caching offline data...");
      await new Promise((resolve) => setTimeout(resolve, 1200)); // mock throttle
      await updateOfflineData("homebaseData", homebaseData);

      localStorage.setItem("lastHomebaseSync", Date.now());

      initializeLaunchSequence();
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
    const homebaseData = await findOfflineData("homebaseData");

    if (!homebaseData.length) {
      setSyncStatus({ status: false, message: "data not synced, try resyncing" });
    }
    // 7 is the amount of data expected from homebase response, but this can be any check
    if (homebaseData.length === 7) {
      setSyncStatus({ status: true, message: "all data cached, ready to launch!" });
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
