// FormContext.js
import React, { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FormContext = createContext();

export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleMultiEntrySubmit = (params) => {
    const queryString = new URLSearchParams(params).toString();
    navigate(`/?${queryString}`);
  };

  useEffect(() => {
    const newFormData = {};
    let hasNewData = false;

    for (let [key, value] of searchParams.entries()) {
      newFormData[key] = value;
      hasNewData = true;
    }

    if (hasNewData) {
      setFormData((prev) => ({ ...prev, ...newFormData }));
    }
  }, [searchParams]);

  const validateInput = useCallback((name, value, validators) => {
    if (validators && validators.length > 0) {
      for (let validator of validators) {
        if (!validator.test(value)) {
          setValidationErrors((prev) => ({ ...prev, [name]: validator.message }));
          return false;
        }
      }
    }
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
    return true;
  }, []);

  const handleChange = useCallback(
    (event, validators) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateInput(name, value, validators);
    },
    [validateInput],
  );

  const contextValue = {
    formData,
    setFormData,
    handleChange,
    validationErrors,
    handleMultiEntrySubmit,
    searchParams,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(formData);
        }}
      >
        {children}
      </form>
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
