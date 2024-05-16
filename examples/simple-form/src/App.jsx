import "./index.css";
import React, { useState, useEffect } from "react";
import { FormGroup, Label, TextInput, Button, Alert } from "@trussworks/react-uswds";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";

function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    numberOfFish: "",
    species: "",
    computedPrice: "",
  });
  const { updateOfflineData, createOfflineData, findOfflineData } = useOfflineStorage();

  useEffect(() => {
    const formData = async () => {
      const data = await findOfflineData("formData");
      if (data) {
        setFormData(data[0]);
      }
    };
    formData();
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData instance
    const formData = new FormData(e.target);

    // Get all field values
    const values = {};
    for (let [key, value] of formData.entries()) {
      values[key] = value;
    }

    setFormData(values);
    createOfflineData("formData", values);
    // Handle form submission, usually by sending a POST request to a server
    // Example: fetch.post("/api/form", values)
    console.log("Form submitted");
  };

  const handleOnChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    await updateOfflineData("formData", [updatedFormData]);
    setFormData(updatedFormData);
  };

  return (
    <div className="grid-container">
      <h1>Simple Form Example</h1>

      <div className="margin-bottom-2">
        <Alert type="info" heading="New/Blank Form Example" headingLevel="h1">
          This is a simple form example. The form data is stored in the browser's IndexedDB using
          methods from the `useOfflineStorage` hook, which uses Dexie.js behind the scenes.
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
        <form onSubmit={handleOnSubmit} onChange={handleOnChange}>
          <FormGroup>
            <Label htmlFor="fullName">Name</Label>
            <TextInput id="fullName" name="fullName" type="text" />
            <Label htmlFor="numberOfFish">Number of Fish</Label>
            <TextInput id="numberOfFish" name="numberOfFish" type="number" />
            <Label htmlFor="species">Species</Label>
            <TextInput id="species" name="species" type="text" />
            <Label htmlFor="computedPrice">Price</Label>
            <TextInput id="computedPrice" name="computedPrice" type="number" />
            <Button type="submit" className="margin-top-2">
              Submit
            </Button>
          </FormGroup>
        </form>
      </div>
      <hr />
      <div>
        <Alert type="info" heading="Existing Form Example" headingLevel="h1">
          This is an example of a form with details coming from IndexedDB. The form data is stored
          in the browser's IndexedDB using methods from the `useOfflineStorage` hook, which uses
          Dexie.js behind the scenes.
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
        {formData && (
          <FormDetails
            formData={formData}
            handleOnSubmit={handleOnSubmit}
            handleOnChange={handleOnChange}
          />
        )}
      </div>
    </div>
  );
}

function FormDetails({ formData, handleOnSubmit, handleOnChange }) {
  return (
    <form onSubmit={handleOnSubmit}>
      <FormGroup>
        <Label htmlFor="fullName">Name</Label>
        <TextInput
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleOnChange}
        />
        <Label htmlFor="numberOfFish">Number of Fish</Label>
        <TextInput
          id="numberOfFish"
          name="numberOfFish"
          type="number"
          value={formData.numberOfFish}
          onChange={handleOnChange}
        />
        <Label htmlFor="species">Species</Label>
        <TextInput
          id="species"
          name="species"
          type="text"
          value={formData.species}
          onChange={handleOnChange}
        />
        <Label htmlFor="computedPrice">Price</Label>
        <TextInput
          id="computedPrice"
          name="computedPrice"
          type="number"
          value={formData.computedPrice}
          onChange={handleOnChange}
        />
        <Button type="submit" className="margin-y-2">
          Submit
        </Button>
      </FormGroup>
    </form>
  );
}

export default App;
