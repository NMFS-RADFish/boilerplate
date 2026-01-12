/**
 * RADFish Theme Configuration - NOAA Default
 *
 * This is the default NOAA theme. Copy this entire directory's contents
 * to your project to use this theme:
 *   - icons/* → public/icons/
 *   - radfish.config.js → project root
 *   - styles/custom.css → src/styles/ (and import in index.css)
 */

export default {
  // Application Identity
  app: {
    name: "RADFish Application",
    shortName: "RADFish",
    description: "RADFish React App",
  },

  // Logo and Icon Paths (relative to public directory)
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

  // Color Theme - NOAA Blue
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

  // PWA Configuration
  pwa: {
    themeColor: "#0054a4",
    backgroundColor: "#ffffff",
  },

  // Typography
  typography: {
    fontFamily: "Arial Narrow, sans-serif",
  },
};
