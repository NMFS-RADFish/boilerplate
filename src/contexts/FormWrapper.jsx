/**
 * Manages state for any child Radfish form.
 * This context should wrap the RadfisForm component and will manage it's state related to input fields, input validations, and form submissions
 * This context provider is meant to be extensible and modular. You can use this anywhere in your app to wrap a form to manage the specific form's state
 */

import React, { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Form } from "../react-radfish";
import { FORM_CONFIG } from "../config/form";
import RadfishAPIService from "../services/APIService";
import useOfflineStorage from "../hooks/useOfflineStorage";

const FormContext = createContext();

const ApiService = new RadfishAPIService("");
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
  const [visibleInputs, setVisibleInputs] = useState(() =>
    Object.fromEntries(
      Object.entries(FORM_CONFIG).map(([key, config]) => [key, config.visibility?.visibleOnMount]),
    ),
  );
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { findOfflineData } = useOfflineStorage();

  /**
   * Handles the submission of multiple entries by updating the URL with query parameters.
   *
   * @function
   * @param {Object} params - Query parameters for multi-entry submission.
   */
  const handleMultiEntrySubmit = (params) => {
    const queryString = new URLSearchParams(params).toString();
    navigate(`/?${queryString}`);
  };

  /**
   * useEffect hook to update form data based on URL search parameters. Useful for multi step forms
   *
   * @function
   */
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

  // if id exists, query data from server with that id
  useEffect(() => {
    if (params.id) {
      const paramFormData = async () => {
        const { data } = await ApiService.get(`/form/${params.id}`);

        if (data) {
          setFormData(data);
        } else {
          const cachedData = await findOfflineData("formData", { uuid: params.id });
          setFormData(cachedData[0]);
        }
      };
      paramFormData();
    }
  }, [params]);

  /**
   * Validates the input value based on provided validators.
   *
   * @function
   * @param {string} name - The name of the input field.
   * @param {string} value - The value of the input field.
   * @param {Array} validators - Array of validation functions and error messages.
   * @returns {boolean} True if validation passes, false otherwise.
   */
  const validateInputCallback = useCallback((name, value, validators) => {
    return handleInputValidationLogic(name, value, validators);
  }, []);

  /**
   * Handles computed form values, updating form elements with a calculated value.
   *
   * @callback handleComputedValuesCallback
   * @param {String} inputId - The id of the input field being computed
   * @param {Object} formData - Controlled form data stored in React state
   */
  const handleComputedValuesCallback = useCallback((inputIds, formData) => {
    handleComputedValuesLogic(inputIds, formData, FORM_CONFIG);
  }, []);

  /**
   * Callback function for handling input visibility based on form data and configuration.
   *
   * @callback handleInputVisibilityCallback
   * @param {string[]} inputIds - An array of input IDs.
   * @param {Object} formData - The form data object.
   */
  const handleInputVisibilityCallback = useCallback((inputIds, formData) => {
    const inputVisibility = handleInputVisibilityLogic(inputIds, formData, FORM_CONFIG);
    setVisibleInputs(inputVisibility);
  }, []);

  /**
   * Handles input change events, updating form data.
   *
   * @function
   * @param {Object} event - The change event object.
   * @param {Array} validators - Array of validation functions and error messages.
   */
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
          handleInputVisibilityCallback(linkedinputids, updatedComputedForm);
          return updatedComputedForm;
        } else {
          return updatedForm;
        }
      });
    },
    [handleComputedValuesCallback, handleInputVisibilityCallback],
  ); // Include 'handleComputedValues' in the dependency array

  /**
   * Handles input onBlur events and performs validation.
   *
   * @function
   * @param {Object} event - The onBlur event object.
   * @param {Array} validators - Array of validation functions and error messages.
   */
  const handleBlur = useCallback(
    (event, validators) => {
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
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
    searchParams,
  };

  return (
    <FormContext.Provider value={contextValue}>
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

export const handleInputVisibilityLogic = (inputIds, formData, FORM_CONFIG) => {
  const inputVisibility = {};

  inputIds.forEach((inputId) => {
    const visibilityCallback = FORM_CONFIG[inputId]?.visibility?.callback;
    if (visibilityCallback) {
      const args = FORM_CONFIG[inputId].visibility.args;
      let result = visibilityCallback(args, formData);
      inputVisibility[inputId] = result;
      // whenever a form disappears, remove its value from formData
      // this prevents non-visible fields from being submitted
      if (result === false) {
        formData[inputId] = ""; // Update the form data directly
      }
    }
  });

  return inputVisibility;
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
