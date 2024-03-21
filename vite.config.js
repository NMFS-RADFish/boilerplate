import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: process.env.NODE_ENV === "development",
      },
      registerType: "autoUpdate",
      injectRegister: null,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.js",
      manifest: {
        short_name: "PWA Boilerplate",
        name: "RADFish PWA Boilerplate",
        icons: [
          {
            src: "favicon.ico",
            sizes: "144x144 64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "144.png",
            type: "image/png",
            sizes: "144x144",
            purpose: "any",
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
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
      },
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
