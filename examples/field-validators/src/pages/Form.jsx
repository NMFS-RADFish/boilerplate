import "../styles/theme.css";
import React from "react";
import { FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Button, Label, ErrorMessage } from "@nmfs-radfish/react-radfish";
import { useFormState } from "../contexts/FormWrapper";
import { CONSTANTS } from "../config/form";
import { fullNameValidators } from "../utilities/fieldValidators";

const { fullName } = CONSTANTS;

const Form = () => {
  const { formData, handleChange, handleBlur, validationErrors } = useFormState();

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
        data-testid="inputId"
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

export { Form };
