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

  // Utility getters
  getBaseHeaderHeight(isSmallScreen) {
    return isSmallScreen ? this.HEADER_HEIGHT_SMALL : this.HEADER_HEIGHT_DEFAULT;
  }
};

export default LayoutConfig;
