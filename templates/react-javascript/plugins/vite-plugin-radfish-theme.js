/**
 * RADFish Theme Vite Plugin
 *
 * This plugin connects radfish.config.js to your application:
 * - Exposes config values via import.meta.env.RADFISH_* constants
 * - Injects CSS variables into HTML
 * - Transforms index.html with config values (title, meta tags, favicon)
 * - Writes manifest.json after build via closeBundle
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

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
  let resolvedViteConfig = null;

  return {
    name: "vite-plugin-radfish-theme",

    // Load config and return define values
    async config(viteConfig, { command }) {
      // Determine root directory
      const root = viteConfig.root || process.cwd();
      const configPath = path.resolve(root, "radfish.config.js");

      // Load config
      if (fs.existsSync(configPath)) {
        try {
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

      // Return define values for import.meta.env.RADFISH_*
      return {
        define: {
          "import.meta.env.RADFISH_APP_NAME": JSON.stringify(config.app.name),
          "import.meta.env.RADFISH_SHORT_NAME": JSON.stringify(
            config.app.shortName,
          ),
          "import.meta.env.RADFISH_DESCRIPTION": JSON.stringify(
            config.app.description,
          ),
          "import.meta.env.RADFISH_LOGO": JSON.stringify(config.icons.logo),
          "import.meta.env.RADFISH_FAVICON": JSON.stringify(
            config.icons.favicon,
          ),
          "import.meta.env.RADFISH_APPLE_TOUCH_ICON": JSON.stringify(
            config.icons.appleTouchIcon,
          ),
          "import.meta.env.RADFISH_PRIMARY_COLOR": JSON.stringify(
            config.colors.primary,
          ),
          "import.meta.env.RADFISH_SECONDARY_COLOR": JSON.stringify(
            config.colors.secondary,
          ),
          "import.meta.env.RADFISH_THEME_COLOR": JSON.stringify(
            config.pwa.themeColor,
          ),
          "import.meta.env.RADFISH_BG_COLOR": JSON.stringify(
            config.pwa.backgroundColor,
          ),
        },
      };
    },

    // Store resolved config
    configResolved(viteConfig) {
      resolvedViteConfig = viteConfig;
    },

    // Transform index.html - inject CSS variables and update meta tags
    transformIndexHtml(html) {
      if (!config) return html;

      // Generate CSS variables from config
      const cssVariables = `
    <style id="radfish-theme-variables">
      :root {
        --noaa-dark-blue: ${config.colors.primary};
        --noaa-light-blue: ${config.colors.secondary};
        --noaa-accent-color: ${config.colors.accent};
        --noaa-text-color: ${config.colors.text};
        --noaa-error-color: ${config.colors.error};
        --noaa-button-hover: ${config.colors.buttonHover};
        --noaa-label-color: ${config.colors.label};
        --noaa-border-dark: ${config.colors.borderDark};
        --noaa-border-light: ${config.colors.borderLight};
        --noaa-yellow-one: ${config.colors.warningLight};
        --noaa-yellow-two: ${config.colors.warningMedium};
        --noaa-yellow-three: ${config.colors.warningDark};
        --radfish-background: ${config.colors.background};
        --radfish-header-bg: ${config.colors.headerBackground};
        --radfish-font-family: ${config.typography.fontFamily};
      }
    </style>`;

      return html
        .replace("</head>", `${cssVariables}\n  </head>`)
        .replace(
          /<title>.*?<\/title>/,
          `<title>${config.app.shortName}</title>`,
        )
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

    // Write manifest.json after build completes
    closeBundle() {
      if (!config || !resolvedViteConfig) return;

      // Only write manifest for build, not serve
      const outDir = resolvedViteConfig.build?.outDir || "dist";
      const manifestPath = path.resolve(
        resolvedViteConfig.root,
        outDir,
        "manifest.json",
      );

      // Ensure output directory exists
      const outDirPath = path.dirname(manifestPath);
      if (!fs.existsSync(outDirPath)) {
        return; // Build hasn't created output dir yet
      }

      const manifest = {
        short_name: config.app.shortName,
        name: config.app.name,
        description: config.app.description,
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

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("[radfish-theme] Wrote manifest.json to", manifestPath);
    },
  };
}

/**
 * Generate VitePWA manifest configuration from radfish.config.js
 * (Kept for backwards compatibility, but closeBundle now handles this)
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
