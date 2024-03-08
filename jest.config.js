// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/mocks/styles.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
};
