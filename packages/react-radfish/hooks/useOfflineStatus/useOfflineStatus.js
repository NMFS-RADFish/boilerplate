import { useState, useEffect } from "react";
import { useApplication } from "../../Application";

export const useOfflineStatus = () => {
  const application = useApplication();
  const [isOffline, setIsOffline] = useState(!application.isOnline);

  const updateOnlineStatus = () => {
    setIsOffline(!application.isOnline);
  };

  useEffect(() => {
    updateOnlineStatus();

    const setIsOfflineTrue = () => setIsOffline(true);
    const setIsOfflineFalse = () => setIsOffline(false);

    application.addEventListener("online", setIsOfflineFalse);
    application.addEventListener("offline", setIsOfflineTrue);

    return () => {
      application.removeEventListener("online", setIsOfflineFalse);
      application.removeEventListener("offline", setIsOfflineTrue);
    };
  }, [application]);

  // Method to check a URL with timeout
  const checkEndpoint = async (url, options = {}) => {
    try {
      const { method = 'HEAD', timeout = application._networkTimeout } = options;
      await application.fetch(url, { method, timeout });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Method to check multiple endpoints
  const checkMultipleEndpoints = async (urls, options = {}) => {
    const results = {};
    
    const checks = urls.map(async (url) => {
      results[url] = await checkEndpoint(url, options);
    });
    
    await Promise.all(checks);
    return results;
  };

  return { 
    isOffline,
    checkEndpoint,
    checkMultipleEndpoints
  };
};
