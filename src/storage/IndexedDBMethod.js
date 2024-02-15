import { generateUUID } from "../utilities";
import { StorageMethod } from "./StorageMethod";
import { db } from "./indexedDB";

export class IndexedDBMethod extends StorageMethod {
  async save(data) {
    try {
      await db.formData.add({
        ...data,
        uuid: generateUUID(),
      });
    } catch (error) {
      throw error;
    }
  }

  async load() {
    try {
      return await db.formData.toArray();
    } catch (error) {
      throw error;
    }
  }

  async loadOne(uuid) {
    try {
      return await db.formData.get(uuid);
    } catch (error) {
      throw error;
    }
  }

  async editOne(uuid, data) {
    try {
      return await db.formData.update(uuid, data);
    } catch (error) {
      throw error;
    }
  }
}
