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
        return await db.formData.where(criteria);
      }
    } catch (error) {
      throw error;
    }
  }

  async update(criteria, data) {
    try {
      const entry = await this.find(criteria);
      return await db.formData.update(entry.uuid, data);
    } catch (error) {
      throw error;
    }
  }
}
