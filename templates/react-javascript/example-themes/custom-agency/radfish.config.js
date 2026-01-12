/**
 * RADFish Theme Configuration - Custom Agency Example
 *
 * This is an example theme showing how to customize colors for your agency.
 * Copy this entire directory's contents to your project:
 *   - icons/* → public/icons/
 *   - radfish.config.js → project root
 *   - styles/custom.css → src/styles/ (and import in index.css)
 */

export default {
  // Application Identity - Customize these for your agency
  app: {
    name: "Fish Tracker",
    shortName: "FishTrack",
    description: "Track and manage fish catch data for your region",
  },

  // Logo and Icon Paths
  // Replace these icons in public/icons/ with your agency's branding
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

  // Color Theme - Green/Teal Example
  // Customize these colors to match your agency's brand
  colors: {
    primary: "#2e7d32",           // Forest green
    secondary: "#4caf50",         // Light green
    accent: "#1b5e20",            // Dark green
    text: "#333333",
    error: "#c62828",             // Red for errors
    buttonHover: "#388e3c",       // Button hover state
    label: "#2e7d32",
    borderDark: "#565c65",
    borderLight: "#e0e0e0",
    background: "#f5f5f5",
    headerBackground: "#2e7d32",  // Match primary for header
    warningLight: "#fff3cd",
    warningMedium: "#ffeeba",
    warningDark: "#856404",
  },

  // PWA Configuration
  pwa: {
    themeColor: "#2e7d32",        // Match primary color
    backgroundColor: "#ffffff",
  },

  // Typography
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
};
