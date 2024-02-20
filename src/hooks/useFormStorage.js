import { useEffect, useState } from "react";
import { LocalStorageMethod, StorageModelFactory } from "../storage";

/**
 * React hook for managing form data in local storage.
 *
 * @example
 * // In a React component
 * import useFormStorage from './useFormStorage';
 *
 * function MyComponent() {
 *   const { store, create, find, update } = useFormStorage();
 *
 *   // Use the hook to create, find, and update data
 *   create({ species: 'Grouper', numberOfFish: 10 });
 *   find({ uuid: '1234' });
 *   update({ species: 'Grouper', numberOfFish: 100 }, { uuid: '1234' });
 *
 *   // Render the component
 *   return <div>{JSON.stringify(store)}</div>;
 * }
 *
 * export default MyComponent;
 *
 * @returns {Object} The store and methods for creating, finding, and updating data.
 */
function useFormStorage() {
  /**
   * The storage method to use.
   * @type {LocalStorageMethod}
   */
  const storageMethod = new LocalStorageMethod("formData");

  /**
   * The storage model to use.
   * @type {StorageModel}
   */
  const storageModel = StorageModelFactory.createModel(storageMethod);

  /**
   * The current state of the store.
   * @type {Object}
   */
  const [store, setStore] = useState();

  useEffect(() => {
    if (!store) {
      setStore(storageModel.find());
    }
  }, [store, storageModel]);

  /**
   * Create data in the storage.
   *
   * @param {Object} data - The data to create, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @returns {Promise} A promise that resolves when the data is created.
   */
  function create(data) {
    return storageModel.create(data);
  }

  /**
   * Find data in the storage.
   *
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @returns {Promise} A promise that resolves with the found data.
   */
  function find(criteria) {
    return storageModel.find(criteria);
  }

  /**
   * Update data in the storage.
   *
   * @param {Object} criteria - The criteria to use for updating data, e.g. { uuid: "1234" }.
   * @param {Object} data - The new data.
   * @returns {Promise} A promise that resolves when the data is updated, e.g. { numberOfFish: "10", species: "Grouper" }.
   */
  function update(criteria, data) {
    return storageModel.update(criteria, data);
  }

  return {
    store,
    create,
    find,
    update,
  };
}

export default useFormStorage;
