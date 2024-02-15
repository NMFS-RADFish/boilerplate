jest.mock("../../utilities/cryptoWrapper.js", () => ({
  generateUUID: jest.fn(() => "mock-uuid"),
}));

jest.mock("../../storage/indexedDB.js", () => ({
  db: {
    formData: {
      add: jest.fn(),
      toArray: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { db, IndexedDBMethod } from "../../storage";

describe("IndexedDBMethod", () => {
  let indexedDBMethod;

  beforeEach(() => {
    indexedDBMethod = new IndexedDBMethod();
  });

  it("should save data", async () => {
    const data = { key: "value" };
    await indexedDBMethod.save(data);
    expect(db.formData.add).toHaveBeenCalledWith(data);
  });

  it("should load data", async () => {
    await indexedDBMethod.load();
    expect(db.formData.toArray).toHaveBeenCalled();
  });

  it("should load one item", async () => {
    const uuid = "1234";
    await indexedDBMethod.loadOne(uuid);
    expect(db.formData.get).toHaveBeenCalledWith(uuid);
  });

  it("should edit one item", async () => {
    const uuid = "1234";
    const data = { key: "value" };
    await indexedDBMethod.editOne(uuid, data);
    expect(db.formData.update).toHaveBeenCalledWith(uuid, data);
  });
});
