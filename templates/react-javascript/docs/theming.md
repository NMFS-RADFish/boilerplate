# Theming Guide

This guide explains how to customize the look and feel of your RADFish application.

## Quick Start

**Option 1: Auto-Detect Theme (Recommended)**
1. Copy an example theme to a `theme/` folder in your project root:
   ```bash
   cp -r example-themes/custom-agency theme
   ```
2. Restart the development server (`npm run start`)
3. Done - Vite automatically detects and uses the theme!

**Option 2: Edit Config Directly**
1. Open `radfish.config.js` in your project root
2. Modify the values you want to customize
3. Restart the development server (`npm run start`)

## Using Theme Directories

Theme directories provide a complete, portable theme package. The Vite plugin automatically detects themes.

### Auto-Detection (Easiest)

Simply place your theme in a `theme/` folder at your project root:

```bash
# Copy an example theme
cp -r example-themes/custom-agency theme

# Start the dev server - theme is automatically applied
npm run start
```

The plugin will:
- Load config from `theme/radfish.config.js`
- Serve icons from `theme/icons/` (no copying needed!)
- Copy icons to `dist/icons/` during build

### Theme Directory Structure

```
theme/                      # <-- Auto-detected by Vite
├── radfish.config.js       # App name, colors, icon paths
├── icons/
│   ├── radfish.png         # Main logo (home page)
│   ├── radfish.ico         # Favicon (browser tab)
│   ├── 144.png             # PWA icon
│   ├── 192.png             # PWA icon
│   └── 512.png             # PWA icon
└── styles/
    └── custom.css          # Custom CSS overrides (optional)
```

### Example Themes

See `example-themes/` for ready-to-use themes:

- `noaa-default/` - Default NOAA blue theme
- `custom-agency/` - Green theme example showing customization

### Manual Theme Application (Alternative)

If you prefer not to use the `theme/` folder, you can manually copy files:

1. **Copy icons** to your project:
   ```bash
   cp example-themes/custom-agency/icons/* public/icons/
   ```

2. **Copy config** to project root:
   ```bash
   cp example-themes/custom-agency/radfish.config.js ./
   ```

3. **Copy custom CSS** (optional):
   ```bash
   cp example-themes/custom-agency/styles/custom.css src/styles/
   ```
   Then import in `src/index.css`:
   ```css
   @import "./styles/custom.css";
   ```

4. **Restart** the development server

### Creating Your Own Theme

1. Copy an existing theme directory as a starting point:
   ```bash
   cp -r example-themes/noaa-default my-agency-theme
   ```

2. Edit `my-agency-theme/radfish.config.js` with your colors and app name

3. Replace icons in `my-agency-theme/icons/` with your agency's branding

4. Add custom CSS in `my-agency-theme/styles/custom.css`

5. To use your theme:
   ```bash
   # Option A: Auto-detect (recommended)
   cp -r my-agency-theme theme

   # Option B: Manual copy
   cp my-agency-theme/radfish.config.js ./
   cp my-agency-theme/icons/* public/icons/
   ```

## Configuration File

All theme settings are centralized in `radfish.config.js`:

```javascript
export default {
  // Application Identity
  app: {
    name: "My App Name",           // Header title
    shortName: "MyApp",            // Browser tab, PWA name
    description: "App description", // SEO meta description
  },

  // Logo and Icon Paths (relative to public directory)
  icons: {
    logo: "/icons/my-logo.png",           // Home page logo
    favicon: "/icons/my-favicon.ico",     // Browser tab icon
    appleTouchIcon: "/icons/my-touch.png", // iOS home screen
    pwa: {
      icon144: "/icons/144.png",
      icon192: "/icons/192.png",
      icon512: "/icons/512.png",
    },
  },

  // Color Theme
  colors: {
    primary: "#0054a4",        // Main brand color
    secondary: "#0093d0",      // Secondary color
    accent: "#00467f",         // Accent elements
    text: "#333",              // Body text
    error: "#af292e",          // Error messages
    buttonHover: "#0073b6",    // Button hover state
    label: "#0054a4",          // Form labels
    borderDark: "#565c65",     // Dark borders
    borderLight: "#ddd",       // Light borders
    background: "#f4f4f4",     // Page background
    headerBackground: "#0054a4", // Header background
    warningLight: "#fff3cd",   // Warning backgrounds
    warningMedium: "#ffeeba",  // Warning borders
    warningDark: "#856404",    // Warning text
  },

  // PWA Configuration
  pwa: {
    themeColor: "#0054a4",      // Browser chrome color (mobile)
    backgroundColor: "#ffffff", // Splash screen background
  },

  // Typography
  typography: {
    fontFamily: "Arial Narrow, sans-serif",
  },
};
```

