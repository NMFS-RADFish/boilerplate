import React, { useEffect } from "react";
import { TextInput, Select, Button } from "@trussworks/react-uswds";
import { useFormState } from "../../contexts/FormWrapper";
import { fullNameValidators, emailValidators, phoneNumberValidators, zipcodeValidators, stateValidators, cityValidators } from "../../utilities";


/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const DemoForm = ({ asyncFormOptions }) => {
  const { formData, setFormData, handleChange, validationErrors, handleMultiEntrySubmit } =
    useFormState();

  /**
   * useEffect hook to set the city to "Honolulu" when fullName and email are present in formData.
   *
   * @function
   */
  useEffect(() => {
    if (formData.fullName && formData.email) setFormData((prev) => ({ ...prev, city: "Honolulu" }));
  }, [formData.fullName, formData.email, setFormData]);

  return (
    <>
      <TextInput
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={formData["fullName"] || ""}
        validationStatus={validationErrors.fullName ? "error" : undefined}
        onChange={(e) => handleChange(e, fullNameValidators)}
      />
      {validationErrors.fullName && <p className="error-message">{validationErrors.fullName}</p>}
      <TextInput
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData["email"] || ""}
        validationStatus={validationErrors.email ? "error" : undefined}
        onChange={(e) => handleChange(e, emailValidators)}
      />
      <TextInput
        name="phoneNumber"
        type="tel"
        placeholder="(000) 000-0000"
        value={formData["phoneNumber"] || ""}
        validationStatus={validationErrors.phoneNumber ? "error" : undefined}
        onChange={(e) => handleChange(e, phoneNumberValidators)}
      />
      <TextInput
        name="numberOfFish"
        type="number"
        placeholder="0"
        value={formData["numberOfFish"] || ""}
        onChange={handleChange}
      />
      <TextInput
        name="addressLine1"
        type="text"
        placeholder="Address Line 1"
        value={formData["addressLine1"] || ""}
        onChange={handleChange}
      />
      <TextInput
        name="addressLine2"
        type="text"
        placeholder="Address Line 2"
        value={formData["addressLine2"] || ""}
        onChange={handleChange}
      />
      <TextInput
        name="city"
        type="text"
        placeholder="City"
        value={formData["city"] || ""}
        validationStatus={validationErrors.city ? "error" : undefined}
        onChange={(e) => handleChange(e, cityValidators)}
      />
      <TextInput
        name="state"
        type="text"
        placeholder="State"
        value={formData["state"] || ""}
        validationStatus={validationErrors.state ? "error" : undefined}
        onChange={(e) => handleChange(e, stateValidators)}
      />
      <TextInput
        name="zipcode"
        type="text"
        placeholder="Zip Code"
        value={formData["zipcode"] || ""}
        validationStatus={validationErrors.zipcode ? "error" : undefined}
        onChange={(e) => handleChange(e, zipcodeValidators)}
      />
      <TextInput
        name="occupation"
        type="text"
        placeholder="Occupation"
        value={formData["occupation"] || ""}
        onChange={handleChange}
      />
      <Select name="department" value={formData["department"] || ""} onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="hr">Human Resources</option>
        <option value="it">IT</option>
        <option value="finance">Finance</option>
      </Select>
      <Select name="species" value={formData["species"] || ""} onChange={handleChange}>
        <option value="">Select Species</option>
        {asyncFormOptions?.species?.map((option) => {
          return (
            <option value={option.toLowerCase()}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          );
        })}
      </Select>
      <Button role="form-submit" type="submit">
        Submit
      </Button>
      <Button
        type="button"
        onClick={() => handleMultiEntrySubmit({ numberOfFish: Number(formData.numberOfFish) + 1 })}
      >
        Multi Entry Submit
      </Button>
    </>
  );
};

export default DemoForm;
