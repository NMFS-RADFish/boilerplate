/**
 * RADFish Theme Vite Plugin
 *
 * This plugin provides theming capabilities for RADFish applications:
 * - Reads theme colors from SCSS files (themes/<theme-name>/styles/theme.scss)
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
 *     styles/theme.scss    - Combined file with USWDS tokens, CSS variables, and component overrides
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import * as sass from "sass";

/**
 * Get the cache directory path for compiled theme files
 * Uses node_modules/.cache/radfish-theme/<themeName>/ to keep project clean
 */
function getCacheDir(themeName) {
  return path.join(process.cwd(), "node_modules", ".cache", "radfish-theme", themeName);
}

/**
 * Parse SCSS content string and extract variable definitions
 * Supports simple variable definitions like: $variable-name: #hex;
 * @param {string} content - SCSS content as a string
 * @returns {Object} Object mapping variable names (without $) to values
 */
function parseScssContent(content) {
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
  return parseScssContent(content);
}


/**
 * Normalize color value (strip quotes if present)
 */
function normalizeColorValue(value) {
  return value.replace(/['"]/g, '');
}

/**
 * Check if a value is a USWDS system color token
 * Matches patterns like: blue-60v, gray-cool-30, red-warm-50v, green-cool-40v
 * See: https://designsystem.digital.gov/design-tokens/color/system-tokens/
 */
function isUswdsToken(value) {
  // USWDS token pattern: color-family[-modifier]-grade[v]
  // Examples: blue-60v, gray-cool-30, red-warm-50v, mint-cool-40v
  const tokenPattern = /^(black|white|red|orange|gold|yellow|green|mint|cyan|blue|indigo|violet|magenta|gray)(-warm|-cool|-vivid)?(-[0-9]+v?)?$/;
  return tokenPattern.test(value);
}

/**
 * Format value for USWDS @use statement
 * - USWDS tokens: quoted ('blue-60v')
 * - Custom values (hex, etc.): unquoted (#0093D0)
 */
function formatUswdsValue(value) {
  const normalized = normalizeColorValue(value);
  if (isUswdsToken(normalized)) {
    return `'${normalized}'`; // USWDS tokens are quoted
  }
  return normalized; // Custom values (hex, etc.) are unquoted
}

/**
 * Compute MD5 hash of a file's content
 */
function computeFileHash(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Check if USWDS needs recompilation based on cache
 */
function needsRecompilation(cacheDir, tokensPath) {
  const cachePath = path.join(cacheDir, ".uswds-cache.json");
  const cssPath = path.join(cacheDir, "uswds-precompiled.css");

  // Need recompilation if cache or CSS doesn't exist
  if (!fs.existsSync(cachePath) || !fs.existsSync(cssPath)) {
    return true;
  }

  try {
    const cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    return cache.tokensHash !== computeFileHash(tokensPath);
  } catch {
    return true;
  }
}

/**
 * Generate SCSS entry file content for USWDS compilation
 */
function generateUswdsEntryScss(uswdsTokens) {
  // Build USWDS @use statement with all token variables
  const uswdsTokensStr = Object.entries(uswdsTokens)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case for USWDS format
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      // Convert kebab-case to USWDS format: base-lightest → theme-color-base-lightest
      const uswdsKey = `theme-color-${kebabKey}`;
      // Format value: hex colors unquoted, token names quoted
      const formattedValue = formatUswdsValue(value);
      return `  $${uswdsKey}: ${formattedValue}`;
    })
    .join(",\n");

  return `/**
 * AUTO-GENERATED USWDS Entry Point
 * Generated by RADFish theme plugin for sass.compile()
 *
 * DO NOT EDIT MANUALLY - changes will be overwritten
 */

@use "uswds-core" with (
${uswdsTokensStr},
  $theme-show-notifications: false
);

@forward "uswds";
`;
}

/**
 * Pre-compile USWDS with theme tokens to a static CSS file
 */
function precompileUswds(themeDir, themeName, uswdsTokens) {
  const cacheDir = getCacheDir(themeName);
  const entryPath = path.join(cacheDir, "_uswds-entry.scss");
  const outputPath = path.join(cacheDir, "uswds-precompiled.css");
  const tokensPath = path.join(themeDir, "styles", "theme.scss");

  // Ensure cache directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  console.log("[radfish-theme] Pre-compiling USWDS...");
  const startTime = Date.now();

  // Generate entry SCSS with tokens
  const entryContent = generateUswdsEntryScss(uswdsTokens);
  fs.writeFileSync(entryPath, entryContent);

  // Compile with sass
  const result = sass.compile(entryPath, {
    loadPaths: [path.join(process.cwd(), "node_modules/@uswds/uswds/packages")],
    style: "compressed",
    quietDeps: true,
  });

  fs.writeFileSync(outputPath, result.css);

  // Save cache manifest
  const cacheData = {
    tokensHash: computeFileHash(tokensPath),
    compiledAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(cacheDir, ".uswds-cache.json"),
    JSON.stringify(cacheData, null, 2)
  );

  const elapsed = Date.now() - startTime;
  console.log(`[radfish-theme] USWDS pre-compiled in ${elapsed}ms: ${outputPath}`);
}

/**
 * Pre-compile theme SCSS file (theme.scss) to CSS
 */
function precompileThemeScss(themeDir, themeName) {
  const cacheDir = getCacheDir(themeName);
  const stylesDir = path.join(themeDir, "styles");

  // Ensure cache directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const inputPath = path.join(stylesDir, "theme.scss");
  const outputPath = path.join(cacheDir, "theme.css");

  if (fs.existsSync(inputPath)) {
    try {
      const result = sass.compile(inputPath, {
        loadPaths: [
          stylesDir,
          cacheDir,
          path.join(process.cwd(), "node_modules/@uswds/uswds/packages"),
        ],
        style: "compressed",
        quietDeps: true,
      });
      fs.writeFileSync(outputPath, result.css);
      console.log(`[radfish-theme] Compiled theme.scss -> theme.css`);
    } catch (err) {
      console.error(`[radfish-theme] Error compiling theme.scss:`, err.message);
    }
  }
}


/**
 * Load theme tokens from theme.scss
 * Returns: { uswdsTokens: {} }
 */
function loadThemeFiles(themeDir) {
  const themeFile = path.join(themeDir, "styles", "theme.scss");

  const uswdsTokens = fs.existsSync(themeFile)
    ? parseScssVariables(themeFile)
    : {};

  return { uswdsTokens };
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
 * Generate manifest icon array for PWA manifest
 * Uses generic filenames so developers can simply replace files in themes/<theme>/assets/
 */
function getManifestIcons() {
  return [
    {
      src: "icons/favicon.ico",
      sizes: "64x64 32x32 24x24 16x16",
      type: "image/x-icon",
    },
    {
      src: "icons/icon-144.png",
      type: "image/png",
      sizes: "144x144",
      purpose: "any",
    },
    {
      src: "icons/icon-192.png",
      type: "image/png",
      sizes: "192x192",
      purpose: "any",
    },
    {
      src: "icons/icon-512.png",
      type: "image/png",
      sizes: "512x512",
      purpose: "any",
    },
    {
      src: "icons/icon-144.png",
      type: "image/png",
      sizes: "144x144",
      purpose: "maskable",
    },
    {
      src: "icons/icon-192.png",
      type: "image/png",
      sizes: "192x192",
      purpose: "maskable",
    },
    {
      src: "icons/icon-512.png",
      type: "image/png",
      sizes: "512x512",
      purpose: "maskable",
    },
  ];
}

/**
 * Default configuration values (used if radfish.config.js is missing)
 * Exported so vite.config.js can import and use default colors
 */
export function getDefaultConfig() {
  return {
    app: {
      name: "RADFish Application",
      shortName: "RADFish",
      description: "RADFish React App",
    },
    icons: {
      logo: "/icons/logo.png",
      favicon: "/icons/favicon.ico",
      appleTouchIcon: "/icons/icon-192.png",
      pwa: {
        icon144: "/icons/icon-144.png",
        icon192: "/icons/icon-192.png",
        icon512: "/icons/icon-512.png",
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

        // Load theme tokens from theme.scss
        const { uswdsTokens } = loadThemeFiles(themeDirPath);

        if (Object.keys(uswdsTokens).length > 0) {
          // Merge USWDS tokens into config colors for CSS variable injection
          config.colors = deepMerge(config.colors, uswdsTokens);

          // Auto-map PWA manifest colors from theme tokens
          // Manifest theme color defaults to primary color from theme.scss
          // Manifest background defaults to base-lightest from theme.scss

          // Set manifest theme color (use primary token, fallback to default)
          if (uswdsTokens.primary) {
            // Primary is typically a token name like 'blue-60v' or hex like '#0054a4'
            // For manifests we want hex, so if it looks like a token name, use our default
            const primaryValue = normalizeColorValue(uswdsTokens.primary);
            if (primaryValue.match(/^#/)) {
              // It's already a hex color, use it directly
              config.pwa.themeColor = primaryValue;
            } else {
              // It's a token name - use a safe default
              // Most apps use blue for primary, so #0054a4 is a good default
              config.pwa.themeColor = '#0054a4';
            }
          }

          // Set manifest background color (use base-lightest token, fallback to white)
          if (uswdsTokens.baseLight || uswdsTokens.baseLighter || uswdsTokens.baseLightest) {
            // Try to find a light color, default to white
            const bgValue = uswdsTokens.baseLightest || uswdsTokens.baseLighter || uswdsTokens.baseLight;
            const normalizedBg = normalizeColorValue(bgValue);
            if (normalizedBg.match(/^#/)) {
              config.pwa.backgroundColor = normalizedBg;
            } else {
              // It's a token name, use white as safe default
              config.pwa.backgroundColor = '#ffffff';
            }
          }

          // Pre-compile USWDS to static CSS (with caching)
          const tokensPath = path.join(themeDirPath, "styles", "theme.scss");
          const cacheDir = getCacheDir(themeName);

          if (needsRecompilation(cacheDir, tokensPath)) {
            precompileUswds(themeDirPath, themeName, uswdsTokens);
          } else {
            console.log("[radfish-theme] Using cached USWDS compilation");
          }

          // Pre-compile theme SCSS file (theme.scss)
          precompileThemeScss(themeDirPath, themeName);

          console.log("[radfish-theme] Loaded theme from:", themeDirPath);
        } else {
          // Fallback: try old _colors.scss for backwards compatibility
          const colorsScssPath = path.join(themeDirPath, "styles", "_colors.scss");
          if (fs.existsSync(colorsScssPath)) {
            const scssColors = parseScssVariables(colorsScssPath);
            config.colors = deepMerge(config.colors, scssColors);
            console.log("[radfish-theme] Loaded colors from:", colorsScssPath);
          }
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
          icons: getManifestIcons(),
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

      const cacheDir = getCacheDir(themeName);

      // Serve pre-compiled CSS files at /radfish-theme/*
      server.middlewares.use("/radfish-theme", (req, res, next) => {
        const fileName = req.url?.replace(/^\//, "") || "";
        const filePath = path.join(cacheDir, fileName);

        if (fs.existsSync(filePath) && filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });

      // Watch theme SCSS file for changes and recompile
      const themePath = path.join(themeDir, "styles", "theme.scss");

      // Add theme file to watcher
      if (fs.existsSync(themePath)) {
        server.watcher.add(themePath);
      }

      server.watcher.on("change", (changedPath) => {
        if (changedPath === themePath) {
          // Theme file changed - recompile everything and restart
          console.log("[radfish-theme] theme.scss changed, recompiling...");
          const { uswdsTokens } = loadThemeFiles(themeDir);
          precompileUswds(themeDir, themeName, uswdsTokens);
          precompileThemeScss(themeDir, themeName);
          console.log("[radfish-theme] Restarting server...");
          server.restart();
        }
      });

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

    // Transform index.html - inject CSS imports, variables, and update meta tags
    transformIndexHtml(html) {
      if (!config) return html;

      // Generate CSS variables from all colors in config
      // Convert camelCase keys to kebab-case for CSS variable names
      const colorVariables = Object.entries(config.colors)
        .map(([key, value]) => {
          const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
          return `        --radfish-color-${kebabKey}: ${value};`;
        })
        .join("\n");

      // Inject theme CSS via link tags (all pre-compiled by plugin)
      // This allows developers to not manually include CSS imports in their code
      // Uses /radfish-theme/ path which is served by middleware in dev and copied to dist in build
      const cssImports = `
    <!-- RADFish Theme CSS (auto-injected by plugin) -->
    <link rel="stylesheet" href="/radfish-theme/uswds-precompiled.css">
    <link rel="stylesheet" href="/radfish-theme/theme.css">`;

      // Generate CSS variables from config
      const cssVariables = `
    <style id="radfish-theme-variables">
      :root {
${colorVariables}
        --radfish-font-family: ${config.typography.fontFamily};
      }
    </style>`;

      return html
        .replace("</head>", `${cssImports}\n${cssVariables}\n  </head>`)
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

        // Copy pre-compiled CSS files to dist/radfish-theme/
        const cacheDir = getCacheDir(themeName);
        const distThemeDir = path.join(outDirPath, "radfish-theme");
        if (fs.existsSync(cacheDir)) {
          if (!fs.existsSync(distThemeDir)) {
            fs.mkdirSync(distThemeDir, { recursive: true });
          }
          const cssFiles = ["uswds-precompiled.css", "theme.css"];
          for (const cssFile of cssFiles) {
            const srcPath = path.join(cacheDir, cssFile);
            const destPath = path.join(distThemeDir, cssFile);
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, destPath);
            }
          }
          console.log("[radfish-theme] Copied CSS files to:", distThemeDir);
        }
      }

      const manifest = {
        short_name: config.app.shortName,
        name: config.app.name,
        description: config.app.description,
        icons: getManifestIcons(),
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
