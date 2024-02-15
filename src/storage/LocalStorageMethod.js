import { StorageMethod } from "./StorageMethod";

export class LocalStorageMethod extends StorageMethod {
  save(data, key) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      throw error;
    }
  }

  load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw error;
    }
  }

  loadOne(uuid, key) {
    try {
      const data = this.load(key);
      return data.find((entry) => entry[0] === uuid);
    } catch (error) {
      throw error;
    }
  }

  editOne(uuid, data, key) {
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
      throw error;
    }
  }
}
