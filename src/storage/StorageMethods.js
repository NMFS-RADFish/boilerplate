export class StorageMethod {
  save(_key, _data) {
    throw new Error("Method not implemented.");
  }

  load(_key) {
    throw new Error("Method not implemented.");
  }

  loadOne(_key, _uuid) {
    throw new Error("Method not implemented.");
  }

  editOne(_key, _uuid, _data) {
    throw new Error("Method not implemented.");
  }
}
