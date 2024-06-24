import { useState } from "react";

export const TOAST_STATUS = {
  SUCCESS: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
};

export function dispatchToast({ message, status}) {
  let event = new CustomEvent("radfish:dispatchToast", { detail: { message, status, expires_at: Date.now() + 2000} });
  return document.dispatchEvent(event);
}