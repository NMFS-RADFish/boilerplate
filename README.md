# RADFish Boilerplate Application Code

![test and build workflow](https://github.com/NMFS-RADFish/boilerplate/actions/workflows/run-tests.yml/badge.svg)

![radfish_logo](https://github.com/NMFS-RADFish/boilerplate/assets/11274285/f0c1f78d-d2bd-4590-897c-c6ec87522dd1)

- [RADFish Boilerplate Application Code](#radfish-boilerplate-application-code)
  - [Getting Started](#getting-started)
  - [React RADFish Components](#react-radfish-components)
    - [Building your first page and form](#building-your-first-page-and-form)
    - [Setting the layout of the application](#setting-the-layout-of-the-application)
      - [Layout Component (Layout.js)](#layout-component-layoutjs)
      - [HeaderNav Component (HeaderNav.js)](#headernav-component-headernavjs)
  - [Styling](#styling)
    - [NOAA Branding and Style Guide](#noaa-branding-and-style-guide)
      - [Using CSS files](#using-css-files)
      - [Using `className` to modify CSS](#using-classname-to-modify-css)
  - [Offline Storage](#offline-storage)
    - [Configuration](#configuration)
    - [**`useOfflineStorage` Hooks API**](#useofflinestorage-hooks-api)
    - [**Usage**](#usage)
  - [Interfacing with backend services](#interfacing-with-backend-services)
    - [Initializing the Service](#initializing-the-service)
    - [Making API Requests](#making-api-requests)
      - [`GET` Request](#get-request)
      - [`POST` Request](#post-request)
      - [`PUT` Request](#put-request)
      - [`DELETE` Request](#delete-request)
    - [Handling Responses and Errors](#handling-responses-and-errors)
  - [State Management](#state-management)
  - [Building Complex Forms](#building-complex-forms)
    - [What is a complex form?](#what-is-a-complex-form)
    - [Design pattern](#design-pattern)
      - [Configuration](#configuration-1)
      - [State handlers](#state-handlers)
      - [Markup](#markup)
  - [Multi-Entry Form Submit](#multi-entry-form-submit)
  - [Handling Offline Requests](#handling-offline-requests)
    - [Prerequisites](#prerequisites)
    - [Steps for Implementation](#steps-for-implementation)
      - [1. Integrate `FormWrapper`:](#1-integrate-formwrapper)
      - [2. Access Form State:](#2-access-form-state)
      - [3. Add Multi-Entry Button:](#3-add-multi-entry-button)
      - [4. Implement Multi-Entry Logic:](#4-implement-multi-entry-logic)
      - [5. Handle Multi-Entry Submission:](#5-handle-multi-entry-submission)
      - [6. Submit Data:](#6-submit-data)
    - [Example](#example)
  - [Multi-Step Form](#multi-step-form)
  - [Testing](#testing)
    - [Running Tests](#running-tests)
    - [Unit Tests](#unit-tests)
      - [Basic Unit Test](#basic-unit-test)
      - [Testing User Interactions](#testing-user-interactions)
    - [Snapshot Tests](#snapshot-tests)
    - [Writing Browser Tests](#writing-browser-tests)
    - [Additional Jest Configuration](#additional-jest-configuration)

## Getting Started

> ### ⭐ Full documentation can be found in the [RADFish Frontend Application Development Guide](https://hickory-drawbridge-d5a.notion.site/RADFish-Frontend-Application-Development-Guide-dc3c5589b019458e8b5ab3f4293ec183).

Assuming you have generated the application with the cli application, you should already have a webpack server running on `localhost:3000`. We have created a example form `DemoForm.js` that demonstrates how to build a form using the `react-radfish` components. You can modify and make changes to this form as needed.

You have the following scripts available to you during development to setup this project outside of the cli bootstrapping process:

- `npm start` starts the development server, with hot reloading
- `npm run build` build a production bundle of your application for deployment
- `npm run test` runs unit test suite
- `npm run lint` lints code with eslint
- `npm run lint:fix` lints and updates code to correct format
- `npm run format` lints, updates, and saves changed files for commit
- `npm run serve` runs the application as a production bundle (need to `npm run build` first). Helpful for debugging service worker behavior in a "production like" environment

## Directory Structure

Once you bootstrap a new radfish app, you will be given the following file structure:

```
├── _tests_
├── assets
├── components
│   ├── HeaderNav.jsx
│   └── Layout.jsx
├── config
│   └── form.js
├── contexts
│   ├── FormWrapper.jsx
│   └── TableWrapper.jsx
├── hooks
│   └── useOfflineStorage.js
├── mocks
│   ├── browser.js
│   └── handlers.js
├── pages
│   ├── Form.example.jsx
│   └── Table.example.jsx
├── react-radfish
├── services
│   └── APIService.js
├── storage
├── styles
│   └── theme.css
├── utilities
│   ├── cryptoWrapper.js
│   └── fieldValidators.js
├── App.jsx
├── index.css
└── index.jsx
```

`pages`

The files within pages are collections of components that can be built leveraging a combination of the application specific components in the `components` directory, along with any components from the `react-radfish` package.

You will notice that the files shipped in this directory have an `.example` file extension. This is by design, to make it clear that these are examples of how to build pages with radfish design patterns as described in this guide.

Feel free to copy/paste/refactor these pages to suit your application's needs.

`components`

The files within this directory should be application specific. They should be reusable components that can be created and imported to created pages. They should be modular, DRY, and reusable so that they can be used within your application pages as needed.

`context`

This boilerplate leverages React's context API to manage application state. `FormWrapper` and `TableWrapper` manage the state of either a `Form` or `Table` component as needed, and exports helper function to modify it's state.

> TODO: This should be broken out into `packages` directory.

`hooks`

The files in this folder contain re-usable hooks for you to use within your components. Hooks extract logic into reusable pieces, and can also hook into context providers as needed. See more about react hooks here: https://react.dev/reference/react/hooks

`mocks`

This should contain the mock server implementation that can simulate a backend API for your Radfish application to leverage. You can find out about the mock server implementation, and how to extend it later [in this doc](#mock-api)

`config`

This folder will contain configurations needed for various components. You can see `form.js` as a working copy of this. Keep in mind that this is an `.example` file and is expected to be modified to suit your needs. See [building complex forms](#building-complex-forms) for more details on this configuration.

You can also house other application specific configurations as needed within this folder.

`styles`

This folder will contain any application specific theme `css` files as needed. Learn more about styling options [here](#styling)

`services`

This folder will contain files that represent services used in interface with 3rd party integrations or internal business logic. It's a good idea to use Object Oriented principles when creating and extending these services.

`storage`

> TODO: break into `packages` directory

## React RADFish Components

### Building your first page and form

When building applications with React, there is an existing component library, [react-uswds](https://trussworks.github.io/react-uswds/?path=/story/welcome--welcome) that our project extends for the purposes of building any Radfish application. These components maintain all functionality of `react-uswds` components, but are branded with NOAA themes and styles. These components live in `react-radfish` directory, and allow for development in a modern React environment with NOAA look and feel.

For reference on the full `react-uswds` library, you can reference the deployed storybook:

[https://trussworks.github.io/react-uswds/](https://trussworks.github.io/react-uswds/?path=/story/welcome--welcome)

> 🚨 Note: Whenever possible, you should use components from `react-radfish` rather than importing components directly from `@trussworks/react-uswds`. This ensures that the component you are using have the correctly styles and theme applied.

**Example**

If you wanted to build a `TextInput` component into an existing form, you can use the `@trussworks` [storybook reference](https://trussworks.github.io/react-uswds/?path=/docs/components-text-input--default-text-input) related to component props that are available.

However, this component should be imported from `react-radfish`. Since `react-radfish` extends the `@trussworks` library, you should have all the functionality from the underlying component:

```jsx

import { TextInput, Label } from "../react-radfish";

<Label htmlFor="fullName">Full Name</Label>
<TextInput
  id="fullName"
  name="fullName"
  type="text"
  placeholder="Full Name"
  value={formData["fullName"] || ""}
  aria-invalid={validationErrors.fullName ? "true" : "false"}
  validationStatus={validationErrors.fullName ? "error" : undefined}
  onChange={handleChange}
  onBlur={(e) => handleBlur(e, fullNameValidators)}
/>
```

### Setting the layout of the application

#### Layout Component ([Layout.js](src/components/Layout.js))

The **`Layout`** component is a wrapper component used to structure the main layout of a React application. It leverages components from the **`@trussworks/react-uswds`** package, specifically [GridContainer](https://trussworks.github.io/react-uswds/?path=/docs/components-grid--default-container), to provide a grid-based layout. The component also includes a **`HeaderNav`** component for navigation purposes.

**Usage**

To use the **`Layout`** component, wrap it around the main content of your application. The children of the **`Layout`** component are placed inside a **`GridContainer`**, which provides a responsive grid layout.

```jsx
import Layout from "./components/Layout";

const App = () => {
  return (
    <Layout>
      <main>{/* Your main content goes here */}</main>
    </Layout>
  );
};

export default App;
```

#### HeaderNav Component ([HeaderNav.js](src/components/HeaderNav.js))

The **`HeaderNav`** component is a customizable navigation header. It uses the **`Header`**, **`NavMenuButton`**, **`PrimaryNav`**, and **`Search`** components from [`@trussworks/react-uswds`](https://trussworks.github.io/react-uswds/?path=/docs/components-header--basic-header). The component is designed to be responsive and includes a toggle-able navigation menu for smaller screens.

The **`HeaderNav`** component is integrated into the **`Layout`** component. It accepts navigation links as the children elements, which are rendered as part of the primary navigation. Below is an example of how it is used within the `Layout` component.

**Usage**

```jsx
import HeaderNav from "./HeaderNav";

const Layout = () => {
  return (
    <>
      <HeaderNav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        {/* Additional navigation links */}
      </HeaderNav>
      <GridContainer>{children}</GridContainer>;
    </>
  );
};

export default Layout;
```

## Styling

### NOAA Branding and Style Guide

Branding refers to the process of creating a distinct identity for a product or application. It involves defining and maintaining a set of visual elements, such as logos, colors, and typography, that represent the brand.

#### Using CSS files

You will notice, that the components above do not have any `className` assigned, and you may be wondering how to style that component. To do this, there are a couple of things to keep in mind:

1. Each component in `react-radfish` has it's own scoped css file, that modifies the existing `@trussworks` css in order to inject NOAA styles. This file should not be touched. If you notice a bug or issue, please see `CONTRIBUTING`
2. You can modify the general theme of these components in the `styles/theme.css` file. You can change things like color variables, font-family, and line-height here, and they will be propagated throughout the application, as well as throughout `react-radfish` . Radfish utilizes css variables, and can be used like so:

```css
// styles/theme.js
:root {
  --noaa-dark-blue: #0054a4;
}

// form.css
.your-custom-class {
  background-color: var(--noaa-dark-blue);
}
```

#### Using `className` to modify CSS

If you need to add additional styles to a particular component, you can do so by adding another `className` **after** the component has been imported from `react-radfish`

```jsx
import { Label } from "../react-radfish";

<Label htmlFor="fullName" className="your-custom-class">
  Full Name
</Label>;
```

By following this method, you can leverage the underlying `uswds` component, maintain the NOAA theme, and can extend if further to suit you needs as a developer.

## Offline Storage

RADFish app users (fishermen/fisherwomen) can be out at sea for an extended period of time and may not have internet access available. The offline storage functionality outlined below allows users to continue using the application to create and manage reports while offline.

To use offline data storage, use the `useOfflineStorage` hook. This React hook provides methods for managing offline form data. There are two storage methods available `LocalStorageMethod` or `IndexedDBStorageMethod`.

### Configuration

Step-by-step instructions to configure offline storage:

1. **Set the environment variables in the `.env` files. Based on which offline storage method you select, the following env variables are required:**
   1. **Local Storage:**
      1. `VITE_LOCAL_STORAGE_KEY`
   2. **Indexed DB:**
      1. `VITE_INDEXED_DB_NAME`
      2. `VITE_INDEXED_DB_VERSION`
2. **In the `src/hooks/useOfflineStorage.js` file, initialize one of the following Storage Method instances, and pass the appropriate environment variables using `import.meta.env.REPLACE_WITH_KEY_NAME` as parameters:**

   1. **`LocalStorageMethod`** — Requires one parameter, the key name for localStorage.

      ```jsx
      const storageMethod = new LocalStorageMethod(import.meta.env.VITE_LOCAL_STORAGE_KEY);
      ```

   2. **`IndexedDBStorageMethod`** — Requires three parameters, the db name, db version, and table configuration.

      ```jsx
      const storageMethod = new IndexedDBStorageMethod(
        import.meta.env.VITE_INDEXED_DB_NAME,
        import.meta.env.VITE_INDEXED_DB_VERSION,
        { formSpecies: "uuid, fullName, numberOfFish", species: "name, price" },
      );
      ```

3. **In the `src/hooks/useOfflineStorage.js` file, create the `StorageModelFactory` :**

   ```jsx
   // 1. Choose one of the following storage methods:
   const storageMethod = new IndexedDBStorageMethod(
     import.meta.env.VITE_INDEXED_DB_NAME,
     import.meta.env.VITE_INDEXED_DB_VERSION,
     { formSpecies: "uuid, fullName, numberOfFish", species: "name, price" },
   );
   const storageMethod = new LocalStorageMethod(import.meta.env.VITE_LOCAL_STORAGE_KEY);
   // 2. Create Storage Method
   const storageModel = StorageModelFactory.createModel(storageMethod);
   ```

### **`useOfflineStorage` Hooks API**

The `useOfflineStorage` hook returns an object with the following methods:

- **`createOfflineData("formData", data)`** Creates a new data entry in the storage.
  - `data`: The data object to create.
  - Returns a promise that resolves when the data is created.
- **`findOfflineData("formData", criteria)`** — Finds data in the storage based on the given criteria, returns all data if not criteria parameter is passed.
  - `criteria`: The criteria object to use for finding data, eg `{uuid: 123}`.
  - Returns a promise that resolves to an array of tuples:
    - `[ [ uuid, { key: value } ], [ uuid2, { key: value } ] ]`
- **`updateOfflineData("formData", data)`** — Updates data in the storage.
  - `data`: Array of data objects to update, the key name (e.g. uuid, name, id, etc) must be included in the data object.
  - Returns a promise that resolves to the updated data as an object.
    - `[{ uuid: 123, numberOfFish: 10, species: salmon }]`
- **`deleteOfflineData("formData", uuids)`** — Updates data in the storage.
  - `uuids`: An array of UUIDs to use for deleting one or more items.
  - Returns a promise that resolves to `true` if the deletion was successful.

### **Usage**

Example usage when using IndexedDB

```jsx
import useOfflineStorage from "./useOfflineStorage";

function MyComponent() {
  const { createOfflineData, findOfflineData, updateOfflineData } = useOfflineStorage();
  const data = { species: "Grouper", numberOfFish: 100 };

  // Create new offline data entry
  createOfflineData(data);
  // Find all offline data
  const allOfflineData = async () => await findOfflineData();
  // Find a specific offline data entry by uuid
  const offlineData = async () => await findOfflineData({ uuid: "1234" });
  // Update an offline data entry by uuid
  updateOfflineData({ uuid: "1234" }, data);
  // Delete one offline data entry
  deleteOfflineData(["uuid-123"]);
  // Delete multiple offline data entries
  deleteOfflineData(["uuid-123", "uuid-321", "uuid-987"]);

  // rest of code....
}

export default MyComponent;
```

## Interfacing with backend services

The **`RadfishAPIService`** is a class designed to facilitate interactions with a backend API. It simplifies making HTTP requests (GET, POST, PUT, DELETE) by encapsulating them into easy-to-use class methods. This service handles the construction of requests, including headers and query parameters, and processes responses.

### Initializing the Service

To use **`RadfishAPIService`**, you should use the included `APIService.js` module that is provided in the radfish application.

```jsx
import RadfishAPIService from "./RadfishAPIService";

const ApiService = new RadfishAPIService("your_access_token_here");
```

### Making API Requests

A common pattern, is to call this `ApiService` in a `useEffect` that will trigger whenever a React component loads:

```jsx
useEffect(() => {
  const fetchData = async () => {
    const { data } = await ApiService.get(API_ENDPOINT);
    // handle data as needed
  };
  fetchData();
}, []);
```

#### `GET` Request

Asynchronous function to perform a `GET` request

- `@param {string} endpoint` - The API endpoint to perform the GET request.
- `@param {Object} queryParams` - The query parameters for the GET request.
- `@returns {Promise<Object|string>}` - A promise that resolves to the API response data or an error string.

```js
useEffect(() => {
  const fetchData = async () => {
    const { data } = await ApiService.get(API_ENDPOINT, { param1: "foo" });
    // handle data as needed
  };
  fetchData();
}, []);
```

#### `POST` Request

Asynchronous function to perform a `POST` request

- `@param {string} endpoint` - The API endpoint to perform the POST request.
- `@param {Object} body` - The request body for the POST request.
- `@returns {Promise<Object|string>}` - A promise that resolves to the API response data or an error string.

```js
useEffect(() => {
  const postData = async () => {
    const { data } = await ApiService.post(API_ENDPOINT, { name: "foo" });
    // handle data as needed
  };
  postData();
}, []);
```

#### `PUT` Request

Asynchronous function to perform a `PUT` request

- `@param {string} endpoint` - The API endpoint to perform the PUT request.
- `@param {Object} body` - The request body for the PUT request.
- `@returns {Promise<Object|string>}` - A promise that resolves to the API response data or an error string.

```js
useEffect(() => {
  const updateData = async () => {
    const { data } = await ApiService.put(API_ENDPOINT, { id: 1 });
    // handle data as needed
  };
  updateData();
}, []);
```

#### `DELETE` Request

Asynchronous function to perform a `DELETE` request

- `@param {string} endpoint` - The API endpoint to perform the DELETE request.
- `@param {Object} body` - The request body for the DELETE request.
- `@returns {Promise<Object|string>}` - A promise that resolves to the API response data or an error string.

```js
useEffect(() => {
  const deleteData = async () => {
    const { data } = await ApiService.delete(API_ENDPOINT, { id: 1 });
    // handle data as needed
  };
  deleteData();
}, []);
```

### Handling Responses and Errors

Responses and errors from the API are returned as promises.

### Mock API

As a frontend developer, it can sometimes be a blocker when you are developing a feature that has a dependency on an external API. Often times, you can be waiting for a backend developer to finish building our their API endpoints before you can continue building your feature. RadfishApp ships with a built-in mock server that allows the frontend developer to “stub out” and mock API requests/responses without this hard dependency during development.

More specifically, RadfishApp ships with [mock service worker](https://mswjs.io/) and is preconfigured in the boilerplate application.

At the entrypoint of the React application, we enable API mocking with the `enableMocking` function:

```jsx
async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

const root = ReactDOM.createRoot(document.getElementById("root"));

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
```

Keep in mind that mocking should only be available during development, and should not ship with the production application. It can be useful to use a `NODE_ENV` environment variable to ensure that API mocks are only used in `DEVELOPMENT`. The `public/mockServiceWorker.js` file installs and configures the mock server. You should not need to modify this file.

**Configuring mock endpoints:**

In `src/mocks` you will notice a `browser.js` file and a `handlers.js` file. As a developer, you will do most of your work in `handlers.js` file, where you can add different mock http handlers to your application. For each handler you create, the mock service worker will intercept the request, and handle that request as defined in the file.

For instance:

```jsx
export const handlers = [
  http.get("/species", () => {
    return HttpResponse.json({ data: ["grouper", "marlin"] }, { status: 200 });
  }),
  http.post("/species", async ({ request }) => {
    const response = await request.json();
    return HttpResponse.json({ data: response }, { status: 201 });
  }),
];
```

This file creates two handlers, a `GET` and `POST` request that returns a `HttpResponse` to the application. We recommend looking at the [msw docs](https://mswjs.io/) for more detailed information on how to further customize this for your needs.

## State Management

Form state is managed with react context. The code for this state can be found in `contexts/FormWrapper.js`. This context exports form handlers, and captures form data on submit. Whenever you want to leverage this context for a form you create, be sure to wrap this component with the `FormWrapper`.

```jsx
<FormWrapper onSubmit={handleFormSubmit}>
  <DemoForm asyncFormOptions={asyncFormOptions} />
</FormWrapper>
```

This will ensure that the state that is managed in context will be passed correctly to the child form that you are building, and should behave in a similar way. You can access the form data within the `FormWrapper` and can `console.log`, `debug`, or otherwise pass this data to the context's children as you application needs.

Table state is managed in a similar way. We use a React context provider to wrap whichever table needs state to be managed. For instance, within the boilerplate repository, you can see how `DemoTable` is wrapper by `TableWrapper`

```jsx
<TableWrapper>
  <DemoTable />
</TableWrapper>
```

By doing this, `DemoTable` can now utilize the `useTableState` hook, that provides the component with all of the state, event handlers, sorting functionality, as well as other pieces of functionality that may be needed for the application’s needs.

```jsx
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

/**
 * React Table instance. Initializes the table with the data being managed in TableWrapper state
 * Columns are set to the memoized value returned from the useMemo hook above
 * state and helper methods are to provide helper methods to render data, and re-render based on sorting functionality
 */
const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
  },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});
```

## Building Complex Forms

### What is a complex form?

As a developer of a NOAA PWA, there may be cases where you need to build a complex form. That is to say, you may need your form's structure/behavior to dynamically change based on the data that is already inputted into the form. Here are some examples:

1. You may want the visibility of certain fields to depend on the values of another input. Let's say you have two inputs: `species` and `subSpecies`. In this case, you may want the `subSpecies` field to initial be non-visible, and then when a `species` is selected in the other input, `subSpecies` then becomes visible.

2. The values of an input may need to be computed from the values of one or several other inputs. Let's say you have a `species` and `numberOfFish` that both correlate to the catch of a certain trip. You then have a third input `computedPrice` that will automatically calculate based on the values selected in `species` and `numberOfFish`

To do this, this boilerplate provides you with a pattern to link inputs as dependencies to other inputs, and create custom callbacks as needed to handle logic required to handle the structure/behavior of your complex form.

### Design pattern

There are three main parts to this implementation. Let's say you want to handle this complex behavior:

> When `species` input is filled, show `subSpecies` input. If `species` input is empty, hide `subSpecies`

#### Configuration

The configuration of a complex form lives in the `config` directory of this project, form example: `config/form.js`. This is where you will start.

Firstly, the `CONSTANTS` object should contain the key-value mapping of each input you plan on using in your form. Whenever you need to reference a certain input value, you should refer to this mapping. This kind of pointer allows you to avoid hardcoded typos, and provides a clear represenation of what inputs your form will have.

So, rather than using `"species"`, you should use `CONTANTS.species`.

```js
const CONSTANTS = {
  species: "species",
  subSpecies: "subSpecies",
};
```

> 🚨 Importantly, this values will correspond with the `name` property of each input in the form. This property is used in the `handleChange` callback of the form's event listener, and is used to update `formState`. It is very important that the `name` property be properly assigned to each input in your form.

Secondly, the `FORM_CONFIG` object represents the "schema" for your form, that defines the types of callbacks, arguments, and controls that each complex input needs in order to control their dependencies. Each input should have a corresponding configuration object.

An example configuration could look like the following. You'll notice that we are referring to the `CONSTANTS` object above, rather that hardcoding the string value.

```js
const FORM_CONFIG = {
  [CONSTANTS.species]: {
    visibility: null,
    computed: null,
  },
  [CONSTANTS.subSpecies]: {
    visibility: {
      callback: handleSubSpeciesVisibility,
      args: [CONSTANTS.species],
      visibleOnMount: false,
    },
    computed: null,
  },
};
```

Thirdly, each configuration object will contain mappings to each complex relationship that your form supports. In this case, our form will support `visibility` and `computed` relationships, as mentioned earlier. This can be extended to your needs.

Each of these complex relationship is `nullable` and, if defined, should contain **at minimum** a `callback` and `args`. This will be used in the state handlers to update your state as needed (more on this in the next section). Each complex relationship can also contain additional keys as needed, for instance `visibleOnMount`.

Each `callback` can either be defined inline, or, preferably in a utilities file. For instance `utilities/inputVisibility.js`. This file can contain any number of callbacks needed to suit your complex form's needs. Each of these callback will accept the args defined in the config, as well as the `formData` from the `FormWrapper` as described in the previous section related to [State Management](#state-management). The `args` in this case, correspond to the `species` and `numberOfFish` inputs, and it will be used to determine whether or not the `subSpecies` input should be visible:

```js
// check to see if values exist in `formData`. If each value exists, return true. If there is a missing value, return false
export const handleSubSpeciesVisibility = (args, formData) => {
  for (let arg of args) {
    if (!formData[arg]) {
      return false;
    }
  }
  return true;
};
```

#### State handlers

Now that your configuration is defined, you can now hook up your state handler in `FormWrapper`. Here is a simplified version:

```jsx
export const FormWrapper = ({ children, onSubmit }) => {
  const [formData, setFormData] = useState({});
  // here, we are using the `visibleOnMount` configuration property, to correctly show/hide each input when mounted to DOM
  const [visibleInputs, setVisibleInputs] = useState(() =>
    Object.fromEntries(
      Object.entries(FORM_CONFIG).map(([key, config]) => [key, config.visibility?.visibleOnMount]),
    ),
  );

  // triggered whenever an input value is changed in form. This is the main state handler, and is responsible, in turn, to execute any complex callbacks
  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target; // name corresponds to the input name property, and should refer to CONTSTANTS
      const linkedinputids = event.target.getAttribute("linkedinputids")?.split(","); // linkedinput ids propertry, should also correspond to CONSTANTS. See Markup section below for more details

      setFormData((prev) => {
        const updatedForm = { ...prev, [name]: value };
        if (linkedinputids) {
          // if there are linkedinputids, handle the complex behavior handler as needed.
          const updatedComplexForm = handleInputVisibility(linkedinputids, updatedForm);
          // ...add other handlers as needed (for instance, handleComputedValues)
          return updatedComplexForm;
        } else {
          return updatedForm;
        }
      });
    },
    [handleInputVisibility], // include callbacks into dependency array
  );

  const handleInputVisibility = useCallback((inputIds, formData) => {
    const inputVisibility = visibleInputs;
    inputIds.forEach((inputId) => {
      // inputId corresponds to CONSTANTS: eg subSpecies
      const visibilityCallback = FORM_CONFIG[inputId]?.visibility?.callback; // eg handleSubSpeciesVisibility

      if (visibilityCallback) {
        // get the args needed for that callback (ie the dependant inputs, in this case `species`)
        const args = FORM_CONFIG[inputId].visibility.args;
        let result = visibilityCallback(args, formData);
        inputVisibility[inputId] = result; // true if `species` is filled, else false

        // whenever a form disappears, remove it's value from formData
        // this prevents non-visible fields from being submitted inadvertantly
        if (result === false) {
          const updatedForm = { ...formData, [inputId]: "" };
          setFormData(updatedForm);
        }
      }
    });
    setVisibleInputs(inputVisibility); // sets state
  }, []);

  // pass along context values to children
  const contextValue = {
    formData,
    visibleInputs,
    setFormData,
    handleChange,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(formData);
        }}
      >
        {children}
      </Form>
    </FormContext.Provider>
  );
};
```

#### Markup

Finally, you can now render your jsx markup for your form:

```jsx
const Form = () => {
  const { formData, visibleInputs, setFormData, handleChange } = useFormState();
  return (
    <React.Fragment>
      <Label htmlFor={species}>Species</Label>
      <Select
        linkedinputids={[subSpecies]} // linkedinputids, tells handleInputVisibility that the `subSpecies` input depends on the value in `species`. Note that this can be several different inputs, meaning that `species` can handle complex behaviors for several dependent inputs
        name={species} // corresponds to CONSTANTS
        value={formData[species] || ""}
        onChange={handleChange}
      >
        <option value="">Select Species</option>
        {speciesOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      {/* visibleInputs[subSpecies] uses FormWrapper state to determine if input should be rendered.
       State gets modified by handleInputVisibility state handler */}
      {visibleInputs[subSpecies] && (
        <>
          <Label htmlFor={subSpecies} isVisible={true}>
            Sub species
          </Label>
          <TextInput
            id={subSpecies}
            name={subSpecies} // corresponds to CONSTANTS
            type="text"
            placeholder="Sub-species"
            value={formData[subSpecies] || ""}
            onChange={handleChange}
            isVisible={true}
          />
        </>
      )}
    </React.Fragment>
  );
};
```

The behavior should now be working as expected:

https://github.com/NMFS-RADFish/boilerplate/assets/35090461/879f212e-8dcf-43dd-8958-97a63db603d8

This pattern can be followed and extended to suit any complex behaviors you may encounter as a developer building out a Radfish form.

## Multi-Entry Form Submit

Implementing multi-entry submissions in your NOAA web application forms streamlines the process of submitting data for multiple items at once. This guide will help you set up this functionality.

## Handling Offline Requests

In the case that there is no network connection, a handler can be implemented in `mocks/handlers.js. If your application makes a request that matches a route handler, this will allow you to store data locally so it can be worked with at a later time.

```js
  http.post('/api', async ({ request }) => {
    const data = await request.json();

    if (!navigator.onLine) {
      const requests = localstorage.getItem('api-requests') || [];
      requests.push(data);

      return HttpResponse.json({ data }, { status: 201 });
    }

  }),
```

### Prerequisites

- Ensure your form is wrapped in `FormWrapper` to manage state effectively.
- Utilize `useFormState` within your form component to interact with form data.

### Steps for Implementation

#### 1. Integrate `FormWrapper`:

Wrap your form component with `FormWrapper` to access state management features such as handling changes, performing validation, and submitting data.

#### 2. Access Form State:

Use the `useFormState` hook to manage form data, including retrieving and setting values, validating inputs, and handling form submissions.

#### 3. Add Multi-Entry Button:

Include a button in your form specifically for multi-entry submissions. This button will facilitate the submission of multiple data entries based on the current form data.

#### 4. Implement Multi-Entry Logic:

Define a function that updates the form data for multiple entries. This could involve incrementing data values or adding multiple sets of data to the submission payload.

#### 5. Handle Multi-Entry Submission:

Utilize the `handleMultiEntrySubmit` method from `useFormState` to process and submit the updated form data for multiple entries. This method can be triggered by the multi-entry button.

#### 6. Submit Data:

On clicking the multi-entry submit button, execute the defined logic to adjust form data as needed for multi-entry and use `handleMultiEntrySubmit` to submit the data.

### Example

Assuming you have a form with fields like `numberOfFish` and `species`, and you want to submit data for an additional fish catch without filling out the form again:

```jsx
// Inside your form component
const { formData, setFormData, handleMultiEntrySubmit } = useFormState();

// Function to increment fish count and submit
const submitMultipleEntries = () => {
  const updatedData = {
    ...formData,
    numberOfFish: Number(formData.numberOfFish) + 1, // Increment fish count
  };
  handleMultiEntrySubmit(updatedData); // Submit updated data
};

// Include this button in your form JSX
<Button onClick={submitMultipleEntries}>Add Another Catch</Button>;
```

## Multi-Step Form

There are cases where you may want to create a form that is handled in several different "steps". This means that there will be different inputs on differet pages (or steps) that should all eventually be submitted when the form's last page/step is complete.

Radfish supports this type of form with the following built-in features:

- Data within a multi-step form will be cached while the form is being filled. This means, that if a user leaves a multi-step form before that form is submitted, the data already inputted in the form will pre-populate the correct field when the user returns to the form.

- The user's progress on the multi-step form is also cached. This means, that if a user returns to the same form, they will return to the same step that they were on previously. This is cached via the `currentStep` value in `formData`

Here are some key constraints to keep in mind when building this type of form.

1. A form is identified by a `uuid` in the url parameter. This means, that `/multistep/123` will attempt to load the form based on the `uuid` in the cache. Otherwise, it will create a new `formData` object in the cache based on that `uuid`. This means that the data already entered into the `123` form will get pre-populated into the UI from the cache.

2. As a user progresses through the multistep form, on each step, you can execute the `stepForward` function that is exposed through the `useMultiStepForm` hook, that caches the `formData` in the cache, and also increments the `currentStep` of within the cache according to the `uuid` provided.

3. Similar to above, you also have access to `stepBackward` function, which decrements the form's `currentStep` in the cache.

Keep in mind, that as a developer, you will need to configure the `TOTAL_STEPS` variable within the `useMultiStep.js` hook. This will limit the multistep form, and prevent it from progressing past the final step and regressing below step `1`.

## Testing

Testing is a critical part of the software development process, ensuring the reliability and maintainability of your React application. This section provides an overview of writing tests using [Jest](https://jestjs.io/), along with additional frameworks like [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for different types of tests: snapshot, unit, and browser testing. This section also covers debugging techniques for broken or failed tests and best practices for effective test writing.

### Running Tests

Run tests with the following command: `npm test`

### Unit Tests

Unit tests focus on testing individual components or functions in isolation.

#### Basic Unit Test

```jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

it("renders the correct content", () => {
  render(<MyComponent />);
  expect(screen.getByText("Content")).toBeInTheDocument();
});
```

#### Testing User Interactions

Utilize user-event or fireEvent from React Testing Library to simulate user actions.

```jsx
import userEvent from "@testing-library/user-event";

// Example: Clicking a button
userEvent.click(screen.getByRole("button"));
```

### Snapshot Tests

Snapshot testing captures the rendered output of a component and ensures that it does not change unexpectedly.

```jsx
import React from "react";
import renderer from "react-test-renderer";
import MyComponent from "./MyComponent";

it("renders correctly", () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

### Writing Browser Tests

Browser testing involves testing the application in a web browser environment. Tools like [Puppeteer](https://pptr.dev/) can be used alongside Jest. Please note Puppeteer does not come included by default in the RADFish framework.

```jsx
const puppeteer = require("puppeteer");

it("should display the homepage", async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  await expect(page.title()).resolves.toMatch("Home Page");
  await browser.close();
});
```

### Additional Jest Configuration

Jest and React Testing Library is included in the RADFish framework by default. Modifying the Jest test configuration can be configured in the `jest.config.js` file. Please see the official Jest docs for the latest configuration options: https://jestjs.io/docs/configuration.
