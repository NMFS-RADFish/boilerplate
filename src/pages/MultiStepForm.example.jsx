import React, { useEffect, useRef } from "react";
import { TextInput, Button, Label, ErrorMessage } from "../react-radfish";
import { GridContainer, Grid } from "@trussworks/react-uswds";
import {
  fullNameValidators,
  emailValidators,
  phoneNumberValidators,
  zipcodeValidators,
  stateValidators,
  cityValidators,
} from "../utilities";
import useOfflineStorage from "../hooks/useOfflineStorage";
import { CONSTANTS } from "../config/multistepForm";
import useMultStepForm from "../hooks/useMultiStepForm";
import { useParams, useNavigate } from "react-router-dom";

const { fullName, nickname, email, phoneNumber, country, city, state, zipcode } = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const MultiStepForm = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { findOfflineData } = useOfflineStorage();
  const {
    init,
    stepForward,
    stepBackward,
    handleSubmit,
    formData,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
  } = useMultStepForm(uuid);

  // A Ref will be needed for each step form to set focus when the form is displayed.
  const stepFocus = [useRef(null), useRef(null), useRef(null)];

  // todo: break this into useMultiStateForm
  useEffect(() => {
    const loadData = async () => {
      const [found] = await findOfflineData("formData", { uuid });
      if (uuid) {
        if (!found) {
          navigate("/multistep");
        } else {
          setFormData(found);
        }
        // we have a cached form
      }
    };
    loadData();
  }, []);

  // Set input focus on first input of active step form
  useEffect(() => {
    if (formData.currentStep > 0) {
      stepFocus[formData.currentStep - 1].current?.focus();
    }
  }, [formData.currentStep]);

  const handleInit = async () => {
    const formId = await init(uuid);
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
      <GridContainer>
        <Grid row gap="md">
          <Grid
            tablet={{
              col: true,
            }}
          >
            <FormGroup error={validationErrors[fullName]}>
              {validationErrors[fullName] && (
                <ErrorMessage>{validationErrors[fullName]}</ErrorMessage>
              )}
              <Label className=".mobile:margin-top-1" htmlFor={fullName}>
                Full Name
              </Label>
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
                inputRef={stepFocus[0]}
              />
            </FormGroup>
          </Grid>
          <Grid
            tablet={{
              col: true,
            }}
          >
            <Label htmlFor={nickname}>Nickname</Label>
            <TextInput
              id={nickname}
              name={nickname}
              type="text"
              placeholder="Nickname"
              value={formData[nickname] || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid className="display-flex flex-justify">
          {/* 
            Buttons are ordered to produce the correct tab flow. The "order-last" class is added
            to move the button to the right to give the correct placement on page while tabbing
            in the correct order.
          */}
          <Button className="margin-top-1 margin-right-0 order-last" onClick={stepForward}>
            Next Step
          </Button>
          <Button className="margin-top-1" onClick={stepBackward}>
            Prev Step
          </Button>
        </Grid>
      </GridContainer>
    );
  }

  if (formData.currentStep === 2) {
    return (
      <GridContainer>
        <Grid row gap="md">
          <Grid
            tablet={{
              col: true,
            }}
          >
            <FormGroup error={validationErrors[email]}>
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
                inputRef={stepFocus[1]}
              />
              {validationErrors[email] && <ErrorMessage>{validationErrors[email]}</ErrorMessage>}
            </FormGroup>
          </Grid>
          <Grid
            tablet={{
              col: true,
            }}
          >
            <FormGroup error={validationErrors[phoneNumber]}>
              <Label htmlFor={phoneNumber}>Phone Number</Label>
              {validationErrors[phoneNumber] && (
                <ErrorMessage>{validationErrors[phoneNumber]}</ErrorMessage>
              )}
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
            </FormGroup>
          </Grid>
        </Grid>
        <Grid className="display-flex flex-justify">
          <Button className="margin-top-1 margin-right-0 order-last" onClick={stepForward}>
            Next Step
          </Button>
          <Button className="margin-top-1" onClick={stepBackward}>
            Prev Step
          </Button>
        </Grid>
      </GridContainer>
    );
  }

  if (formData.currentStep === 3) {
    return (
      <GridContainer>
        <Grid row>
          <Grid col>
            <FormGroup error={validationErrors[city]}>
              <Label htmlFor={city}>City</Label>
              {validationErrors.city && <ErrorMessage>{validationErrors.city}</ErrorMessage>}
              <TextInput
                id={city}
                name={city}
                type="text"
                placeholder="City"
                value={formData[city] || ""}
                validationStatus={validationErrors[city] ? "error" : undefined}
                onChange={handleChange}
                onBlur={(e) => handleBlur(e, cityValidators)}
                inputRef={stepFocus[2]}
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Grid row gap="md">
          <Grid
            tablet={{
              col: true,
            }}
          >
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
          </Grid>
          <Grid
            tablet={{
              col: true,
            }}
          >
            <FormGroup error={validationErrors[state]}>
              <Label htmlFor={state}>State</Label>
              {validationErrors[state] && <ErrorMessage>{validationErrors[state]}</ErrorMessage>}
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
            </FormGroup>
          </Grid>
          <Grid
            tablet={{
              col: true,
            }}
          >
            <FormGroup error={validationErrors[zipcode]}>
              <Label htmlFor={zipcode}>Zip Code</Label>
              {validationErrors[zipcode] && (
                <ErrorMessage>{validationErrors[zipcode]}</ErrorMessage>
              )}
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
            </FormGroup>
          </Grid>
        </Grid>
        <Grid className="display-flex flex-justify">
          <Button
            className="margin-top-1 margin-right-0 order-last"
            role="form-submit"
            type="submit"
            onClick={handleSubmit}
          >
            Submit MultiStep Form
          </Button>
          <Button className="margin-top-1" onClick={stepBackward}>
            Prev Step
          </Button>
        </Grid>
      </GridContainer>
    );
  }

  return (
    <div>
      <p>Invalid Step</p>
    </div>
  );
};

export { MultiStepForm };
