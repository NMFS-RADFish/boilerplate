export class StorageModelFactory {
  static createModel(storageMethod) {
    return new StorageModel(storageMethod);
  }
}

export class StorageModel {
  constructor(storageMethod) {
    this.storageMethod = storageMethod;
  }

  create(data) {
    this.storageMethod.create(data);
  }
  find(criteria) {
    return this.storageMethod.find(criteria);
  }
  // loadEntryByUUID(uuid) {
  //   return this.storageMethod.loadOne(uuid);
  // }
  update(criteria, data) {
    return this.storageMethod.update(criteria, data);
  }
}
