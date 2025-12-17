# Style Customization Guide

**Complete guide for customizing colors, fonts, visual styling, and UI elements.**

---

## Quick Start: Edit `style.css`

**All visual styling is centralized in `style.css` using CSS variables.** Changes to colors, fonts, and sizes automatically apply throughout the game via the `themeColors`, `themeFonts`, and `themeOpacity` objects in `js/themeColors.js`.

---

## 1. COLOR CUSTOMIZATION

### Edit Colors in `style.css`
**File:** `style.css` — Lines 1-30 (`:root` section)

All game colors are defined as CSS variables. Simply change the hex/rgba values:

```css
:root {
    /* PRIMARY COLORS */
    --color-primary-gold: #efcc03;      /* UI text, score, titles */
    --color-primary-white: #FFFFFF;      /* General text */
    --color-primary-red: #e22020;        /* Game Over text */
    --color-primary-yellow: #efcc03;     /* Accent highlights */

    /* BACKGROUND COLORS */
    --color-bg-gradient-top: #01172F;    /* Sky gradient top */
    --color-bg-gradient-bottom: #010D1B; /* Sky gradient bottom */
    --color-bg-dark: #050f18;            /* Body background */
    --color-bg-ground: #0b1b28;          /* Ground/snow color */
    
    /* DIALOG BOXES */
    --color-bg-dialog: rgba(0, 0, 0, 0.85);        /* Story dialogs */
    --color-bg-dialog-dark: rgba(0, 0, 0, 0.8);    /* Win celebration */
    --color-bg-dialog-shadow: rgba(0, 0, 0, 0.3);  /* Shadow effects */
    --color-bg-overlay: rgba(0, 0, 0, 0.7);        /* Game Over overlay */

    /* ACCENT COLORS */
    --color-accent-border: #c2ddf1;         /* Canvas border */
    --color-accent-border-dialog: #efcc03;  /* Dialog borders */
    --color-accent-snow: rgba(255, 255, 255, 0.948); /* Snowflakes */
}
```

### How Colors Are Applied

Colors automatically sync from CSS to JavaScript via `js/themeColors.js`:

- **Score text:** Uses `themeColors.goldPrimary` → `--color-primary-gold`
- **Background gradient:** Uses `themeColors.bgGradientTop` and `bgGradientBottom`
- **Snowflakes:** Uses `themeColors.accentSnow`
- **Dialog boxes:** Uses `themeColors.bgDialog` and `accentBorderDialog`

**No JavaScript editing needed!** Just change CSS variables.

---

## 2. FONT CUSTOMIZATION

### Edit Fonts in `style.css`
**File:** `style.css` — Lines 22-36

```css
:root {
    /* FONT FAMILIES */
    --font-primary: Arial, sans-serif;              /* General text */
    --font-fancy: "Space Grotesk", Arial, sans-serif; /* Titles, Game Over */

    /* FONT SIZES */
    --font-size-small: 12px;      /* Small instructions */
    --font-size-medium: 16px;     /* Story dialog text */
    --font-size-large: 18px;      /* Win celebration text */
    --font-size-xlarge: 20px;     /* Score display */
    --font-size-huge: 24px;       /* Press ENTER prompts */
    --font-size-title: 36px;      /* Victory titles */
    --font-size-gameover: 72px;   /* GAME OVER screen */
}
```

### How Fonts Are Applied

Fonts sync automatically via `js/themeColors.js`:

- **Score:** `font: bold ${themeFonts.xlarge} ${themeFonts.primary}`
- **Game Over:** `font: bold ${themeFonts.gameover} ${themeFonts.fancy}`
- **Instructions:** `font: ${themeFonts.small} ${themeFonts.primary}`

**To change a font globally:** Edit the CSS variable in `style.css`.

