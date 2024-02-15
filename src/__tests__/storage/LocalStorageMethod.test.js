import { LocalStorageMethod } from "../../storage/LocalStorageMethod";

describe("LocalStorageMethod", () => {
  let localStorageMethod;
  let mockData;

  beforeEach(() => {
    localStorageMethod = new LocalStorageMethod();
    mockData = { key: "value" };

    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify([["mock-uuid", mockData]]));
    Storage.prototype.setItem = jest.fn();
  });

  it("should save data", () => {
    localStorageMethod.save(mockData, "formData");
    expect(global.localStorage.setItem).toHaveBeenCalledWith("formData", JSON.stringify(mockData));
  });

  it("should load data", () => {
    const data = localStorageMethod.load("formData");
    expect(global.localStorage.getItem).toHaveBeenCalledWith("formData");
    expect(data).toEqual([["mock-uuid", mockData]]);
  });

  it("should load one item", () => {
    const item = localStorageMethod.loadOne("mock-uuid", "formData");
    expect(global.localStorage.getItem).toHaveBeenCalledWith("formData");
    expect(item).toEqual(["mock-uuid", mockData]);
  });

  it("should edit one item", () => {
    const newData = [["mock-uuid", { key: "new value" }]];
    localStorageMethod.editOne("mock-uuid", newData, "formData");
    expect(global.localStorage.getItem).toHaveBeenCalledWith("formData");
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });
});
