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
   * @param {String} tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} data - The data to create, e.g. { numberOfFish: 1, species: "Grouper" }.
   */
  create(tableNameOrKeyName, data) {
    return this.storageMethod.create(tableNameOrKeyName, data);
  }

  /**
   * Find data in the storage.
   * @param {String} tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @return {Array|Promise<Array>} The found data.
   */
  find(tableNameOrKeyName, criteria) {
    return this.storageMethod.find(tableNameOrKeyName, criteria);
  }

  /**
   * Find a single object in the storage.
   * @param {String} tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} criteria - The criteria to use for finding data, e.g. { where: { uuid: "1234" } }.
   * @return {Object|Promise<Object>} The found data.
   */
  findOne(tableNameOrKeyName, criteria) {
    return this.storageMethod.findOne(tableNameOrKeyName, criteria)
  }

  /**
   * Update data in the storage.
   * @param {String} tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} data - The new data, e.g. { numberOfFish: 2, species: "Grouper" }.
   * @param {Object} criteria - The criteria to use for updating data, e.g. { uuid: "1234" } (required for localStorage only).
   * @return {Array|Promise<Array>} The updated data.
   */
  update(tableNameOrKeyName, data, criteria) {
    return this.storageMethod.update(tableNameOrKeyName, data, criteria);
  }

  /**
   * Delete data in the storage.
   * @param {String} tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Array} UUIDs - Array of UUIDs, e.g. `["uuid1234"]` or `["uuid12345", "uuid5432", "uuid987"]`.
   * @return {Boolean} Returns `true` if the data was deleted successfully, otherwise `false`.
   */
  delete(tableNameOrKeyName, uuids) {
    return this.storageMethod.delete(tableNameOrKeyName, uuids);
  }
}
