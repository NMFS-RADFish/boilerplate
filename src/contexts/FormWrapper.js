// FormContext.js
import React, { createContext, useState, useCallback } from 'react';

const FormContext = createContext();

export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const contextValue = { formData, handleChange, setFormData };

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
