import "./index.css";
import React, { useState, useEffect } from "react";
import { Button, Alert } from "@trussworks/react-uswds";

const App = () => {
  const [state, setState] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 250)); // mock throttle
    const { data } = await ApiService.get(MSW_ENDPOINT.SPECIES);

    setState(data);
    setIsLoading(false);
  };

  const postData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 250)); // mock throttle
    const { data } = await ApiService.post(MSW_ENDPOINT.SPECIES, {
      newData: {
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
      <Alert type="info" heading="Information" headingLevel="h2">
        This is an example of how to use the `RADFishApiClient` along with `mock
        service worker` in order to create a mock API to serve data to your
        client. Requests to this mock API will be intercepted by mock service
        worker API methods and respond with expected data, which simulates a
        REST API to consume.
      </Alert>
      <br />
      <br />
      <Button type="submit" onClick={(e) => getData(e)}>
        Get Data
      </Button>
      <Button type="submit" onClick={(e) => postData(e)}>
        Post Data
      </Button>

      <h2>Saved Data</h2>

      {state &&
        state.map((data, i) => {
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

export default App;
