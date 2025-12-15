/**
 * RADFish Configuration Hook
 *
 * Provides access to radfish.config.js values in React components.
 *
 * Usage:
 *   import { useRadFishConfig } from "./hooks/useRadFishConfig";
 *
 *   function MyComponent() {
 *     const config = useRadFishConfig();
 *     return <h1>{config.app.name}</h1>;
 *   }
 */

import { createContext, useContext } from "react";
import config from "virtual:radfish-config";

// Create context with config as default value
const RadFishConfigContext = createContext(config);

/**
 * Provider component for RADFish configuration.
 *
 * Wrap your app with this to provide config to all child components.
 * Optionally pass a custom config to override the default.
 *
 * Usage:
 *   <RadFishConfigProvider>
 *     <App />
 *   </RadFishConfigProvider>
 *
 *   // Or with custom config override:
 *   <RadFishConfigProvider config={customConfig}>
 *     <App />
 *   </RadFishConfigProvider>
 */
export function RadFishConfigProvider({ children, config: customConfig }) {
  const value = customConfig || config;
  return (
    <RadFishConfigContext.Provider value={value}>
      {children}
    </RadFishConfigContext.Provider>
  );
}

/**
 * Hook to access RADFish configuration in components.
 *
 * Returns the full config object with app, icons, colors, pwa, and typography.
 *
 * Usage:
 *   const config = useRadFishConfig();
 *   console.log(config.app.name);        // "RADFish Application"
 *   console.log(config.colors.primary);  // "#0054a4"
 *   console.log(config.icons.logo);      // "/icons/radfish.png"
 */
export function useRadFishConfig() {
  return useContext(RadFishConfigContext);
}

// Direct export for non-component usage (e.g., utility functions)
export { config as radFishConfig };
