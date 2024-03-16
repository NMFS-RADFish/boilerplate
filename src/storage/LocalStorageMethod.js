import { generateUUID } from "../utilities";
import { StorageMethod } from "./StorageMethod";

/**
 * Class representing a local storage method.
 * @extends StorageMethod
 */
export class LocalStorageMethod extends StorageMethod {
  /**
   * Create a new local storage method.
   * @param {string} key - The key to use for storing data in localStorage, e.g. "formData".
   */
  constructor(key) {
    super();
    this.key = key;
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
            Object.keys(criteria).every(
              (key) => criteria[key] === entry[key] || uuid === criteria[key],
            ),
          );
        return result;
      }
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
  // update(criteria, data) {
  //   try {
  //     const originalData = this.find(this.key);
  //     const updatedData = originalData.map((entry) => {
  //       const entryData = entry[1];

  //       if (
  //         Object.keys(criteria).every(
  //           (key) => entryData[key] === criteria[key] || criteria[key] === entry[0],
  //         )
  //       ) {
  //         return [entry[0], data];
  //       }
  //       return entry;
  //     });
  //     console.log(updatedData);
  //     const newData = JSON.stringify(updatedData);
  //     localStorage.setItem(this.key, newData);
  //     this.store = newData;
  //     return updatedData;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  update(criteria, data) {
    try {
      const originalData = JSON.parse(this.store);
      const updatedData = originalData.map((entry) => {
        const entryData = entry[1];

        if (
          Object.keys(criteria).every(
            (key) => entryData[key] === criteria[key] || criteria[key] === entry[0],
          )
        ) {
          return [entry[0], data];
        }
        return entry;
      });
      console.log(updatedData);
      const newData = JSON.stringify(updatedData);
      localStorage.setItem(this.key, newData);
      this.store = newData;
      return updatedData;
    } catch (error) {
      throw error;
    }
  }
}
