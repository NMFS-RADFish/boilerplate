import React from 'react';
import { TextInput, DatePicker, Select } from '@trussworks/react-uswds';
import { FormWrapper } from '../../contexts/FormWrapper';

const Page = () => {
  const handleFormSubmit = (formData) => {
    console.log('Form Data:', formData);
  };

  return (
    <FormWrapper onSubmit={handleFormSubmit}>
        <TextInput name="full-name" type="text" placeholder="Full Name" />
        <TextInput name="email" type="email" placeholder="Email Address" />
        <TextInput name="phone-number" type="tel" placeholder="(000) 000-0000" />
        <DatePicker name="dob" />
    </FormWrapper>
  )

}

export default Page