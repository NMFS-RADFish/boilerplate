import { Toast } from "../alerts";
import { createContext, useState, useEffect } from "react";
import { useOfflineStatus, dispatchToast } from "../hooks";

const OfflineContext = createContext(!navigator.onLine);

export function Application(props) {
  const [ toasts, setToasts ] = useState([]);
  const { isOffline } = useOfflineStatus();

  useEffect(() => {
    if (isOffline) {
      dispatchToast({ message: "Application is offline", status: "warning" })
    } else {
      dispatchToast({ message: "Application is online", status: "info" })
    }
  }, [isOffline]);

  useEffect(() => {
    function handleToast(event) {
      const nextToasts = [...toasts];
      nextToasts.unshift({ message: event.detail.message, status: event.detail.status, expires_at: event.detail.expires_at });
      setToasts(nextToasts);
    }

    document.addEventListener("radfish:dispatchToast", handleToast);

    return () => {
      document.removeEventListener("radfish:dispatchToast", handleToast);
    };
  }, []);

  return (<div className="radfish__application">
    {toasts.map((toast, i) => <Toast toast={toast} key={i}/>) }
    <OfflineContext.Provider value={isOffline}>
      {props.children}
    </OfflineContext.Provider>
  </div>)
}