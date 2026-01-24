# RADFish Theming Guide

This guide explains how to customize the look and feel of your RADFish application using USWDS, react-uswds, and RADFish component styling.

## Quick Start

Theme customization is split across 3 files in the theme folder:

```
themes/noaa-theme/styles/
├── theme-tokens.scss           # USWDS theme color tokens
├── theme-components.scss       # RADFish component variables
└── theme-overrides.scss        # Custom react-uswds component CSS
```

1. **theme-tokens.scss** - Set design system colors
2. **theme-components.scss** - Configure framework components
3. **theme-overrides.scss** - Style react-uswds components

## How It Works

The RADFish theme plugin:

1. **Reads 3 theme files** from `themes/noaa-theme/styles/`
2. **Generates `_uswds-generated.scss`** from theme-tokens.scss with:
   - USWDS configuration (@use "uswds-core" with theme color tokens)
3. **Generates `_theme-components-generated.scss`** from theme-components.scss with:
   - RADFish component CSS rules using the defined variables
4. **Watches all theme files** for changes and regenerates on save
5. **Injects CSS variables** from tokens into index.html

### Architecture

```
themes/noaa-theme/styles/
├── theme-tokens.scss (developer edits)
│   └── USWDS Theme Color Tokens
│                   ↓
├── theme-components.scss (developer edits)
│   └── RADFish Component Variables
│                   ↓
├── theme-overrides.scss (developer edits)
│   └── Custom react-uswds Component CSS
│                   ↓
└── _uswds-generated.scss (auto-generated, don't edit)
    └── USWDS @use statement (from theme-tokens.scss)
```

## Section 1: USWDS Theme Color Tokens

Edit **`theme-tokens.scss`** to set design system color tokens. You can use:

- **USWDS token names**: `'blue-60v'`, `'red-50v'`, `'gray-cool-30'`, etc.
- **Hex colors**: `'#0054a4'`, `'#ffffff'`, etc.

### Example

```scss
/* themes/noaa-theme/styles/theme-tokens.scss */

// Base Colors
$base-lightest: 'gray-5';
$base-lighter: 'gray-cool-10';
$primary: 'blue-60v';
$secondary: 'red-50v';

// Or use hex colors
$primary: '#0054a4';
```

### Available USWDS Tokens

- **Base**: `base-lightest`, `base-lighter`, `base-light`, `base`, `base-dark`, `base-darker`, `base-darkest`
- **Primary**: `primary`, `primary-lighter`, `primary-light`, `primary-vivid`, `primary-dark`, `primary-darker`
- **Secondary**: `secondary`, `secondary-lighter`, `secondary-light`, `secondary-vivid`, `secondary-dark`, `secondary-darker`
- **Accent Cool**: `accent-cool-lighter`, `accent-cool-light`, `accent-cool`, `accent-cool-dark`, `accent-cool-darker`
- **Accent Warm**: `accent-warm-lighter`, `accent-warm-light`, `accent-warm`, `accent-warm-dark`, `accent-warm-darker`
- **State**: `info`, `error`, `warning`, `success` (with `-lighter`, `-light`, `-dark`, `-darker` variants)
- **Disabled**: `disabled-light`, `disabled`, `disabled-dark`

See [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/) for complete list.

## Section 2: RADFish Component Variables

Edit **`theme-components.scss`** to configure RADFish framework components. The plugin automatically generates CSS rules from these variables and includes them in the CSS import chain via `_theme-components-generated.scss`.

Currently supports:

**Header:** Background color, logo width, title color, mobile menu button color
**Buttons:** Primary and secondary button hover state colors (background and text)

### Header Variables

```scss
/* themes/noaa-theme/styles/theme-components.scss */

$header-background: 'primary';          // References theme-tokens.scss token or hex color
$header-logo-width: 72px;              // Width of logo element in header
$header-title-color: 'white';          // Color name or hex
$header-menu-btn-color: 'primary';     // Menu button color (mobile/tablet size)
```

### Button Hover State Variables

```scss
/* themes/noaa-theme/styles/theme-components.scss */

$button-primary-hover-bg: 'primary-dark';     // Primary button hover background color
$button-primary-hover-color: 'white';         // Primary button hover text color
$button-secondary-hover-bg: 'secondary-dark'; // Secondary button hover background color
$button-secondary-hover-color: 'white';       // Secondary button hover text color
```

