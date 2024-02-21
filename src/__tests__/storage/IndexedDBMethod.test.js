jest.mock("../../utilities/cryptoWrapper.js", () => ({
  generateUUID: jest.fn(() => "mock-uuid"),
}));

jest.mock("../../storage/indexedDB.js", () => ({
  db: {
    formData: {
      add: jest.fn(),
      toArray: jest.fn(),
      where: jest.fn(),
      put: jest.fn(),
    },
  },
}));

import { IndexedDBMethod, db } from "../../storage";
import { generateUUID } from "../../utilities/cryptoWrapper";

describe("IndexedDBMethod", () => {
  let indexedDBMethod;
  let mockData;

  beforeEach(() => {
    indexedDBMethod = new IndexedDBMethod();
    mockData = { key: "value" };

    db.formData.add.mockClear();
    db.formData.toArray.mockClear();
    db.formData.where.mockClear();
    db.formData.put.mockClear();
    generateUUID.mockClear();
  });

  it("should create data", async () => {
    generateUUID.mockReturnValue("mock-uuid");
    await indexedDBMethod.create(mockData);
    expect(db.formData.add).toHaveBeenCalledWith({ ...mockData, uuid: "mock-uuid" });
  });

  it("should find all data if no criteria is provided", async () => {
    db.formData.toArray.mockReturnValue([mockData]);
    const result = await indexedDBMethod.find();
    expect(result).toEqual([mockData]);
    expect(db.formData.toArray).toHaveBeenCalled();
  });

  it("should find data based on criteria", async () => {
    db.formData.where.mockReturnValue({
      toArray: jest.fn().mockReturnValue([mockData]),
    });
    const result = await indexedDBMethod.find({ key: "value" });
    expect(result).toEqual([mockData]);
    expect(db.formData.where).toHaveBeenCalledWith({ key: "value" });
  });

  it("should update data based on criteria", async () => {
    await indexedDBMethod.update({ uuid: "mock-uuid" }, mockData);
    expect(db.formData.put).toHaveBeenCalledWith(mockData, "mock-uuid");
  });
});
