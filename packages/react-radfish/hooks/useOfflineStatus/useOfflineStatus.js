import { useState, useEffect } from "react";
import { useApplication } from "../useApplication";

export const useOfflineStatus = () => {
  const application = useApplication();
  const [isOffline, setIsOffline] = useState(!application.isOnline);

  const updateOnlineStatus = () => {
    setIsOffline(!application.isOnline);
  };

  useEffect(() => {
    updateOnlineStatus();

    application.addEventListener("online", updateOnlineStatus);
    application.addEventListener("offline", updateOnlineStatus);

    return () => {
      application.removeEventListener("online", updateOnlineStatus);
      application.removeEventListener("offline", updateOnlineStatus);
    };
  }, [application]);

  return { isOffline };
};
