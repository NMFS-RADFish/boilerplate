# Form Field Validators Example

[Official Documentation](https://nmfs-radfish.github.io/radfish/)

This example demonstrates how to enforce field validation logic on certain fields within your form. The validator ensures that no numbers should be allowed within the **Full Name** input field.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples).

## Steps

### 1. Adding Validation with `onBlur` Handlers
In this step, we add validation logic to our form inputs using an `onBlur` handler. This ensures the data is validated when the user navigates away from the input field, providing immediate feedback on any validation errors.

This function validates the input value using the provided validation rules and updates the state with any validation errors:
```jsx
const handleBlur = (event, validators) => {
  const { name, value } = event.target;
  setValidationErrors((prev) => ({
    ...prev,
    ...handleInputValidationLogic(name, value, validators),
  }));
};
```

This helper function loops through the provided validators and checks if the input value passes the validation criteria. If not, it returns the appropriate error message:
```jsx
const handleInputValidationLogic = (name, value, validators) => {
  if (validators && validators.length > 0) {
    for (let validator of validators) {
      if (!validator.test(value)) {
        return { [name]: validator.message };
      }
    }
  }
  return { [name]: null }; // Clear error if value is valid
};
```

Here’s how to use the onBlur handler in the TextInput component. The input dynamically sets its validation status and ARIA attributes based on validation errors:
```jsx
<TextInput
    id={FULL_NAME}
    name={FULL_NAME}
    type="text"
    placeholder="Full Name"
    value={formData[FULL_NAME] || ""}
    aria-invalid={validationErrors[FULL_NAME] ? "true" : "false"}
    validationStatus={validationErrors[FULL_NAME] ? "error" : undefined}
    onChange={handleChange}
  onBlur={(e) => handleBlur(e, fullNameValidators)}
/>
```

### 2. Testing with Validator
Additionally, we need to include the validator needed to check the contents of the field input. In this case `fullNameValidators` has a single test that checks if the input contains a number. This array can include several tests for more complex validation logic. They are each included as separate objects within each validator array.

```jsx
// utilities/fieldValidators.js
const fullNameValidators = [
  {
    test: (value) => !/\d/.test(value) || value === "",
    message: "Full Name should not contain numbers.",
  },
];

export { fullNameValidators };

// in Form.js
import { fullNameValidators } from "../utilities/fieldValidators";
```

### 3. Trigger Validation Logic and Render Error Message
Then, we can update the properties on our input to ensure that the validation logic gets triggered when the correct form field has been navigated away from. We also conditionally render an `ErrorMessage` when there is an error present.

```jsx
<TextInput
  id={FULL_NAME}
  name={FULL_NAME}
  type="text"
  placeholder="Full Name"
  value={formData[FULL_NAME] || ""}
  aria-invalid={validationErrors[FULL_NAME] ? "true" : "false"}
  validationStatus={validationErrors[FULL_NAME] ? "error" : undefined}
  onChange={handleChange}
  onBlur={(e) => handleBlur(e, fullNameValidators)}
/>;
{
  validationErrors[FULL_NAME] && <ErrorMessage>{validationErrors[FULL_NAME]}</ErrorMessage>;
}
```

## Field Validators Example Preview

![Field Validators](./src/assets/field-validators.png)
