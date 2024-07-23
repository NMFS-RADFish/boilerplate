import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import "./index.css";

import { Button, Alert, Link } from "@trussworks/react-uswds";
import { Application } from "@nmfs-radfish/react-radfish";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Application>
      <div className="grid-container">
        <QueryClientProvider client={queryClient}>
          <h1>React Query Example</h1>
          <InfoAnnotation />
          <br />
        </QueryClientProvider>
      </div>
    </Application>
  );
};

const InfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example of how to use the <code>QueryClientProvider</code>{" "}
      along with <code>mock service worker</code> in order to create a mock API
      to serve data to your client. Requests to this mock API will be
      intercepted by mock service worker API methods and respond with expected
      data, which simulates a REST API to consume.
      <br />
      <br />
      <Link
        href="https://nmfs-radfish.github.io/documentation"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button type="button">Go To Documentation</Button>
      </Link>
    </Alert>
  );
};

export default App;
