import { Toast } from "../alerts";
import { createContext, useEffect, useContext } from "react";
import { useOfflineStatus, useToasts, dispatchToast } from "../hooks";

const ApplicationContext = createContext();

function ApplicationComponent(props) {
  const { toasts } = useToasts();
  const { isOffline } = useOfflineStatus();

  useEffect(() => {
    if (!isOffline) {
      dispatchToast({ message: "Application is online", status: "info", duration: 3000 });
    }
  }, [isOffline]);

  return (
    <div className="radfish__application">
      <div style={{ position: "sticky", width: "100%", top: 0, zIndex: 999 }}>
        {isOffline && <Toast toast={{ message: "Application is offline", status: "warning" }} />}
        {toasts.map((toast, i) => (
          <Toast toast={toast} key={i} />
        ))}
      </div>
      {props.children}
    </div>
  );
}

export function Application({ application, children }) {
  return (
    <ApplicationContext.Provider value={application}>
      <ApplicationComponent>{children}</ApplicationComponent>
    </ApplicationContext.Provider>
  );
}

export const useApplication = () => {
  const application = useContext(ApplicationContext);
  if (!application) {
    throw new Error("useApplication must be used within an Application component");
  }
  return application;
};
