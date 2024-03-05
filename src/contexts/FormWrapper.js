/**
 * Manages state for any child Radfish form.
 * This context should wrap the RadfisForm component and will manage it's state related to input fields, input validations, and form submissions
 * This context provider is meant to be extensible and modular. You can use this anywhere in your app to wrap a form to manage the specific form's state
 */

import React, { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Form } from "../react-radfish";
import { computePriceFromQuantitySpecies } from "../utilities";

const FormContext = createContext();

const handleSubSpeciesVisibility = (args, formData) => {
  for (let arg of args) {
    if (!formData[arg]) {
      return false;
    }
  }
  return true;
};

const formConfig = {
  numberOfFish: {
    callback: () => console.log("callback numberOfFish"),
    args: [],
    visibilityCallback: null,
    visibilityCallbackArgs: [],
    visibleOnMount: true,
  },
  species: {
    callback: () => console.log("callback numberOfFish"),
    args: [],
    visibilityCallback: null,
    visibilityCallbackArgs: [],
    visibleOnMount: true,
  },
  subSpecies: {
    callback: () => console.log("callback subSpecies"),
    args: [],
    visibilityCallback: handleSubSpeciesVisibility,
    visibilityCallbackArgs: ["species"],
    visibleOnMount: false,
  },
  computedPrice: {
    callback: computePriceFromQuantitySpecies,
    // args should specify all formIds that are marked with linkedInputId, in this case computedPrice
    args: ["numberOfFish", "species"],
    visibilityCallback: null,
    visibilityCallbackArgs: [],
    visibleOnMount: true,
  },
};

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
  const [visibleInputs, setVisibleInputs] = useState(() => {
    let hashmap = {};
    for (let key in formConfig) {
      hashmap[key] = formConfig[key].visibleOnMount;
    }
    return hashmap;
  });
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
      const args = formConfig[inputId].args.map((arg) => formData[arg]);
      const computedValue = formConfig[inputId].callback(args);
      return {
        ...formData,
        [inputId]: computedValue,
      };
    })[0];
  }, []); // Added empty array as the second argument to useCallback

  const handleInputVisibility = useCallback((inputIds, formData) => {
    let existing = visibleInputs;
    inputIds.forEach((inputId) => {
      if (formConfig[inputId].visibilityCallback) {
        const callback = formConfig[inputId].visibilityCallback;
        const args = formConfig[inputId].visibilityCallbackArgs;
        let result = callback(args, formData);
        existing[inputId] = result;
      }
    });
    setVisibleInputs(existing);
  }, []);

  console.log(visibleInputs);

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
      const linkedInputIds = event.target.getAttribute("linkedInputIds").split(",");
      // if field being updated has a linked field that needs to be computed, update state after computing linked fields
      // else just return updatedForm without needing to linked computedValues
      setFormData((prev) => {
        const updatedForm = { ...prev, [name]: value };
        if (linkedInputIds) {
          const updatedComputedForm = handleComputedValues(linkedInputIds, updatedForm);
          handleInputVisibility(linkedInputIds, updatedComputedForm);
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
        config={{}}
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
