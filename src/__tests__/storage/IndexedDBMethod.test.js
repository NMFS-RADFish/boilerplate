import Dexie from "dexie";
import { IndexedDBMethod } from "../../storage/IndexedDBMethod.js";
import { generateUUID } from "../../utilities/cryptoWrapper.js";

jest.mock("dexie");
jest.mock("../../utilities/cryptoWrapper.js");

describe("IndexedDBMethod", () => {
  let indexedDBMethod;
  let mockData;

  beforeEach(() => {
    // Mock Dexie
    Dexie.mockImplementation(() => ({
      version: jest.fn().mockReturnThis(),
      stores: jest.fn().mockReturnThis(),
      formData: {
        add: jest.fn(),
        toArray: jest.fn(),
        where: jest.fn().mockReturnThis(),
        put: jest.fn(),
      },
    }));

    // Mock generateUUID
    generateUUID.mockReturnValue("mock-uuid");

    indexedDBMethod = new IndexedDBMethod(
      "mock-db",
      1,
      "formData",
      "uuid, fullName, numberOfFish, species",
    );
    mockData = { key: "value" };
  });

  test("create", async () => {
    await indexedDBMethod.create(mockData);
    expect(indexedDBMethod.db.formData.add).toHaveBeenCalledWith({
      ...mockData,
      uuid: "mock-uuid",
    });
  });

  test("find without criteria", async () => {
    await indexedDBMethod.find();
    expect(indexedDBMethod.db.formData.toArray).toHaveBeenCalled();
  });

  test("find with criteria", async () => {
    await indexedDBMethod.find(mockData);
    expect(indexedDBMethod.db.formData.where).toHaveBeenCalledWith(mockData);
    expect(indexedDBMethod.db.formData.toArray).toHaveBeenCalled();
  });

  test("update", async () => {
    await indexedDBMethod.update({ uuid: "mock-uuid" }, mockData);
    expect(indexedDBMethod.db.formData.put).toHaveBeenCalledWith(mockData, "mock-uuid");
  });
});
