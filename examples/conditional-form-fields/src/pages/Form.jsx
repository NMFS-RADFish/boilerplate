import "../styles/theme.css";
import React, { useState } from "react";
import { FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Button, Label, Form } from "@trussworks/react-uswds";

const fullName = "fullName";
const nickname = "nickname";

const ConditionalForm = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Integrate toast component
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="maxw-full margin-205 padding-205 bg-white radius-8px shadow-2"
    >
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
          onChange={(event) => {
            const { value } = event.target;
            setFormData({
              ...formData,
              [fullName]: value,
              [nickname]: value === "" ? "" : formData[nickname],
            });
          }}
        />
        {formData[fullName] && (
          <>
            <Label className="text-bold" htmlFor={nickname}>
              Nickname
            </Label>
            <TextInput
              id={nickname}
              name={nickname}
              type="text"
              placeholder="Nickname"
              onChange={(event) => {
                const { value } = event.target;
                setFormData({
                  ...formData,
                  [nickname]: value,
                });
              }}
            />
          </>
        )}
        <Grid className="display-flex flex-justify">
          <Button type="submit" className="margin-top-1 margin-right-0 order-last">
            Submit
          </Button>
        </Grid>
      </FormGroup>
    </Form>
  );
};

export { ConditionalForm };
