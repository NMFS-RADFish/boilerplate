class RadfishAuthenticationService {
  static loading = false;
  static error = null;

  /**
   * Asynchronous function to sign in and obtain an authentication token.
   * @param {string} loginId - The user's login ID.
   * @param {string} password - The user's password.
   * @param {string} endpoint - The API endpoint for the sign-in request.
   * @returns {Promise<Object|undefined>} - A promise that resolves to the authentication token data or undefined.
   */
  async signIn(loginId, password, endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId,
          password,
        }),
      });

      if (!response.ok) {
        console.log("Authentication failed");
      }

      const responseJson = await response.json();
      localStorage.setItem("token", responseJson.token);
      return responseJson;
    } catch (err) {
      throw new Error("signIn error: ", err);
    }
  }

  /**
   * Asynchronous function to sign out and invalidate the authentication token.
   * @param {string} token - The authentication token to be invalidated.
   * @param {string} endpoint - The API endpoint for the sign-out request.
   * @returns {Promise<void>} - A promise that resolves once the sign-out process is complete.
   */
  async signOut(token, endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (!response.ok) {
        console.log("Failed to remove token on server");
      }

      localStorage.removeItem("token"); // Always remove the token from localStorage
    } catch (err) {
      throw new Error("signOut error: ", err);
    }
  }
}

export default new RadfishAuthenticationService();
