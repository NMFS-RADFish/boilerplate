import { useState, useEffect } from "react";
import { useApplication } from "../../Application";

export const useOfflineStatus = () => {
  const application = useApplication();
  const [isOffline, setIsOffline] = useState(!application.isOnline);
  const [isFlapping, setIsFlapping] = useState(false);
  const [flappingDetails, setFlappingDetails] = useState(null);

  const updateOnlineStatus = (event) => {
    setIsOffline(!application.isOnline);
    // Reset flapping if we get a stable online/offline state
    if (event?.detail?.isFlapping === false) {
      setIsFlapping(false);
    }
  };

  const handleNetworkFlapping = (event) => {
    setIsFlapping(true);
    setFlappingDetails(event.detail);
  };

  useEffect(() => {
    updateOnlineStatus();

    application.addEventListener("online", updateOnlineStatus);
    application.addEventListener("offline", updateOnlineStatus);
    application.addEventListener("networkFlapping", handleNetworkFlapping);

    return () => {
      application.removeEventListener("online", updateOnlineStatus);
      application.removeEventListener("offline", updateOnlineStatus);
      application.removeEventListener("networkFlapping", handleNetworkFlapping);
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
    isFlapping, 
    flappingDetails,
    checkEndpoint,
    checkMultipleEndpoints
  };
};
