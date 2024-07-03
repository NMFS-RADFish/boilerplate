// import {
//   fullNameValidators,
//   emailValidators,
//   phoneNumberValidators,
//   cityValidators,
//   stateValidators,
//   zipcodeValidators,
// } from "../../utilities/index.js";
// import {
//   handleSubSpeciesVisibility,
//   handleNicknameVisibility,
//   handleCountryVisibility,
// } from "../../config/form.js";
// import {
//   handleComputedValuesLogic,
//   handleInputVisibilityLogic,
// } from "../../contexts/FormWrapper.example.jsx";

// describe("Form Input Validators", () => {
//   // Full Name Validator Tests
//   describe("fullNameValidators", () => {
//     test("should validate full name without numbers", () => {
//       expect(fullNameValidators[0].test("John Doe")).toBe(true);
//     });

//     test("should invalidate full name with numbers", () => {
//       expect(fullNameValidators[0].test("John Doe123")).toBe(false);
//     });
//   });

//   // Email Validator Tests
//   describe("emailValidators", () => {
//     test("should validate a correct email format", () => {
//       expect(emailValidators[0].test("example@test.com")).toBe(true);
//     });

//     test("should invalidate an incorrect email format", () => {
//       expect(emailValidators[0].test("example.com")).toBe(false);
//     });
//   });

//   // Phone Number Validator Tests
//   describe("phoneNumberValidators", () => {
//     test("should validate a correct phone number format", () => {
//       expect(phoneNumberValidators[0].test("(123) 456-7890")).toBe(true);
//       expect(phoneNumberValidators[0].test("1234567890")).toBe(true);
//       expect(phoneNumberValidators[0].test("123 456 7890")).toBe(true);
//     });

//     test("should invalidate an incorrect phone number format", () => {
//       expect(phoneNumberValidators[0].test("123-45-678")).toBe(false);
//     });
//   });

//   // City Validator Tests
//   describe("cityValidators", () => {
//     test("should validate a correct city name", () => {
//       expect(cityValidators[0].test("New York")).toBe(true);
//     });

//     test("should invalidate a city name with numbers or special characters", () => {
//       expect(cityValidators[0].test("New York123")).toBe(false);
//     });
//   });

//   // State Validator Tests
//   describe("stateValidators", () => {
//     test("should validate a correct state name", () => {
//       expect(stateValidators[0].test("California")).toBe(true);
//     });

//     test("should invalidate a state name with numbers or special characters", () => {
//       expect(stateValidators[0].test("Calif0rnia!")).toBe(false);
//     });
//   });

//   // Zipcode Validator Tests
//   describe("zipcodeValidators", () => {
//     test("should validate correct zipcode formats", () => {
//       expect(zipcodeValidators[0].test("12345")).toBe(true);
//       expect(zipcodeValidators[0].test("12345-6789")).toBe(true);
//     });

//     test("should invalidate incorrect zipcode formats", () => {
//       expect(zipcodeValidators[0].test("1234")).toBe(false);
//       expect(zipcodeValidators[0].test("123456")).toBe(false);
//     });
//   });
// });

// describe("handleComputedValuesLogic", () => {
//   it("should compute values for specified inputs", () => {
//     const inputIds = ["input1", "input2"]; // Mock input IDs
//     const formData = {
//       value1: 5,
//       value2: 10,
//     }; // Mock form data
//     const FORM_CONFIG = {
//       input1: {
//         computed: {
//           callback: (args) => args[0] * 2, // Double the value
//           args: ["value1"], // Argument from the form data
//         },
//       },
//       input2: {
//         computed: {
//           callback: (args) => args.reduce((acc, val) => acc + val, 0), // Sum of values
//           args: ["value1", "value2"], // Arguments from the form data
//         },
//       },
//     }; // Mock form configuration

//     // Invoke the function to compute values
//     handleComputedValuesLogic(inputIds, formData, FORM_CONFIG);

//     // Assert that the computed values are correct
//     expect(formData.input1).toBe(10); // Computed value of input1 should be 10 (5 * 2)
//     expect(formData.input2).toBe(15); // Computed value of input2 should be 15 (5 + 10)
//   });

//   it("should handle inputs with no computed callbacks", () => {
//     const inputIds = ["input1", "input2"]; // Mock input IDs
//     const formData = {
//       value1: 5,
//       value2: 10,
//     }; // Mock form data
//     const FORM_CONFIG = {
//       input1: {}, // No computed callback for input1
//       input2: {}, // No computed callback for input2
//     }; // Mock form configuration

//     // Invoke the function to compute values
//     handleComputedValuesLogic(inputIds, formData, FORM_CONFIG);

//     // Assert that the form data remains unchanged
//     expect(formData.input1).toBeUndefined(); // input1 should not be modified
//     expect(formData.input2).toBeUndefined(); // input2 should not be modified
//   });
// });

// describe("handleSubSpeciesVisibility", () => {
//   it("should return false if any of the provided arguments is missing in the form data", () => {
//     const args = ["subSpecies"]; // Argument required for visibility
//     const formData = {}; // Empty form data

