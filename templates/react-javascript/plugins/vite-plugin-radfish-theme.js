/**
 * RADFish Theme Vite Plugin
 *
 * This plugin connects radfish.config.js to your application:
 * - Exposes config values via import.meta.env.RADFISH_* constants
 * - Injects CSS variables into HTML <head>
 * - Transforms index.html with config values (title, meta tags, favicon)
 * - Writes manifest.json after build via closeBundle
 * - Auto-restarts dev server when config file changes
 *
 * Theme Directory Auto-Detection:
 * - If a `theme/` folder exists in project root, it will be used automatically
 * - Place radfish.config.js and icons/ in the theme/ folder
 * - No manual copying required - Vite serves theme assets automatically
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Copy directory recursively
 */
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Get content type for file extension
 */
function getContentType(ext) {
  const types = {
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  return types[ext] || "application/octet-stream";
}

/**
 * Generate manifest icon array from config
 */
function getManifestIcons(config) {
  return [
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
  ];
}

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
  let themeDir = null; // Path to theme/ directory if it exists

  return {
    name: "vite-plugin-radfish-theme",

    // Load config and return define values
    async config(viteConfig) {
      // Determine root directory
      const root = viteConfig.root || process.cwd();

      // Check for theme/ directory first (auto-detection)
      const themeDirPath = path.resolve(root, "theme");
      const themeConfigPath = path.resolve(themeDirPath, "radfish.config.js");
      const rootConfigPath = path.resolve(root, "radfish.config.js");

      // Determine which config to load
      let configPath;
      if (fs.existsSync(themeDirPath) && fs.existsSync(themeConfigPath)) {
        // Use theme directory
        themeDir = themeDirPath;
        configPath = themeConfigPath;
        console.log("[radfish-theme] Using theme directory:", themeDirPath);
      } else if (fs.existsSync(rootConfigPath)) {
        // Use root config
        configPath = rootConfigPath;
      } else {
        configPath = null;
      }

      // Load config
      if (configPath) {
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

    // Serve theme icons in dev mode and watch config for changes
    configureServer(server) {
      const root = server.config.root || process.cwd();

      // Watch config file for changes and auto-restart
      const configPaths = [
        path.resolve(root, "theme", "radfish.config.js"),
        path.resolve(root, "radfish.config.js"),
      ];

      for (const configPath of configPaths) {
        if (fs.existsSync(configPath)) {
          server.watcher.add(configPath);
        }
      }

      server.watcher.on("change", (changedPath) => {
        if (configPaths.some((p) => changedPath === p)) {
          console.log("[radfish-theme] Config changed, restarting server...");
          server.restart();
        }
      });

      // Serve theme icons if theme directory exists
      if (!themeDir) return;

      const themeIconsDir = path.join(themeDir, "icons");
      if (!fs.existsSync(themeIconsDir)) return;

      // Serve /icons/* from theme/icons/ directory
      server.middlewares.use("/icons", (req, res, next) => {
        const filePath = path.join(themeIconsDir, req.url || "");
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.setHeader(
            "Content-Type",
            getContentType(path.extname(filePath)),
          );
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });

      console.log("[radfish-theme] Serving icons from:", themeIconsDir);
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
      const outDirPath = path.resolve(resolvedViteConfig.root, outDir);
      const manifestPath = path.resolve(outDirPath, "manifest.json");

      // Ensure output directory exists
      if (!fs.existsSync(outDirPath)) {
        return; // Build hasn't created output dir yet
      }

      // Copy theme icons to dist if using theme directory
      if (themeDir) {
        const themeIconsDir = path.join(themeDir, "icons");
        const distIconsDir = path.join(outDirPath, "icons");
        if (fs.existsSync(themeIconsDir)) {
          copyDirSync(themeIconsDir, distIconsDir);
          console.log("[radfish-theme] Copied theme icons to:", distIconsDir);
        }
      }

      const manifest = {
        short_name: config.app.shortName,
        name: config.app.name,
        description: config.app.description,
        icons: getManifestIcons(config),
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
 * Used by VitePWA plugin for dev mode manifest serving
 */
export function getManifestFromConfig(config) {
  return {
    short_name: config.app.shortName,
    name: config.app.name,
    icons: getManifestIcons(config),
    start_url: ".",
    display: "standalone",
    theme_color: config.pwa.themeColor,
    background_color: config.pwa.backgroundColor,
  };
}