**Selectors affected:**
- Primary button hover: `.usa-button:hover`, `.usa-button:active`, `.usa-button:focus`
- Secondary button hover: `.usa-button--secondary:hover`, `.usa-button--secondary:active`, `.usa-button--secondary:focus`

**How it works:**
- Plugin reads variables from `theme-components.scss`
- Generates `_theme-components-generated.scss` with CSS rules
- Token references like `'primary'` become `color('primary')` (USWDS function)
- Direct colors like `'white'` or `'#0054a4'` are used as-is
- USWDS module is imported automatically for utility functions

### Adding Custom Component Variables

You can extend RADFish with your own component variables. This requires a 2-step process:

**Step 1: Add variable to `theme-components.scss`**

```scss
/* themes/noaa-theme/styles/theme-components.scss */

$footer-background: 'base-lightest';   // Your custom footer variable
$nav-link-color: 'primary';            // Your custom nav link color
```

**Step 2: Add handler to the plugin**

Edit `plugins/vite-plugin-radfish-theme.js` and add a handler in the `generateComponentsCSS()` function:

```javascript
// In plugins/vite-plugin-radfish-theme.js
// Inside the generateComponentsCSS() function, add:

if (radfishVars.footerBackground || radfishVars['footer-background']) {
  const bgValue = radfishVars.footerBackground || radfishVars['footer-background'];
  const normalizedBg = normalizeColorValue(bgValue);
  // Check if it's a token reference (from theme-tokens) or direct color
  const bgExpression = normalizedBg.match(/^[a-z-]+$/) ? `color('${normalizedBg}')` : `'${normalizedBg}'`;

  css.push(`/* Footer Background */
footer.usa-footer {
  background-color: ${bgExpression} !important;
}`);
}

if (radfishVars.navLinkColor || radfishVars['nav-link-color']) {
  const linkColor = radfishVars.navLinkColor || radfishVars['nav-link-color'];
  const normalizedColor = normalizeColorValue(linkColor);
  const colorExpression = normalizedColor.match(/^[a-z-]+$/) ? `color('${normalizedColor}')` : `'${normalizedColor}'`;

  css.push(`/* Navigation Link Color */
.usa-nav__link {
  color: ${colorExpression} !important;
}`);
}
```

**Pattern explanation:**
- Check both kebab-case (`'footer-background'`) and camelCase (`footerBackground`) variable names for compatibility
- Normalize the color value by stripping quotes
- Detect token references using regex: if value matches `^[a-z-]+$`, it's a USWDS token
- For tokens, use `color()` function; for hex/names, use directly
- Add `!important` to override any conflicting styles
- Push the CSS rule to the `css` array

