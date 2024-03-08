/**
 * Manages state for any child Radfish form.
 * This context should wrap the RadfisForm component and will manage it's state related to input fields, input validations, and form submissions
 * This context provider is meant to be extensible and modular. You can use this anywhere in your app to wrap a form to manage the specific form's state
 */

import React, { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Form } from "../react-radfish";
import { FORM_CONFIG } from "../config/form";

const FormContext = createContext();

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
        const formData = await fetch(`/form/${params.id}`);
        const responseJson = await formData.json();

        setFormData(responseJson.data);
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

  /**
   * Handles computed form values, updating form elements with a calculated value.
   *
   * @function
   * @param {String} inputId - The id of the input field being computed
   * @param {Object} formData - Controlled form data stored in React state
   */
  const handleComputedValues = useCallback((inputIds, formData) => {
    return inputIds.map((inputId) => {
      const computedCallback = FORM_CONFIG[inputId]?.computed?.callback;
      if (computedCallback) {
        const args = FORM_CONFIG[inputId].computed.args.map((arg) => formData[arg]);
        const computedValue = computedCallback(args);
        return {
          ...formData,
          [inputId]: computedValue,
        };
      }
    })[0];
  }, []); // Added empty array as the second argument to useCallback

  const handleInputVisibility = useCallback((inputIds, formData) => {
    const inputVisibility = visibleInputs;
    inputIds.forEach((inputId) => {
      const visibilityCallback = FORM_CONFIG[inputId]?.visibility?.callback;
      if (visibilityCallback) {
        const args = FORM_CONFIG[inputId].visibility.args;
        let result = visibilityCallback(args, formData);
        inputVisibility[inputId] = result;
        // whenever a form disappears, remove it's value from formData
        // this prevents non-visible fields from being submitted
        if (result === false) {
          const updatedForm = { ...formData, [inputId]: "" };
          setFormData(updatedForm);
        }
      }
    });
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
            handleComputedValues(linkedinputids, updatedForm) || updatedForm;
          handleInputVisibility(linkedinputids, updatedComputedForm);
          return updatedComputedForm;
        } else {
          return updatedForm;
        }
      });
    },
    [handleComputedValues],
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
      validateInput(name, value, validators);
    },
    [validateInput],
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
