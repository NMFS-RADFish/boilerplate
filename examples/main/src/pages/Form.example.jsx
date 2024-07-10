import "../styles/theme.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Checkbox, FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Radio, Select, Button, Label, ErrorMessage } from "@trussworks/react-uswds";

import { useFormState } from "../contexts/FormWrapper.example";
import { fullNameValidators } from "../utilities";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { CONSTANTS } from "../config/form";
import DatePicker from "../components/DatePicker";
const { fullName, numberOfFish, radioOption, species, subSpecies, computedPrice } = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const Form = ({ asyncFormOptions }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, setFormData, stepBackward, init } = useFormState();
  const { findOfflineData } = useOfflineStorage();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const [found] = await findOfflineData("formData", {
          uuid: id,
        });

        if (found) {
          setFormData({ ...found });
        } else {
          navigate("/form");
        }
      }
    };
    loadData();
  }, [id]);

  const handleInit = async () => {
    const formId = await init({ initialStep: 1 });
    navigate(`${formId}`);
  };

  if (!id) {
    return (
      <div>
        <Button type="button" onClick={handleInit} data-testid="init-complex">
          Begin Form
        </Button>
      </div>
    );
  }

  if (!formData.currentStep || formData.currentStep === 1) {
    // return step one
    return <StepOne />;
  }

  if (formData.currentStep === 2) {
    // return step two with data
    return <StepTwo asyncFormOptions={asyncFormOptions} />;
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
      <Grid className="display-flex flex-justify">
        {/* 
          Buttons are ordered to produce the correct tab flow. The "order-last" class is added
          to move the button to the right to give the correct placement on page while tabbing
          in the correct order.
        */}
        <Button className="margin-top-1 margin-right-0 order-last" role="form-submit" type="submit">
          Submit Form
        </Button>
        <Button
          type="button"
          className="margin-top-1"
          onClick={stepBackward}
          data-testid="step-backward"
          id="step-backward"
        >
          Prev Step
        </Button>
      </Grid>
    </div>
  );
};

export const StepOne = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { init, stepForward, stepBackward, formData, handleChange, handleBlur, validationErrors } =
    useFormState();
  const [key, setKey] = useState(0);

  const handleInit = async () => {
    const formId = await init({ initialStep: 2 });
    navigate(`${formId}`);
  };

  return <DatePicker />;
};

export const StepTwo = ({ asyncFormOptions }) => {
  const { stepForward, stepBackward, formData, visibleInputs, handleChange } = useFormState();

  return (
    <FormGroup>
      <Label className="text-bold" htmlFor={numberOfFish}>
        Number of Fish
      </Label>
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
      <Label className="text-bold" htmlFor={species}>
        Species
      </Label>
      <Alert type="info" slim={true}>
        The species select input is dependent on data coming from a server. The current
        implementation is using a mock server.
      </Alert>
      <Select
        id={species}
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
          <Label className="text-bold" htmlFor={subSpecies}>
            Sub species
          </Label>
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
      <Label className="text-bold" htmlFor={species}>
        Computed Price
      </Label>
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
        <Button
          type="button"
          className="margin-top-1 margin-right-0 order-last"
          onClick={stepForward}
          data-testid="step-forward"
          id="step-forward"
        >
          Next Step
        </Button>
        <Button
          type="button"
          className="margin-top-1"
          onClick={stepBackward}
          data-testid="step-backward"
          id="step-backward"
        >
          Prev Step
        </Button>
      </Grid>
    </FormGroup>
  );
};

export { Form };
