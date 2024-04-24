import { IndexedDBMethod, StorageModelFactory } from "../packages/storage";

function useOfflineStorage() {
  const storageMethod = new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME || "radfish_dev",
    import.meta.env.VITE_INDEXED_DB_VERSION || 1,
    {
      offlineTripReportData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
      offlineTripReportClamLobsterData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
      activityData: "KEY, VALUE",
      speciesData: "SPPSYN, SPPCODE, SPPNAME, ITIS",
      tripTypesData: "KEY, VALUE",
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

  return {
    createOfflineData,
    findOfflineData,
    updateOfflineData,
    deleteOfflineData,
  };
}

export default useOfflineStorage;
