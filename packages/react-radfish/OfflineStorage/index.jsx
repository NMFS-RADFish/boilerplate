import { createContext, useContext } from "react";
import { IndexedDBMethod, LocalStorageMethod, StorageModelFactory } from "@nmfs-radfish/radfish";

export const OfflineStorageContext = createContext();

export const OfflineStorageWrapper = ({ children, config }) => {
  const storageMethod =
    config.type === "indexedDB"
      ? new IndexedDBMethod(config.name, config.version, config.stores)
      : new LocalStorageMethod(config.name);

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
  };

  return (
    <OfflineStorageContext.Provider value={contextValue}>{children}</OfflineStorageContext.Provider>
  );
};

export const useOfflineStorage = () => {
  const context = useContext(OfflineStorageContext);
  if (!context) {
    throw new Error("useOfflineStorage must be used within an OfflineStorageWrapper");
  }
  return context;
};
