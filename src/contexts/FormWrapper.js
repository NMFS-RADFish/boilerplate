// FormContext.js
import React, { createContext, useState, useCallback } from 'react';

const FormContext = createContext();

export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const validateInput = useCallback((name, value, validators) => {
    if (validators && validators.length > 0) {
      for (let validator of validators) {
        if (!validator.test(value)) {
          setValidationErrors(prev => ({ ...prev, [name]: validator.message }));
          return false;
        }
      }
    }
    setValidationErrors(prev => ({ ...prev, [name]: null }));
    return true;
  }, []);

  const handleChange = useCallback((event, validators) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateInput(name, value, validators);
  }, [validateInput]);

  const contextValue = { formData, handleChange, validationErrors, setFormData };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(formData);
      }}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const useFormState = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormState must be used within a FormWrapper');
  }
  return context;
};
