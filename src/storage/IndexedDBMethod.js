import { generateUUID } from "../utilities";
import { StorageMethod } from "./StorageMethod";
import { db } from "./indexedDB";

export class IndexedDBMethod extends StorageMethod {
  async create(data) {
    try {
      await db.formData.add({
        ...data,
        uuid: generateUUID(),
      });
    } catch (error) {
      throw error;
    }
  }

  async find(criteria) {
    try {
      if (!criteria) {
        return await db.formData.toArray();
      } else {
        return await db.formData.where(criteria).toArray();
      }
    } catch (error) {
      throw error;
    }
  }

  async update(criteria, data) {
    try {
      return await db.formData.put(data, criteria.uuid);
    } catch (error) {
      throw error;
    }
  }
}
