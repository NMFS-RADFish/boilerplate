import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import App from "../App";

const RADFishApplication = () => {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

export default RADFishApplication;
