import "../styles/theme.css";
import React from "react";
import { Alert, FormGroup, Grid } from "@trussworks/react-uswds";
import { TextInput, Select, Button, Label } from "radfish-react";
import { useFormState } from "../contexts/FormWrapper";
import { CONSTANTS } from "../config/form";

const { numberOfFish, species, computedPrice } = CONSTANTS;

const speciesData = ["grouper", "salmon", "marlin", "mahimahi"];

const Form = () => {
  const { formData, handleChange } = useFormState();

  return (
    <FormGroup>
      <Label htmlFor={numberOfFish}>Number of Fish</Label>
      <Alert type="info" slim={true}>
        Example of a linked input. The value of this input is used to compute the price.
      </Alert>
      <TextInput
        id={numberOfFish}
        linkedinputids={[computedPrice]}
        name={numberOfFish}
        type="number"
        placeholder="0"
        value={formData[numberOfFish] || ""}
        onChange={handleChange}
      />
      <Label htmlFor={species}>Species</Label>
      <Alert type="info" slim={true}>
        The species select input is dependent on data coming from a server. The current
        implementation is using a mock server.
      </Alert>
      <Select
        id={species}
        linkedinputids={[computedPrice]}
        name={species}
        value={formData[species] || ""}
        onChange={handleChange}
      >
        <option value="">Select Species</option>
        {speciesData.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </Select>
      <Label htmlFor={species}>Computed Price</Label>
      <Alert type="info" slim={true}>
        Readonly input. Its value is calculated based on the number of fish and species selected.
      </Alert>
      <TextInput
        readOnly
        id={computedPrice}
        name={computedPrice}
        type="text"
        placeholder="Computed Price"
        value={formData[computedPrice] || ""}
        onChange={handleChange}
      />
      <Grid className="display-flex flex-justify">
        <Button type="submit" className="margin-top-1 margin-right-0 order-last">
          Submit
        </Button>
      </Grid>
    </FormGroup>
  );
};

export { Form };
