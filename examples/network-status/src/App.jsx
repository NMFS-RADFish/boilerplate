import "./index.css";
import React, { useEffect } from "react";
import { Application, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { Alert, Button, Link } from "@trussworks/react-uswds";

function App() {
  const { isOffline } = useOfflineStatus();

  return (
    <Application>
      <div className="grid-container">
        <h1>Network Status Example</h1>
        <Alert type="info" headingLevel={"h2"} heading="Information">
          This is an example of a network status indicator. The application will display a toast
          notification for 5 seconds when network is offline.
          <br />
          <Link
            href="https://nmfs-radfish.github.io/radfish/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <br />
            <Button type="button" className="padding-4">
              Go To Documentation
            </Button>
          </Link>
        </Alert>
        <h3 className="header-body">Network Status: {isOffline ? "Offline ❌" : "Online ✅"}</h3>
      </div>
    </Application>
  );
}

export default App;
