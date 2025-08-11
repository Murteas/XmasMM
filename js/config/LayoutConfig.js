// LayoutConfig.js - central layout & sizing constants (TECH-001)
// Single source of truth for common UI measurements and spacings.
// NOTE: Keep values conservative for mobile (375x667 baseline). Adjust with care.

const LayoutConfig = {
  // Header heights: small vs normal (used in history / active row managers)
  HEADER_HEIGHT_SMALL: 140, // iPhone baseline small screens (<= 667px height)
  HEADER_HEIGHT_DEFAULT: 120,

  // Unified fixed header height used in simplified three-zone scenes
  THREE_ZONE_HEADER: 140,

  // Footer heights
  FOOTER_HEIGHT_GAME: 120,
  FOOTER_HEIGHT_ROUND_OVER: 100,

  // History & RoundOver row heights
  HISTORY_ROW_HEIGHT_STANDARD: 60,
  ROUND_OVER_ROW_HEIGHT_DENSE: 42,

  // Minimum touch target
  MIN_TOUCH_TARGET: 44,

  // Common spacings
  ELEMENT_SPACING_SMALL: 45,
  ELEMENT_SPACING_DEFAULT: 60,

  // Button sizing
  SUBMIT_BUTTON_WIDTH: 60,

  // Button style tokens (Harmonized Christmas Color Palette)
  BUTTON_STYLE: {
    PRIMARY_BG: '#0F4C36',        // Emerald green (matches title stroke)
    PRIMARY_BG_HOVER: '#1a6b4a',  // Emerald hover state
    PRIMARY_BG_ACTIVE: '#0a3d2a', // Emerald pressed state
    PRIMARY_FG: '#ffffff',
    ACCENT_BG: '#DAA520',         // Sophisticated gold (less bright)
    ACCENT_BG_HOVER: '#F4D03F',   // Warmer gold hover
    ACCENT_BG_ACTIVE: '#B8860B',  // Rich gold pressed
    ACCENT_FG: '#0F4C36',         // Emerald text on gold
    DANGER_BG: '#A0342B',         // Deeper Christmas red
    DANGER_BG_HOVER: '#C0392B',   // Classic Christmas red hover
    DANGER_BG_ACTIVE: '#7A2920',  // Dark red pressed
    DANGER_FG: '#ffffff',
    DISABLED_BG: '#444444',
    DISABLED_FG: '#bbbbbb',
  BORDER_GOLD: '#DAA520',         // Harmonized gold
  BORDER_WHITE: '#ffffff',
  BORDER_GREEN_DARK: '#0a3d2a',   // Harmonized dark emerald
    RADIUS: 10,
    PADDING_X: 22,
    PADDING_Y: 12,
    // Enhanced typography for mobile clarity (Option 2.5)
    FONT: 'bold 18px "Trebuchet MS", "Arial Black", Arial, sans-serif',
    SHADOW_COLOR: 0x000000,
    SHADOW_ALPHA: 0.35,
    SHADOW_OFFSET_Y: 3,
    SMALL_SCREEN_SCALE(width) { return width < 430 ? 0.9 : 1; }
  },

  // Utility getters
  getBaseHeaderHeight(isSmallScreen) {
    return isSmallScreen ? this.HEADER_HEIGHT_SMALL : this.HEADER_HEIGHT_DEFAULT;
  }
};

// Expose globally (project uses dynamic script loader, not ES module imports)
window.LayoutConfig = LayoutConfig;
