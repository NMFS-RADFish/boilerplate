import { IndexedDBMethod, StorageModelFactory } from "../storage";

/**
 * React hook for managing offline form data using IndexedDB.
 *
 * @example
 * // In a React component
 * import useOfflineStorage from './useOfflineStorage';
 *
 * function MyComponent() {
 *   const { createOfflineDataEntry, findOfflineData, updateOfflineDataEntry } = useOfflineStorage();
 *
 *   // Use the hook to create, find, or update data
 *   const allOfflineData = async () => await findOfflineData();
 *   const offlineData = async () => await findOfflineData({ uuid: "1234" });
 *   createOfflineDataEntry({ species: 'Grouper', numberOfFish: 10 });
 *   updateOfflineDataEntry({ species: 'Grouper', numberOfFish: 100 }, { uuid: '1234' });
 *   const allEntries = findOfflineData().map((entry) => entry[1]);
 *
 *   // Render the component
 *   return <div>{JSON.stringify(allEntries)}</div>;
 * }
 *
 * export default MyComponent;
 *
 * @returns {Object} The storage methods for creating, finding, and updating data, e.g. `{ createOfflineDataEntry, findOfflineData, updateOfflineDataEntry }`.
 */
function useOfflineStorage() {
  /**
   * Initialize the storage method to use and pass in the required parameters, e.g. LocalStorageMethod("formData") or IndexedDBMethod("dbName", "dbVersion").
   * @type {LocalStorageMethod or IndexedDBMethod}
   * @example const storageMethod = new LocalStorageMethod("formData");
   */
  const storageMethod = new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME,
    import.meta.env.VITE_INDEXED_DB_VERSION,
    {
      formData:
        "uuid, fullName, email, phoneNumber, numberOfFish, address1, address2, city, state, zipcode, occupation, department, species, computedPrice",
      species: "name, price",
    },
  );

  /**
   * Create the Storage Model and pass in the `storageMethod` that was initialized above, e.g. `storageMethod`.
   * @type {StorageModelFactory}
   * @example const storageModel = StorageModelFactory.createModel(storageMethod);
   */
  const storageModel = StorageModelFactory.createModel(storageMethod);

  /**
   * Create data in the storage.
   *
   * @param {Object} data - The data to create, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @returns {Promise} A promise that resolves when the data is created.
   */
  function createOfflineDataEntry(data) {
    return storageModel.create(data);
  }

  /**
   * Find data in the storage.
   *
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @returns {Promise} A promise that resolves with the found data.
   */
  function findOfflineData(criteria) {
    return storageModel.find(criteria);
  }

  /**
   * Update data in the storage.
   *
   * @param {Object} criteria - The criteria to use for updating data, e.g. { uuid: "1234" }.
   * @param {Object} data - The new data.
   * @returns {Promise} A promise that resolves when the data is updated, e.g. { numberOfFish: "10", species: "Grouper" }.
   */
  function updateOfflineDataEntry(criteria, data) {
    return storageModel.update(criteria, data);
  }

  /**
   * Delete data in the storage.
   *
   * @param {Array} UUIDs - Array of UUIDs to delete data, e.g. ["uuid1234"] or ["uuid1234", "uuid321", "uuid987"].
   * @returns {Promise} A promise that resolves to `true` when the data is deleted, otherwise `false`.
   */
  function deleteOfflineData(uuid) {
    return storageModel.delete(uuid);
  }

  return {
    createOfflineDataEntry,
    findOfflineData,
    updateOfflineDataEntry,
    deleteOfflineData,
  };
}

export default useOfflineStorage;
