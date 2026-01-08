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

  // Sliding window configuration (CLEAN SLATE: No scrolling, simple layout)
  HISTORY_SLIDING_WINDOW_SIZE: 6, // Show last 6 completed guesses (adjustable based on mobile testing)

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
