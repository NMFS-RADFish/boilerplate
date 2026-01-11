import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import {
  radFishThemePlugin,
  getManifestFromConfig,
} from "./plugins/vite-plugin-radfish-theme.js";
import radFishConfig from "./radfish.config.js";

export default defineConfig((env) => ({
  base: "/",
  plugins: [
    // RADFish theme plugin - provides:
    // - import.meta.env.RADFISH_* constants (via define)
    // - CSS variable injection
    // - manifest.json generation (via closeBundle on build)
    radFishThemePlugin(),
    react(),
    // VitePWA still needed for service worker and dev mode manifest
    VitePWA({
      devOptions: {
        enabled: process.env.NODE_ENV === "development",
        type: "module",
      },
      registerType: "autoUpdate",
      injectRegister: null,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.js",
      manifest: getManifestFromConfig(radFishConfig),
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
    setupFiles: "./src/__tests__/setup.js",
    environment: "jsdom",
  },
}));
