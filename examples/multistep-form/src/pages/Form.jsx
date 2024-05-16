import "../styles/theme.css";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Button, Label } from "radfish-react";
import { TOTAL_STEPS, useFormState } from "../contexts/FormWrapper";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";
import { CONSTANTS } from "../config/form";

const { fullName, email, city, state, zipcode } = CONSTANTS;

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
  const { formData, setFormData, stepBackward, stepForward, handleChange, init } = useFormState();
  const { findOfflineData } = useOfflineStorage();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const [found] = await findOfflineData("formData", {
          uuid: id,
        });

        if (found) {
          setFormData({ ...found, totalSteps: TOTAL_STEPS });
        } else {
          navigate("/");
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

  if (!formData.currentStep) {
    return (
      <div>
        <p>Invlid Step</p>
      </div>
    );
  }

  if (formData.currentStep === 1) {
    return (
      <FormGroup>
        <Label htmlFor={fullName}>Full Name</Label>
        <TextInput
          id={fullName}
          name={fullName}
          type="text"
          placeholder="Full Name"
          value={formData[fullName] || ""}
          onChange={handleChange}
        />
        <Label htmlFor={fullName}>Email</Label>
        <TextInput
          id={email}
          name={email}
          type="text"
          placeholder="user@example.com"
          value={formData[email] || ""}
          onChange={handleChange}
        />

        <Grid className="display-flex flex-justify">
          <Button
            type="button"
            className="margin-top-1 margin-right-0 order-last"
            onClick={stepForward}
          >
            Next Step
          </Button>
          <Button
            disabled
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
  }

  return (
    <FormGroup>
      <Label htmlFor={city}>City</Label>
      <TextInput
        id={city}
        name={city}
        type="text"
        placeholder="City"
        value={formData[city] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={state}>State</Label>
      <TextInput
        id={state}
        name={state}
        type="text"
        placeholder="State"
        value={formData[state] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={zipcode}>Zipcode</Label>
      <TextInput
        id={zipcode}
        name={zipcode}
        type="text"
        placeholder="Zipcode"
        value={formData[zipcode] || ""}
        onChange={handleChange}
      />

      <Grid className="display-flex flex-justify">
        <Button type="submit" className="margin-top-1 margin-right-0 order-last">
          Submit
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
