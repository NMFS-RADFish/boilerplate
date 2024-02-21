import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  plugins: [
    react(),
    VitePWA({
      injectRegister: null,
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        short_name: "React App",
        name: "Create React App Sample",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any",
          },
          {
            src: "512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any",
          },
          {
            src: "144.png",
            type: "image/png",
            sizes: "144x144",
            purpose: "any",
          },
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
