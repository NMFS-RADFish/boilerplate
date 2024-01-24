import { fullNameValidators, emailValidators, phoneNumberValidators, cityValidators, stateValidators, zipcodeValidators } from './index.js';

describe('Form Input Validators', () => {
  // Full Name Validator Tests
  describe('fullNameValidators', () => {
    test('should validate full name without numbers', () => {
      expect(fullNameValidators[0].test('John Doe')).toBe(true);
    });

    test('should invalidate full name with numbers', () => {
      expect(fullNameValidators[0].test('John Doe123')).toBe(false);
    });
  });

  // Email Validator Tests
  describe('emailValidators', () => {
    test('should validate a correct email format', () => {
      expect(emailValidators[0].test('example@test.com')).toBe(true);
    });

    test('should invalidate an incorrect email format', () => {
      expect(emailValidators[0].test('example.com')).toBe(false);
    });
  });

  // Phone Number Validator Tests
  describe('phoneNumberValidators', () => {
    test('should validate a correct phone number format', () => {
      expect(phoneNumberValidators[0].test('(123) 456-7890')).toBe(true);
      expect(phoneNumberValidators[0].test('1234567890')).toBe(true);
      expect(phoneNumberValidators[0].test('123 456 7890')).toBe(true);
    });

    test('should invalidate an incorrect phone number format', () => {
      expect(phoneNumberValidators[0].test('123-45-678')).toBe(false);
    });
  });

  // City Validator Tests
  describe('cityValidators', () => {
    test('should validate a correct city name', () => {
      expect(cityValidators[0].test('New York')).toBe(true);
    });

    test('should invalidate a city name with numbers or special characters', () => {
      expect(cityValidators[0].test('New York123')).toBe(false);
    });
  });

  // State Validator Tests
  describe('stateValidators', () => {
    test('should validate a correct state name', () => {
      expect(stateValidators[0].test('California')).toBe(true);
    });

    test('should invalidate a state name with numbers or special characters', () => {
      expect(stateValidators[0].test('Calif0rnia!')).toBe(false);
    });
  });

  // Zipcode Validator Tests
  describe('zipcodeValidators', () => {
    test('should validate correct zipcode formats', () => {
      expect(zipcodeValidators[0].test('12345')).toBe(true);
      expect(zipcodeValidators[0].test('12345-6789')).toBe(true);
    });

    test('should invalidate incorrect zipcode formats', () => {
      expect(zipcodeValidators[0].test('1234')).toBe(false);
      expect(zipcodeValidators[0].test('123456')).toBe(false);
    });
  });
});
