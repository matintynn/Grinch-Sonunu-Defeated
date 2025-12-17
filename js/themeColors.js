// ============================================
// THEME COLORS & FONTS - CSS VARIABLES HELPER
// ============================================
// This module provides easy access to CSS variables defined in style.css
// Edit colors and fonts in style.css :root section for global changes



export const themeColors = {
    // PRIMARY COLORS
    goldPrimary: '#FFD700',
    whitePrimary: '#FFFFFF',
    redPrimary: '#FF0000',
    yellowPrimary: '#FFFF00',

    // BACKGROUND COLORS
    bgGradientTop: '#01172F',
    bgGradientBottom: '#010D1B',
    bgDark: 'rgb(8, 18, 29)',
    bgGround: '#1a3a52',
    bgDialog: 'rgba(0, 0, 0, 0.85)',
    bgDialogDark: 'rgba(0, 0, 0, 0.8)',
    bgDialogShadow: 'rgba(0, 0, 0, 0.3)',
    bgOverlay: 'rgba(0, 0, 0, 0.7)',

    // ACCENT COLORS
    accentBorder: '#c2ddf1',
    accentBorderDialog: 'gold',
    accentSnow: 'rgba(255, 255, 255, 0.8)'
};

export const themeFonts = {
    // FONT FAMILIES
    primary: 'Arial, sans-serif',
    fancy: '"Space Grotesk", Arial, sans-serif',

    // FONT SIZES
    small: '12px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
    huge: '24px',
    title: '36px',
    gameover: '72px'
};

export const themeOpacity = {
    full: 1,
    high: 0.85,
    medium: 0.8,
    low: 0.7,
    verylow: 0.3,
    dialog: 0.03
};

// Helper function to get CSS variable value (in case you need it)
export function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
}

// Example usage in drawing code:
// Instead of: ctx.fillStyle = '#FFD700';
// Use: ctx.fillStyle = themeColors.goldPrimary;
//
// Instead of: ctx.font = 'bold 20px Arial';
// Use: ctx.font = `bold ${themeFonts.xlarge} ${themeFonts.primary}`;
