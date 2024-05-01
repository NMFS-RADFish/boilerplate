import { useState } from "react";

// lifespan toast message should be visible in ms
const TOAST_LIFESPAN = 2000;
/**
 * Toast configuration constants.
 * @constant {Object}
 */
export const TOAST_CONFIG = {
  OFFLINE: {
    status: "error",
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

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (toast) => {
    setToast({ status: toast.status, message: toast.message });
    setTimeout(() => {
      setToast(null);
    }, TOAST_LIFESPAN);
  };

  return { toast, showToast };
};
