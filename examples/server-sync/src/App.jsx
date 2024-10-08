import "./index.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Button, Alert, Link, GridContainer } from "@trussworks/react-uswds";
import { Application } from "@nmfs-radfish/react-radfish";
import { ServerSync } from "./components/ServerSync";

function App() {
  return (
    <Application>
      <GridContainer>
        <div className="App">
          <Router>
            <h1>Server Sync Example</h1>
            <InfoAnnotation />
            <ServerSync />
          </Router>
        </div>
      </GridContainer>
    </Application>
  );
}

const InfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example that demonstrates a design pattern for syncing data from an API endpoint
      into IndexedDB. The idea is that the application with fetch from the API, and store the
      persistent data in IndexedDB for offline storage.
      <br />
      <br />
      Please note that this is utilizing Mock Service Worker to intercept these API requests. In
      production this would integrate with an external API.
      <br />
      <br />
      The data is cached in index db and you can view it by opening the application tab in the
      browser developer tools.
      <Link href="https://nmfs-radfish.github.io/radfish" target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Documentation</Button>
      </Link>
    </Alert>
  );
};

export default App;
