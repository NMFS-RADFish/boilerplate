import RadfishAuthenticationService from "../../services/AuthenticationService";

describe("RadfishAuthenticationService", () => {
  beforeEach(() => {
    RadfishAuthenticationService.error = null;
    localStorage.clear();
  });

  describe("signIn", () => {
    it("should sign in successfully and set token in localStorage", async () => {
      const loginId = "testUser";
      const password = "testPassword";
      const endpoint = "some-sign-in-endpoint";
      const responseJson = { token: "someToken" };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(responseJson),
      });

      await RadfishAuthenticationService.signIn(loginId, password, endpoint);

      expect(global.fetch).toHaveBeenCalledWith(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId,
          password,
        }),
      });

      expect(localStorage.getItem("token")).toEqual(responseJson.token);
    });

    it("should handle sign-in error and not set token in localStorage", async () => {
      const loginId = "testUser";
      const password = "testPassword";
      const endpoint = "some-sign-in-endpoint";

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: "Sign-in error" }),
      });

      await RadfishAuthenticationService.signIn(loginId, password, endpoint);

      expect(global.fetch).toHaveBeenCalledWith(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId,
          password,
        }),
      });

      expect(localStorage.getItem("token")).toBe(null);
    });
  });

  describe("signOut", () => {
    it("should sign out successfully and remove token from localStorage", async () => {
      const token = "someToken";
      const endpoint = "some-sign-out-endpoint";

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ message: "Sign-out success" }),
      });

      localStorage.setItem("token", token); // emulate logged in state

      await RadfishAuthenticationService.signOut(token, endpoint);

      expect(global.fetch).toHaveBeenCalledWith(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      expect(localStorage.getItem("token")).toBeNull();
    });

    it("should handle sign-out error and still remove token from localStorage", async () => {
      const token = "someToken";
      const endpoint = "some-sign-out-endpoint";

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: "Sign-out error" }),
      });

      localStorage.setItem("token", token); // emulate logged in state

      await RadfishAuthenticationService.signOut(token, endpoint);

      expect(global.fetch).toHaveBeenCalledWith(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
