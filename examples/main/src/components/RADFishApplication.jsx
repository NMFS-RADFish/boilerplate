import React from "react";
import { OfflineStorageWrapper } from "../packages/contexts/OfflineStorageWrapper";
import ErrorBoundary from "./ErrorBoundary";
import App from "../App";

const offlineStorageConfig = {
  type: "indexedDB",
  name: import.meta.env.VITE_INDEXED_DB_NAME,
  version: import.meta.env.VITE_INDEXED_DB_VERSION,
  stores: {
    formData:
      "uuid, fullName, email, phoneNumber, numberOfFish, address1, address2, city, state, zipcode, occupation, department, species, computedPrice, isDraft",
    species: "name, price",
    homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
    lastHomebaseSync: "uuid, time",
  },
};

const RADFishApplication = () => {
  return (
    <OfflineStorageWrapper config={offlineStorageConfig}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </OfflineStorageWrapper>
  );
};

export default RADFishApplication;
