import React, { createContext, useState, useCallback } from "react";
import { Alert } from "@trussworks/react-uswds";
import { Form } from "@nmfs-radfish/react-radfish";
import { FORM_CONFIG } from "../config/form";

const FormContext = createContext();

export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleComputedValuesCallback = useCallback((inputIds, formData) => {
    handleComputedValuesLogic(inputIds, formData, FORM_CONFIG);
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      const linkedinputids = event.target.getAttribute("linkedinputids")?.split(",");
      // if field being updated has a linked field that needs to be computed, update state after computing linked fields
      // else just return updatedForm without needing to linked computedValues
      setFormData((prev) => {
        const updatedForm = { ...prev, [name]: value };
        if (linkedinputids) {
          const updatedComputedForm =
            handleComputedValuesCallback(linkedinputids, updatedForm) || updatedForm;
          return updatedComputedForm;
        } else {
          return updatedForm;
        }
      });
    },
    [handleComputedValuesCallback],
  );

  const contextValue = {
    formData,
    setFormData,
    handleChange,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <FormInfoAnnotation />
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(formData);
        }}
      >
        {children}
      </Form>
    </FormContext.Provider>
  );
};

export const useFormState = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormState must be used within a FormWrapper");
  }
  return context;
};

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
      This is an example of a form with form inputs that compute the values of other form inputs.
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
    </Alert>
  );
}
