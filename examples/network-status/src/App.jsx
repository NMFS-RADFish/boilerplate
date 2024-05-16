import "./index.css";
import React, { useEffect } from "react";
import { Toast } from "radfish-react";
import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "./hooks/useToast";
import { useOfflineStatus } from "./hooks/useOfflineStatus";

function App() {
  const { toast, showToast, dismissToast } = useToast();
  const { isOffline } = useOfflineStatus();

  useEffect(() => {
    if (isOffline) {
      showToast(TOAST_CONFIG.OFFLINE);
      setTimeout(() => {
        dismissToast();
      }, TOAST_LIFESPAN);
    }
  }, [isOffline]);

  return (
    <div className="grid-container">
      <Toast toast={toast} />
      <Alert type="info" headingLevel={"h1"} heading="Network Status Example">
        This is an example of a network status indicator. The application will display a toast
        notification for 5 seconds when network is offline.
        <a
          href="https://nmfs-radfish.github.io/documentation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="button">Go To Documentation</Button>
        </a>
      </Alert>
      <h1>Network Status Example</h1>
      <h3>Network Status: {isOffline ? "Offline" : "Online"}</h3>
    </div>
  );
}

export default App;
