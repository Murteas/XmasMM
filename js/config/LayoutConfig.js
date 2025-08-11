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

  // Button style tokens (FestiveButtonTheming)
  BUTTON_STYLE: {
    PRIMARY_BG: '#0d5016',
    PRIMARY_BG_HOVER: '#156b1f',
    PRIMARY_BG_ACTIVE: '#093b11',
    PRIMARY_FG: '#ffffff',
    ACCENT_BG: '#ffd700',
    ACCENT_BG_HOVER: '#ffe55c',
    ACCENT_BG_ACTIVE: '#e6c200',
    ACCENT_FG: '#0d5016',
    DANGER_BG: '#c0392b',
    DANGER_BG_HOVER: '#d04637',
    DANGER_BG_ACTIVE: '#8f2a1f',
    DANGER_FG: '#ffffff',
    DISABLED_BG: '#444444',
    DISABLED_FG: '#bbbbbb',
    RADIUS: 10,
    PADDING_X: 22,
    PADDING_Y: 12,
    FONT: '18px Arial',
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
