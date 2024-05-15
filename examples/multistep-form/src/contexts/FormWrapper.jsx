/**
 * Manages state for any child Radfish form.
 * This context should wrap the RadfisForm component and will manage it's state related to input fields, input validations, and form submissions
 * This context provider is meant to be extensible and modular. You can use this anywhere in your app to wrap a form to manage the specific form's state
 */

import React, { createContext, useState, useCallback } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Alert } from "@trussworks/react-uswds";
import { Form, Button } from "../../../../packages/radfish-react";
import { COMMON_CONFIG } from "../config/common";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";

const FormContext = createContext();
const TOTAL_STEPS = 2;

/**
 * Higher-order component providing form state and functionality.
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Function} props.onSubmit - Callback function to handle form submission.
 * @returns {JSX.Element} The JSX element representing the form wrapper.
 */
export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { createOfflineData, updateOfflineData } = useOfflineStorage();

  async function init({ initialStep }) {
    const uuid = await createOfflineData("formData", {
      ...formData,
      currentStep: initialStep,
      totalSteps: TOTAL_STEPS,
    });
    setFormData({ ...formData, currentStep: initialStep, totalSteps: TOTAL_STEPS });
    return uuid;
  }

  function stepForward() {
    if (formData.currentStep < TOTAL_STEPS) {
      const nextStep = formData.currentStep + 1;
      setFormData({ ...formData, currentStep: nextStep });
      updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: nextStep }]);
    }
  }

  function stepBackward() {
    if (formData.currentStep > 1) {
      const prevStep = formData.currentStep - 1;
      setFormData({ ...formData, currentStep: prevStep });
      updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: prevStep }]);
    }
  }

  const saveOfflineData = async (tableName, data) => {
    try {
      if (params.id) {
        await updateOfflineData(tableName, [{ uuid: params.id, ...data }]);
      }
    } catch (error) {
      return error;
    }
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    // if field being updated has a linked field that needs to be computed, update state after computing linked fields
    // else just return updatedForm without needing to linked computedValues
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      saveOfflineData("formData", updatedForm);
      return updatedForm;
    });
  }, []); // Include 'handleComputedValues' in the dependency array

  const contextValue = {
    formData,
    setFormData,
    handleChange,
    searchParams,
    init,
    stepForward,
    stepBackward,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <FormInfoAnnotation />
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          if (!navigator.onLine) {
            formData.isDraft = true;
          } else {
            formData.isDraft = false;
          }
          onSubmit?.(formData);
        }}
      >
        {children}
      </Form>
    </FormContext.Provider>
  );
};

/**
 * Custom hook for accessing the form state from the context. Can be used by a child of FormWrapper
 *
 * @function
 * @returns {Object} Form state and functions.
 * @throws {Error} Throws an error if used outside of a FormWrapper.
 */
export const useFormState = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormState must be used within a FormWrapper");
  }
  return context;
};

// callback handlers

export const handleComputedValuesLogic = (inputIds, formData, FORM_CONFIG) => {
  for (let inputId of inputIds) {
    const computedCallback = FORM_CONFIG[inputId]?.computed?.callback;
    if (computedCallback) {
      const args = FORM_CONFIG[inputId].computed.args.map((arg) => formData[arg]);
      const computedValue = computedCallback(args);
      formData[inputId] = computedValue;
    }
  }
};

function FormInfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Example Form">
      This is an example of a form with various input types. The form is designed to be used with
      the `FormWrapper` component.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
      <br />
      <br />
      <a href={COMMON_CONFIG.docsUrl} target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Documentation</Button>
      </a>
      <a href={COMMON_CONFIG.storybookURL} target="_blank" rel="noopener noreferrer">
        <Button type="button">Go To Storybook</Button>
      </a>
    </Alert>
  );
}
