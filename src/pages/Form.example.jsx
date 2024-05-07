import React, { useState } from "react";
import { Alert, Checkbox, FormGroup, Grid } from "@trussworks/react-uswds";
import {
  TextInput,
  Radio,
  Select,
  Button,
  Label,
  ErrorMessage,
  Toast,
  ToastStatus,
} from "../packages/react-components";
import { useFormState } from "../contexts/FormWrapper.example";
import { fullNameValidators } from "../utilities";
import useOfflineStorage from "../hooks/useOfflineStorage.example";
import { CONSTANTS } from "../config/form";
import "../styles/theme.css";

const { fullName, numberOfFish, radioOption, species, subSpecies, computedPrice } = CONSTANTS;
const id = null;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const Form = ({ asyncFormOptions }) => {
  const { formData, handleMultiEntrySubmit } = useFormState();
  const [toast, setToast] = useState(null);
  const TOAST_LIFESPAN = 2000;

  const { createOfflineData } = useOfflineStorage();

  const onOfflineSubmit = async (e) => {
    e.preventDefault();
    formData.isDraft = true;
    try {
      await createOfflineData("formData", formData);
      const { status, message } = ToastStatus.SUCCESS;
      setToast({ status, message });
    } catch (err) {
      const { status, message } = ToastStatus.ERROR;
      setToast({ status, message });
    } finally {
      setTimeout(() => {
        setToast(null);
      }, TOAST_LIFESPAN);
    }
  };

  if (!formData.currentStep || formData.currentStep === 1) {
    // return step one
    return <StepOne id={id} />;
  }

  if (formData.currentStep === 2) {
    // return step two with data
    return <StepTwo />;
  }

  return (
    <div className="grid-row flex-column">
      {!navigator.onLine && (
        <>
          <Alert type="info" slim={true}>
            Button Option 1: Below is an example of a simple button, it will save data locally. It
            does not make a server request.
          </Alert>
          <Button role="form-submit" type="submit" onClick={onOfflineSubmit}>
            Send Data to IndexDB
          </Button>
        </>
      )}
      <Alert type="info" slim={true}>
        Button Option 2: Below is an example of a multi-entry button, it sends data to a server. The
        current implementation is using a mock server.
      </Alert>
      <Button
        role="form-submit"
        type="submit"
        onClick={() => handleMultiEntrySubmit({ numberOfFish: Number(formData.numberOfFish) + 1 })}
        className="margin-top-10px border-105"
      >
        Multi Entry Submit
      </Button>
    </div>
  );
};

export const StepOne = ({ id }) => {
  const { init, stepForward, stepBackward, formData, handleChange, handleBlur, validationErrors } =
    useFormState();

  const handleInit = async () => {
    const formId = await init();
    navigate(`${formId}`);
  };

  return (
    <FormGroup error={validationErrors[fullName]}>
      <Label htmlFor={fullName}>Full Name</Label>
      {validationErrors[fullName] && <ErrorMessage>{validationErrors[fullName]}</ErrorMessage>}
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
        data-testid="inputId"
      />
      <Label htmlFor="checkbox">Checkbox Example</Label>
      <Checkbox id="Oahu" name="islands" value="Oahu" label="Oahu" defaultChecked />
      <Checkbox id="Kauai" name="islands" value="Kauai" label="Kauai" />
      <Checkbox id="Mauai" name="islands" value="Mauai" label="Mauai" />

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
      <Grid className="display-flex flex-justify">
        {/* 
    Buttons are ordered to produce the correct tab flow. The "order-last" class is added
    to move the button to the right to give the correct placement on page while tabbing
    in the correct order.
  */}
        <Button
          type="button"
          className="margin-top-1 margin-right-0 order-last"
          onClick={id ? stepForward : handleInit}
          data-testid="step-forward"
        >
          Next Step
        </Button>
        <Button
          disabled
          type="button"
          className="margin-top-1"
          onClick={stepBackward}
          data-testid="step-backward"
        >
          Prev Step
        </Button>
      </Grid>
    </FormGroup>
  );
};

export const StepTwo = () => {
  const { stepForward, stepBackward, formData, visibleInputs, handleChange } = useFormState();
  return (
    <FormGroup>
      <Label htmlFor={numberOfFish}>Number of Fish</Label>
      <Alert type="info" slim={true}>
        Example of a linked input. The value of this input is used to compute the price.
      </Alert>
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
          <Label htmlFor={subSpecies}>Sub species</Label>
          <Alert type="info" slim={true}>
            Only visible when a species is selected.
          </Alert>
          <TextInput
            id={subSpecies}
            name={subSpecies}
            type="text"
            placeholder="Sub-species"
            value={formData[subSpecies] || ""}
            onChange={handleChange}
          />
        </>
      )}
      <Label htmlFor={species}>Computed Price</Label>
      <Alert type="info" slim={true}>
        Readonly input. Its value is calculated based on the number of fish and species selected.
      </Alert>
      <TextInput
        readOnly
        id={computedPrice}
        name={computedPrice}
        type="text"
        placeholder="Computed Price"
        value={formData[computedPrice] || ""}
        onChange={handleChange}
      />
      <Grid className="display-flex flex-justify">
        {/* 
    Buttons are ordered to produce the correct tab flow. The "order-last" class is added
    to move the button to the right to give the correct placement on page while tabbing
    in the correct order.
  */}
        <Button
          type="button"
          className="margin-top-1 margin-right-0 order-last"
          onClick={stepForward}
          data-testid="step-forward"
        >
          Next Step
        </Button>
        <Button
          type="button"
          className="margin-top-1"
          onClick={stepBackward}
          data-testid="step-backward"
        >
          Prev Step
        </Button>
      </Grid>
      <hr />
    </FormGroup>
  );
};

export { Form };