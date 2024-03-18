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
  generateUUID,
} from "../utilities";
import useFormStorage from "../hooks/useFormStorage";
import { CONSTANTS } from "../config/multistepForm";
import useMultStepForm from "../hooks/useMultiStepForm";
import { useParams, useNavigate, Link } from "react-router-dom";

const { fullName, nickname, email, phoneNumber, country, city, state, zipcode } = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const MultiStepForm = ({ asyncFormOptions }) => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { create, find, update } = useFormStorage();
  const {
    init,
    stepForward,
    stepBackward,
    handleSubmit,
    currentStep,
    //
    formData,
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  } = useMultStepForm(uuid);

  // todo: break this into useMultiStateForm
  useEffect(() => {
    if (uuid) {
      const [found] = find({ uuid });
      if (!found) {
        navigate("/multistep");
      } else {
        setFormData(found[1]);
      }
      // we have a cached form
    }
  }, []);

  const handleInit = () => {
    const formId = init(uuid);
    navigate(`${formId}`);
  };

  if (!uuid) {
    return (
      <div>
        <Button onClick={handleInit}>Begin Multistep Form</Button>
      </div>
    );
  }

  if (formData.currentStep === 1) {
    return (
      <>
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
        <Label htmlFor={nickname}>Nickname</Label>
        <TextInput
          id={nickname}
          name={nickname}
          type="text"
          placeholder="Nickname"
          value={formData[nickname] || ""}
          onChange={handleChange}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={stepBackward} style={{ marginTop: "10px" }}>
            Prev Step
          </Button>
          <Button onClick={stepForward} style={{ marginTop: "10px" }}>
            Next Step
          </Button>
        </div>
      </>
    );
  }

  if (formData.currentStep === 2) {
    return (
      <>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={stepBackward} style={{ marginTop: "10px" }}>
            Prev Step
          </Button>
          <Button onClick={stepForward} style={{ marginTop: "10px" }}>
            Next Step
          </Button>
        </div>
      </>
    );
  }

  if (formData.currentStep === 3) {
    return (
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={stepBackward} style={{ marginTop: "10px" }}>
            Prev Step
          </Button>
          <Button
            role="form-submit"
            type="submit"
            onClick={handleSubmit}
            style={{ marginTop: "10px" }}
          >
            Submit MultiStep Form
          </Button>
        </div>
      </>
    );
  }

  return (
    <div>
      <p>Invalid Step</p>
    </div>
  );
};

export { MultiStepForm };
