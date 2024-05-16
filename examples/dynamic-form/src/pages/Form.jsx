import "../styles/theme.css";
import React from "react";
import { FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Button, Label } from "radfish-react";
import { useFormState } from "../contexts/FormWrapper";
import { CONSTANTS } from "../config/form";

const { fullName, nickname } = CONSTANTS;

const Form = () => {
  const { formData, handleChange, visibleInputs } = useFormState();

  return (
    <FormGroup>
      <Label htmlFor={fullName}>Full Name</Label>
      <TextInput
        id={fullName}
        name={fullName}
        type="text"
        placeholder="Full Name"
        value={formData[fullName] || ""}
        onChange={handleChange}
        linkedinputids={[nickname]}
      />
      {visibleInputs[nickname] && (
        <>
          <Label htmlFor={nickname}>Nickname</Label>
          <TextInput
            id={nickname}
            name={nickname}
            type="text"
            placeholder="Nickname"
            onChange={handleChange}
          />
        </>
      )}
      <Grid className="display-flex flex-justify">
        <Button type="submit" className="margin-top-1 margin-right-0 order-last">
          Submit
        </Button>
      </Grid>
    </FormGroup>
  );
};

export { Form };
