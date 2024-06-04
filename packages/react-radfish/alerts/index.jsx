import "./style.css";
import React from "react";
import { Alert } from "@trussworks/react-uswds";

/**
 * Functional component for rendering a toast notification based on the provided toast object.
 *
 * @component
 * @param {Object} props - React component props.
 * @param {Object} props.toast - The toast object containing status and message information.
 * @returns {JSX.Element | undefined} The JSX element representing the toast notification.
 */
const RADFishToast = ({ toast }) => {
  switch (toast?.status) {
    case "success":
      return (
        <Alert role="toast-notification" type={"success"} headingLevel={"h1"}>
          {toast.message}
        </Alert>
      );
    case "error":
      return (
        <Alert role="toast-notification" type={"error"} headingLevel={"h1"}>
          {toast.message}
        </Alert>
      );
    case "info":
      return (
        <Alert role="toast-notification" type={"info"} headingLevel={"h1"}>
          {toast.message}
        </Alert>
      );
    case "warning":
      return (
        <Alert role="toast-notification" type={"warning"} headingLevel={"h1"}>
          {toast.message}
        </Alert>
      );
    default:
      return null;
  }
};

export { RADFishToast as Toast };
