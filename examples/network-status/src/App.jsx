import "./index.css";
import React, { useEffect } from "react";
import { Toast } from "@nmfs-radfish/react-radfish";
import { Alert, Button, Link } from "@trussworks/react-uswds";
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
      <h1>Network Status Example</h1>
      <Alert type="info" headingLevel={"h2"} heading="Information">
        This is an example of a network status indicator. The application will display a toast
        notification for 5 seconds when network is offline.
        <br />
        <Link
          href="https://nmfs-radfish.github.io/documentation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <br />
          <Button type="button">Go To Documentation</Button>
        </Link>
      </Alert>
      <h3>Network Status: {isOffline ? "Offline" : "Online"}</h3>
    </div>
  );
}

export default App;
