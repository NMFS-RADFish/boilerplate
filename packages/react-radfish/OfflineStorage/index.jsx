import { createContext, useContext } from "react";
import { IndexedDBMethod, LocalStorageMethod, StorageModelFactory } from "@nmfs-radfish/radfish";
import { useApplication } from "../Application";

export const OfflineStorageContext = createContext();

export const OfflineStorageWrapper = ({ children }) => {
  const application = useApplication();

  const storageMethod = application.storage;
  const storageModel = StorageModelFactory.createModel(storageMethod);

  function createOfflineData(tableName, data) {
    return storageModel.create(tableName, data);
  }

  function findOfflineData(tableName, criteria) {
    return storageModel.find(tableName, criteria);
  }

  function updateOfflineData(tableName, data) {
    return storageModel.update(tableName, data);
  }

  function deleteOfflineData(tableName, uuid) {
    return storageModel.delete(tableName, uuid);
  }

  const contextValue = {
    createOfflineData,
    findOfflineData,
    updateOfflineData,
    deleteOfflineData,
    storageMethod,
  };

  return (
    <OfflineStorageContext.Provider value={contextValue}>{children}</OfflineStorageContext.Provider>
  );
};

export const useOfflineStorage = () => {
  const context = useContext(OfflineStorageContext);
  if (!context) {
    throw new Error(
      "useOfflineStorage must be used within an OfflineStorageWrapper. Please make sure a storage method has been configured.",
    );
  }
  return context;
};
