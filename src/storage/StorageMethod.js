/**
 * Abstract class representing a storage method.
 */
export class StorageMethod {
  /**
   * Create data in the storage.
   * This method should be overridden by subclasses.
   * @param {Object} _data - The data to create.
   * @throws {Error} If the method is not implemented.
   */
  create(_data) {
    throw new Error("Method not implemented.");
  }

  /**
   * Find data in the storage.
   * This method should be overridden by subclasses.
   * @param {Object} _criteria - The criteria to use for finding data.
   * @throws {Error} If the method is not implemented.
   */
  find(_criteria) {
    throw new Error("Method not implemented.");
  }

  /**
   * Update data in the storage.
   * This method should be overridden by subclasses.
   * @param {Object} _criteria - The criteria to use for updating data.
   * @param {Object} _data - The new data.
   * @throws {Error} If the method is not implemented.
   */
  update(_criteria, _data) {
    throw new Error("Method not implemented.");
  }

  /**
   * Delete an object in the storage.
   * This method should be overridden by subclasses.
   * @param {Array} _uuids - Array of UUIDs to use for deleting data.
   * @throws {Error} If the method is not implemented.
   */
  delete(_uuids) {
    throw new Error("Method not implemented.");
  }
}
