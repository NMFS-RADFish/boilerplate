import "./index.css";
import React, { useState, useEffect } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { Button, Alert, Link } from "@trussworks/react-uswds";

const App = () => {
  const [formData, setFormData] = useState([]);

  const {
    findOfflineData,
    createOfflineData,
    updateOfflineData,
    deleteOfflineData,
  } = useOfflineStorage();

  useEffect(() => {
    const getFormData = async () => {
      const data = await findOfflineData("formData");
      setFormData(data);
    };
    getFormData();
  }, []);

  const createData = async (e) => {
    e.preventDefault();
    const newData = {
      fullName: "Bilbo Baggins",
      species: "Mahimahi",
      computedPrice: 100,
      numberOfFish: 5,
      isDraft: true,
    };

    // Create the data in indexedDB
    // Takes a string for the store name and an object to create
    await createOfflineData("formData", newData);

    // Find all the data in indexedDB
    const allData = await findOfflineData("formData");
    setFormData(allData);
  };

  const updateData = async (e, data) => {
    e.preventDefault();

    // const dataToUpdate = formData.find((data) => data.uuid === uuid);
    const updatedData = {
      ...data,
      numberOfFish: Number((data.numberOfFish += 1)),
      computedPrice: Number((data.computedPrice += 10)),
    };

    // // Update the data in indexedDB
    // // Takes a string for the store name and an array of objects to update
    await updateOfflineData("formData", [updatedData]);

    // // Update the state
    setFormData((prevData) =>
      prevData.map((item) => (item.uuid === data.uuid ? updatedData : item))
    );
  };

  const deleteData = async (e, data) => {
    e.preventDefault();
    if (data.uuid) {
      // Delete the data from indexedDB
      // Takes a string for the store name and an array of uuids to delete
      await deleteOfflineData("formData", [data.uuid]);
      setFormData((prevData) =>
        prevData.filter((item) => item.uuid !== data.uuid)
      );
    }
  };

  return (
    <div className="grid-container">
      <h1>On Device Storage Example</h1>
      <Alert type="info" heading="Information" headingLevel="h2">
        This is an example of how to use the <code>OfflineStorageWrapper</code>{" "}
        context and the provided <code>useOfflineStorage</code> hook to interact
        with on-device storage. This example demonstrates how to create, read,
        update, and delete data from IndexedDB. The{" "}
        <code>useOfflineStorage</code> hooks uses Dexie.js under the hood.
        <br />
        <br />
        Please note that if you choose to test this example with the network
        connection offline, you won’t be able to refresh the page. To do this,
        you must ensure that Service Worker is registered, which requires the
        example to be served as a production build using{" "}
        <code>npm run build</code> and serving that output using a basic HTTP
        server such as <code>serve build</code>
        <br />
        <br />
        <Link
          href="https://nmfs-radfish.github.io/radfish"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="button">Go To Documentation</Button>
        </Link>
        <Link
          href="https://dexie.org/docs/Tutorial/Getting-started"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="button">Dexie Docs</Button>
        </Link>
      </Alert>
      <br />
      <Button type="submit" onClick={(e) => createData(e)}>
        Create Data
      </Button>

      <h2>Saved Data</h2>

      {formData &&
        formData.map((data, i) => {
          return (
            <div key={i}>
              Name: {data?.fullName}
              <br />
              Species: {data?.species}
              <br />
              Number of Fish: {data?.numberOfFish}
              <br />
              Price: {data?.computedPrice}
              <br />
              <Button type="submit" onClick={(e) => updateData(e, data)}>
                Update Data
              </Button>
              <Button type="submit" onClick={(e) => deleteData(e, data)}>
                Delete Data
              </Button>
              <hr />
            </div>
          );
        })}
    </div>
  );
};

export default App;
