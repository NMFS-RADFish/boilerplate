import { StorageMethod } from "./StorageMethods";

export class LocalStorageMethod extends StorageMethod {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data to localStorage: ${error}`);
      throw error;
    }
  }

  load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading data from localStorage: ${error}`);
      throw error;
    }
  }

  loadOne(key, uuid) {
    try {
      const data = this.load(key);
      return data.find((entry) => entry[0] === uuid);
    } catch (error) {
      console.error(`Error loading item from localStorage: ${error}`);
      throw error;
    }
  }

  editOne(key, uuid, data) {
    try {
      const originalData = this.load(key);
      const updatedData = originalData.map((entry) => {
        if (entry[0] === uuid) {
          return [uuid, data];
        }
        return entry;
      });
      this.save(key, updatedData);
    } catch (error) {
      console.error(`Error editing item in localStorage: ${error}`);
      throw error;
    }
  }
}
