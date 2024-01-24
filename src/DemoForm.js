import React, { useEffect } from "react";
import { TextInput, Radio, Select, Button, Label, ErrorMessage } from "../../react-radfish";
import { useFormState } from "../../contexts/FormWrapper";
import {
  fullNameValidators,
  emailValidators,
  phoneNumberValidators,
  zipcodeValidators,
  stateValidators,
  cityValidators,
} from "../../utilities";

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
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  } = useFormState();

  useEffect(() => {
    if (formData.fullName && formData.email) setFormData((prev) => ({ ...prev, city: "Honolulu" }));
  }, [formData.fullName, formData.email, setFormData]);

  return (
    <>
      <Label htmlFor="fullName">Full Name</Label>
      <TextInput
        id="fullName"
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={formData["fullName"] || ""}
        aria-invalid={validationErrors.fullName ? "true" : "false"}
        validationStatus={validationErrors.fullName ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, fullNameValidators)}
      />
      {validationErrors.fullName && <ErrorMessage>{validationErrors.fullName}</ErrorMessage>}

      <Label htmlFor="email">Email Address</Label>
      <TextInput
        id="email"
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData["email"] || ""}
        validationStatus={validationErrors.email ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, emailValidators)}
      />

      <Label htmlFor="phoneNumber">Phone Number</Label>
      {validationErrors.email && <ErrorMessage>{validationErrors.email}</ErrorMessage>}
      <TextInput
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        placeholder="(000) 000-0000"
        value={formData["phoneNumber"] || ""}
        validationStatus={validationErrors.phoneNumber ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, phoneNumberValidators)}
      />

      <Label htmlFor="numberOfFish">Number of Fish</Label>
      {validationErrors.phoneNumber && <ErrorMessage>{validationErrors.phoneNumber}</ErrorMessage>}
      <TextInput
        id="numberOfFish"
        name="numberOfFish"
        type="number"
        placeholder="0"
        value={formData["numberOfFish"] || ""}
        onChange={handleChange}
      />

      <Label htmlFor="addressLine1">Address Line 1</Label>
      <TextInput
        id="addressLine1"
        name="addressLine1"
        type="text"
        placeholder="Address Line 1"
        value={formData["addressLine1"] || ""}
        onChange={handleChange}
      />

      <Label htmlFor="radioOption">Options</Label>
      <Radio
        id="option1"
        name="radioOption"
        label="Option 1"
        value="option1"
        checked={formData.radioOption === "option1"}
        onChange={handleChange}
      />
      <Radio
        id="option2"
        name="radioOption"
        label="Option 2"
        value="option2"
        checked={formData.radioOption === "option2"}
        onChange={handleChange}
      />
      <Radio
        id="option3"
        name="radioOption"
        label="Option 3"
        value="option3"
        checked={formData.radioOption === "option3"}
        onChange={handleChange}
      />

      <Label htmlFor="addressLine2">Address Line 2</Label>
      <TextInput
        id="addressLine2"
        name="addressLine2"
        type="text"
        placeholder="Address Line 2"
        value={formData["addressLine2"] || ""}
        onChange={handleChange}
      />

      <Label htmlFor="city">City</Label>
      <TextInput
        id="city"
        name="city"
        type="text"
        placeholder="City"
        value={formData["city"] || ""}
        validationStatus={validationErrors.city ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, cityValidators)}
      />

      <Label htmlFor="state">State</Label>
      {validationErrors.city && <ErrorMessage>{validationErrors.city}</ErrorMessage>}
      <TextInput
        id="state"
        name="state"
        type="text"
        placeholder="State"
        value={formData["state"] || ""}
        validationStatus={validationErrors.state ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, stateValidators)}
      />

      <Label htmlFor="zipcode">Zip Code</Label>
      {validationErrors.state && <ErrorMessage>{validationErrors.state}</ErrorMessage>}
      <TextInput
        id="zipcode"
        name="zipcode"
        type="text"
        placeholder="Zip Code"
        value={formData["zipcode"] || ""}
        validationStatus={validationErrors.zipcode ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, zipcodeValidators)}
      />

      <Label htmlFor="occupation">Occupation</Label>
      {validationErrors.zipcode && <ErrorMessage>{validationErrors.zipcode}</ErrorMessage>}
      <TextInput
        id="occupation"
        name="occupation"
        type="text"
        placeholder="Occupation"
        value={formData["occupation"] || ""}
        onChange={handleChange}
      />

      <Label htmlFor="department">Department</Label>
      <Select name="department" value={formData["department"] || ""} onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="hr">Human Resources</option>
        <option value="it">IT</option>
        <option value="finance">Finance</option>
      </Select>

      <Label htmlFor="species">Species</Label>
      <Select name="species" value={formData["species"] || ""} onChange={handleChange}>
        <option value="">Select Species</option>
        {asyncFormOptions?.species?.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </Select>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button role="form-submit" type="submit">
          Submit
        </Button>
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

export { DemoForm };
