import "./index.css";
import React, { useState, useEffect } from "react";
import { FormGroup, Alert } from "@trussworks/react-uswds";
import { useOfflineStorage } from "./packages/contexts/OfflineStorageWrapper";
import { Button } from "@nmfs-radfish/react-radfish";
import { FormWrapper, useFormState } from "./contexts/FormWrapper";
import SimpleForm from "./pages/Form";

function App() {
  const { createOfflineData } = useOfflineStorage();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {};

    for (let [key, value] of formData.entries()) {
      values[key] = value;
    }

    // setFormData(values);
    createOfflineData("formData", values);
    // Handle form submission, usually by sending a POST request to a server
    // Example: fetch.post("/api/form", values)
    console.log("Form submitted");
  };

  return (
    <div className="grid-container">
      <h1>Simple Form Examples</h1>
      <FormWrapper onSubmit={handleOnSubmit}>
        <SimpleForm />
      </FormWrapper>
    </div>
  );
}

export default App;
