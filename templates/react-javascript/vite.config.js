import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { radFishThemePlugin } from "./plugins/vite-plugin-radfish-theme.js";

/**
 * RADFish Theme Configuration
 *
 * Usage:
 *   radFishThemePlugin("noaa-theme")                 // Use default NOAA theme
 *   radFishThemePlugin("noaa-theme", { app: {...} }) // With app config overrides
 *
 * Available themes (in themes/ folder):
 *   - noaa-theme: Default NOAA blue branding
 *
 * Colors are defined in SCSS: themes/<theme-name>/styles/_colors.scss
 * The SCSS file is watched for changes and will auto-reload the server.
 */

// Define config overrides here (colors come from theme's _colors.scss)
const configOverrides = {
  app: {
    name: "Fish Tracker",
    shortName: "FishTrack",
    description: "Track and manage fish catch data",
  },
  pwa: {
    themeColor: "#0054a4", // Should match $primary in _colors.scss
  },
};

export default defineConfig({
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["node_modules/@uswds/uswds/packages"],
        // Suppress USWDS deprecation warnings about global built-in functions
        // These are from USWDS using map-merge() which will be fixed in Dart Sass 3.0.0
        quietDeps: true,
      },
    },
  },
  plugins: [
    // RADFish theme plugin - provides:
    // - import.meta.env.RADFISH_* constants
    // - CSS variable injection
    // - manifest.json generation on build
    radFishThemePlugin("noaa-theme", configOverrides),
    react(),
    // VitePWA for service worker
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
      // Manifest configuration (synced with radFishThemePlugin configOverrides)
      manifest: {
        short_name: configOverrides.app.shortName,
        name: configOverrides.app.name,
        description: configOverrides.app.description,
        start_url: "/",
        display: "standalone",
        scope: "/",
        theme_color: configOverrides.pwa.themeColor,
        background_color: "#ffffff",
      },
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
});
