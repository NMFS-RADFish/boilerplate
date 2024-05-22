import "../index.css";
import React, { useEffect } from "react";
import { FormGroup, Alert } from "@trussworks/react-uswds";
import { TextInput, Label, Button } from "@nmfs-radfish/react-radfish";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";
import { useFormState } from "../contexts/FormWrapper";

function SimpleForm() {
  const { findOfflineData } = useOfflineStorage();
  const { handleChange, formData, setFormData } = useFormState();

  useEffect(() => {
    const formData = async () => {
      const data = await findOfflineData("formData");
      if (data) {
        setFormData(data[0]);
      }
    };
    formData();
  }, []);

  return (
    <div className="grid-container">
      <Alert type="info" heading="Unpersisted Form Example" headingLevel="h1">
        This is a simple form example. The form data is stored with the React state.
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
      <div className="margin-bottom-2">
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
      </div>
      <hr />
      <div>
        <Alert type="info" heading="Persisted Form Example" headingLevel="h1">
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
        {formData && <SimpleFormDetails formData={formData} handleOnChange={handleChange} />}
      </div>
    </div>
  );
}

function SimpleFormDetails({ formData, handleOnChange }) {
  return (
    <FormGroup>
      <Label htmlFor="fullName">Name</Label>
      <TextInput
        id="fullName"
        name="fullName"
        type="text"
        value={formData?.fullName || ""}
        onChange={handleOnChange}
      />
      <Label htmlFor="numberOfFish">Number of Fish</Label>
      <TextInput
        id="numberOfFish"
        name="numberOfFish"
        type="number"
        value={formData?.numberOfFish || ""}
        onChange={handleOnChange}
      />
      <Label htmlFor="species">Species</Label>
      <TextInput
        id="species"
        name="species"
        type="text"
        value={formData?.species || ""}
        onChange={handleOnChange}
      />
      <Label htmlFor="computedPrice">Price</Label>
      <TextInput
        id="computedPrice"
        name="computedPrice"
        type="number"
        value={formData?.computedPrice || ""}
        onChange={handleOnChange}
      />
      <Button type="submit" className="margin-y-2">
        Submit
      </Button>
    </FormGroup>
  );
}

export default SimpleForm;