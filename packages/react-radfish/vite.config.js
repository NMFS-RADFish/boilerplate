import { defineConfig, loadEnv } from "vite";

export default defineConfig({
  plugins: [
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
