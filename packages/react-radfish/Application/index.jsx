import { Toast } from "../alerts";
import { createContext, useEffect, useContext } from "react";
import { useOfflineStatus, useToasts, dispatchToast } from "../hooks";
import { StorageModelFactory } from "@nmfs-radfish/radfish";

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
    const storageModel = StorageModelFactory.createModel(application._options.storage);

    const contextValue = {
      createOfflineData: storageModel.create.bind(storageModel),
      findOfflineData: storageModel.find.bind(storageModel),
      updateOfflineData: storageModel.update.bind(storageModel),
      deleteOfflineData: storageModel.delete.bind(storageModel),
      storageMethod: application._options.storage,
    };
  return (
    <ApplicationContext.Provider value={contextValue}>
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
