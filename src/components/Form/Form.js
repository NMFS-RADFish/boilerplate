
import React, { useEffect } from 'react';
import { TextInput, DatePicker, Select } from '@trussworks/react-uswds';
import { useFormState } from '../../contexts/FormWrapper';

const Form = () => {
  const { formData, handleChange } = useFormState();

  useEffect(() => {
    console.log("Form Data Changed:", formData);
  }, [formData]);

  return (
    <>
      <TextInput name="full-name" type="text" placeholder="Full Name" value={formData["full-name"] || ''} onChange={handleChange}/>
      <TextInput name="email" type="email" placeholder="Email Address" />
      <TextInput name="phone-number" type="tel" placeholder="(000) 000-0000" />
      <DatePicker name="dob" />
      <TextInput name="address-line1" type="text" placeholder="Address Line 1" />
      <TextInput name="address-line2" type="text" placeholder="Address Line 2" />
      <TextInput name="city" type="text" placeholder="City" />
      <TextInput name="state" type="text" placeholder="State" />
      <TextInput name="zipcode" type="text" placeholder="Zip Code" />
      <TextInput name="occupation" type="text" placeholder="Occupation" />
      <TextInput name="fishnumber" type="text" placeholder="Zip Code" />
      <TextInput name="price" type="text" placeholder="Occupation" />
      <Select name="department">
        <option value="">Select Department</option>
        <option value="hr">Human Resources</option>
        <option value="it">IT</option>
        <option value="finance">Finance</option>
      </Select>
      <button type="submit">Submit</button>    </>
  );
};

export default Form;
