import React, { useEffect } from "react";
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
import useFormStorage from "../hooks/useFormStorage";
import { CONSTANTS } from "../config/form";

const { nickname, fullName, numberOfFish, species, subSpecies, computedPrice } = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const DemoForm = ({ asyncFormOptions }) => {
  const {
    formData,
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  } = useFormState();

  const { create } = useFormStorage();

  // useEffect(() => {
  //   if (formData.fullName && formData.email) setFormData((prev) => ({ ...prev, city: "Honolulu" }));
  // }, [formData.fullName, formData.email, setFormData]);

  function onOfflineSubmit(e) {
    e.preventDefault();
    create(formData);
  }

  return (
    <>
      {/* <Label htmlFor={fullName}>Full Name</Label>
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
      />
      {validationErrors[fullName] && <ErrorMessage>{validationErrors[fullName]}</ErrorMessage>}

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
      />
      {validationErrors[phoneNumber] && (
        <ErrorMessage>{validationErrors[phoneNumber]}</ErrorMessage>
      )} */}

      <Label htmlFor={numberOfFish}>Number of Fish</Label>
      <TextInput
        id={numberOfFish}
        // linkedInputId tells computedPrice to update onChange
        linkedInputIds={[computedPrice]}
        name={numberOfFish}
        type="number"
        placeholder="0"
        value={formData[numberOfFish] || ""}
        onChange={handleChange}
      />

      {/* <Label htmlFor={addressLine1}>Address Line 1</Label>
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
      </Select> */}

      <Label htmlFor={species}>Species</Label>
      <Select
        // linkedInputIds tells computedPrice to update onChange
        linkedInputIds={[computedPrice, subSpecies]}
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

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button role="form-submit" type="submit" onClick={onOfflineSubmit}>
          Submit
        </Button>
        {/* <Button
          role="form-submit"
          type="submit"
          onClick={() =>
            handleMultiEntrySubmit({ numberOfFish: Number(formData.numberOfFish) + 1 })
          }
          style={{ marginTop: "10px" }}
        >
          Multi Entry Submit
        </Button> */}
      </div>
    </>
  );
};

export { DemoForm };
