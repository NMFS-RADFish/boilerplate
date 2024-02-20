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

  async find() {
    try {
      return await db.formData.toArray();
    } catch (error) {
      throw error;
    }
  }

  async update(uuid, data) {
    try {
      return await db.formData.update(uuid, data);
    } catch (error) {
      throw error;
    }
  }
}
