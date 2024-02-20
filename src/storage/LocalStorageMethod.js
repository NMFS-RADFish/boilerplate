import { generateUUID } from "../utilities";
import { StorageMethod } from "./StorageMethod";

export class LocalStorageMethod extends StorageMethod {
  constructor(key) {
    super();
    this.key = key;
    this.store = localStorage.getItem(this.key);
  }

  create(data) {
    const existingData = JSON.parse(this.store) || [];
    const uuid = generateUUID();
    try {
      localStorage.setItem(this.key, JSON.stringify([...existingData, [uuid, data]]));
    } catch (error) {
      throw error;
    }
  }

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

  update(criteria, data) {
    try {
      const originalData = this.find(this.key);
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
      localStorage.setItem(this.key, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      throw error;
    }
  }
}
