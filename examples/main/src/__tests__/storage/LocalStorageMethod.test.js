import { LocalStorageMethod } from "@nmfs-radfish/radfish";

vi.mock("@nmfs-radfish/react-radfish", () => ({
  generateUUID: vi.fn(() => "mock-uuid"),
}));

describe("LocalStorageMethod", () => {
  let localStorageMethod;
  let mockData;

  beforeEach(() => {
    mockData = { key: "value" };

    // Mock localStorage
    Storage.prototype.getItem = vi.fn((key) => {
      return JSON.stringify([["mock-uuid", mockData]]);
    });
    Storage.prototype.setItem = vi.fn();

    // Initialize localStorageMethod after mocking localStorage
    localStorageMethod = new LocalStorageMethod("formData");
  });

  it("should create new form entry", () => {
    localStorageMethod.create("formData", mockData);
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("should get all form entries", () => {
    const data = localStorageMethod.find();
    expect(global.localStorage.getItem).toHaveBeenCalledWith("formData");
    expect(data).toEqual([["mock-uuid", mockData]]);
  });

  it("should update a form entry", () => {
    const newData = [["mock-uuid", { key: "new value" }]];
    const criteria = { uuid: "mock-uuid" };
    localStorageMethod.update(criteria.uuid, newData, "formData");
    expect(global.localStorage.getItem).toHaveBeenCalledWith("formData");
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });
});
