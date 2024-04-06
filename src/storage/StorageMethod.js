/**
 * Abstract class representing a storage method.
 */
export class StorageMethod {
  /**
   * Create data in the storage.
   * This method should be overridden by subclasses.
   * @param {String} _tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} _data - The data to create.
   * @throws {Error} If the method is not implemented.
   */
  create(_tableNameOrKeyName, _data) {
    throw new Error("Method not implemented.");
  }

  /**
   * Find data in the storage.
   * This method should be overridden by subclasses.
   * @param {String} _tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} _criteria - The criteria to use for finding data.
   * @throws {Error} If the method is not implemented.
   */
  find(_tableNameOrKeyName, _criteria) {
    throw new Error("Method not implemented.");
  }

  /**
   * Update data in the storage.
   * This method should be overridden by subclasses.
   * @param {String} _tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Object} _data - The new data.
   * @param {Object} _criteria - The criteria to use for updating data (required for localStorage only).
   * @throws {Error} If the method is not implemented.
   */
  update(_tableNameOrKeyName, _data, _criteria) {
    throw new Error("Method not implemented.");
  }

  /**
   * Delete an object in the storage.
   * This method should be overridden by subclasses.
   * @param {String} _tableNameOrKeyName - The name of the database (indexedDB) or key name to use for creating data (localStorage).
   * @param {Array} _uuids - Array of UUIDs to use for deleting data.
   * @throws {Error} If the method is not implemented.
   */
  delete(_tableNameOrKeyName, _uuids) {
    throw new Error("Method not implemented.");
  }
}
