import "../styles/theme.css";
import React, { useState } from "react";
import {
  Alert,
  FormGroup,
  Grid,
  Form,
  TextInput,
  Select,
  Button,
  Label,
} from "@trussworks/react-uswds";

const species = "species";
const numberOfFish = "numberOfFish";
const computedPrice = "computedPrice";
const speciesData = ["grouper", "salmon", "marlin", "mahimahi"];
import { dispatchToast } from "@nmfs-radfish/react-radfish";

const HomePage = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatchToast({ status: "success", message: "Successful form submission" });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="maxw-full margin-205 padding-205 bg-white radius-8px shadow-2"
    >
      <FormGroup>
        <Label className="text-bold" htmlFor={numberOfFish}>
          Number of Fish
        </Label>
        <Alert type="info" slim={true}>
          Example of a linked input. The value of this input is used to calculate “Computed Price”
          below.
        </Alert>
        <TextInput
          className="text-bold"
          id={numberOfFish}
          name={numberOfFish}
          type="number"
          placeholder="0"
          value={formData[numberOfFish] || ""}
          onChange={(event) => {
            const { value } = event.target;
            setFormData({
              ...formData,
              [numberOfFish]: value,
              [computedPrice]: computeFieldValue(value, formData?.species || ""),
            });
          }}
        />
        <Label className="text-bold" htmlFor={species}>
          Species
        </Label>
        <Alert type="info" slim={true}>
          The current implementation is using our mock server which can be found at /directory.
          Documentation for the mock service worker can be found at{" "}
          <a href="https://nmfs-radfish.github.io/radfish/docs/front-end-developlement-guide/mock-api">
            this link
          </a>
        </Alert>
        <Select
          id={species}
          name={species}
          value={formData[species] || ""}
          onChange={(event) => {
            const { value } = event.target;
            setFormData({
              ...formData,
              [species]: value,
              [computedPrice]: computeFieldValue(formData?.numberOfFish || 0, value),
            });
          }}
        >
          <option value="">Select Species</option>
          {speciesData.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </Select>
        <Label className="text-bold" htmlFor={species}>
          Computed Price
        </Label>
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
        />
        <Grid className="display-flex flex-justify">
          <Button type="submit" className="margin-top-1 margin-right-0 order-last">
            Submit
          </Button>
        </Grid>
      </FormGroup>
    </Form>
  );
};

const computeFieldValue = (numberOfFish, species) => {
  const speciesPriceMap = {
    grouper: 25.0,
    salmon: 58.0,
    marlin: 100.0,
    mahimahi: 44.0,
  };

  let computedPrice = parseInt(numberOfFish || 0) * parseInt(speciesPriceMap[species] || 0);
  return computedPrice.toString();
};

export default HomePage;
