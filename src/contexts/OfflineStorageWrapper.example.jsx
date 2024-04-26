import { createContext, useContext } from "react";
import { IndexedDBMethod, StorageModelFactory } from "../packages/storage";

export const OfflineStorageContext = createContext();

export const OfflineStorageWrapper = ({ children }) => {
  const storageMethod = new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME || "radfish_dev",
    import.meta.env.VITE_INDEXED_DB_VERSION || 1,
    {
      formData:
        "uuid, fullName, email, phoneNumber, numberOfFish, address1, address2, city, state, zipcode, occupation, department, species, computedPrice",
      species: "name, price",
    },
  );

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