**To add a custom font:**
1. Add font link to `index.html` `<head>`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
   ```
2. Update `--font-fancy` or `--font-primary` in `style.css`:
   ```css
   --font-fancy: "YourFont", Arial, sans-serif;
   ```

---

## 3. TRANSPARENCY/OPACITY

### Edit Opacity Values in `style.css`
**File:** `style.css` — Lines 38-45

```css
:root {
    /* TRANSPARENCY LEVELS */
    --opacity-full: 1;          /* 100% opaque */
    --opacity-high: 0.85;       /* Dialog backgrounds */
    --opacity-medium: 0.8;      /* Win celebration overlay */
    --opacity-low: 0.7;         /* Game Over overlay */
    --opacity-verylow: 0.3;     /* Shadows */
    --opacity-dialog: 0.03;     /* Noise effect intensity */
}
```

Used in:
- **Dialog backgrounds:** `themeOpacity.high` (0.85)
- **Noise effect:** `themeOpacity.dialog` (0.03) — controls visual grain
- **Overlays:** `themeOpacity.low` (0.7)

---

## 4. CANVAS BORDER & SHAPE

### Edit Canvas Border in `style.css`
**File:** `style.css` — Lines 68-72

```css
#gameCanvas {
    border: 3px solid var(--color-accent-border);  /* Border width & color */
    border-radius: 24px;                           /* Corner roundness */
    max-width: calc(100vw - 10vw);                 /* Responsive width */
    max-height: calc(100vh - 10vh);                /* Responsive height */
}
```

**Customization examples:**
- **Thicker border:** `border: 5px solid var(--color-accent-border);`
- **Sharp corners:** `border-radius: 0px;`
- **Colored border:** Change `--color-accent-border` in `:root`
- **Glowing border:** Add `box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);`

---

## 5. BACKGROUND EFFECTS

### Gradient Background
**Controlled by:** `--color-bg-gradient-top` and `--color-bg-gradient-bottom`

Change these in `style.css` to modify the sky:
```css
--color-bg-gradient-top: #01172F;    /* Night sky (top) */
--color-bg-gradient-bottom: #010D1B; /* Night sky (bottom) */
```

**Example themes:**
- **Sunrise:** Top `#ff6b6b`, Bottom `#ffd93d`
- **Day:** Top `#87CEEB`, Bottom `#E0F6FF`
- **Sunset:** Top `#ff6347`, Bottom `#4b0082`

### Ground Color
**Controlled by:** `--color-bg-ground`

```css
--color-bg-ground: #0b1b28;  /* Dark snow/ground */
```

### Snowflake Color
**Controlled by:** `--color-accent-snow`

```css
--color-accent-snow: rgba(255, 255, 255, 0.948);  /* White snowflakes */
```

For colored snow (e.g., golden snowflakes):
```css
--color-accent-snow: rgba(255, 215, 0, 0.8);
```

---

## 6. UI TEXT COLORS BY SCREEN

### Start Screen
- **Story dialog text:** `themeColors.whitePrimary`
- **Dialog border:** `themeColors.accentBorderDialog` (gold)
- **"Press ENTER" prompt:** `themeColors.yellowPrimary`

### Game Screen
- **Score:** `themeColors.goldPrimary`
- **Instructions (← → Move):** `themeColors.goldPrimary`

### Game Over Screen
- **"GAME OVER" text:** `themeColors.redPrimary`
- **Score display:** `themeColors.whitePrimary`
- **"Press ENTER" prompt:** `themeColors.whitePrimary`

### Win Screens
- **Celebration message:** `themeColors.whitePrimary`
- **"Christmas Saved!" title:** `themeColors.accentBorderDialog` (gold)
- **Score & bonus:** `themeColors.goldPrimary`
- **Reward card border:** `themeColors.accentBorderDialog`

---

## 7. COMMON CUSTOMIZATION SCENARIOS

### Scenario 1: Dark Mode → Light Mode

**In `style.css`:**
```css
/* Change these variables */
--color-bg-gradient-top: #87CEEB;      /* Light blue sky */
--color-bg-gradient-bottom: #E0F6FF;   /* Lighter blue */
--color-bg-dark: #f0f8ff;              /* Light body */
--color-bg-ground: #ffffff;            /* White ground */
--color-primary-gold: #d4af37;         /* Darker gold for contrast */
--color-primary-white: #000000;        /* Black text */
--color-accent-snow: rgba(200, 200, 255, 0.9); /* Light blue snow */
```

### Scenario 2: Halloween Theme

