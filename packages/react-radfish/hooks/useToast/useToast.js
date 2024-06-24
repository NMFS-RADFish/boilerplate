import { useState } from "react";

export const TOAST_STATUS = {
  SUCCESS: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
};

export function useToast(initialState = null) {
  const [toast, set] = useState(initialState);

  return { toast, setToast: (toast) => { 
    if (!toast) return;

    set(toast); 
    setTimeout(function dismissToast() { set(null) }, 2000);
  }};
}

export function dispatchToast({ message, status}) {
  let event = new CustomEvent("radfish:dispatchToast", { detail: { message, status, expires_at: Date.now() + 30000} });
  return document.dispatchEvent(event);
}