import "./style.css";
import React from "react";
import { Alert } from "@trussworks/react-uswds";

/**
 * Toast configuration constants.
 * @constant {Object}
 */
const ToastStatus = {
  OFFLINE: {
    status: "offline",
    message: "Application currently offline",
  },
  SUCCESS: {
    status: "success",
    message: "Successful form submission",
  },
  ERROR: {
    status: "error",
    message: "Error submitting form",
  },
};

/**
 * Functional component for rendering a toast notification based on the provided toast object.
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.toast - The toast object containing status and message information.
 * @returns {JSX.Element | undefined} The JSX element representing the toast notification.
 */
const RadfishToast = ({ toast }) => {
  if (!toast) {
    return;
  }

  switch (toast.status) {
    case ToastStatus.OFFLINE.status:
      return (
        <Alert
          role="toast-notification"
          type={"error"}
          headingLevel={"h1"}
          hidden={toast.status !== ToastStatus.OFFLINE.status}
        >
          {toast.message}
        </Alert>
      );
    case ToastStatus.SUCCESS.status:
      return (
        <Alert
          role="toast-notification"
          type={"success"}
          headingLevel={"h1"}
          hidden={toast.status !== ToastStatus.SUCCESS.status}
        >
          {toast.message}
        </Alert>
      );
    case ToastStatus.ERROR.status:
      return (
        <Alert
          role="toast-notification"
          type={"error"}
          headingLevel={"h1"}
          hidden={toast.status !== ToastStatus.ERROR.status}
        >
          {toast.message}
        </Alert>
      );
    default:
      return;
  }
};

export { RadfishToast as Toast, ToastStatus };
