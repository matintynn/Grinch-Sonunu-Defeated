// ============================================
// THEME COLORS & FONTS - CSS VARIABLES INTEGRATION
// ============================================
// This module reads CSS variables from style.css :root
// Edit colors and fonts in style.css for global changes

// Helper function to get CSS variable value
function getCSSVar(varName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
}

// Initialize theme colors from CSS variables
export const themeColors = {
    // PRIMARY COLORS
    goldPrimary: getCSSVar('--color-primary-gold'),
    whitePrimary: getCSSVar('--color-primary-white'),
    redPrimary: getCSSVar('--color-primary-red'),
    yellowPrimary: getCSSVar('--color-primary-yellow'),

    // BACKGROUND COLORS
    bgGradientTop: getCSSVar('--color-bg-gradient-top'),
    bgGradientBottom: getCSSVar('--color-bg-gradient-bottom'),
    bgDark: getCSSVar('--color-bg-dark'),
    bgGround: getCSSVar('--color-bg-ground'),
    bgDialog: getCSSVar('--color-bg-dialog'),
    bgDialogDark: getCSSVar('--color-bg-dialog-dark'),
    bgDialogShadow: getCSSVar('--color-bg-dialog-shadow'),
    bgOverlay: getCSSVar('--color-bg-overlay'),

    // ACCENT COLORS
    accentBorder: getCSSVar('--color-accent-border'),
    accentBorderDialog: getCSSVar('--color-accent-border-dialog'),
    accentSnow: getCSSVar('--color-accent-snow'),
    layersnow: getCSSVar('--color-layer-snow')
};

// Initialize theme fonts from CSS variables
export const themeFonts = {
    // FONT FAMILIES
    primary: getCSSVar('--font-primary'),
    fancy: getCSSVar('--font-fancy'),

    // FONT SIZES
    small: getCSSVar('--font-size-small'),
    medium: getCSSVar('--font-size-medium'),
    large: getCSSVar('--font-size-large'),
    xlarge: getCSSVar('--font-size-xlarge'),
    huge: getCSSVar('--font-size-huge'),
    title: getCSSVar('--font-size-title'),
    gameover: getCSSVar('--font-size-gameover')
};

// Initialize theme opacity from CSS variables
export const themeOpacity = {
    full: parseFloat(getCSSVar('--opacity-full')),
    high: parseFloat(getCSSVar('--opacity-high')),
    medium: parseFloat(getCSSVar('--opacity-medium')),
    low: parseFloat(getCSSVar('--opacity-low')),
    verylow: parseFloat(getCSSVar('--opacity-verylow')),
    dialog: parseFloat(getCSSVar('--opacity-dialog'))
};

// Export getter function for dynamic updates
export function refreshTheme() {
    Object.keys(themeColors).forEach(key => {
        const cssVarName = '--color-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        themeColors[key] = getCSSVar(cssVarName);
    });

    Object.keys(themeFonts).forEach(key => {
        const cssVarName = key === 'primary' || key === 'fancy'
            ? '--font-' + key
            : '--font-size-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        themeFonts[key] = getCSSVar(cssVarName);
    });

    Object.keys(themeOpacity).forEach(key => {
        const cssVarName = '--opacity-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        themeOpacity[key] = parseFloat(getCSSVar(cssVarName));
    });
}

// Example usage in drawing code:
// Instead of: ctx.fillStyle = '#FFD700';
// Use: ctx.fillStyle = themeColors.goldPrimary;
//
// Instead of: ctx.font = 'bold 20px Arial';
// Use: ctx.font = `bold ${themeFonts.xlarge} ${themeFonts.primary}`;