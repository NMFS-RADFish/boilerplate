import "./index.css";
import React, { useEffect } from "react";
import { Toast, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { Alert, Button } from "@trussworks/react-uswds";
import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "./hooks/useToast";

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
          <br />
          <Button type="button">Go To Documentation</Button>
        </a>
      </Alert>
      <h3>Network Status: {isOffline ? "Offline" : "Online"}</h3>
    </div>
  );
}

export default App;
