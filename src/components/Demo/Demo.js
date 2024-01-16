import React, { useEffect } from "react";
import { TextInput, Select } from "@trussworks/react-uswds";
import { useFormState } from "../../contexts/FormWrapper";

const fullNameValidators = [
  {
    test: (value) => !/\d/.test(value),
    message: "Full Name should not contain numbers.",
  },
];

const DemoForm = ({ asyncFormOptions }) => {
  const { formData, setFormData, handleChange, validationErrors, handleMultiEntrySubmit } =
    useFormState();

  useEffect(() => {
    if (formData.fullName && formData.email) setFormData((prev) => ({ ...prev, city: "Honolulu" }));
  }, [formData.fullName, formData.email]);

  return (
    <>
      <TextInput
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={formData["fullName"] || ""}
        onChange={(e) => handleChange(e, fullNameValidators)}
      />
      {validationErrors.fullName && <p className="error-message">{validationErrors.fullName}</p>}
      <TextInput
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData["email"] || ""}
        onChange={handleChange}
      />
      <TextInput
        name="phoneNumber"
        type="tel"
        placeholder="(000) 000-0000"
        value={formData["phoneNumber"] || ""}
        onChange={handleChange}
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
        onChange={handleChange}
      />
      <TextInput
        name="state"
        type="text"
        placeholder="State"
        value={formData["state"] || ""}
        onChange={handleChange}
      />
      <TextInput
        name="zipcode"
        type="text"
        placeholder="Zip Code"
        value={formData["zipcode"] || ""}
        onChange={handleChange}
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
      <button type="submit">Submit</button>
      <button
        type="button"
        onClick={() => handleMultiEntrySubmit({ numberOfFish: Number(formData.numberOfFish) + 1 })}
      >
        Multi Entry Submit
      </button>
    </>
  );
};

export default DemoForm;
