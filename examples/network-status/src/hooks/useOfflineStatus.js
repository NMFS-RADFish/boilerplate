import { useState, useEffect } from "react";

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  const checkConnectivity = () => {
    const online = navigator.onLine;
    if (online) {
      handleOnline();
    } else {
      handleOffline();
    }
  };

  const handleOnline = () => {
    setIsOffline(false);
  };

  const handleOffline = () => {
    setIsOffline(true);
  };

  useEffect(() => {
    checkConnectivity();

    const onlineListener = () => checkConnectivity();
    const offlineListener = () => checkConnectivity();

    window.addEventListener("online", onlineListener);
    window.addEventListener("offline", offlineListener);

    return () => {
      window.removeEventListener("online", onlineListener);
      window.removeEventListener("offline", offlineListener);
    };
  }, []);

  return { isOffline };
};
