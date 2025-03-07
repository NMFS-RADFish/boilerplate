import React, { useState } from "react";
import {
  Alert,
  Button,
  Link,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Tag
} from "@trussworks/react-uswds";
import { useOfflineStatus, useApplication } from "@nmfs-radfish/react-radfish";

const HomePage = () => {
  const { isOffline } = useOfflineStatus();
  const app = useApplication();
  const [loading, setLoading] = useState(false);

  const testFetchWithRetry = async () => {
    setLoading(true);
    console.log(
      "%c STARTING FETCH WITH RETRY TEST ",
      "background: #4CAF50; color: #fff; font-weight: bold; padding: 4px;",
    );

    try {
      // Simulate an endpoint that will fail initially but succeed on retry
      const response = await app.fetchWithRetry(
        "https://nonexistent-endpoint.example.com",
        {},
        {
          retries: 2,
          retryDelay: 1000,
          exponentialBackoff: true,
        },
      );

      const data = await response.json();
      console.log(
        "%c FETCH SUCCESSFUL ",
        "background: #4CAF50; color: #fff; font-weight: bold; padding: 4px;",
        data,
      );
      alert(`Fetch successful with retry! Retrieved ${data.length} users.`);
    } catch (error) {
      console.error(
        "%c FETCH FAILED ",
        "background: #F44336; color: #fff; font-weight: bold; padding: 4px;",
        error,
      );
      alert(`Fetch failed after all retries: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkStatusTag = () => {
    if (isOffline) {
      return <Tag className="bg-error">Offline</Tag>;
    } else {
      return <Tag className="bg-success">Online</Tag>;
    }
  };

  return (
    <div className="grid-container">
      <h1>Network Status Example</h1>

      <Alert type="info" headingLevel={"h2"} heading="Information">
        This example demonstrates network status handling with support for request retries with exponential backoff, and request timeouts and fallback URLs.
        <Link
          href="https://nmfs-radfish.github.io/radfish/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <br />
          <br />
          <Button type="button" className="padding-4">
            Go To Documentation
          </Button>
        </Link>
      </Alert>

      {/* Top row - Network Status */}
      <Grid row className="margin-bottom-4 margin-top-4">
        <Grid col={12}>
          <Card>
            <CardHeader>
              <h2 className="margin-0">Network Status</h2>
            </CardHeader>
            <CardBody>
              <div className="margin-bottom-2">
                <strong>Current Status:</strong> {getNetworkStatusTag()}
              </div>

              <p>
                The application automatically detects network connection status based on the browser's online/offline events.
              </p>
            </CardBody>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom row - Resilient Network Features */}
      <Grid row gap>
        <Grid col={12}>
          <Card>
            <CardHeader>
              <h2 className="margin-0">Resilient Network Features</h2>
            </CardHeader>
            <CardBody>
              <p>Test network resilience features with retry logic and exponential backoff:</p>
              <div className="display-flex flex-column flex-fill">
                <div className="flex-fill"></div>
                <Button
                  type="button"
                  onClick={testFetchWithRetry}
                  disabled={loading || isOffline}
                  className="margin-bottom-2"
                >
                  Test Fetch with Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
