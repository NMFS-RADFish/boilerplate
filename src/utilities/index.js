/*
  This file contains utility functions and constants that are used throughout the application.
  - Validators are used to validate form input. They are used in conjunction with the `handleChange` function in `FormWrapper` to validate form input.
/*

/**
 *
 * Array of validators for the Full Name field.
 *
 * @typedef {Object} FullNameValidator
 * @property {function} test - Validation function that checks if the value contains numbers.
 * @property {string} message - Error message to display if validation fails.
 */
const fullNameValidators = [
  {
    test: (value) => !/\d/.test(value) || value === "",
    message: "Full Name should not contain numbers.",
  },
];
/**
/**
 * Array of validators for the Email field.
 * Checks for a valid email format.
 *
 * @typedef {Object} EmailValidator
 */
const emailValidators = [
  {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "",
    message: "Invalid email format.",
  },
];
/**
 * Array of validators for the Phone Number field.
 * Checks for a valid phone number format (e.g., (123) 456-7890).
 *
 * @typedef {Object} PhoneNumberValidator
 */
const phoneNumberValidators = [
  {
    test: (value) => /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(value) || value === "",
    message: "Invalid phone number format. Use (000) 000-0000.",
  },
];
/**
 * Array of validators for the City field.
 * Checks if the city name does not contain numbers or special characters.
 *
 * @typedef {Object} CityValidator
 */
const cityValidators = [
  {
    test: (value) => /^[a-zA-Z\s-]+$/.test(value) || value === "",
    message: "City should only contain letters, spaces, and hyphens.",
  },
];
/**
 * Array of validators for the State field.
 * Checks if the state name does not contain numbers or special characters.
 *
 * @typedef {Object} StateValidator
 */
const stateValidators = [
  {
    test: (value) => /^[a-zA-Z\s-]+$/.test(value) || value === "",
    message: "State should only contain letters, spaces, and hyphens.",
  },
];
/**
 * Array of validators for the Zipcode field.
 * Checks for a valid 5-digit or 9-digit (Zip+4) format.
 *
 * @typedef {Object} ZipcodeValidator
 */
const zipcodeValidators = [
  {
    test: (value) => /^\d{5}(-\d{4})?$/.test(value) || value === "",
    message: "Invalid zipcode format. Use 00000 or 00000-0000.",
  },
];

export { fullNameValidators, emailValidators, phoneNumberValidators, cityValidators, stateValidators, zipcodeValidators };