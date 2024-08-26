import "./index.css";
import React, { useState } from "react";
import { Button, Alert, Link } from "@trussworks/react-uswds";
import { MSW_ENDPOINT } from "./mocks/handlers";

const App = () => {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

  const getData = async (endpoint) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock throttle
    try {
      const response = await fetch(endpoint, {
        headers: {
          "X-Access-Token": "your-access-token",
        },
      });

      if (!response.ok) {
        // Set error with the JSON response
        const error = await response.json();
        return error;
      }

      const { data } = await response.json();

      setState(data);
      setIsLoading(false);
    } catch (err) {
      // Set error in case of an exception
      const error = `[GET]: Error fetching data: ${err}`;
      return error;
    }
  };

  const postData = async (endpoint) => {
    const mockData = {
      name: "tuna",
      price: 75,
      src: "https://picsum.photos/200/300",
    };

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock throttle
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": "your-access-token",
      },
      body: JSON.stringify({
        ...{ formData: mockData },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return error;
    }

    const { data } = await response.json();

    setState(data);
    setIsLoading(false);
  };

  return (
    <div className="grid-container">
      <h1>Mock API Example</h1>
      <InfoAnnotation />
      <br />
      <Button type="submit" onClick={(e) => getData(e)}>
        Get Data
      </Button>
      {state.length > 0 && (
        <Button type="submit" onClick={(e) => postData(e)}>
          Post Data
        </Button>
      )}

      <h2>Mock API Data</h2>

      {isLoading && <p>Loading...</p>}

      {state.length > 0
        ? `Number of fetched items: ${state.length}`
        : "Request data to see items"}

      {state.map((data, i) => {
        return (
          <div key={i}>
            Species: {data?.name}
            <br />
            Price: {data?.price}
            <br />
            <img src={data?.src} />
            <hr />
          </div>
        );
      })}
    </div>
  );
};

const InfoAnnotation = () => {
  return (
    <Alert type="info" heading="Information" headingLevel="h2">
      This is an example of how to use the <code>native fetch API</code> along
      with <code>mock service worker</code> in order to create a mock API to
      serve data to your client. Requests to this mock API will be intercepted
      by mock service worker API methods and respond with expected data, which
      simulates a REST API to consume.
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
