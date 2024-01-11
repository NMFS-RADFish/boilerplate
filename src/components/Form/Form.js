
import React, { useEffect } from 'react';
import { TextInput, DatePicker, Select } from '@trussworks/react-uswds';
import { useFormState } from '../../contexts/FormWrapper';

const fullNameValidators = [
  {
    test: (value) => !/\d/.test(value),
    message: "Full Name should not contain numbers."
  }
];

const Form = () => {
  const { formData, handleChange, validationErrors, setFormData } = useFormState();

  useEffect(() => {
    if(formData.fullName && formData.email) setFormData(prev => ({ ...prev, city: 'Waipahu' }));
  }, [formData.fullName, formData.email]);
  
  return (
    <>
      <TextInput 
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={formData["fullName"] || ''}
        onChange={(e) => handleChange(e, fullNameValidators)}
        isValid={!validationErrors.fullName}
      />th
      {validationErrors.fullName && <p className="error-message">{validationErrors.fullName}</p>}
      <TextInput name="email" type="email" placeholder="Email Address" value={formData["email"] || ''} onChange={handleChange}/>
      <TextInput name="phoneNumber" type="tel" placeholder="(000) 000-0000" value={formData["phoneNumber"] || ''} onChange={handleChange}/>
      <TextInput name="addressLine1" type="text" placeholder="Address Line 1" value={formData["addressLine1"] || ''} onChange={handleChange}/>
      <TextInput name="addressLine2" type="text" placeholder="Address Line 2" value={formData["addressLine2"] || ''} onChange={handleChange}/>
      <TextInput name="city" type="text" placeholder="City" value={formData["city"] || ''} onChange={handleChange}/>
      <TextInput name="state" type="text" placeholder="State" value={formData["state"] || ''} onChange={handleChange}/>
      <TextInput name="zipcode" type="text" placeholder="Zip Code" value={formData["zipcode"] || ''} onChange={handleChange}/>
      <TextInput name="occupation" type="text" placeholder="Occupation" value={formData["occupation"] || ''} onChange={handleChange}/>
      <Select name="department" value={formData["department"] || ''} onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="hr">Human Resources</option>
        <option value="it">IT</option>
        <option value="finance">Finance</option>
      </Select>
      <button type="submit">Submit</button>    </>
  );
};

export default Form;
