import "../styles/theme.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Button, Label, Form } from "@nmfs-radfish/react-radfish";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";
import { CONSTANTS } from "../config/form";

const TOTAL_STEPS = 2;
const { fullName, email, city, state, zipcode } = CONSTANTS;

const MultiStepForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const { createOfflineData, findOfflineData, updateOfflineData } = useOfflineStorage();

  // checks if uuid exists in IndexedDB. If it does, load that formData, else start new multistep form
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

  // submits form data, and includes a submitted flag to identify that it has been submitted
  // this is useful for tracking which forms have been submitted, and which are still in progress
  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateOfflineData("formData", [{ uuid: formData.uuid, ...formData, submitted: true }]);
  };

  // whenever an input field changes, update the formData state in IndexedDB so that is is cached as the user types
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      saveOfflineData("formData", updatedForm);
      return updatedForm;
    });
  };

  // helper function to allow for async/await in IndexedDB operations within setFormData state handler
  const saveOfflineData = async (tableName, data) => {
    try {
      if (id) {
        await updateOfflineData(tableName, [{ uuid: id, ...data }]);
      }
    } catch (error) {
      return error;
    }
  };

  // update form data, and increment currentStep by 1
  const stepForward = () => {
    if (formData.currentStep < TOTAL_STEPS) {
      const nextStep = formData.currentStep + 1;
      setFormData({ ...formData, currentStep: nextStep });
      updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: nextStep }]);
    }
  };

  // update form data, and decrement currentStep by 1
  const stepBackward = () => {
    if (formData.currentStep > 1) {
      const prevStep = formData.currentStep - 1;
      setFormData({ ...formData, currentStep: prevStep });
      updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: prevStep }]);
    }
  };

  // initialize new multistep form in IndexedDB, and navigate to new form id
  const handleInit = async () => {
    const formId = await createOfflineData("formData", {
      ...formData,
      currentStep: 1,
      totalSteps: TOTAL_STEPS,
    });
    setFormData({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
    navigate(`${formId}`);
  };

  if (!id) {
    return (
      <div>
        <Button type="button" onClick={handleInit}>
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

  return (
    <Form onSubmit={handleSubmit}>
      {/* step one */}
      {formData.currentStep === 1 && (
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
      )}
      {/* step two */}
      {formData.currentStep === 2 && (
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
      )}
    </Form>
  );
};

export { MultiStepForm };
