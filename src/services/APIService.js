// Function to process and validate query parameters
const processQueryParameters = (queryOptions) => {
  // custom logic to process / validate query parameters
};

// Function to set headers with provided token
const setHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    "X-Access-Token": token,
  };
};

// Class for interacting with the Radfish API
class RadfishAPIService {
  // Static properties to store data, loading status, error, and token
  static data = null;
  static loading = false;
  static error = null;
  static token = "";

  // Constructor to initialize the instance with a token
  constructor(token) {
    this.token = token;
  }

  // Asynchronous function to perform a GET request
  async get(endpoint, queryParams) {
    // Process and validate query parameters
    const queryParamString = processQueryParameters(queryParams);

    try {
      // Set loading to true before making the request
      this.loading = true;
      // Make the GET request using fetch API
      const response = await fetch(`${API_HOST}/${endpoint}${queryParamString}`, {
        headers: setHeaders(this.token),
      });

      // Check if the response is not OK (status code not in the range 200-299)
      if (!response.ok) {
        // Set error with the JSON response
        this.error = await response.json();
        return;
      }

      // Set data with the JSON response
      this.data = await response.json();
    } catch (err) {
      // Set error in case of an exception
      this.error = `[GET]: Error fetching data: ${err}`;
    } finally {
      // Set loading to false after the request is completed
      this.loading = false;
    }
  }

  // Asynchronous function to perform a POST request
  async post(endpoint, body) {
    try {
      this.loading = true;
      // Make the POST request using fetch API
      const response = await fetch(`${API_HOST}/${endpoint}`, {
        method: "POST",
        headers: setHeaders(this.token),
        body: JSON.stringify({
          ...body,
        }),
      });

      if (!response.ok) {
        this.error = await response.json();
        return;
      }

      this.data = await response.json();
    } catch (err) {
      this.error = `[POST] Error creating data: ${err}`;
    } finally {
      this.loading = false;
    }
  }

  // Asynchronous function to perform a PUT request
  async put(endpoint, body) {
    try {
      this.loading = true;
      // Make the PUT request using fetch API
      const response = await fetch(`${API_HOST}/${endpoint}`, {
        method: "PUT",
        headers: setHeaders(this.token),
        body: JSON.stringify({ ...body }),
      });

      if (!response.ok) {
        this.error = await response.json();
        return;
      }

      this.data = response.json();
    } catch (err) {
      this.error = `[PUT] Error updating data: ${err}`;
    } finally {
      this.loading = false;
    }
  }

  // Asynchronous function to perform a DELETE request
  async delete(endpoint, body) {
    try {
      this.loading = true;
      // Make the DELETE request using fetch API
      const response = await fetch(`${API_HOST}/${endpoint}`, {
        method: "DELETE",
        headers: setHeaders(this.token),
        body: JSON.stringify({ ...body }),
      });

      if (!response.ok) {
        this.error = await response.json();
      }

      this.data = response.json();
    } catch (err) {
      this.error = `[DELETE] Error removing data: ${err}`;
    } finally {
      this.loading = false;
    }
  }

  // Static methods to retrieve data, loading status, and error
  static getData = () => this.data;
  static isLoading = () => this.loading;
  static getError = () => this.error;
}

// Export an instance of RadfishAPIService
export default new RadfishAPIService();
