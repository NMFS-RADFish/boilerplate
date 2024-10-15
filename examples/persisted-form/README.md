# Persisted Form Example

[Official Documentation](https://nmfs-radfish.github.io/radfish/)

This example shows you how to configure a persisted form that saves the data locally.

The `FormWrapper` component is a context provider for form data. It provides a context that contains the current form data, a function to update the form data, and a function to handle form input changes.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples)

### Imports

- `React`, `createContext`, `useState`, `useCallback`: React library and hooks.
- `useParams`: Hook from `react-router-dom` for accessing the current route parameters.
- `Form`: Form component from the `@nmfs-radfish/react-radfish` library.
- `useOfflineStorage`: Custom hook for accessing offline storage functions.

### Context

- `FormContext`: The context created by `FormWrapper`. It provides the current form data, a function to update the form data, and a function to handle form input changes.

### State

- `formData`: The current form data. It's an object where each key is a form input name and each value is the corresponding form input value.

### Functions

- `saveOfflineData(tableName, data)`: Saves the provided data to offline storage. The data is saved under the provided table name and is associated with the current route parameter `id`.
- `handleChange(event)`: Handles form input changes. It updates the `formData` state and saves the new form data to offline storage.

### Rendered Components

- `Form`: Renders a form with the provided `onSubmit` handler and children.

### Props

- `children`: The children to be rendered inside the form.
- `onSubmit`: The function to be called when the form is submitted.

## useFormState Hook

The `useFormState` hook is a custom hook for accessing the `FormContext`.

### Return Value

- `formData`: The current form data.
- `setFormData`: Function to update the form data.
- `handleChange`: Function to handle form input changes.

### Errors

- Throws an error if used outside of a `FormWrapper`.

## Steps

1. In the `index.jsx` file, import the `OfflineStorageWrapper`, then create a configuration object:

```jsx
import { OfflineStorageWrapper } from "@nmfs-radfish/react-radfish";

const offlineStorageConfig = {
  // Type is either `indexedDB` or `localStorage`
  type: "indexedDB",
  // Database name
  name: import.meta.env.VITE_INDEXED_DB_NAME,
  // Database version number
  version: import.meta.env.VITE_INDEXED_DB_VERSION,
  // Table schema object must include the table name as the object key and a comma-separated string as the value. Please note `uuid` must be the first value in `formData` table.
  stores: {
    formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
  },
};
```

2. In the `index.jsx` file, wrap the `App` component with `OfflineStorageWrapper` and pass the config object:

```jsx
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <OfflineStorageWrapper config={offlineStorageConfig}>
      <App />
    </OfflineStorageWrapper>
  </React.StrictMode>,
);
```

3. Use the provided `FormWrapper` context provider in this example, located in the `/src/contexts/FormWrapper.jsx` directory, to wrap child form components in a parent component. In this example `App.jsx` is the parent component.
   1. Create a `handleOnSubmit` handler and pass it to the wrapper:

```jsx
const { createOfflineData } = useOfflineStorage();

const handleOnSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const values = {};

  for (let [key, value] of formData.entries()) {
    values[key] = value;
  }

  createOfflineData("formData", values);
  // Handle form submission, usually by sending a POST request to a server
  // Example: fetch.post("/api/form", values)
  console.log("Form submitted");
};

return (
  <FormWrapper onSubmit={handleOnSubmit}>
    <PersistedForm />
  </FormWrapper>
);
```

4. Construct your form using the `react-radfish` components. See the `/src/pages/Form.jsx` file to see how to construct the form and use the methods available from `FormWrapper`.

![Persisted Form](./src/assets/persisted-form.png)