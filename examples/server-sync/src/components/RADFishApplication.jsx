import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import App from "../App";
const offlineStorageConfig = {
  type: "indexedDB",
  name: import.meta.env.VITE_INDEXED_DB_NAME,
  version: import.meta.env.VITE_INDEXED_DB_VERSION,
  stores: {
    formData: "uuid, fullName, email, city, state, zipcode",
  },
};
const RADFishApplication = () => {
  return (
    <ErrorBoundary>
      <OfflineStorageWrapper config={offlineStorageConfig}>
        <App />
      </OfflineStorageWrapper>
    </ErrorBoundary>
  );
};

export default RADFishApplication;
