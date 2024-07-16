# Mock API Example

[Official Documentation](https://nmfs-radfish.github.io/documentation/)

This example includes how to setup and use mock service worker and the RADFishAPIClient to build out a mock API on the frontend to consume without needing to rely on a backend system. The idea is that this can be used during development while backend APIs are worked on, allowing for mock endpoints to be easily swapped out for production endpoints as needed.

This example does _not_ include any backend persistence via IndexedDB, as this is out of scope for this example. Instead, this example provides two simplified endpoints to call:

`[GET] /species` returns a list of 4 species
`[POST] /species` returns the original list, with an additional species added (this is hard coded for simplicity)

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/documentation/docs/examples/templates_examples)

## Steps

1. In the `index.jsx` file, be sure to enable mocking from the mock service worker. This will ensure that your mock API is being called while in development.

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  const onUnhandledRequest = "bypass";

  if (import.meta.env.MODE === "development") {
    return worker.start({
      onUnhandledRequest,
      serviceWorker: {
        url: `/mockServiceWorker.js`,
      },
    });
  }

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest,
    serviceWorker: {
      url: `/service-worker.js`,
    },
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

2. Be sure to include the `service-worker.js` file in the application `src` directory. This can be safely copy/pasted for simplicity

## Setting up Mock API

1. Create a `mocks` directory in `src`
2. Create `browser.js` and `handlers.js` files
3. `browser.js` will import the endpoints configured in the `handlers.js` file, and wrap them in a higher order function from the `msw/browser` library to set up these mock endpoints and intercept them when getting called from the client:

```js
// src/mocks/browser.js
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

4. Lastly, you can setup any endpoints that you want to mock within `handlers.js`. Be sure to export these handlers so that they can be imported into `browser.js` appropriately:

```js
import { http, HttpResponse } from "msw";

export const MSW_ENDPOINT = {
  SPECIES: "/species",
};

export const species = [
  { name: "grouper", price: 25.0, src: "https://picsum.photos/200/300" },
  { name: "salmon", price: 58.0, src: "https://picsum.photos/200/300" },
  { name: "marlin", price: 100.0, src: "https://picsum.photos/200/300" },
  { name: "mahimahi", price: 44.0, src: "https://picsum.photos/200/300" },
];

export const handlers = [
  // Returns an array of fish species. This is currently being used to demonstrate populating a dropdown form component with "data" from a server
  // Note that this implementation can/should change depending on your needs
  http.get(MSW_ENDPOINT.SPECIES, () => {
    return HttpResponse.json(
      {
        data: species,
      },
      { status: 200 }
    );
  }),
  // This endpoint simply returns the data that is submitted to from a form
  // In a full stack implementation, there will likely be some logic on the server to handle/store persistent data
  http.post(MSW_ENDPOINT.SPECIES, async ({ request }) => {
    const requestData = await request.json();
    const response = [requestData.data, ...species];

    return HttpResponse.json({ data: response }, { status: 201 });
  }),
];
```

Now, within your application code, you can access these endpoints, and query them via `RADFishAPIClient`

```jsx
import RADFishAPIService from "./packages/services/APIService";
import { MSW_ENDPOINT } from "./mocks/handlers";

const APIService = new RADFishAPIService();

// [GET] /species
const { data } = await APIService.get(MSW_ENDPOINT.SPECIES);

// [POST] /species
const { data } = await APIService.post(MSW_ENDPOINT.SPECIES, {
  data: {
    name: "tuna",
    price: 75,
    src: "https://picsum.photos/200/300",
  },
});
```
