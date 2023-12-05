// Import necessary components and assets
import { React } from "react";
import {
  Fieldset,
  Form,
  TextInput,
  DatePicker,
  Select,
  RangeInput,
  FileInput,
} from "@trussworks/react-uswds";
import "./RADForm.css";
import NOAALogo from "../assets/noaalogo.png"; // Make sure this path is correct

const RADForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {};
    for (const input of event.target.elements) {
      if (input.name) {
        formData[input.name] = input.value;
      }
    }
    console.log(formData, "formData");
  };

  return (
    <div className="rad-form-container">
      <main className="rad-form-wrapper">
        <img src={NOAALogo} alt="NOAA Logo" className="noaa-logo" />
        <Form onSubmit={(e) => handleSubmit(e)} className="noaa-form">
          <Fieldset legend="Personal Information" className="fieldset">
            <TextInput
              id="full-name"
              name="full-name"
              type="text"
              placeholder="Full Name"
            />
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
            />
            <TextInput
              id="phone-number"
              name="phone-number"
              type="tel"
              placeholder="Phone Number"
            />
            <DatePicker id="dob" name="dob" placeholder="Date of Birth" />
          </Fieldset>
          <Fieldset legend="Address" className="fieldset">
            <TextInput
              id="address-line1"
              name="address-line1"
              type="text"
              placeholder="Address Line 1"
            />
            <TextInput
              id="address-line2"
              name="address-line2"
              type="text"
              placeholder="Address Line 2"
            />
            <TextInput id="city" name="city" type="text" placeholder="City" />
            <TextInput
              id="state"
              name="state"
              type="text"
              placeholder="State"
            />
            <TextInput
              id="zipcode"
              name="zipcode"
              type="text"
              placeholder="Zip Code"
            />
          </Fieldset>
          <Fieldset legend="Work Information" className="fieldset">
            <TextInput
              id="occupation"
              name="occupation"
              type="text"
              placeholder="Occupation"
            />
            <Select id="department" name="department">
              <option value="">Select Department</option>
              <option value="hr">Human Resources</option>
              <option value="it">IT</option>
              <option value="finance">Finance</option>
            </Select>
            <RangeInput
              id="experience"
              name="experience"
              min="0"
              max="30"
              step="1"
            />
          </Fieldset>

          <Fieldset legend="Additional Details" className="fieldset">
            <FileInput id="resume" name="resume" />
          </Fieldset>
          <input type="submit" value="Submit" className="submit-button" />
        </Form>
      </main>
    </div>
  );
};

export default RADForm;
