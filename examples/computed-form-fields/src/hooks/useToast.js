import { useState } from "react";

// lifespan toast message should be visible in ms
export const TOAST_LIFESPAN = 2000;
export const TOAST_CONFIG = {
  SUCCESS: {
    status: "success",
    message: "Successful form submission",
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
