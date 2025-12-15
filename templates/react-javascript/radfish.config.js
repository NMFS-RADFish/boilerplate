/**
 * RADFish Theme Configuration
 *
 * This file is the single source of truth for customizing your RADFish application's
 * branding, colors, and appearance. Edit the values below to match your agency's style.
 *
 * After making changes, restart the development server to see updates.
 */

export default {
  // Application Identity
  app: {
    name: "RADFish Application", // Full name shown in header
    shortName: "RADFish", // Short name for browser tab and PWA
    description: "RADFish React App", // Meta description for SEO
  },

  // Logo and Icon Paths (relative to public directory)
  icons: {
    logo: "/icons/radfish.png", // Main logo shown on home page
    favicon: "/icons/radfish.ico", // Browser tab icon
    appleTouchIcon: "/icons/radfish.png", // iOS home screen icon
    // PWA icons for installed app
    pwa: {
      icon144: "/icons/144.png",
      icon192: "/icons/192.png",
      icon512: "/icons/512.png",
    },
  },

  // Color Theme
  // These values generate CSS custom properties (e.g., --noaa-dark-blue)
  colors: {
    primary: "#0054a4", // Main brand color (header, buttons)
    secondary: "#0093d0", // Secondary actions
    accent: "#00467f", // Accent elements
    text: "#333", // Body text color
    error: "#af292e", // Error messages
    buttonHover: "#0073b6", // Button hover state
    label: "#0054a4", // Form labels
    borderDark: "#565c65", // Dark borders
    borderLight: "#ddd", // Light borders
    background: "#f4f4f4", // Page background
    headerBackground: "#0054a4", // Header background

    // Warning/alert colors
    warningLight: "#fff3cd",
    warningMedium: "#ffeeba",
    warningDark: "#856404",
  },

  // PWA (Progressive Web App) Configuration
  pwa: {
    themeColor: "#0054a4", // Browser chrome color on mobile
    backgroundColor: "#ffffff", // Splash screen background
  },

  // Typography
  typography: {
    fontFamily: "Arial Narrow, sans-serif",
  },
};