//     const result = handleSubSpeciesVisibility(args, formData);

//     expect(result).toBe(false); // Expect visibility to be false if argument is missing
//   });

//   it("should return true if all of the provided arguments are present in the form data", () => {
//     const args = ["subSpecies"]; // Argument required for visibility
//     const formData = { subSpecies: "Test SubSpecies" }; // Form data with required argument

//     const result = handleSubSpeciesVisibility(args, formData);

//     expect(result).toBe(true); // Expect visibility to be true if argument is present
//   });
// });

// describe("handleNicknameVisibility", () => {
//   it("should return false if the provided argument is missing in the form data", () => {
//     const args = ["nickname"]; // Argument required for visibility
//     const formData = {}; // Empty form data

//     const result = handleNicknameVisibility(args, formData);

//     expect(result).toBe(false); // Expect visibility to be false if argument is missing
//   });

//   it("should return true if the provided argument is present in the form data", () => {
//     const args = ["nickname"]; // Argument required for visibility
//     const formData = { nickname: "Test Nickname" }; // Form data with required argument

//     const result = handleNicknameVisibility(args, formData);

//     expect(result).toBe(true); // Expect visibility to be true if argument is present
//   });
// });

// describe("handleCountryVisibility", () => {
//   it("should return false if the provided argument is missing in the form data", () => {
//     const args = ["country"]; // Argument required for visibility
//     const formData = {}; // Empty form data

//     const result = handleCountryVisibility(args, formData);

//     expect(result).toBe(false); // Expect visibility to be false if argument is missing
//   });

//   it("should return true if the provided argument is present in the form data", () => {
//     const args = ["country"]; // Argument required for visibility
//     const formData = { country: "Test Country" }; // Form data with required argument

//     const result = handleCountryVisibility(args, formData);

//     expect(result).toBe(true); // Expect visibility to be true if argument is present
//   });
// });

// describe("handleInputVisibilityLogic", () => {
//   it("should set visibility to false for fields when their visibility callback returns false", () => {
//     const inputIds = ["subSpecies", "nickname", "country"]; // Mock input IDs
//     const formData = {}; // Empty form data
//     const FORM_CONFIG = {
//       subSpecies: { visibility: { callback: handleSubSpeciesVisibility, args: ["subSpecies"] } },
//       nickname: { visibility: { callback: handleNicknameVisibility, args: ["nickname"] } },
//       country: { visibility: { callback: handleCountryVisibility, args: ["country"] } },
//     }; // Mock form configuration

//     const result = handleInputVisibilityLogic(inputIds, formData, FORM_CONFIG);

//     expect(result).toEqual({
//       subSpecies: false, // Visibility should be false for subSpecies
//       nickname: false, // Visibility should be false for nickname
//       country: false, // Visibility should be false for country
//     });
//   });

//   it("should set visibility to true for fields when their visibility callback returns true", () => {
//     const inputIds = ["subSpecies", "nickname", "country"]; // Mock input IDs
//     const formData = {
//       subSpecies: "Test SubSpecies",
//       nickname: "Test Nickname",
//       country: "Test Country",
//     }; // Form data with all required arguments
//     const FORM_CONFIG = {
//       subSpecies: { visibility: { callback: handleSubSpeciesVisibility, args: ["subSpecies"] } },
//       nickname: { visibility: { callback: handleNicknameVisibility, args: ["nickname"] } },
//       country: { visibility: { callback: handleCountryVisibility, args: ["country"] } },
//     }; // Mock form configuration

//     const result = handleInputVisibilityLogic(inputIds, formData, FORM_CONFIG);

//     expect(result).toEqual({
//       subSpecies: true, // Visibility should be true for subSpecies
//       nickname: true, // Visibility should be true for nickname
//       country: true, // Visibility should be true for country
//     });
//   });

//   it("should only hide values that aren't present in formData", () => {
//     const inputIds = ["subSpecies", "nickname", "country"]; // Mock input IDs
//     const formData = {
//       nickname: "Test Nickname",
//       country: "Test Country",
//     }; // Form data with all required arguments
//     const FORM_CONFIG = {
//       subSpecies: { visibility: { callback: handleSubSpeciesVisibility, args: ["subSpecies"] } },
//       nickname: { visibility: { callback: handleNicknameVisibility, args: ["nickname"] } },
//       country: { visibility: { callback: handleCountryVisibility, args: ["country"] } },
//     }; // Mock form configuration

//     // Set visibility to false for all fields
//     const result = handleInputVisibilityLogic(inputIds, formData, FORM_CONFIG);

//     // Expect values to be removed from formData for fields with visibility set to false
//     expect(result).toEqual({
//       subSpecies: false, // Visibility should be true for subSpecies
//       nickname: true, // Visibility should be true for nickname
//       country: true, // Visibility should be true for country
//     });
//   });
// });

describe.skip("Validators");
