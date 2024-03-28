import React, { useEffect } from "react";
import { Alert } from "@trussworks/react-uswds";
import { TextInput, Radio, Select, Button, Label, ErrorMessage } from "../react-radfish";
import { useFormState } from "../contexts/FormWrapper";
import {
  fullNameValidators,
  emailValidators,
  phoneNumberValidators,
  zipcodeValidators,
  stateValidators,
  cityValidators,
} from "../utilities";
import useOfflineStorage from "../hooks/useOfflineStorage";
import { CONSTANTS } from "../config/form";
import { COMMON_CONFIG } from "../config/common";

const {
  fullName,
  nickname,
  email,
  phoneNumber,
  country,
  addressLine1,
  numberOfFish,
  addressLine2,
  radioOption,
  city,
  state,
  zipcode,
  occupation,
  department,
  species,
  subSpecies,
  computedPrice,
} = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const ComplexForm = ({ asyncFormOptions }) => {
  const {
    formData,
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  } = useFormState();

  const { createOfflineDataEntry } = useOfflineStorage();

  useEffect(() => {
    if (formData.fullName && formData.email) setFormData((prev) => ({ ...prev, city: "Honolulu" }));
  }, [formData.fullName, formData.email, setFormData]);

  function onOfflineSubmit(e) {
    e.preventDefault();
    if (navigator.onLine) {
      return;
    }
    createOfflineDataEntry(formData);
  }

  return (
    <>
      <FormInfoAnnotation />
      <Label htmlFor={fullName}>Full Name</Label>
      <TextInput
        id={fullName}
        name={fullName}
        type="text"
        placeholder="Full Name"
        value={formData[fullName] || ""}
        aria-invalid={validationErrors[fullName] ? "true" : "false"}
        validationStatus={validationErrors[fullName] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, fullNameValidators)}
        linkedinputids={[nickname]}
      />
      {validationErrors[fullName] && <ErrorMessage>{validationErrors[fullName]}</ErrorMessage>}
      {visibleInputs[nickname] && (
        <>
          <Label htmlFor={nickname}>Nickname</Label>
          <TextInput
            id={nickname}
            name={nickname}
            type="text"
            placeholder="Nickname"
            value={formData[nickname] || ""}
            onChange={handleChange}
          />
        </>
      )}
      <Label htmlFor={email}>Email Address</Label>
      <TextInput
        id={email}
        name={email}
        type={email}
        placeholder="Email Address"
        value={formData[email] || ""}
        validationStatus={validationErrors[email] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, emailValidators)}
      />
      {validationErrors[email] && <ErrorMessage>{validationErrors[email]}</ErrorMessage>}
      <Label htmlFor={phoneNumber}>Phone Number</Label>
      <TextInput
        id={phoneNumber}
        name={phoneNumber}
        type="tel"
        placeholder="(000) 000-0000"
        value={formData[phoneNumber] || ""}
        validationStatus={validationErrors[phoneNumber] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, phoneNumberValidators)}
        linkedinputids={[country]}
      />
      {validationErrors[phoneNumber] && (
        <ErrorMessage>{validationErrors[phoneNumber]}</ErrorMessage>
      )}
      {visibleInputs[country] && (
        <>
          <Label htmlFor={country}>Country</Label>
          <TextInput
            id={country}
            name={country}
            type="text"
            placeholder="Country of Origin"
            value={formData[country] || ""}
            onChange={handleChange}
            linkedinputids={[country]}
          />
        </>
      )}
      <Label htmlFor={numberOfFish}>Number of Fish</Label>
      <TextInput
        id={numberOfFish}
        // linkedInputId tells computedPrice to update onChange
        linkedinputids={[computedPrice]}
        name={numberOfFish}
        type="number"
        placeholder="0"
        value={formData[numberOfFish] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={addressLine1}>Address Line 1</Label>
      <TextInput
        id={addressLine1}
        name={addressLine1}
        type="text"
        placeholder="Address Line 1"
        value={formData[addressLine1] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={radioOption}>Have you caught fish today?</Label>
      <Radio
        id="option-catch-yes"
        name={radioOption}
        label="Yes"
        value="option-catch-yes"
        checked={formData[radioOption] === "option-catch-yes"}
        onChange={handleChange}
      />
      <Radio
        id="option-catch-no"
        name={radioOption}
        label="No"
        value="option-catch-no"
        checked={formData[radioOption] === "option-catch-no"}
        onChange={handleChange}
      />
      <Label htmlFor={addressLine2}>Address Line 2</Label>
      <TextInput
        id={addressLine2}
        name={addressLine2}
        type="text"
        placeholder="Address Line 2"
        value={formData[addressLine2] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={city}>City</Label>
      <TextInput
        id={city}
        name={city}
        type="text"
        placeholder="City"
        value={formData[city] || ""}
        validationStatus={validationErrors[city] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, cityValidators)}
      />
      {validationErrors.city && <ErrorMessage>{validationErrors.city}</ErrorMessage>}
      <Label htmlFor={state}>State</Label>
      <TextInput
        id={state}
        name="state"
        type="text"
        placeholder="State"
        value={formData[state] || ""}
        validationStatus={validationErrors[state] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, stateValidators)}
      />
      {validationErrors[state] && <ErrorMessage>{validationErrors[state]}</ErrorMessage>}
      <Label htmlFor={zipcode}>Zip Code</Label>
      <TextInput
        id={zipcode}
        name={zipcode}
        type="text"
        placeholder="Zip Code"
        value={formData[zipcode] || ""}
        validationStatus={validationErrors[zipcode] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, zipcodeValidators)}
      />
      {validationErrors[zipcode] && <ErrorMessage>{validationErrors[zipcode]}</ErrorMessage>}
      <Label htmlFor={occupation}>Occupation</Label>
      <TextInput
        id={occupation}
        name={occupation}
        type="text"
        placeholder="Occupation"
        value={formData[occupation] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={department}>Department</Label>
      <Select name={department} value={formData[department] || ""} onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="hr">Human Resources</option>
        <option value="it">IT</option>
        <option value="finance">Finance</option>
      </Select>
      <Label htmlFor={species}>Species</Label>
      <Alert type="info" slim={true}>
        The species select input is dependent on data coming from a server. The current
        implementation is using a mock server.
      </Alert>
      <Select
        // linkedinputids tells computedPrice to update onChange
        linkedinputids={[computedPrice, subSpecies]}
        name={species}
        value={formData[species] || ""}
        onChange={handleChange}
      >
        <option value="">Select Species</option>
        {asyncFormOptions?.species?.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </Select>
      {visibleInputs[subSpecies] && (
        <>
          <Label htmlFor={subSpecies} isVisible={true}>
            Sub species
          </Label>
          <TextInput
            id={subSpecies}
            name={subSpecies}
            type="text"
            placeholder="Sub-species"
            value={formData[subSpecies] || ""}
            onChange={handleChange}
            isVisible={true}
          />
        </>
      )}
      <Label htmlFor={species}>Computed Price</Label>
      <TextInput
        readOnly
        id={computedPrice}
        name={computedPrice}
        type="text"
        placeholder="Computed Price"
        value={formData[computedPrice] || ""}
        onChange={handleChange}
      />
      <Alert type="info" slim={true}>
        Button Option 1: Below is an example of a simple button, it will save data locally. It does
        not make a server request.
      </Alert>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button role="form-submit" type="submit" onClick={onOfflineSubmit}>
          Submit
        </Button>

        <Alert type="info" slim={true}>
          Button Option 2: Below is an example of a multi-entry button, it sends data to a server.
          The current implementation is using a mock server.
        </Alert>
        <Button
          role="form-submit"
          type="submit"
          onClick={() =>
            handleMultiEntrySubmit({ numberOfFish: Number(formData.numberOfFish) + 1 })
          }
          style={{ marginTop: "10px" }}
        >
          Multi Entry Submit
        </Button>
      </div>
    </>
  );
};

function FormInfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Form Components">
      This component is an example of a form with various input types. The form is designed to be
      used with the `FormWrapper` component.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
      <br />
      <br />
      <a href={COMMON_CONFIG.docsUrl} target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Documentation</Button>
      </a>
      <a href={COMMON_CONFIG.storybookURL} target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Storybook</Button>
      </a>
    </Alert>
  );
}

export { ComplexForm };
