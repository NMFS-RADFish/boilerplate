/**
 * Function to process and validate query parameters
 * @param {Object} queryOptions - The query parameters to be processed and validated.
 * @returns {string} - The processed query parameters as a string.
 */
const processQueryParameters = () => {
  return "";
};

/**
 * Function to set headers with provided token
 * @param {string} token - The access token to be set in the headers.
 * @returns {Object} - The headers object with Content-Type and X-Access-Token.
 */
const setHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    "X-Access-Token": token,
  };
};

/**
 * Class for interacting with the Radfish API
 */
class RadfishAPIService {
  static data = null;
  static error = null;
  static token = null;

  /**
   * Constructor for RadfishAPIService
   * @param {string} token - The access token used for API authentication.
   */
  constructor(token) {
    this.token = token;
  }

  /**
   * Asynchronous function to perform a GET request
   * @param {string} endpoint - The API endpoint to perform the GET request.
   * @param {Object} queryParams - The query parameters for the GET request.
   * @returns {Promise<Object|string>} - A promise that resolves to the API response data or an error string.
   */
  async get(endpoint, queryParams) {
    const queryParamString = processQueryParameters(queryParams);
    try {
      const response = await fetch(`${endpoint}${queryParamString}`, {
        headers: setHeaders(this.token),
      });

      if (!response.ok) {
        // Set error with the JSON response
        this.error = await response.json();
        return this.error;
      }

      this.data = await response.json();
      return this.data;
    } catch (err) {
      // Set error in case of an exception
      this.error = `[GET]: Error fetching data: ${err}`;
      return this.error;
    }
  }

  /**
   * Asynchronous function to perform a POST request
   * @param {string} endpoint - The API endpoint to perform the POST request.
   * @param {Object} body - The request body for the POST request.
   * @returns {Promise<Object|string>} - A promise that resolves to the API response data or an error string.
   */
  async post(endpoint, body) {
    try {
      const response = await fetch(`${endpoint}`, {
        method: "POST",
        headers: setHeaders(this.token),
        body: JSON.stringify({
          ...body,
        }),
      });

      if (!response.ok) {
        this.error = await response.json();
        return this.error;
      }

      this.data = await response.json();
      return this.data;
    } catch (err) {
      this.error = `[POST] Error creating data: ${err}`;
      return this.error;
    }
  }

  /**
   * Asynchronous function to perform a PUT request
   * @param {string} endpoint - The API endpoint to perform the PUT request.
   * @param {Object} body - The request body for the PUT request.
   * @returns {Promise<Object|string>} - A promise that resolves to the API response data or an error string.
   */
  async put(endpoint, body) {
    try {
      const response = await fetch(`${endpoint}`, {
        method: "PUT",
        headers: setHeaders(this.token),
        body: JSON.stringify({ ...body }),
      });

      if (!response.ok) {
        this.error = await response.json();
        return this.error;
      }

      this.data = await response.json();
      return this.data;
    } catch (err) {
      this.error = `[PUT] Error updating data: ${err}`;
      return this.error;
    }
  }

  /**
   * Asynchronous function to perform a DELETE request
   * @param {string} endpoint - The API endpoint to perform the DELETE request.
   * @param {Object} body - The request body for the DELETE request.
   * @returns {Promise<Object|string>} - A promise that resolves to the API response data or an error string.
   */
  async delete(endpoint, body) {
    try {
      const response = await fetch(`${endpoint}`, {
        method: "DELETE",
        headers: setHeaders(this.token),
        body: JSON.stringify({ ...body }),
      });

      if (!response.ok) {
        this.error = await response.json();
        return this.error;
      }

      this.data = await response.json();
      return this.data;
    } catch (err) {
      this.error = `[DELETE] Error removing data: ${err}`;
      return this.error;
    }
  }
}

export default RadfishAPIService;