**Tips for finding CSS selectors:**
- Inspect element in browser DevTools to find the exact class
- Check [USWDS component documentation](https://designsystem.digital.gov/components/) for official class names
- Common USWDS selectors: `.usa-footer`, `.usa-nav__link`, `.usa-button`, `.usa-card`, `.usa-alert`

## Section 3: Custom Component Overrides

Edit **`theme-overrides.scss`** to write your own CSS customizing react-uswds components. You can use:

- USWDS utility functions: `color()`, `u-bg()`, `u-text()`
- USWDS utility classes: `.bg-primary`, `.text-base-lightest`, etc.
- Standard CSS

### Available react-uswds Components

You can override any USWDS component class:

**Layout & Navigation**: `usa-header`, `usa-footer`, `usa-sidenav`, `usa-breadcrumb`, `usa-in-page-nav`, `usa-banner`, `usa-identifier`

**Forms & Inputs**: `usa-button`, `usa-input`, `usa-checkbox`, `usa-radio`, `usa-select`, `usa-combo-box`, `usa-form`, `usa-validation`, and more

**Content & Display**: `usa-card`, `usa-alert`, `usa-table`, `usa-list`, `usa-accordion`, `usa-tag`, `usa-collection`, and more

**Interactive**: `usa-modal`, `usa-tooltip`, `usa-pagination`, `usa-language-selector`

### Example

```scss
/* themes/noaa-theme/styles/theme-overrides.scss */

/* Custom button styles */
.usa-button {
  border-radius: 8px;
  font-weight: 600;
}

/* Custom card styles using USWDS utilities */
.usa-card {
  border-color: color('base-light');
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Custom alert styling */
.usa-alert--info {
  background-color: color('info');
}
```

## Theme Structure

```
themes/noaa-theme/
├── assets/                         # Theme icons and logos
│   ├── radfish.png                # Main logo
│   ├── radfish.ico                # Favicon
│   ├── 144.png                    # PWA icon
│   ├── 192.png                    # PWA icon
│   └── 512.png                    # PWA icon
└── styles/
    ├── theme-tokens.scss          # USWDS color tokens (edit this)
    ├── theme-components.scss      # RADFish component variables (edit this)
    ├── theme-overrides.scss       # Custom react-uswds CSS (edit this)
    └── .generated/                # Auto-generated files (do not edit)
        ├── _uswds-generated.scss           # From theme-tokens.scss
        └── _theme-components-generated.scss # From theme-components.scss
```

**Note:** The `.generated/` folder is auto-generated and should not be committed to git. It's included in `.gitignore`.

## Developer Styles

Add application-specific page and layout styles in:

```
src/styles/custom.css
```

This file is loaded **after** all theme styles, so you can override anything.

### Example

```css
/* src/styles/custom.css */

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.fish-data-card {
  background: var(--radfish-background);
  border: 1px solid var(--radfish-border-light);
  padding: 1.5rem;
  border-radius: 4px;
}
```

### Available CSS Variables

The plugin injects these CSS variables from Section 1:

- `--radfish-primary` - Primary brand color
- `--radfish-secondary` - Secondary color
- `--radfish-accent` - Accent color
- `--radfish-text` - Text color
- `--radfish-error` - Error color
- `--radfish-background` - Background color
- `--radfish-border-light` - Light border color
- `--radfish-border-dark` - Dark border color
- And others based on your Section 1 variables...

## CSS Import Order

The styles are loaded in this order (in `src/index.css`):

1. **_uswds-generated.scss** - Auto-generated USWDS configuration from theme-tokens.scss
2. **@trussworks/react-uswds** - Trussworks component base styles
3. **_theme-components-generated.scss** - Auto-generated RADFish component styles from theme-components.scss
4. **theme-overrides.scss** - Your custom react-uswds component overrides
5. **src/styles/custom.css** - Your page-level application styles

This order ensures correct CSS cascade: USWDS base → Trussworks components → RADFish components → Your overrides → Your app styles

## Configuration

In `vite.config.js`:

```javascript
radFishThemePlugin("noaa-theme", {
  app: {
    name: "My App Name",
    shortName: "MyApp",
    description: "App description for PWA",
  },
  pwa: {
    themeColor: "#0054a4",
    backgroundColor: "#ffffff",
  },
})
```

The theme name matches the folder in `themes/` directory.

## Creating a New Theme

1. Create theme folder:
   ```bash
   mkdir -p themes/my-agency/assets themes/my-agency/styles
   ```

2. Add assets to `themes/my-agency/assets/`:
   - `radfish.png` (main logo)
   - `radfish.ico` (favicon)
   - `144.png`, `192.png`, `512.png` (PWA icons)

3. Create the 3 theme files in `themes/my-agency/styles/`:
   - Copy `themes/noaa-theme/styles/theme-tokens.scss` → Customize color tokens
   - Copy `themes/noaa-theme/styles/theme-components.scss` → Customize RADFish component variables
   - Copy `themes/noaa-theme/styles/theme-overrides.scss` → Customize react-uswds component styles

4. Update `vite.config.js`:
   ```javascript
   radFishThemePlugin("my-agency", {
     app: { name: "My Agency App" }
   })
   ```

5. The plugin will auto-generate `_uswds-generated.scss` from your `theme-tokens.scss`

## Troubleshooting

### Changes not appearing?

- **Edit any theme file?** The dev server should auto-restart when you save
- **Still not working?** Manually restart the server with `npm start`
- **Browser cache?** Clear cache (Ctrl+Shift+R or Cmd+Shift+R)

### USWDS utilities not working?

Make sure you're using the correct syntax in `theme-overrides.scss`:
- Function: `color('primary')` (with quotes)
- Class: `.bg-primary` (with hyphen, no quotes)

### Custom app styles not applying?

Check that you're editing `src/styles/custom.css` for page-level styles.
Theme styling should happen in the 3 theme files: `theme-tokens.scss`, `theme-components.scss`, and `theme-overrides.scss`.

## Additional Resources

- [USWDS Design System](https://designsystem.digital.gov/)
- [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/)
- [USWDS Components](https://designsystem.digital.gov/components/)
- [Trussworks react-uswds](https://github.com/trussworks/react-uswds)
