# Theming Guide

This guide explains how to customize the look and feel of your RADFish application.

## Quick Start

In `vite.config.js`, specify your theme:

```javascript
radFishThemePlugin("noaa-theme", {
  app: {
    name: "My Agency App",
    shortName: "MyApp",
  },
})
```

Colors are defined in your theme's SCSS file at `themes/<theme-name>/styles/_colors.scss`.

## How It Works

The plugin accepts two arguments:

1. **Theme name** (string) - Name of folder in `themes/` directory containing assets and colors
2. **Config overrides** (object, optional) - Customize app name, icons, etc.

```javascript
// Use NOAA theme with defaults
radFishThemePlugin("noaa-theme")

// Use NOAA theme with custom app name
radFishThemePlugin("noaa-theme", {
  app: { name: "My Agency App" }
})
```

## Theme Structure

Themes contain assets and color definitions:

```
themes/
└── noaa-theme/
    ├── assets/
    │   ├── radfish.png         # Main logo
    │   ├── radfish.ico         # Favicon
    │   ├── 144.png             # PWA icon
    │   ├── 192.png             # PWA icon
    │   └── 512.png             # PWA icon
    └── styles/
        └── _colors.scss        # Theme color variables
```

The plugin:
- Reads color variables from `themes/<theme-name>/styles/_colors.scss`
- Serves assets from `themes/<theme-name>/assets/` as `/icons/*` in dev mode
- Copies assets to `dist/icons/` on build
- Generates `manifest.json` on build

## Configuration Options

### Colors (SCSS File)

Colors are defined in the theme's `_colors.scss` file:

```scss
// themes/noaa-theme/styles/_colors.scss

// Primary colors
$primary: #0054a4;
$secondary: #0093d0;
$accent: #00467f;

// Text and UI colors
$text: #333;
$error: #af292e;
$button-hover: #0073b6;
$label: #0054a4;

// Border colors
$border-dark: #565c65;
$border-light: #ddd;

// Background colors
$background: #f4f4f4;
$header-background: #0054a4;

// Warning/status colors
$warning-light: #fff3cd;
$warning-medium: #ffeeba;
$warning-dark: #856404;
```

Variable names use kebab-case (e.g., `$button-hover`) and are automatically converted to camelCase (e.g., `buttonHover`) for internal config compatibility.

### Plugin Config Overrides

Non-color configuration is passed as the second argument to `radFishThemePlugin()`:

```javascript
radFishThemePlugin("noaa-theme", {
  // Application Identity
  app: {
    name: "My Agency App",
    shortName: "MyApp",
    description: "Description for PWA",
  },

  // Icon Paths (relative to /icons/)
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

  // PWA
  pwa: {
    themeColor: "#0054a4",
    backgroundColor: "#ffffff",
  },

  // Typography
  typography: {
    fontFamily: "Arial Narrow, sans-serif",
  },
})
```

## Accessing Config in Components

Use `import.meta.env.RADFISH_*` constants:

```jsx
function HomePage() {
  return (
    <img
      src={import.meta.env.RADFISH_LOGO}
      alt={`${import.meta.env.RADFISH_SHORT_NAME} logo`}
    />
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

The plugin injects CSS custom properties into `<head>`:

```css
:root {
  --noaa-dark-blue: #0054a4;
  --radfish-header-bg: #0054a4;
  --radfish-secondary: #0093d0;
  --radfish-accent: #00467f;
  --noaa-text-color: #333333;
  --radfish-error: #af292e;
  --radfish-btn-hover: #0073b6;
  --radfish-label: #0054a4;
  --radfish-border-dark: #565c65;
  --radfish-border-light: #dddddd;
  --radfish-background: #f4f4f4;
  --radfish-font-family: Arial Narrow, sans-serif;
}
```

Use these in your CSS:

```css
.my-button {
  background-color: var(--noaa-dark-blue);
  color: white;
}
```

## Creating a New Theme

1. Create a theme folder structure:
   ```bash
   mkdir -p themes/my-agency/assets themes/my-agency/styles
   ```

2. Add your icons to `themes/my-agency/assets/`:
   - `radfish.png` - Main logo
   - `radfish.ico` - Favicon
   - `144.png`, `192.png`, `512.png` - PWA icons

3. Create `themes/my-agency/styles/_colors.scss` with your colors:
   ```scss
   $primary: #2e7d32;
   $secondary: #4caf50;
   $accent: #1b5e20;
   $header-background: #2e7d32;
   // ... add other color variables as needed
   ```

4. Update `vite.config.js`:
   ```javascript
   radFishThemePlugin("my-agency", {
     app: { name: "My Agency App" },
   })
   ```

## File Structure

```
your-project/
├── vite.config.js              # Theme plugin config here
├── themes/
│   └── noaa-theme/
│       ├── assets/             # Theme icons
│       └── styles/
│           └── _colors.scss    # Theme color variables
├── plugins/
│   └── vite-plugin-radfish-theme.js
├── src/
│   └── styles/
│       └── theme.css           # Styles using CSS variables
└── public/
    └── icons/                  # Fallback icons
```

## Troubleshooting

### Changes not appearing?

- Restart the dev server after changing `vite.config.js`
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### PWA icons not updating?

- Unregister the service worker in DevTools → Application → Service Workers
- Clear application data and reload
