import Dexie from "dexie";
import { IndexedDBMethod } from "../../packages/storage/IndexedDBMethod.js";
import { generateUUID } from "../../utilities/cryptoWrapper.js";

vi.mock("dexie");

vi.mock("../../utilities/cryptoWrapper.js");

vi.mock("../../storage/indexedDB.js", () => ({
  db: {
    formData: {
      add: vi.fn(),
      toArray: vi.fn(),
      where: vi.fn(),
      bulkPut: vi.fn(),
      bulkDelete: vi.fn(),
    },
  },
}));

describe("IndexedDBMethod", () => {
  let indexedDBMethod;
  let mockData;

  beforeEach(() => {
    // Mock Dexie
    Dexie.mockImplementation(() => ({
      version: vi.fn().mockReturnThis(),
      stores: vi.fn().mockReturnThis(),
      formData: {
        add: vi.fn(),
        toArray: vi.fn(),
        where: vi.fn().mockReturnThis(),
        bulkPut: vi.fn(),
        bulkDelete: vi.fn(),
      },
    }));

    // Mock generateUUID
    generateUUID.mockReturnValue("mock-uuid");

    indexedDBMethod = new IndexedDBMethod("mock-db", 1, {
      formData: "uuid, fullName, numberOfFish, species",
    });
    mockData = { key: "value" };
  });

  test("create", async () => {
    await indexedDBMethod.create("formData", mockData);
    expect(indexedDBMethod.db.formData.add).toHaveBeenCalledWith({
      ...mockData,
      uuid: "mock-uuid",
    });
  });

  test("find without criteria", async () => {
    await indexedDBMethod.find("formData");
    expect(indexedDBMethod.db.formData.toArray).toHaveBeenCalled();
  });

  test("find with criteria", async () => {
    await indexedDBMethod.find("formData", mockData);
    expect(indexedDBMethod.db.formData.where).toHaveBeenCalledWith(mockData);
    expect(indexedDBMethod.db.formData.toArray).toHaveBeenCalled();
  });

  test("update", async () => {
    await indexedDBMethod.update("formData", [mockData]);
    expect(indexedDBMethod.db.formData.bulkPut).toHaveBeenCalled();
  });

  test("delete", async () => {
    await indexedDBMethod.delete("formData", ["uuid-123"]);
    expect(indexedDBMethod.db.formData.bulkDelete).toHaveBeenCalledWith(["uuid-123"]);
  });
});
