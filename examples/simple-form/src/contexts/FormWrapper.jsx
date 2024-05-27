import React, { createContext, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Form } from "@nmfs-radfish/react-radfish";
import { useOfflineStorage } from "../packages/contexts/OfflineStorageWrapper";

const FormContext = createContext();
export const TOTAL_STEPS = 2;

export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const params = useParams();
  const { updateOfflineData } = useOfflineStorage();

  const saveOfflineData = async (tableName, data) => {
    try {
      await updateOfflineData(tableName, [{ uuid: params.id, ...data }]);
    } catch (error) {
      return error;
    }
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      saveOfflineData("formData", updatedForm);
      return updatedForm;
    });
  }, []);

  const contextValue = {
    formData,
    setFormData,
    handleChange,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <Form onSubmit={onSubmit}>{children}</Form>
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
