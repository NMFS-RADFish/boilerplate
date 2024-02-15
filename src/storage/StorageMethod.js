export class StorageMethod {
  save(_data, _key) {
    throw new Error("Method not implemented.");
  }

  load(_key) {
    throw new Error("Method not implemented.");
  }

  loadOne(_uuid, _key) {
    throw new Error("Method not implemented.");
  }

  editOne(_uuid, _data, _key) {
    throw new Error("Method not implemented.");
  }
}
