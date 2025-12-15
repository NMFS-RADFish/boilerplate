/**
 * RADFish Theme Vite Plugin
 *
 * This plugin connects radfish.config.js to your application:
 * - Transforms index.html with config values (title, meta tags, favicon)
 * - Exposes config to React via virtual module "virtual:radfish-config"
 * - Provides helper to generate PWA manifest from config
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const VIRTUAL_MODULE_ID = "virtual:radfish-config";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

/**
 * Default configuration values (used if radfish.config.js is missing)
 */
function getDefaultConfig() {
  return {
    app: {
      name: "RADFish Application",
      shortName: "RADFish",
      description: "RADFish React App",
    },
    icons: {
      logo: "/icons/radfish.png",
      favicon: "/icons/radfish.ico",
      appleTouchIcon: "/icons/radfish.png",
      pwa: {
        icon144: "/icons/144.png",
        icon192: "/icons/192.png",
        icon512: "/icons/512.png",
      },
    },
    colors: {
      primary: "#0054a4",
      secondary: "#0093d0",
      accent: "#00467f",
      text: "#333",
      error: "#af292e",
      buttonHover: "#0073b6",
      label: "#0054a4",
      borderDark: "#565c65",
      borderLight: "#ddd",
      background: "#f4f4f4",
      headerBackground: "#0054a4",
      warningLight: "#fff3cd",
      warningMedium: "#ffeeba",
      warningDark: "#856404",
    },
    pwa: {
      themeColor: "#0054a4",
      backgroundColor: "#ffffff",
    },
    typography: {
      fontFamily: "Arial Narrow, sans-serif",
    },
  };
}

/**
 * Main Vite plugin for RADFish theming
 */
export function radFishThemePlugin() {
  let config = null;
  let resolvedViteConfig;

  return {
    name: "vite-plugin-radfish-theme",

    // Store Vite config for later use
    configResolved(viteConfig) {
      resolvedViteConfig = viteConfig;
    },

    // Load radfish.config.js at build start
    async buildStart() {
      const configPath = path.resolve(
        resolvedViteConfig.root,
        "radfish.config.js",
      );

      if (fs.existsSync(configPath)) {
        try {
          // Use dynamic import with cache-busting for HMR
          const configUrl = pathToFileURL(configPath).href;
          const module = await import(`${configUrl}?update=${Date.now()}`);
          config = module.default;
        } catch (error) {
          console.warn(
            "[radfish-theme] Error loading radfish.config.js:",
            error.message,
          );
          config = getDefaultConfig();
        }
      } else {
        console.warn(
          "[radfish-theme] No radfish.config.js found, using defaults",
        );
        config = getDefaultConfig();
      }
    },

    // Handle virtual module imports
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    // Provide config as virtual module content
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(config)}`;
      }
    },

    // Transform index.html with config values
    transformIndexHtml(html) {
      if (!config) return html;

      return html
        .replace(/<title>.*?<\/title>/, `<title>${config.app.shortName}</title>`)
        .replace(
          /<meta name="theme-color" content=".*?" \/>/,
          `<meta name="theme-color" content="${config.pwa.themeColor}" />`,
        )
        .replace(
          /<meta name="description" content=".*?" \/>/,
          `<meta name="description" content="${config.app.description}" />`,
        )
        .replace(
          /<link rel="icon" type="image\/x-icon" href=".*?" \/>/,
          `<link rel="icon" type="image/x-icon" href="${config.icons.favicon}" />`,
        )
        .replace(
          /<link rel="apple-touch-icon" href=".*?" \/>/,
          `<link rel="apple-touch-icon" href="${config.icons.appleTouchIcon}" />`,
        );
    },
  };
}

/**
 * Generate VitePWA manifest configuration from radfish.config.js
 *
 * Usage in vite.config.js:
 *   import radFishConfig from "./radfish.config.js";
 *   VitePWA({ manifest: getManifestFromConfig(radFishConfig) })
 */
export function getManifestFromConfig(config) {
  return {
    short_name: config.app.shortName,
    name: config.app.name,
    icons: [
      {
        src: "icons/radfish.ico",
        sizes: "512x512 256x256 144x144 64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "icons/radfish-144.ico",
        sizes: "144x144 64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "icons/radfish-144.ico",
        type: "image/icon",
        sizes: "144x144",
        purpose: "any",
      },
      {
        src: "icons/radfish-192.ico",
        type: "image/icon",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "icons/radfish-512.ico",
        type: "image/icon",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: config.icons.pwa.icon144.replace(/^\//, ""),
        type: "image/png",
        sizes: "144x144",
        purpose: "any",
      },
      {
        src: config.icons.pwa.icon144.replace(/^\//, ""),
        type: "image/png",
        sizes: "144x144",
        purpose: "maskable",
      },
      {
        src: config.icons.pwa.icon192.replace(/^\//, ""),
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: config.icons.pwa.icon512.replace(/^\//, ""),
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    start_url: ".",
    display: "standalone",
    theme_color: config.pwa.themeColor,
    background_color: config.pwa.backgroundColor,
  };
}
