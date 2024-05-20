import React, { createContext, useState, useCallback } from "react";
import { Alert } from "@trussworks/react-uswds";
import { Form } from "radfish-react";

const FormContext = createContext();

export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const validateInputCallback = useCallback((name, value, validators) => {
    return handleInputValidationLogic(name, value, validators);
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      return updatedForm;
    });
  }, []);

  const handleBlur = useCallback(
    (event, validators) => {
      console.log("blur");
      const { name, value } = event.target;
      setValidationErrors((prev) => ({
        ...prev,
        ...validateInputCallback(name, value, validators),
      }));
    },
    [validateInputCallback],
  );

  const contextValue = {
    formData,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
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

export const handleInputValidationLogic = (name, value, validators) => {
  if (validators && validators.length > 0) {
    for (let validator of validators) {
      if (!validator.test(value)) {
        return { [name]: validator.message };
      }
    }
  }
  return { [name]: null };
};

function FormInfoAnnotation() {
  return (
    <Alert type="info" headingLevel={"h1"} heading="Example Form">
      This is an example of a form with form inputs that handle input validation. If a fullName
      input includes a number, the validator will return false and display the error
      <br />
      <br />
      <strong>Note:</strong> Annotations are for informational purposes only. In production, you
      would remove the annotations. Components with annotations above them are optional. You can
      choose whether or not to use them in your application.
    </Alert>
  );
}
