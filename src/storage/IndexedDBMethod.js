import Dexie from "dexie";
import { generateUUID } from "../utilities";
import { StorageMethod } from "./StorageMethod";
// import { db } from "./indexedDB";

/**
 * Class representing an IndexedDB method.
 * @extends StorageMethod
 * @param {string} dbName - The name of the database.
 * @param {number} dbVersion - The version of the database.
 * @param {string} dbTableName - The name of the table.
 * @param {string} dbSchema - The schema of the table.
 */
export class IndexedDBMethod extends StorageMethod {
  constructor(dbName, dbVersion, dbTableName, dbSchema) {
    super();
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.db = new Dexie(this.dbName);
    this.dbSchema = dbSchema;
    this.db.version(this.dbVersion).stores({
      [dbTableName]: dbSchema,
    });
  }
  /**
   * Create and store data in IndexedDB.
   * @param {Object} data - The data to store, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @return {Promise<Object>} A promise that resolves to the found data as an object.
   * @throws {Error} If an error occurs while adding the data to IndexedDB.
   */
  async create(data) {
    try {
      return await this.db.formData.add({
        ...data,
        uuid: generateUUID(),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find data in IndexedDB.
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @return {Promise<Array>} A promise that resolves to the found data.
   * @throws {Error} If an error occurs while retrieving the data from IndexedDB.
   */
  async find(criteria) {
    try {
      if (!criteria) {
        return await this.db.formData.toArray();
      } else {
        return await this.db.formData.where(criteria).toArray();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update data in IndexedDB.
   * @param {Object} criteria - The criteria to use for updating data, e.g. { uuid: "1234" }.
   * @param {Object} data - The new data, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @return {Promise<Array>} A promise that resolves to the updated data.
   * @throws {Error} If an error occurs while updating the data in IndexedDB.
   */
  async update(criteria, data) {
    try {
      return await this.db.formData.put(data, criteria.uuid);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete data in IndexedDB.
   * @param {Array} UUIDs - Array of UUIDs to delete data, e.g. ["uuid123", "uuid321"].
   * @return {Promise<Boolean>} A promise that resolves to `true` when the data is deleted.
   * @throws {Error} If an error occurs while deleting the data in IndexedDB.
   */
  async delete(uuids) {
    try {
      await this.db.formData.bulkDelete(uuids);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
