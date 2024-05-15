import React, { useState, useEffect } from "react";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";
import {
  Button,
  FormGroup,
  Label,
  TextInput,
  Alert,
} from "@trussworks/react-uswds";

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

  const updateData = async (e, uuid) => {
    e.preventDefault();
    const { name, value } = e.target;

    const dataToUpdate = formData.find((data) => data.uuid === uuid);
    const updatedData = { ...dataToUpdate, [name]: value };

    // Update the data in indexedDB
    // Takes a string for the store name and an array of objects to update
    await updateOfflineData("formData", [updatedData]);

    // Update the state
    setFormData((prevData) =>
      prevData.map((data) => (data.uuid === uuid ? updatedData : data))
    );
  };

  const deleteData = async (e, uuid) => {
    e.preventDefault();
    if (uuid) {
      // Delete the data from indexedDB
      // Takes a string for the store name and an array of uuids to delete
      await deleteOfflineData("formData", [uuid]);
      setFormData((prevData) => prevData.filter((data) => data.uuid !== uuid));
    }
  };

  return (
    <div className="grid-container">
      <h1>On Device Storage Example</h1>
      <Alert type="info" heading="Information" headingLevel="h2">
        This is an example of how to use the `OfflineStorageWrapper` context and
        the provided `useOfflineStorage` hook to interact with on-device
        storage. This example demonstrates how to create, read, update, and
        delete data from IndexedDB. The `useOfflineStorage` hooks uses Dexie.js
        under the hood.
        <br />
        <br />
        <a
          href="https://nmfs-radfish.github.io/documentation"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="button">Go To Documentation</Button>
        </a>
        <a
          href="https://dexie.org/docs/Tutorial/Getting-started"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="button">Dexie Docs</Button>
        </a>
      </Alert>
      <br />
      <br />
      <Button type="submit" onClick={(e) => createData(e)}>
        Create Data
      </Button>

      <h2>Saved Data</h2>
      {formData &&
        formData.map((data, i) => {
          return (
            <div key={i}>
              <div className="grid-row">
                <FormGroup>
                  <Label htmlFor="uuid">UUID</Label>
                  <TextInput
                    id="uuid"
                    name="uuid"
                    type="text"
                    value={data.uuid}
                    onChange={(e) => updateData(e, data.uuid)}
                  />
                  <Label htmlFor="fullName">Name</Label>
                  <TextInput
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => updateData(e, data.uuid)}
                  />
                  <Label htmlFor="numberOfFish">Number of Fish</Label>
                  <TextInput
                    id="numberOfFish"
                    name="numberOfFish"
                    type="number"
                    value={data.numberOfFish}
                    onChange={(e) => updateData(e, data.uuid)}
                  />
                  <Label htmlFor="species">Species</Label>
                  <TextInput
                    id="species"
                    name="species"
                    type="text"
                    value={data.species}
                    onChange={(e) => updateData(e, data.uuid)}
                  />
                  <Label htmlFor="computedPrice">Price</Label>
                  <TextInput
                    id="computedPrice"
                    name="computedPrice"
                    type="number"
                    value={data.computedPrice}
                    onChange={(e) => updateData(e, data.uuid)}
                  />
                </FormGroup>
                <div className="margin-left-2">
                  <Button
                    type="submit"
                    secondary={true}
                    onClick={(e) => deleteData(e, data.uuid)}
                  >
                    x
                  </Button>
                </div>
              </div>
              <hr />
            </div>
          );
        })}
    </div>
  );
};

export default App;
