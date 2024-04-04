import Dexie from "dexie";
import { generateUUID } from "../utilities";
import { StorageMethod } from "./StorageMethod";
// import { db } from "./indexedDB";

/**
 * Class representing an IndexedDB method.
 * @extends StorageMethod
 * @param {string} dbName - The name of the database.
 * @param {number} dbVersion - The version of the database.
 * @param {object} dbConfig - takes an object with the key as the table name and the value as the table schema, e.g. { formData: "uuid, fullName, email", species: "name, prices" }.
 */
export class IndexedDBMethod extends StorageMethod {
  constructor(dbName, dbVersion, dbConfig) {
    super();
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.db = new Dexie(dbName);
    this.db.version(dbVersion).stores(dbConfig);
  }

  /**
   * Create and store data in IndexedDB.
   * @param {Object} data - The data to store, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @param {string} tableName - The name of the table to find data.
   * @return {Promise<Object>} A promise that resolves to the found data as an object.
   * @throws {Error} If an error occurs while adding the data to IndexedDB.
   */
  async create(tableName, data) {
    try {
      return await this.db[tableName].add({
        ...data,
        uuid: generateUUID(),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find data in IndexedDB.
   * @param {string} tableName - The name of the table to find data.
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @return {Promise<Array>} A promise that resolves to the found data.
   * @throws {Error} If an error occurs while retrieving the data from IndexedDB.
   */
  async find(tableName, criteria) {
    try {
      if (!criteria) {
        return await this.db[tableName].toArray();
      } else {
        return await this.db[tableName].where(criteria).toArray();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update data in IndexedDB.
   * @param {string} tableName - The name of the table to find data.
   * @param {Array} criteria - The criteria to use for updating data, e.g. ["uuid-123"] or ["uuid-123", "uuid-987", "uuid-456"].
   * @param {Array} data - Array of the updated data, e.g. [{ numberOfFish: "1", species: "Grouper" }] or [{name: "Grouper", price: 5.00}, {name: "Salmon", price: 10.00}].
   * @return {Promise<Array>} A promise that resolves to the updated data.
   * @throws {Error} If an error occurs while updating the data in IndexedDB.
   */
  async update(tableName, data) {
    try {
      return await this.db[tableName].bulkPut(data, { allKeys: true });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete data in IndexedDB.
   * @param {Array} UUIDs - Array of UUIDs to delete data, e.g. ["uuid123", "uuid321"].
   * @param {string} tableName - The name of the table to find data.
   * @return {Promise<Boolean>} A promise that resolves to `true` when the data is deleted.
   * @throws {Error} If an error occurs while deleting the data in IndexedDB.
   */
  async delete(tableName, uuids) {
    try {
      await this.db[tableName].bulkDelete(uuids);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
