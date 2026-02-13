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
      appleTouchIcon: "/icons/icon-512.png",
    },
    colors: {
      primary: "#0054a4",
      secondary: "#0093d0",
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
export function deepMerge(source, target) {
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
