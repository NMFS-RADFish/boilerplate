import "../styles/theme.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FormGroup, Grid, TextInput, Button, Label, Form, Select } from "@trussworks/react-uswds";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

import { CONSTANTS } from "../config/form";
import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "../hooks/useToast";
import { Toast } from "@nmfs-radfish/react-radfish";
const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
const TOTAL_STEPS = 2;
const { fullName, email, city, state, zipcode } = CONSTANTS;

const HomePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const { toast, showToast, dismissToast } = useToast();
  const location = useLocation();
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const { createOfflineData, findOfflineData, updateOfflineData } = useOfflineStorage();
  const validateForm = () => {
    const newErrors = { email: "", fullName: "", city: "", state: "", zipcode: "" };
    // Check each field for content, add errors for empty required fields
    if (!formData[fullName]) newErrors[fullName] = "Full name is required";
    if (!formData[email]) newErrors[email] = "Email is required";
    if (formData.currentStep === 2) {
      if (!formData[city]) newErrors[city] = "City is required";
      if (!formData[state]) newErrors[state] = "State is required";
      if (!formData[zipcode]) newErrors[zipcode] = "Zipcode is required";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };
  // checks if uuid exists in IndexedDB. If it does, load that formData, else start new multistep form
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const [found] = await findOfflineData("formData", {
          uuid: id,
        });

        if (found) {
          setFormData({ ...found, totalSteps: TOTAL_STEPS });
        } else {
          navigate("/");
        }
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (location.state?.showToast) {
      showToast(TOAST_CONFIG.SUCCESS);
      setTimeout(() => {
        dismissToast();
        navigate(location.pathname, {
          state: { ...location.state, showToast: false },
          replace: true,
        });
        setFormData({});
      }, TOAST_LIFESPAN);
    }
  }, [location.state]);

  // submits form data, and includes a submitted flag to identify that it has been submitted
  // this is useful for tracking which forms have been submitted, and which are still in progress
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        await updateOfflineData("formData", [
          { uuid: formData.uuid, ...formData, submitted: true },
        ]);
        navigate("/", { replace: true, state: { showToast: true } });
        showToast(TOAST_CONFIG.SUCCESS);
      }
    } catch {
      showToast(TOAST_CONFIG.ERROR);
    } finally {
      setTimeout(() => {
        dismissToast();
      }, TOAST_LIFESPAN);
    }
  };

  // whenever an input field changes, update the formData state in IndexedDB so that is is cached as the user types
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      saveOfflineData("formData", updatedForm);
      return updatedForm;
    });
  };

  // helper function to allow for async/await in IndexedDB operations within setFormData state handler
  const saveOfflineData = async (tableName, data) => {
    try {
      if (id) {
        await updateOfflineData(tableName, [{ uuid: id, ...data }]);
      }
    } catch (error) {
      return error;
    }
  };

  // update form data, and increment currentStep by 1
  const stepForward = () => {
    if (formData.currentStep < TOTAL_STEPS) {
      const nextStep = formData.currentStep + 1;
      setFormData({ ...formData, currentStep: nextStep });
      updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: nextStep }]);
    }
  };

  // update form data, and decrement currentStep by 1
  const stepBackward = () => {
    if (formData.currentStep > 1) {
      const prevStep = formData.currentStep - 1;
      setFormData({ ...formData, currentStep: prevStep });
      updateOfflineData("formData", [{ ...formData, uuid: formData.uuid, currentStep: prevStep }]);
    }
  };

  // initialize new multistep form in IndexedDB, and navigate to new form id
  const handleInit = async () => {
    const formId = await createOfflineData("formData", {
      ...formData,
      currentStep: 1,
      totalSteps: TOTAL_STEPS,
    });
    setFormData({ ...formData, currentStep: 1, totalSteps: TOTAL_STEPS });
    navigate(`${formId}`);
  };

  if (!id) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="toast-container">
          <Toast toast={toast} />
        </div>
        <Button type="button" onClick={handleInit}>
          Begin Form
        </Button>
      </div>
    );
  }

  if (!formData.currentStep) {
    return (
      <div>
        <p>Invalid Step</p>
      </div>
    );
  }
  const errorMessages = [
    errors[fullName],
    errors[email],
    errors[city],
    errors[state],
    errors[zipcode],
  ]
    .filter(Boolean) // Filters out empty or undefined error messages
    .join(", ");
  return (
    <Form
      className="maxw-full margin-205 padding-205 bg-white radius-8px shadow-2"
      onSubmit={handleSubmit}
    >
      {errorMessages && (
        <div className="text-error">
          <strong>Please correct the following:</strong> {errorMessages}
        </div>
      )}
      <Label className="text-bold" style={{ textAlign: "right" }}>
        Step {formData.currentStep}
      </Label>
      {/* step one */}
      {formData.currentStep === 1 && (
        <FormGroup>
          <Label className="text-bold" htmlFor={fullName}>
            Full Name
          </Label>
          <TextInput
            id={fullName}
            name={fullName}
            type="text"
            placeholder="Full Name"
            value={formData[fullName] || ""}
            onChange={handleChange}
          />
          <Label className="text-bold" htmlFor={fullName}>
            Email
          </Label>
          <TextInput
            id={email}
            name={email}
            type="text"
            placeholder="user@example.com"
            value={formData[email] || ""}
            onChange={handleChange}
          />
          <Grid className="display-flex flex-justify">
            <Button
              type="button"
              className="margin-top-1 margin-right-0 order-last"
              onClick={stepForward}
            >
              Next Step
            </Button>
            <Button
              disabled
              type="button"
              className="margin-top-1"
              onClick={stepBackward}
              data-testid="step-backward"
              id="step-backward"
            >
              Prev Step
            </Button>
          </Grid>
        </FormGroup>
      )}
      {/* step two */}
      {formData.currentStep === 2 && (
        <FormGroup>
          <Label className="text-bold" htmlFor={city}>
            City
          </Label>
          <TextInput
            id={city}
            name={city}
            type="text"
            placeholder="City"
            value={formData[city] || ""}
            onChange={handleChange}
          />
          <Label className="text-bold" htmlFor={state}>
            State
          </Label>
          <Select
            id={state}
            name={state}
            value={formData[state] || ""}
            onChange={handleChange}
            aria-label="Select a state"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
          <Label className="text-bold" htmlFor={zipcode}>
            Zip Code
          </Label>
          <TextInput
            id={zipcode}
            name={zipcode}
            type="text"
            placeholder="Zipcode"
            value={formData[zipcode] || ""}
            onChange={handleChange}
          />

          <Grid className="display-flex flex-justify">
            <Button type="submit" className="margin-top-1 margin-right-0 order-last">
              Submit
            </Button>
            <Button
              type="button"
              className="margin-top-1"
              onClick={stepBackward}
              data-testid="step-backward"
              id="step-backward"
            >
              Prev Step
            </Button>
          </Grid>
        </FormGroup>
      )}
    </Form>
  );
};

export default HomePage;
