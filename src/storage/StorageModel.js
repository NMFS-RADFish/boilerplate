export class StorageModelFactory {
  static createModel(storageMethod) {
    return new StorageModel(storageMethod);
  }
}

export class StorageModel {
  constructor(storageMethod) {
    this.storageMethod = storageMethod;
  }

  saveEntry(data, key) {
    this.storageMethod.save(data, key);
  }
  loadAllEntries(key) {
    return this.storageMethod.load(key);
  }
  loadEntryByUUID(uuid, key) {
    return this.storageMethod.loadOne(uuid, key);
  }
  editEntry(uuid, data, key) {
    return this.storageMethod.editOne(uuid, data, key);
  }
}