## Using Config Values in Components

Config values are available as `import.meta.env.RADFISH_*` constants:

```jsx
function MyComponent() {
  return (
    <div>
      <h1>{import.meta.env.RADFISH_APP_NAME}</h1>
      <img src={import.meta.env.RADFISH_LOGO} alt="Logo" />
    </div>
  );
}
```

### Available Constants

| Constant | Config Source |
|----------|---------------|
| `import.meta.env.RADFISH_APP_NAME` | `app.name` |
| `import.meta.env.RADFISH_SHORT_NAME` | `app.shortName` |
| `import.meta.env.RADFISH_DESCRIPTION` | `app.description` |
| `import.meta.env.RADFISH_LOGO` | `icons.logo` |
| `import.meta.env.RADFISH_FAVICON` | `icons.favicon` |
| `import.meta.env.RADFISH_PRIMARY_COLOR` | `colors.primary` |
| `import.meta.env.RADFISH_SECONDARY_COLOR` | `colors.secondary` |
| `import.meta.env.RADFISH_THEME_COLOR` | `pwa.themeColor` |
| `import.meta.env.RADFISH_BG_COLOR` | `pwa.backgroundColor` |

## CSS Variables

The config automatically generates CSS custom properties injected into your HTML:

| CSS Variable | Config Source |
|--------------|---------------|
| `--noaa-dark-blue` | `colors.primary` |
| `--noaa-light-blue` | `colors.secondary` |
| `--noaa-accent-color` | `colors.accent` |
| `--noaa-text-color` | `colors.text` |
| `--noaa-error-color` | `colors.error` |
| `--noaa-button-hover` | `colors.buttonHover` |
| `--noaa-label-color` | `colors.label` |
| `--noaa-border-dark` | `colors.borderDark` |
| `--noaa-border-light` | `colors.borderLight` |
| `--noaa-yellow-one` | `colors.warningLight` |
| `--noaa-yellow-two` | `colors.warningMedium` |
| `--noaa-yellow-three` | `colors.warningDark` |
| `--radfish-background` | `colors.background` |
| `--radfish-header-bg` | `colors.headerBackground` |
| `--radfish-font-family` | `typography.fontFamily` |

Example usage in CSS:

```css
.my-element {
  background-color: var(--noaa-dark-blue);
  color: var(--noaa-text-color);
  font-family: var(--radfish-font-family);
}
```

## Customization Examples

### Change App Name

```javascript
app: {
  name: "NOAA Fish Tracker",
  shortName: "FishTracker",
  description: "Track and manage fish catch data",
},
```

### Change Brand Colors

```javascript
colors: {
  primary: "#2e7d32",           // Green theme
  secondary: "#4caf50",
  headerBackground: "#2e7d32",
},
pwa: {
  themeColor: "#2e7d32",        // Match your primary color
},
```

### Use Custom Logo

1. Add your logo to `public/icons/`
2. Update the config:

```javascript
icons: {
  logo: "/icons/my-agency-logo.png",
  favicon: "/icons/my-agency.ico",
},
```

## How It Works

The RADFish theme system uses a Vite plugin that:

1. **Reads `radfish.config.js`** at build/dev time
2. **Injects CSS variables** into `<head>` via `<style>` tag
3. **Provides constants** via Vite's `define` option (`import.meta.env.RADFISH_*`)
4. **Transforms HTML** - updates title, meta tags, favicon links
5. **Writes manifest.json** after build for PWA

## File Structure

```
your-project/
├── theme/                      # Auto-detected theme folder (recommended)
│   ├── radfish.config.js       # Theme config
│   └── icons/                  # Theme icons (served automatically)
├── radfish.config.js           # Or place config here (if no theme/ folder)
├── example-themes/             # Ready-to-use theme packages
│   ├── noaa-default/           # Default NOAA blue theme
│   └── custom-agency/          # Example customized theme
├── plugins/
│   └── vite-plugin-radfish-theme.js  # Theme processing
├── src/
│   └── styles/
│       ├── theme.css           # Styles that use CSS variables (header, body)
│       └── custom.css          # Your custom overrides (optional)
└── public/
    └── icons/                  # Fallback icons (if no theme/ folder)
```

## Troubleshooting

### Changes not appearing?

- Restart the dev server after editing `radfish.config.js`
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### PWA icons not updating?

- Unregister the service worker in DevTools → Application → Service Workers
- Clear application data and reload

### Build errors?

- Ensure `radfish.config.js` uses valid JavaScript syntax
- Check that icon paths exist in the `public/` directory

### CSS variables not working?

- The variables are injected into `<head>` - check the HTML source
- Make sure you're using the correct variable names (see table above)
