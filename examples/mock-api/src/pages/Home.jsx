import "../index.css";
import React, { useState } from "react";
import { Button } from "@trussworks/react-uswds";
import { MSW_ENDPOINT } from "../mocks/handlers";

const HomePage = () => {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const mockData = {
    name: "tuna",
    price: 75,
    src: "https://picsum.photos/200/300",
  };

  const getData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock throttle
    try {
      const response = await fetch(MSW_ENDPOINT.SPECIES, {
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

  const postData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock throttle
    const response = await fetch(MSW_ENDPOINT.SPECIES, {
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
    <>
      <Button
        type="submit"
        onClick={(e) => getData(e)}
        style={{ marginTop: "1rem" }}
      >
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
    </>
  );
};

export default HomePage;
