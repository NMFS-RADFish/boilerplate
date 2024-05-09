import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Checkbox, FormGroup } from "@trussworks/react-uswds";
import {
  TextInput,
  Radio,
  Select,
  Button,
  Label,
  ErrorMessage,
  Toast,
} from "../packages/react-components";
import { useFormState } from "../contexts/FormWrapper.example";
import { fullNameValidators } from "../utilities";
import { CONSTANTS } from "../config/form";
import "../styles/theme.css";
import { useToast } from "../hooks/useToast";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";

const { fullName, numberOfFish, radioOption, species, subSpecies, computedPrice } = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const ComplexForm = ({ asyncFormOptions }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { formData, setFormData, visibleInputs, handleChange, handleBlur, validationErrors } =
    useFormState();
  const { toast } = useToast();

  const { findOfflineData, createOfflineData } = useOfflineStorage();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const [found] = await findOfflineData("formData", {
          uuid: id,
        });

        if (found) {
          setFormData({ ...found, currentStep: 1, totalSteps: 3 });
        } else {
          navigate("/complexform");
        }
      }
    };
    loadData();
  }, [id]);

  const handleInit = async () => {
    const formId = await createOfflineData("formData", {});
    navigate(`${formId}`);
  };

  if (!id) {
    return (
      <div>
        <Button type="button" onClick={handleInit} data-testid="init-complex">
          Begin Complex Form
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="toast-container">
        <Toast toast={toast} />
      </div>
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
      </FormGroup>

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

      <div className="grid-row flex-column">
        <Alert type="info" slim={true}>
          Below is an example of a submit button, it sends data to a server if online, or saves a
          draft locally if offline. The current implementation is using a mock server.
        </Alert>
        <Button role="form-submit" type="submit" className="margin-top-10px border-105">
          Submit
        </Button>
      </div>
    </>
  );
};

export { ComplexForm };
