import RadfishAPIService from "../../services/APIService";

describe("RadfishAPIService", () => {
  beforeEach(() => {
    // Clear mocks and reset data, loading, and error before each test
    jest.resetAllMocks();
    RadfishAPIService.data = null;
    RadfishAPIService.loading = false;
    RadfishAPIService.error = null;
  });

  describe("get", () => {
    it("should fetch data successfully", async () => {
      const responseData = { data: "dataValue" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.get("some-endpoint");

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
      });
      expect(data).toEqual(apiService.data);
    });

    it("should fetch data unsuccessfully", async () => {
      const responseData = { data: "dataValue" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.get("some-endpoint");

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
      });
      expect(data).toEqual(apiService.error);
    });

    it("should handle error during fetch", async () => {
      const errorResponse = { error: "Error fetching data" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      const apiService = new RadfishAPIService("your-token");
      const error = await apiService.get("some-endpoint");

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
      });
      expect(error).toEqual(apiService.error);
    });
  });

  describe("post", () => {
    it("should create data successfully", async () => {
      const requestData = { newData: "newDataValue" };
      const responseData = { createdData: "createdDataValue" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.post("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(data).toEqual(apiService.data);
    });

    it("should create data unsuccessfully", async () => {
      const requestData = { newData: "newDataValue" };
      const responseData = { createdData: "createdDataValue" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.post("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(data).toEqual(apiService.error);
    });

    it("should handle error during creation", async () => {
      const requestData = { newData: "newDataValue" };
      const errorResponse = { error: "Error creating data" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      const apiService = new RadfishAPIService("your-token");
      const error = await apiService.post("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(error).toEqual(apiService.error);
    });
  });

  describe("put", () => {
    it("should update data successfully", async () => {
      const requestData = { updatedData: "updatedDataValue" };
      const responseData = { updatedData: "updatedDataValue" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.put("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(data).toEqual(apiService.data);
    });

    it("should update data unsuccessfully", async () => {
      const requestData = { updatedData: "updatedDataValue" };
      const responseData = { updatedData: "updatedDataValue" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.put("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(data).toEqual(apiService.error);
    });

    it("should handle error during update", async () => {
      const requestData = { updatedData: "updatedDataValue" };
      const errorResponse = { error: "Error updating data" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      const apiService = new RadfishAPIService("your-token");
      const error = await apiService.put("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(error).toEqual(apiService.error);
    });
  });

  describe("delete", () => {
    it("should remove data successfully", async () => {
      const requestData = { deleteData: "deleteDataValue" };
      const responseData = { message: "Data successfully deleted" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.delete("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(data).toEqual(apiService.data);
    });

    it("should remove data unsuccessfully", async () => {
      const requestData = { deleteData: "deleteDataValue" };
      const responseData = { message: "Data successfully deleted" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(responseData),
      });

      const apiService = new RadfishAPIService("your-token");
      const data = await apiService.delete("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(data).toEqual(apiService.error);
    });

    it("should handle error during deletion", async () => {
      const requestData = { deleteData: "deleteDataValue" };
      const errorResponse = { error: "Error deleting data" };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      const apiService = new RadfishAPIService("your-token");
      const error = await apiService.delete("some-endpoint", requestData);

      expect(global.fetch).toHaveBeenCalledWith("some-endpoint", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": "your-token",
        },
        body: JSON.stringify(requestData),
      });
      expect(error).toEqual(apiService.error);
    });
  });
});
