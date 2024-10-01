![NPM Version](https://img.shields.io/npm/v/%40nmfs-radfish%2Fradfish)

# radfish

**radfish** is a flexible JavaScript library that provides an `Application` class to help manage event handling and service worker installations for web applications. It is especially useful in applications where managing online/offline states and service worker operations is essential.

## Installation

Install Radfish with npm:

```bash
npm install @nmfs-radfish/radfish
```

This library is open source and can be found here: https://www.npmjs.com/package/@nmfs-radfish/radfish

## Usage

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "@nmfs-radfish/radfish";

// Initialize the application
const app = new Application({
  serviceWorker: {
    url:
      import.meta.env.MODE === "development"
        ? "/mockServiceWorker.js"
        : "/service-worker.js",
  },
  mocks: {
    handlers: import("../mocks/browser.js"),  // Specify mock handlers for MSW
  },
});

// Wait until the application is ready before rendering the React app
app.on("ready", () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      { /* Your application code */ }
    </React.StrictMode>,
  );
});
```

## Contributing
Contributions are welcome! If you would like to contribute, please read our [contributing guide](https://nmfs-radfish.github.io/radfish/about/contribute) and follow the steps.

