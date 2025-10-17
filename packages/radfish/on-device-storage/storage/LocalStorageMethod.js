import { generateUUID } from "../utilities/cryptoWrapper.js";
import { StorageMethod } from "./StorageMethod.js";

/**
 * Class representing a local storage method.
 * @extends StorageMethod
 */
export class LocalStorageMethod extends StorageMethod {
  /**
   * Create a new local storage method instance.
   * @param {string} key - The key to use for local storage, e.g. "formData" or  `import.meta.env.VITE_YOUR_KEY_NAME`.
   */
  constructor(key) {
    super();
    this.key = key;
    if (!localStorage.hasOwnProperty(this.key)) {
      console.warn(`Initializing local storage for key: ${this.key}`);
      localStorage.setItem(this.key, JSON.stringify([]));
    };
    this.store = localStorage.getItem(this.key);
  }

  /**
   * Create and store data in local storage.
   * @param {Object} data - The data to store, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @throws {Error} If an error occurs while stringifying the data.
   */

  create(data) {
    const existingData = JSON.parse(this.store) || [];
    const uuid = generateUUID();
    try {
      const newData = JSON.stringify([...existingData, [uuid, data]]);
      localStorage.setItem(this.key, newData);
      this.store = newData;
      return uuid;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find data in local storage.
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @return {Array} The found data, e.g. [ ["uuid-1234", { numberOfFish: "1", species: "Grouper" }] ].
   * @throws {Error} If an error occurs while parsing the data.
   */
  find(criteria) {
    try {
      const parsedData = JSON.parse(this.store);
      if (!criteria) {
        return parsedData;
      } else {
        const result = parsedData
          ?.map((item) => [item[0], item[1]])
          .filter(([uuid, entry]) =>
            Object.keys(criteria.where).every(
              (key) => criteria[key] === entry[key] || uuid === criteria[key]
            )
          );
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a single object in local storage.
   * @param {Object} criteria - The criteria to use for finding data, e.g. { uuid: "1234" }.
   * @return {Object} The found data, e.g. { numberOfFish: "1", species: "Grouper" }.
   * @throws {Error} If an error occurs while parsing the data.
   */
  findOne(criteria) {
    try {
      const parsedData = JSON.parse(this.store);
      const result = parsedData.find(
        (item) =>
          Object.keys(criteria.where).every(
            (key) => criteria[key] === item[1][key] || item[0] === criteria[key]
          )
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update data in local storage.
   * @param {Object} criteria - The criteria to use for updating data, e.g. { uuid: "1234" }.
   * @param {Object} data - The new data, e.g. { numberOfFish: "1", species: "Grouper"}.
   * @return {Array} The updated data.
   * @throws {Error} If an error occurs while stringifying the data.
   */
  update(criteria, data) {
    try {
      const originalData = this.find();
      const updatedData = originalData.map((entry) => {
        const entryData = entry[1];

        if (
          Object.keys(criteria).every(
            (key) =>
              entryData[key] === criteria[key] || criteria[key] === entry[0]
          )
        ) {
          return [entry[0], { ...entryData, ...data }];
        }
        return entry;
      });
      const newData = JSON.stringify(updatedData);
      localStorage.setItem(this.key, newData);
      this.store = newData;
      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete data in local storage.
   * @param {Array} UUIDs - Array of UUIDs to delete, e.g ["uuid123"] or ["uuid1234", "uuid321", "uuid987"].
   * @return {Boolean} Returns `true` if the data was deleted successfully, otherwise `false`.
   * @throws {Error} If an error occurs.
   */
  delete(uuid) {
    try {
      const parsedData = JSON.parse(this.store);
      const newData = parsedData.filter((item) => !uuid.includes(item[0]));
      localStorage.setItem(this.key, JSON.stringify(newData));
      return true;
    } catch (error) {
      throw error;
    }
  }
}
