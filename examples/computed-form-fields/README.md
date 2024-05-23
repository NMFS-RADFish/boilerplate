# Computed Form Fields Example

This example includes an example on how to build a form where the values of certain input fields compute the value of a separate readOnly input field elsewhere in the form.

## Steps

1. In the `index.jsx` file, import the `OfflineStorageWrapper`, then create a configuration object:

```jsx
import { OfflineStorageWrapper } from "./packages/contexts/OfflineStorageWrapper";

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
    species: "name, price",
    homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
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

1. Use the `useOfflineStorage` context hook in any components. See the `App.jsx` file for examples of how to use the provided hooks.
