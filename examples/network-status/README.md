# Network Status Example

[Official Documentation](https://nmfs-radfish.github.io/documentation/)

This example shows you how to detect if a user has network connectivity. If the user is offline a toast alert will be displayed at the top of the app.

The `useOfflineStatus` hook provides a `isOffline` utility that detects whether or not a user has network connectivity. It uses the `navigator` browser API. Please see the [MDN Navigator Docs](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) for limitations.

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/documentation/docs/building-your-application/templates_examples)

## Steps

1. Import the following in the `App.jsx` file:
   ```jsx
   import React, { useEffect } from "react";
   import { TOAST_CONFIG, TOAST_LIFESPAN, useToast } from "./hooks/useToast";
   import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
   import { Alert } from "@trussworks/react-uswds";
   ```
2. Within the `App` component create a `useEffect` to handle displaying the toast:
   ```jsx
   useEffect(() => {
     if (isOffline) {
       showToast(TOAST_CONFIG.OFFLINE);
       setTimeout(() => {
         dismissToast();
       }, TOAST_LIFESPAN);
     }
   }, [isOffline]);
   ```
