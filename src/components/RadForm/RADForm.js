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
import NOAALogo from "../../assets/noaalogo.png";
import Tooltip from '../Tooltip/Tooltip';


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
          <div className="input-with-tooltip">
            <TextInput id="full-name"
              name="full-name"
              type="text"
              placeholder="Full Name"
            />
            <Tooltip message="Enter your full legal name as it appears on official documents." />
          </div>
          <div className="input-with-tooltip">
            <TextInput id="email" name="email" type="email" placeholder="Email Address" />
            <Tooltip message="Provide your email address for further communication." />
          </div>
          <div className="input-with-tooltip">
            <TextInput
              id="phone-number"
              name="phone-number"
              type="tel"
              placeholder="(000) 000-0000"
            />
            <Tooltip message="Include your primary contact number with area code." />
          </div>
            <DatePicker id="dob" name="dob" placeholder="Date of Birth" />
          </Fieldset>
          
          <Fieldset legend="Address" className="fieldset">
          <div className="input-with-tooltip">
            <TextInput
              id="address-line1"
              name="address-line1"
              type="text"
              placeholder="Address Line 1"
            />
            <Tooltip message="Input the primary line of your home or work address." />
          </div>
          <div className="input-with-tooltip">
            <TextInput
              id="address-line2"
              name="address-line2"
              type="text"
              placeholder="Address Line 2"
            />
            <Tooltip message="Input additional address information, such as apartment or suite number." />
          </div>
          <div className="input-with-tooltip">
            <TextInput id="city" name="city" type="text" placeholder="City" />
            <Tooltip message="Enter the city part of your address." />
          </div>
          <div className="input-with-tooltip">
            <TextInput id="state" name="state" type="text" placeholder="State" />
            <Tooltip message="Input the state or region for your address." />
          </div>
          <div className="input-with-tooltip">
            <TextInput id="zipcode" name="zipcode" type="text" placeholder="Zip Code" />
            <Tooltip message="Provide your postal code for your address." />
          </div>
          </Fieldset>
          <Fieldset legend="Work Information" className="fieldset">
            <div className="input-with-tooltip">
              <TextInput id="occupation" name="occupation" type="text" placeholder="Occupation" />
              <Tooltip message="Describe your current job title or position." />
            </div>
            <div className="input-with-tooltip">
              <Select id="department" name="department">
                <option value="">Select Department</option>
                <option value="hr">Human Resources</option>
                <option value="it">IT</option>
                <option value="finance">Finance</option>
              </Select>
              <Tooltip message="Choose the department you work in or are applying to." />
            </div>
            <div className="input-with-tooltip">
              <RangeInput id="experience" name="experience" min="0" max="30" step="1" />
              <Tooltip message="Adjust the slider to reflect your total years of work experience." />
            </div>
          </Fieldset>
          <Fieldset legend="Additional Details" className="fieldset">
          <div className="input-with-tooltip">
            <FileInput id="resume" name="resume" />
            <Tooltip message="Upload your resume or CV. Acceptable formats include PDF, DOC, DOCX." />
          </div>
          </Fieldset>
          <input type="submit" value="Submit" className="submit-button" />
        </Form>
      </main>
    </div>
  );
};

export default RADForm;
