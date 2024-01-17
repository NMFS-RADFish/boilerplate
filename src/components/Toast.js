import React from "react";
import { Alert } from "@trussworks/react-uswds";

const Toast = ({ toast }) => {
  if (!toast) {
    return;
  }

  if (toast.status === "offline") {
    return (
      <Alert
        role="toast-notification"
        type={"error"}
        headingLevel={"h1"}
        hidden={toast.status !== "offline"}
      >
        Application currently offline
      </Alert>
    );
  }

  if (toast.status === "success") {
    return (
      <Alert
        role="toast-notification"
        type={"success"}
        headingLevel={"h1"}
        hidden={toast.status !== "success"}
      >
        {toast.message}
      </Alert>
    );
  }

  if (toast.status === "error") {
    return (
      <Alert
        role="toast-notification"
        type={"error"}
        headingLevel={"h1"}
        hidden={toast.status !== "error"}
      >
        {toast.message}
      </Alert>
    );
  }
};

export default Toast;
