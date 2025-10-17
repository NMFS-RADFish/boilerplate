import Dexie from "dexie";
import { generateUUID } from "../utilities/cryptoWrapper.js";
import { StorageMethod } from "./StorageMethod.js";
import { compareBy } from "./utils.js";

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
    if (typeof data !== "object" || Array.isArray(data)) {
      throw new Error(
        "The `data` parameter must be an Object: { bar: 'foo' }."
      );
    }

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
  async find(tableName, criteria={}) {
    if ((criteria && typeof criteria !== "object") || Array.isArray(criteria)) {
      throw new Error(
        "IndexedDB find: The `criteria` parameter must be an Object: { where: { bar: 'foo' } }."
      );
    }

    let results = [];
    try {
      if (criteria.where) {
        const entries = Object.entries(criteria.where);
        let query = this.db.table(tableName);
        for (const [key, value] of entries) {
          if (query instanceof this.db.Table) {
            query = query.where(key).equals(value);
          }
          if (query instanceof this.db.Collection) {
            query = query.and((item) => item[key] === value);
          }
        }
        results = query;
      
      } else {
        results = this.db.table(tableName).toCollection();
      }

      results = await results.toArray();

      if (criteria.sortBy) {
        for (let i = criteria.sortBy.length - 1; i >= 0; i--) {
          results.sort((a, b) => {
            return compareBy(a[criteria.sortBy[i].key], b[criteria.sortBy[i].key], criteria.sortBy[i].order)
          });
        }
      }
    } catch (error) {
      throw error;
    }
    return results;
  }

  async findOne(tableName, criteria={}) {
    try {
      const result =  await this.find(tableName, criteria);
      return result[0]
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update data in IndexedDB.
   * @param {string} tableName - The name of the table to find data.
   * @param {Array} data - Array of the updated data, e.g. [{ uuid: 1234, numberOfFish: "1", species: "Grouper" }] or [{ uuid: 5678, name: "Grouper", price: 5.00}, { uuid: 9012, name: "Salmon", price: 10.00 }]. Be sure the uuid is included in each data object.
   * @return {Promise<Array>} A promise that resolves to the updated data.
   * @throws {Error} If an error occurs while updating the data in IndexedDB.
   */
  async update(tableName, data) {
    if (!Array.isArray(data)) {
      throw new Error(
        "The `data` parameter must be an Array of objects, e.g. [ { uuid: 1234, bar: 'foo' } ]"
      );
    }

    if (!data.every((item) => typeof item === "object" && "uuid" in item)) {
      throw new Error(
        "Every object in the `data` array must have a 'uuid' property."
      );
    }

    try {
      return await this.db.table(tableName).bulkPut(data, { allKeys: true });
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
    if (!Array.isArray(uuids)) {
      throw new Error(
        "The `uuids` parameter must be an Array of UUIDs, e.g. [ 123, 567 ]"
      );
    }
    try {
      await this.db.table(tableName).bulkDelete(uuids);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
