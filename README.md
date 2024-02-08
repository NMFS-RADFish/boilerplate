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
  - [Interfacing with backend services](#interfacing-with-backend-services)
    - [Initializing the Service](#initializing-the-service)
    - [Making API Requests](#making-api-requests)
      - [`GET` Request](#get-request)
      - [`POST` Request](#post-request)
      - [`PUT` Request](#put-request)
      - [`DELETE` Request](#delete-request)
    - [Handling Responses and Errors](#handling-responses-and-errors)
  - [State Management](#state-management)
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
import Layout from './components/Layout';

const App = () => {
  return (
    <Layout>
      <main>
        {/* Your main content goes here */}
      </main>
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
import HeaderNav from './HeaderNav';

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
</Label>
```

By following this method, you can leverage the underlying `uswds` component, maintain the NOAA theme, and can extend if further to suit you needs as a developer.

## Interfacing with backend services

The **`RadfishAPIService`** is a class designed to facilitate interactions with a backend API. It simplifies making HTTP requests (GET, POST, PUT, DELETE) by encapsulating them into easy-to-use class methods. This service handles the construction of requests, including headers and query parameters, and processes responses.

### Initializing the Service

To use **`RadfishAPIService`**, you should use the included `APIService.js` module that is provided in the radfish application. 

```jsx
import RadfishAPIService from './RadfishAPIService';

const ApiService = new RadfishAPIService('your_access_token_here');
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
      const { data } = await ApiService.get(API_ENDPOINT, { "param1": "foo" });
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
      const { data } = await ApiService.post(API_ENDPOINT, { "name": "foo" });
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
      const { data } = await ApiService.put(API_ENDPOINT, { "id": 1 });
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
      const { data } = await ApiService.delete(API_ENDPOINT, { "id": 1 });
      // handle data as needed
    };
    deleteData();
  }, []);
```

### Handling Responses and Errors

Responses and errors from the API are returned as promises.

## State Management

Form state is managed with react context. The code for this state can be found in `contexts/FormWrapper.js`. This context exports form handlers, and captures form data on submit. Whenever you want to leverage this context for a form you create, be sure to wrap this component with the `FormWrapper`.

```
    <FormWrapper onSubmit={handleFormSubmit}>
        <DemoForm asyncFormOptions={asyncFormOptions} />
    </FormWrapper>
```

This will ensure that the state that is managed in context will be passed correctly to the child form that you are building, and should behave in a similar way. You can access the form data within the `FormWrapper` and can `console.log`, `debug`, or otherwise pass this data to the context's children as you application needs.

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


## Testing

Testing is a critical part of the software development process, ensuring the reliability and maintainability of your React application. This section provides an overview of writing tests using [Jest](https://jestjs.io/), along with additional frameworks like [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for different types of tests: snapshot, unit, and browser testing. This section also covers debugging techniques for broken or failed tests and best practices for effective test writing.

### Running Tests

Run tests with the following command: `npm test`

### Unit Tests

Unit tests focus on testing individual components or functions in isolation.

#### Basic Unit Test

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

it('renders the correct content', () => {
  render(<MyComponent />);
  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

#### Testing User Interactions

Utilize user-event or fireEvent from React Testing Library to simulate user actions.

```jsx
import userEvent from '@testing-library/user-event';

// Example: Clicking a button
userEvent.click(screen.getByRole('button'));
```

### Snapshot Tests

Snapshot testing captures the rendered output of a component and ensures that it does not change unexpectedly.

```jsx
import React from 'react';
import renderer from 'react-test-renderer';
import MyComponent from './MyComponent';

it('renders correctly', () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

### Writing Browser Tests

Browser testing involves testing the application in a web browser environment. Tools like [Puppeteer](https://pptr.dev/) can be used alongside Jest. Please note Puppeteer does not come included by default in the RADFish framework.

```jsx
const puppeteer = require('puppeteer');

it('should display the homepage', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await expect(page.title()).resolves.toMatch('Home Page');
  await browser.close();
});

```

### Additional Jest Configuration

Jest and React Testing Library is included in the RADFish framework by default. Modifying the Jest test configuration can be configured in the `jest.config.js` file. Please see the official Jest docs for the latest configuration options: https://jestjs.io/docs/configuration.