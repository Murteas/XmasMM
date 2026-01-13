// LayoutConfig.js - central layout & sizing constants (TECH-001)
// Single source of truth for common UI measurements and spacings.
// NOTE: Keep values conservative for mobile (375x667 baseline). Adjust with care.

const LayoutConfig = {
  // Header heights: small vs normal (used in history / active row managers)
  HEADER_HEIGHT_SMALL: 140, // iPhone baseline small screens (<= 667px height)
  HEADER_HEIGHT_DEFAULT: 120,

  // Unified fixed header height used in simplified three-zone scenes
  THREE_ZONE_HEADER: 140,

  // Footer heights (MOBILE EXPERT: Optimized for minimal space usage)
  FOOTER_HEIGHT_GAME: 85, // REDUCED from 90 to 85px - reclaim 5px more gameplay space
  FOOTER_HEIGHT_ROUND_OVER: 100,
  
  // Fixed footer for ElementBar (symbol picker) - always visible at bottom
  FOOTER_HEIGHT_ELEMENT_BAR: 70, // DEPRECATED: Use FOOTER.HEIGHT instead

  // FOOTER: Consolidated footer layout values (single source of truth)
  FOOTER: {
    HEIGHT: 70,                    // Total footer height
    TOP_PADDING: 8,                // Padding from top edge to avoid border overlap
    ELEMENT_BUTTON_SIZE: 45,       // Size of each element picker button
    ELEMENT_BUTTON_SPACING: 8,     // Gap between element buttons
    SUBMIT_BUTTON_WIDTH: 50,       // Width of GO button
    SUBMIT_BUTTON_GAP: 12,         // Gap between elements and submit button
  },

  // History & RoundOver row heights (MOBILE EXPERT: Increased for larger elements)
  HISTORY_ROW_HEIGHT_STANDARD: 75, // Increased from 60 to accommodate larger elements
  ROUND_OVER_ROW_HEIGHT_DENSE: 36, // Reduced from 42 to 36px for better fit with 10 guesses

  // DEPRECATED: Sliding window removed in favor of scrolling
  // HISTORY_SLIDING_WINDOW_SIZE: 6, // No longer used - all guesses now shown with scrolling

  // Minimum touch target
  MIN_TOUCH_TARGET: 44,

  // Common spacings
  ELEMENT_SPACING_SMALL: 45,
  ELEMENT_SPACING_DEFAULT: 60,

  // Button sizing
  SUBMIT_BUTTON_WIDTH: 60,

  // Button style tokens (Dynamic colors from theme configuration)
  BUTTON_STYLE: {
    get PRIMARY_BG() { return ThemeConfig.getColors().primary.bg; },
    get PRIMARY_BG_HOVER() { return ThemeConfig.getColors().primary.hover; },
    get PRIMARY_BG_ACTIVE() { return ThemeConfig.getColors().primary.active; },
    get PRIMARY_FG() { return ThemeConfig.getColors().primary.fg; },
    get ACCENT_BG() { return ThemeConfig.getColors().accent.bg; },
    get ACCENT_BG_HOVER() { return ThemeConfig.getColors().accent.hover; },
    get ACCENT_BG_ACTIVE() { return ThemeConfig.getColors().accent.active; },
    get ACCENT_FG() { return ThemeConfig.getColors().accent.fg; },
    get DANGER_BG() { return ThemeConfig.getColors().danger.bg; },
    get DANGER_BG_HOVER() { return ThemeConfig.getColors().danger.hover; },
    get DANGER_BG_ACTIVE() { return ThemeConfig.getColors().danger.active; },
    get DANGER_FG() { return ThemeConfig.getColors().danger.fg; },
    get DISABLED_BG() { return ThemeConfig.getColors().disabled.bg; },
    get DISABLED_FG() { return ThemeConfig.getColors().disabled.fg; },
    get BORDER_GOLD() { return ThemeConfig.getColors().border.gold; },
    get BORDER_WHITE() { return ThemeConfig.getColors().border.white; },
    get BORDER_GREEN_DARK() { return ThemeConfig.getColors().border.darkGreen; },
    RADIUS: 10,
    PADDING_X: 22,
    PADDING_Y: 12,
    // Enhanced typography for mobile clarity (Option 2.5) - Updated for playful consistency
    FONT: 'bold 18px "Comic Sans MS", "Trebuchet MS", Arial, sans-serif',
    SHADOW_COLOR: 0x000000,
    SHADOW_ALPHA: 0.35,
    SHADOW_OFFSET_Y: 3,
    SMALL_SCREEN_SCALE(width) { return width < 430 ? 0.9 : 1; }
  },

  // MOBILE EXPERT: Layout spacing constants (centralizing hardcoded values)
  SPACING: {
    CONTAINER_TOP_SMALL: 20,      // Start just below container top (small screens)
    CONTAINER_TOP_DEFAULT: 15,    // Start just below container top (default)
    CONTAINER_TOP_VERY_SMALL: 25, // Start just below container top (very small screens)
    
    ELEMENT_BAR_OFFSET: 55,       // Space between active row and element bar
    ELEMENT_BAR_HEIGHT: 50,       // Height of element selection bar
    ACTIVE_ROW_HEIGHT: 50,        // Height of active row elements (increased from 45)
    BOTTOM_MARGIN_MIN: 10,        // Minimum margin from bottom edge
    CONTENT_MARGIN: 20,           // General content margins
    
    SUBMIT_BUTTON_WIDTH: 80,      // Width of submit button
    SUBMIT_BUTTON_GAP: 20,        // Gap between elements and submit button
    SUBMIT_BUTTON_HALF_WIDTH: 40, // Half width of submit button for positioning
    
    ELEMENT_WIDTH_SMALL: 48,      // Element width on small screens (increased from 42 - ~15%)
    ELEMENT_WIDTH_DEFAULT: 50,    // Element width on default screens (increased from 45 - ~11%)
    ELEMENT_SPACING_SMALL: 52,    // Element spacing on small screens (increased from 48)
    ELEMENT_SPACING_DEFAULT: 58,  // Element spacing on default screens (increased from 55)
    
    DEBUG_INDICATOR: 10,          // Debug indicator positioning
    LOADING_TEXT_OFFSET: 20,      // Loading text vertical offset
    LOADING_SPINNER_OFFSET: 30,   // Loading spinner vertical offset
  },

  // Animation constants
  ANIMATION: {
    FAST_DURATION: 60,            // Fast animations (60ms)
    STANDARD_DURATION: 100,       // Standard animations (100ms)
    SCALE_DOWN: 0.95,             // Standard scale down amount
    THROTTLE_60FPS: 16,           // 60fps throttle (16ms)
  },

  // Utility getters
  getBaseHeaderHeight(isSmallScreen) {
    return isSmallScreen ? this.HEADER_HEIGHT_SMALL : this.HEADER_HEIGHT_DEFAULT;
  }
};

// Expose globally (project uses dynamic script loader, not ES module imports)
window.LayoutConfig = LayoutConfig;
