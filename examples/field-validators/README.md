# Form Field Validators Example

[Official Documentation](https://nmfs-radfish.github.io/radfish/)

This example demonstrates how to enforce field validation logic on certain fields within your form. In this example, the validator ensures that no numbers should be allowed within the `fullName` input field.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples)

## Steps

1. You can follow the same pattern to build a persisted form, as described in other examples within RADFish. The difference, is that we are adding an `onBlur` handler to validate the data of the input when the user navigates away from it.

```jsx
const handleBlur = (event, validators) => {
  const { name, value } = event.target;
  setValidationErrors((prev) => ({
    ...prev,
    ...handleInputValidationLogic(name, value, validators),
  }));
};

const handleInputValidationLogic = (name, value, validators) => {
  if (validators && validators.length > 0) {
    for (let validator of validators) {
      if (!validator.test(value)) {
        return { [name]: validator.message };
      }
    }
  }
  return { [name]: null };
};
```

2. Additionally, we need to include the validator needed to check the contents of the field input. In this case `fullNameValidators` has a single test that checks if the input contains a number. This array can include several tests for more complex validation logic. They are each included as separate objects within each validator array.

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

3. Then, we can update the properties on our input to ensure that the validation logic gets triggered when the correct form field has been navigated away from. We also conditionally render an `ErrorMessage` when there is an error present.

```jsx
<TextInput
  id={fullName}
  name={fullName}
  type="text"
  placeholder="Full Name"
  value={formData[fullName] || ""}
  aria-invalid={validationErrors[fullName] ? "true" : "false"}
  validationStatus={validationErrors[fullName] ? "error" : undefined}
  onChange={handleChange}
  onBlur={(e) => handleBlur(e, fullNameValidators)}
/>;
{
  validationErrors[fullName] && <ErrorMessage>{validationErrors[fullName]}</ErrorMessage>;
}
```
