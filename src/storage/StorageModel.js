export class StorageModelFactory {
  static createModel(storageMethod) {
    return new StorageModel(storageMethod);
  }
}

export class StorageModel {
  constructor(storageMethod) {
    this.storageMethod = storageMethod;
  }

  saveEntry(key, data) {
    this.storageMethod.save(key, data);
  }
  loadAllEntries(key) {
    return this.storageMethod.load(key);
  }
  loadEntryByUUID(key, uuid) {
    return this.storageMethod.loadOneByUUID(key, uuid);
  }
  editEntry(key, uuid, data) {
    return this.storageMethod.editOne(key, uuid, data);
  }
}
