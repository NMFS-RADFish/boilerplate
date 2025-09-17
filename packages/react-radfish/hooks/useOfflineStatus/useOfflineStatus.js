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

    application.addEventListener("online", updateOnlineStatus);
    application.addEventListener("offline", updateOnlineStatus);

    return () => {
      application.removeEventListener("online", updateOnlineStatus);
      application.removeEventListener("offline", updateOnlineStatus);
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
