# On-Device Storage Example

This example shows you how to setup and use on-device storage. It uses IndexedDB and [Dexie.js](https://dexie.org/docs/Tutorial/Getting-started). Use cases include:

- Offline on-device data storage (most cases)
- Local non-relational database (online or offline use)

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples). Refer to the [RADFish GitHub repo](https://nmfs-radfish.github.io/radfish/) for more information and code samples.

## Preview
This example will render as shown in this screenshot:

![On-Device Storage](./src/assets/on-device-storage.png)

## Steps

### 1. Configure Offline Storage 
In the `index.jsx` file, import the `OfflineStorageWrapper`. Then, create a configuration object:

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
    formData:
      "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
    species: "name, price",
    homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
  },
};
```

### 2. Wrap the App Component 
In the `index.jsx` file, wrap the `App` component with `OfflineStorageWrapper` and pass the config object:

```jsx
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <OfflineStorageWrapper config={offlineStorageConfig}>
      <App />
    </OfflineStorageWrapper>
  </React.StrictMode>
);
```

## `useOfflineStorage` Hook API

Use the `useOfflineStorage` context hook in any child components. See the `App.jsx` file for examples of how to use the provided hooks.

The `useOfflineStorage` hook returns an object with these methods:

- `createOfflineDataEntry(tableName, data)` — Creates a new data entry in the storage.

  - `tableName`: Name of the IndexedDB name.
  - `data`: The data object to create.
  - Returns a promise that resolves when the data is created.

- `findOfflineData(tableName, criteria)` — Finds data in the storage based on the given criteria. Returns all data if not criteria parameter is passed.

  - `tableName`: Name of the IndexedDB name.
  - `criteria`: The criteria object to use for finding data, eg `{uuid: 123}`.
  - Returns a promise that resolves to an array of tuples:
    `[ [ uuid, { key: value } ], [ uuid2, { key: value } ] ]`

- `updateOfflineDataEntry(tableName, data)` — Updates data in the storage.

  - `tableName`: Name of the IndexedDB name.
  - `data`: The updated data object.
  - Returns a promise that resolves to the updated data as an object:
    `{ numberOfFish: 10, species: salmon }`

- `deleteOfflineDataEntry(tableName, uuids)` — Deletes data by UUID.
  - `tableName`: Name of the IndexedDB name.
  - `uuids`: An array of UUIDs to delete.
  - Returns a promise that resolves to the updated data as an object:
    `{ numberOfFish: 10, species: salmon }`