```css
--color-bg-gradient-top: #1a0033;      /* Dark purple */
--color-bg-gradient-bottom: #000000;   /* Black */
--color-bg-ground: #2d1b00;            /* Dark brown */
--color-primary-gold: #ff6600;         /* Orange */
--color-primary-yellow: #ff6600;       /* Orange accents */
--color-accent-border-dialog: #ff6600; /* Orange borders */
--color-accent-snow: rgba(255, 102, 0, 0.5); /* Orange particles */
```

### Scenario 3: Neon/Cyberpunk Theme

```css
--color-bg-gradient-top: #0a0e27;      /* Dark navy */
--color-bg-gradient-bottom: #000000;   /* Black */
--color-bg-ground: #1a1a2e;            /* Dark purple-gray */
--color-primary-gold: #00ffff;         /* Cyan */
--color-primary-yellow: #ff00ff;       /* Magenta */
--color-accent-border: #00ffff;        /* Cyan border */
--color-accent-border-dialog: #ff00ff; /* Magenta dialogs */
--color-accent-snow: rgba(0, 255, 255, 0.8); /* Cyan particles */
```

---

## 8. BUTTON STYLING (If Added)

**File:** `style.css` — Lines 74-82

If you add HTML buttons to the game UI:
```css
button, .button, .btn {
    border: 1px solid var(--color-primary-white);
    border-radius: 16px;
    /* Add more styles as needed */
}
```

---

## 9. ADVANCED: Dynamic Theme Switching

To change themes dynamically at runtime:

**1. Add a theme switcher function in `js/themeColors.js`:**
Already included! Use `refreshTheme()` to reload all CSS variables after changing them.

**2. Create a theme toggle:**
```javascript
// Example: Toggle to dark theme
document.documentElement.style.setProperty('--color-bg-gradient-top', '#000000');
document.documentElement.style.setProperty('--color-bg-gradient-bottom', '#1a1a1a');
refreshTheme(); // Reload theme in game
```

---

## 10. TROUBLESHOOTING

**Colors not changing?**
- Clear browser cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Verify CSS variable names match exactly (case-sensitive)
- Check `js/themeColors.js` loads before other JS files

**Fonts not loading?**
- Verify font link in `index.html` `<head>`
- Check font name spelling in `--font-fancy` or `--font-primary`
- Use browser DevTools to confirm font loads

**Opacity not working?**
- Opacity values must be 0-1 (0.85, not 85)
- RGBA colors need opacity as 4th value: `rgba(0, 0, 0, 0.85)`

---

## 11. COLOR REFERENCE TABLE

| CSS Variable | Usage | Default Value |
|--------------|-------|---------------|
| `--color-primary-gold` | Score, UI highlights | `#efcc03` |
| `--color-primary-white` | General text | `#FFFFFF` |
| `--color-primary-red` | Game Over title | `#e22020` |
| `--color-primary-yellow` | Accent highlights | `#efcc03` |
| `--color-bg-gradient-top` | Sky top | `#01172F` |
| `--color-bg-gradient-bottom` | Sky bottom | `#010D1B` |
| `--color-bg-ground` | Ground/snow | `#0b1b28` |
| `--color-bg-dialog` | Story dialogs | `rgba(0,0,0,0.85)` |
| `--color-accent-border` | Canvas border | `#c2ddf1` |
| `--color-accent-border-dialog` | Dialog borders | `#efcc03` |
| `--color-accent-snow` | Snowflakes | `rgba(255,255,255,0.948)` |

---

## 12. FONT REFERENCE TABLE

| CSS Variable | Usage | Default Value |
|--------------|-------|---------------|
| `--font-primary` | General text | `Arial, sans-serif` |
| `--font-fancy` | Titles, Game Over | `"Space Grotesk", Arial` |
| `--font-size-small` | Small text | `12px` |
| `--font-size-medium` | Dialog text | `16px` |
| `--font-size-large` | Win messages | `18px` |
| `--font-size-xlarge` | Score | `20px` |
| `--font-size-huge` | Press ENTER | `24px` |
| `--font-size-title` | Victory titles | `36px` |
| `--font-size-gameover` | GAME OVER | `72px` |

---

**Last Updated:** December 17, 2025

**Pro Tip:** Create multiple CSS files (e.g., `theme-dark.css`, `theme-light.css`) and swap them to quickly switch between complete theme presets!