import "../index.css";
import React, { useEffect } from "react";
import { FormGroup, Alert, Link, TextInput, Label, Button } from "@trussworks/react-uswds";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";
import { useFormState } from "../contexts/FormWrapper";

function SimpleForm() {
  return (
    <div className="grid-container">
      <Alert type="info" heading="Unpersisted Form Example" headingLevel="h1">
        This is a simple form example. The form data is stored with the React state.
        <br />
        <br />
        <Link
          href="https://nmfs-radfish.github.io/documentation"
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
      <div className="margin-bottom-2">
        <FormGroup>
          <Label className="text-bold" htmlFor="fullName">
            Name
          </Label>
          <TextInput id="fullName" name="fullName" type="text" />
          <Label className="text-bold" htmlFor="numberOfFish">
            Number of Fish
          </Label>
          <TextInput id="numberOfFish" name="numberOfFish" type="number" />
          <Label className="text-bold" htmlFor="species">
            Species
          </Label>
          <TextInput id="species" name="species" type="text" />
          <Label className="text-bold" htmlFor="computedPrice">
            Price
          </Label>
          <TextInput id="computedPrice" name="computedPrice" type="number" />
          <Button type="submit" className="margin-top-2">
            Submit
          </Button>
        </FormGroup>
      </div>
    </div>
  );
}

export function SimpleFormDetails() {
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

  if (!formData) return null;

  return (
    <>
      <Alert type="info" heading="Persisted Form Example" headingLevel="h1">
        This is an example of a form with details coming from IndexedDB. The form data is stored in
        the browser's IndexedDB using methods from the `useOfflineStorage` hook, which uses Dexie.js
        behind the scenes.
        <br />
        <br />
        Please note that the form below will only populate when you have data saved in IndexedDB.
        <br />
        <br />
        <Link
          href="https://nmfs-radfish.github.io/documentation"
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

      <FormGroup>
        <Label className="text-bold" htmlFor="fullName">
          Name
        </Label>
        <TextInput
          id="fullName"
          name="fullName"
          type="text"
          value={formData?.fullName || ""}
          onChange={handleChange}
        />
        <Label className="text-bold" htmlFor="numberOfFish">
          Number of Fish
        </Label>
        <TextInput
          id="numberOfFish"
          name="numberOfFish"
          type="number"
          value={formData?.numberOfFish || ""}
          onChange={handleChange}
        />
        <Label className="text-bold" htmlFor="species">
          Species
        </Label>
        <TextInput
          id="species"
          name="species"
          type="text"
          value={formData?.species || ""}
          onChange={handleChange}
        />
        <Label className="text-bold" htmlFor="computedPrice">
          Price
        </Label>
        <TextInput
          id="computedPrice"
          name="computedPrice"
          type="number"
          value={formData?.computedPrice || ""}
          onChange={handleChange}
        />
        <Button type="submit" className="margin-top-2">
          Submit
        </Button>
      </FormGroup>
    </>
  );
}

export default SimpleForm;
