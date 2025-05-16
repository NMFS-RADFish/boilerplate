class Engine {
  constructor() {
    if (new.target === Engine) {
      throw new TypeError("Cannot instantiate abstract class Engine directly.");
    }
  }

  async initialize() {
    throw new Error("Method 'initialize()' must be implemented.");
  }

  async create(tableName, data) {
    throw new Error("Method 'create()' must be implemented.");
  }

  async find(tableName, criteria) {
    throw new Error("Method 'find()' must be implemented.");
  }

  async update(tableName, data) {
    throw new Error("Method 'update()' must be implemented.");
  }

  /**
   * Delete records from a table
   * @param {string} tableName - The name of the table
   * @param {Array} records - The records to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  async delete(tableName, records) {
    throw new Error("Method 'delete()' must be implemented.");
  }
}

export default Engine;
