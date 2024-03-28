import React, { useEffect, useRef } from "react";
import { TextInput, Radio, Select, Button, Label, ErrorMessage } from "../react-radfish";
import {
  fullNameValidators,
  emailValidators,
  phoneNumberValidators,
  zipcodeValidators,
  stateValidators,
  cityValidators,
} from "../utilities";
import useOfflineStorage from "../hooks/useOfflineStorage";
import { CONSTANTS } from "../config/multistepForm";
import useMultStepForm from "../hooks/useMultiStepForm";
import { useParams, useNavigate, Link } from "react-router-dom";

const { fullName, nickname, email, phoneNumber, country, city, state, zipcode } = CONSTANTS;

/**
 * React functional component for a demo form. Demonstrates how to construct a form. This should be a child of `FormWrapper`
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.asyncFormOptions - Options for asynchronous form elements, helpful for providing default form options that are provided from centralized backend.
 * @returns {JSX.Element} The JSX element representing the demo form.
 */
const MultiStepForm = ({ asyncFormOptions }) => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { findOfflineData } = useOfflineStorage();
  const {
    init,
    stepForward,
    stepBackward,
    handleSubmit,
    currentStep,
    //
    formData,
    visibleInputs,
    setFormData,
    handleChange,
    handleBlur,
    validationErrors,
    handleMultiEntrySubmit,
  } = useMultStepForm(uuid);

  // A Ref will be needed for each step form to set focus when the form is displayed.
  const stepFocus = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // todo: break this into useMultiStateForm
  useEffect(() => {
    if (uuid) {
      const [found] = findOfflineData({ uuid });
      if (!found) {
        navigate("/multistep");
      } else {
        setFormData(found[1]);
      }
      // we have a cached form
    }
  }, []);

  // Set input focus on first input of active step form
  useEffect(() => {
    if (formData.currentStep > 0) {
      stepFocus[formData.currentStep - 1].current?.focus();
    }
  }, [formData.currentStep]);

  const handleInit = () => {
    const formId = init(uuid);
    navigate(`${formId}`);
  };

  if (!uuid) {
    return (
      <div>
        <Button onClick={handleInit}>Begin Multistep Form</Button>
      </div>
    );
  }

  if (formData.currentStep === 1) {
    return (
              inputRef={stepFocus[0]}
            Prev Step
          </Button>
          <Button onClick={stepForward} style={{ marginTop: "10px" }}>
            Next Step
          </Button>
        </div>
      </>
    );
  }

  if (formData.currentStep === 2) {
    return (
              inputRef={stepFocus[1]}
            Prev Step
          </Button>
          <Button onClick={stepForward} style={{ marginTop: "10px" }}>
            Next Step
          </Button>
        </div>
      </>
    );
  }

  if (formData.currentStep === 3) {
    return (
              inputRef={stepFocus[2]}
            Prev Step
          </Button>
          <Button
            role="form-submit"
            type="submit"
            onClick={handleSubmit}
            style={{ marginTop: "10px" }}
          >
            Submit MultiStep Form
          </Button>
        </div>
      </>
    );
  }

  return (
    <div>
      <p>Invalid Step</p>
    </div>
  );
};

export { MultiStepForm };
