import Dexie from "dexie";
import { IndexedDBMethod } from "../../storage/IndexedDBMethod.js";
import { generateUUID } from "../../utilities/cryptoWrapper.js";

vi.mock("dexie");

vi.mock("../../utilities/cryptoWrapper.js");

vi.mock("../../storage/indexedDB.js", () => ({
  db: {
    formData: {
      add: vi.fn(),
      toArray: vi.fn(),
      where: vi.fn(),
      put: vi.fn(),
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
        put: vi.fn(),
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
    await indexedDBMethod.update("formData", { uuid: "mock-uuid" }, mockData);
    expect(indexedDBMethod.db.formData.put).toHaveBeenCalledWith(mockData, "mock-uuid");
  });
});
