/**
 * Class representing a factory for creating storage models.
 */
export class StorageModelFactory {
  /**
   * Create a new storage model.
   * @param {StorageMethod} storageMethod - The storage method to use (`LocalStorageMethod` or `IndexedDBMethod`).
   * @return {StorageModel} The created storage model.
   */
  static createModel(storageMethod) {
    return new StorageModel(storageMethod);
  }
}

/**
 * Class representing a storage model.
 */
export class StorageModel {
  /**
   * Create a new storage model.
   * @param {StorageMethod} storageMethod - The storage method to use (LocalStorageMethod or IndexedDBMethod).
   */
  constructor(storageMethod) {
    this.storageMethod = storageMethod;
  }

  /**
   * Create data in the storage.
   * @param {Object} data - The data to create, e.g. { numberOfFish: 1, species: "Grouper" }.
   */
  create(data) {
    return this.storageMethod.create(data);
  }

  /**
   * Find data in the storage.
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @return {Array|Promise<Array>} The found data.
   */
  find(criteria) {
    return this.storageMethod.find(criteria);
  }

  /**
   * Update data in the storage.
   * @param {Object} criteria - The criteria to use for updating data, e.g. { uuid: "1234" }.
   * @param {Object} data - The new data, e.g. { numberOfFish: 2, species: "Grouper" }.
   * @return {Array|Promise<Array>} The updated data.
   */
  update(criteria, data) {
    return this.storageMethod.update(criteria, data);
  }

  /**
   * Delete data in the storage.
   * @param {Array} UUIDs - Array of UUIDs, e.g. `["uuid1234"]` or `["uuid12345", "uuid5432", "uuid987"]`.
   * @return {Boolean} Returns `true` if the data was deleted successfully, otherwise `false`.
   */
  delete(uuids) {
    return this.storageMethod.delete(uuids);
  }
}
