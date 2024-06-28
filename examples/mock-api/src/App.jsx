import "./index.css";
import React, { useState } from "react";
import { Button, Alert, Link } from "@trussworks/react-uswds";
import RADFishAPIService from "./packages/services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";

const APIService = new RADFishAPIService();

const App = () => {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock throttle
    const { data } = await APIService.get(MSW_ENDPOINT.SPECIES);
    setState(data);
    setIsLoading(false);
  };

  const postData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock throttle
    const { data } = await APIService.post(MSW_ENDPOINT.SPECIES, {
      data: {
        name: "tuna",
        price: 75,
        src: "https://picsum.photos/200/300",
      },
    });

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
      This is an example of how to use the <code>RADFishApiClient</code> along
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
