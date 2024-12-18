# Persisted Form Example

This example shows you how to configure a persisted form that saves the data locally.

The `FormWrapper` component is a context provider for form data. It provides a context that contains the current form data, a function to update the form data, and a function to handle form input changes.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples). Refer to the [RADFish GitHub repo](https://nmfs-radfish.github.io/radfish/) for more information and code samples.

## Preview
This example will render as shown in this screenshot:

![Persisted Form](./src/assets/persisted-form.png)

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

### useFormState Hook

The `useFormState` hook is a custom hook for accessing the `FormContext`.

### Return Value

- `formData`: The current form data.
- `setFormData`: Function to update the form data.
- `handleChange`: Function to handle form input changes.

### Errors

- Throws an error if used outside of a `FormWrapper`.

## Steps

### 1. Configure RADFish Application Storage
In the `index.jsx` file, import the `Application`. Then, configure it with an instance of `IndexedDBMethod`:

```jsx
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";

const app = new Application({
  serviceWorker: {
    url: import.meta.env.MODE === "development" ? "/mockServiceWorker.js" : "/service-worker.js",
  },
  storage: new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME,
    import.meta.env.VITE_INDEXED_DB_VERSION,
    {
      formData: "uuid, fullName, numberOfFish, species, computedPrice, isDraft",
    },
  ),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <App application={app} />
    </React.StrictMode>
  </ErrorBoundary>,
);
```

### 3. Add FormWrapper Context Provider
Use the `FormWrapper` context provider, located in the `/src/contexts/FormWrapper.jsx` directory, to wrap child form components in a parent component. In this example, `App.jsx` is the parent component. Then, create a `handleOnSubmit` handler and pass it to the wrapper:

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

### 4. Build the Form
Construct your form using the `react-radfish` components. See the `/src/pages/Form.jsx` file to see how to construct the form and use the methods available from `FormWrapper`.

