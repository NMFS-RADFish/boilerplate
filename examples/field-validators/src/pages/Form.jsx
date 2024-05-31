import "../styles/theme.css";
import React, { useState } from "react";
import { FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Button, Label, ErrorMessage } from "@nmfs-radfish/react-radfish";
import { handleInputValidationLogic } from "../contexts/FormWrapper";
import { CONSTANTS } from "../config/form";
import { fullNameValidators } from "../utilities/fieldValidators";

const { fullName } = CONSTANTS;

const FieldValidatorForm = () => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      return updatedForm;
    });
  };

  const handleBlur = (event, validators) => {
    console.log("blur");
    const { name, value } = event.target;
    setValidationErrors((prev) => ({
      ...prev,
      ...handleInputValidationLogic(name, value, validators),
    }));
  };

  return (
    <FormGroup>
      <Label htmlFor={fullName}>Full Name</Label>
      <TextInput
        id={fullName}
        name={fullName}
        type="text"
        placeholder="Full Name"
        value={formData[fullName] || ""}
        aria-invalid={validationErrors[fullName] ? "true" : "false"}
        validationStatus={validationErrors[fullName] ? "error" : undefined}
        onChange={handleChange}
        onBlur={(e) => handleBlur(e, fullNameValidators)}
      />
      {validationErrors[fullName] && <ErrorMessage>{validationErrors[fullName]}</ErrorMessage>}
      <Grid className="display-flex flex-justify">
        <Button
          disabled={validationErrors[fullName]}
          type="submit"
          className="margin-top-1 margin-right-0 order-last"
        >
          Submit
        </Button>
      </Grid>
    </FormGroup>
  );
};

export { FieldValidatorForm };
