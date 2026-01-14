/**
 * RADFish Theme Vite Plugin
 *
 * This plugin provides theming capabilities for RADFish applications:
 * - Reads theme colors from SCSS files (themes/<theme-name>/styles/_colors.scss)
 * - Exposes config values via import.meta.env.RADFISH_* constants
 * - Injects CSS variables into HTML <head>
 * - Transforms index.html with config values (title, meta tags, favicon)
 * - Writes manifest.json after build via closeBundle
 *
 * Usage:
 *   radFishThemePlugin("noaa-theme")                    // Use noaa-theme from themes/noaa-theme/
 *   radFishThemePlugin("noaa-theme", { app: {...} })    // With config overrides (non-color)
 *
 * Theme Structure:
 *   themes/<theme-name>/
 *     assets/              - Theme icons (served in dev, copied on build)
 *     styles/_colors.scss  - SCSS file with color variables (e.g., $primary: #0054a4;)
 */

import fs from "fs";
import path from "path";

/**
 * Parse SCSS file and extract variable definitions
 * Supports simple variable definitions like: $variable-name: #hex;
 * @param {string} filePath - Path to the SCSS file
 * @returns {Object} Object mapping variable names (without $) to values
 */
function parseScssVariables(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const variables = {};

  // Match SCSS variable definitions: $variable-name: value;
  // Captures: variable name (without $) and value (without semicolon)
  const variableRegex = /^\s*\$([a-zA-Z_][\w-]*)\s*:\s*([^;]+);/gm;

  let match;
  while ((match = variableRegex.exec(content)) !== null) {
    const name = match[1].trim();
    let value = match[2].trim();

    // Remove !default flag if present
    value = value.replace(/\s*!default\s*$/, "").trim();

    // Convert kebab-case to camelCase for config compatibility
    const camelName = name.replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    variables[camelName] = value;
  }

  return variables;
}

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
 * Deep merge two objects (target values override source)
 */
function deepMerge(source, target) {
  const result = { ...source };
  for (const key of Object.keys(target)) {
    if (target[key] && typeof target[key] === "object" && !Array.isArray(target[key])) {
      result[key] = deepMerge(source[key] || {}, target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

/**
 * Main Vite plugin for RADFish theming
 * @param {string} themeName - Name of the theme folder in themes/ directory
 * @param {Object} configOverrides - Optional config overrides (colors, app name, etc.)
 */
export function radFishThemePlugin(themeName = "noaa-theme", configOverrides = {}) {
  let config = null;
  let resolvedViteConfig = null;
  let themeDir = null; // Path to themes/<themeName>/ directory

  return {
    name: "vite-plugin-radfish-theme",

    // Load config and return define values
    async config(viteConfig) {
      // Determine root directory
      const root = viteConfig.root || process.cwd();

      // Start with defaults, then merge provided overrides
      config = deepMerge(getDefaultConfig(), configOverrides);

      // Set theme directory based on theme name
      const themeDirPath = path.resolve(root, "themes", themeName);
      if (fs.existsSync(themeDirPath)) {
        themeDir = themeDirPath;
        console.log("[radfish-theme] Using theme:", themeName);

        // Read colors from theme's SCSS file
        const colorsScssPath = path.join(themeDirPath, "styles", "_colors.scss");
        if (fs.existsSync(colorsScssPath)) {
          const scssColors = parseScssVariables(colorsScssPath);
          // Merge SCSS colors into config (SCSS takes precedence over defaults)
          config.colors = deepMerge(config.colors, scssColors);
          console.log("[radfish-theme] Loaded colors from:", colorsScssPath);
        }
      } else {
        console.warn(`[radfish-theme] Theme "${themeName}" not found at ${themeDirPath}`);
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

    // Serve theme assets in dev mode and watch SCSS for changes
    configureServer(server) {
      // Serve manifest.json in dev mode
      server.middlewares.use("/manifest.json", (_req, res) => {
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
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(manifest, null, 2));
      });

      // Serve theme assets if theme directory exists
      if (!themeDir) return;

      // Watch _colors.scss for changes and trigger full reload
      const colorsScssPath = path.join(themeDir, "styles", "_colors.scss");
      if (fs.existsSync(colorsScssPath)) {
        server.watcher.add(colorsScssPath);
        server.watcher.on("change", (changedPath) => {
          if (changedPath === colorsScssPath) {
            console.log("[radfish-theme] Colors changed, restarting server...");
            server.restart();
          }
        });
      }

      const themeAssetsDir = path.join(themeDir, "assets");
      if (!fs.existsSync(themeAssetsDir)) return;

      // Serve /icons/* from themes/<themeName>/assets/ directory
      server.middlewares.use("/icons", (req, res, next) => {
        const filePath = path.join(themeAssetsDir, req.url || "");
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

      console.log("[radfish-theme] Serving assets from:", themeAssetsDir);
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

      // Copy theme assets to dist/icons if using theme directory
      if (themeDir) {
        const themeAssetsDir = path.join(themeDir, "assets");
        const distIconsDir = path.join(outDirPath, "icons");
        if (fs.existsSync(themeAssetsDir)) {
          copyDirSync(themeAssetsDir, distIconsDir);
          console.log("[radfish-theme] Copied theme assets to:", distIconsDir);
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
