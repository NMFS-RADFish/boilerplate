import { useState } from "react";

// lifespan toast message should be visible in ms
export const TOAST_LIFESPAN = 2000;
/**
 * Toast configuration constants.
 * @constant {Object}
 */
export const TOAST_CONFIG = {
  OFFLINE: {
    status: "warning",
    message: "Application currently offline",
  },
  OFFLINE_SUBMIT: {
    status: "warning",
    message: "Application offline, saving data locally",
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

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast({ status: toastObj.status, message: toastObj.message });
  };

  const dismissToast = () => {
    setToast(null);
  };

  return { toast, showToast, dismissToast };
};
