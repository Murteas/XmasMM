// ThemeConfig.js - Central theme configuration system
// Single source of truth for all theme definitions (elements, colors, backgrounds, assets)

const ThemeConfig = {
  // Active theme identifier (can be changed at runtime)
  currentTheme: 'christmas',

  // List of themes that are fully ready with assets (used for theme cycling)
  availableThemes: ['christmas'], // Add 'halloween' here when assets are ready

  // Theme registry - add new themes here
  themes: {
    // ============================================
    // CHRISTMAS THEME (Default)
    // ============================================
    christmas: {
      id: 'christmas',
      name: 'Christmas',
      displayName: '🎄 Christmas 🎁\nMasterMind', // Note: \n for line break

      // Game elements (6 unique symbols required for MasterMind gameplay)
      elements: [
        { id: 'santa', displayName: 'Santa', assetBase: 'santa' },
        { id: 'present', displayName: 'Present', assetBase: 'present' },
        { id: 'candycane', displayName: 'Candy Cane', assetBase: 'candycane' },
        { id: 'star', displayName: 'Star', assetBase: 'star' },
        { id: 'tree', displayName: 'Tree', assetBase: 'tree' },
        { id: 'snowflake', displayName: 'Snowflake', assetBase: 'snowflake' }
      ],

      // Feedback symbols (perfect match and close match)
      feedback: {
        perfect: { assetBase: 'feedback_perfect_star', displayName: 'Star', symbol: '★' },
        close: { assetBase: 'feedback_close_bell', displayName: 'Bell', symbol: '🔔' }
      },

      // Color palette (matches existing LayoutConfig.BUTTON_STYLE exactly)
      colors: {
        primary: {
          bg: '#0F4C36',        // Emerald green (matches title stroke)
          hover: '#1a6b4a',     // Emerald hover state
          active: '#0a3d2a',    // Emerald pressed state
          fg: '#ffffff'         // White text
        },
        accent: {
          bg: '#DAA520',        // Sophisticated gold
          hover: '#F4D03F',     // Warmer gold hover
          active: '#B8860B',    // Rich gold pressed
          fg: '#0F4C36'         // Emerald text on gold
        },
        danger: {
          bg: '#A0342B',        // Deeper Christmas red
          hover: '#C0392B',     // Classic Christmas red hover
          active: '#7A2920',    // Dark red pressed
          fg: '#ffffff'         // White text
        },
        disabled: {
          bg: '#444444',
          fg: '#bbbbbb'
        },
        border: {
          gold: '#DAA520',      // Harmonized gold
          white: '#ffffff',
          darkGreen: '#0a3d2a'  // Harmonized dark emerald
        }
      },

      // Background gradient themes (matches BackgroundManager christmasThemes)
      backgrounds: {
        traditional: { top: '#0d3820', bottom: '#051610' },  // Deep forest green
        festive: { top: '#1e4d3f', bottom: '#0a2817' },       // Rich emerald green
        winter: { top: '#2C4F6B', bottom: '#1A3445' },        // Icy blue-green
        red: { top: '#8B1538', bottom: '#4A0E1F' }            // Deep Christmas red
      },

      // Audio assets
      audio: {
        background: 'jingle_bells.mp3',
        success: 'ho_ho_ho.mp3',
        win: 'tada.mp3'
      },

      // Asset path (Christmas assets at root for backward compatibility)
      assetPath: 'assets/'
    },

    // ============================================
    // HALLOWEEN THEME
    // ============================================
    halloween: {
      id: 'halloween',
      name: 'Halloween',
      displayName: '🎃 Halloween 👻\nMasterMind',

      // Game elements (6 spooky symbols)
      elements: [
        { id: 'pumpkin', displayName: 'Pumpkin', assetBase: 'pumpkin' },
        { id: 'ghost', displayName: 'Ghost', assetBase: 'ghost' },
        { id: 'bat', displayName: 'Bat', assetBase: 'bat' },
        { id: 'witch', displayName: 'Witch Hat', assetBase: 'witch' },
        { id: 'spider', displayName: 'Spider', assetBase: 'spider' },
        { id: 'skull', displayName: 'Skull', assetBase: 'skull' }
      ],

      // Feedback symbols
      feedback: {
        perfect: { assetBase: 'feedback_perfect_moon', displayName: 'Moon', symbol: '🌙' },
        close: { assetBase: 'feedback_close_cauldron', displayName: 'Cauldron', symbol: '🔮' }
      },

      // Halloween color palette (orange and purple)
      colors: {
        primary: {
          bg: '#FF6600',        // Halloween orange
          hover: '#FF7F2A',     // Lighter orange hover
          active: '#CC5200',    // Darker orange pressed
          fg: '#000000'         // Black text
        },
        accent: {
          bg: '#8B4789',        // Deep purple
          hover: '#A05B9E',     // Lighter purple hover
          active: '#6B3669',    // Darker purple pressed
          fg: '#ffffff'         // White text
        },
        danger: {
          bg: '#CC0000',        // Blood red
          hover: '#E60000',     // Bright red hover
          active: '#990000',    // Dark red pressed
          fg: '#ffffff'         // White text
        },
        disabled: {
          bg: '#444444',
          fg: '#bbbbbb'
        },
        border: {
          gold: '#FF6600',      // Orange for borders
          white: '#ffffff',
          darkGreen: '#2d1b00'  // Dark brown instead of green
        }
      },

      // Background gradient themes (spooky dark colors)
      backgrounds: {
        traditional: { top: '#1a0d33', bottom: '#0d0619' },  // Deep purple night
        festive: { top: '#2d1b4f', bottom: '#1a0d33' },       // Rich purple
        winter: { top: '#331a00', bottom: '#1a0d00' },        // Dark orange
        red: { top: '#660000', bottom: '#330000' }            // Dark blood red
      },

      // Audio assets (note: these files don't exist yet)
      audio: {
        background: 'spooky_music.mp3',
        success: 'witch_cackle.mp3',
        win: 'halloween_win.mp3'
      },

      // Asset path (Halloween assets in subdirectory)
      assetPath: 'assets/themes/halloween/'
    }
  },

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get the currently active theme object
   * @returns {Object} Current theme configuration
   */
  getCurrentTheme() {
    return this.themes[this.currentTheme] || this.themes.christmas;
  },

  /**
   * Set the active theme
   * @param {string} themeId - Theme identifier (e.g., 'christmas', 'halloween')
   * @returns {boolean} True if theme was set successfully
   */
  setTheme(themeId) {
    if (this.themes[themeId]) {
      this.currentTheme = themeId;
      console.log(`🎨 Theme switched to: ${this.themes[themeId].name}`);
      return true;
    }
    console.warn(`⚠️ Theme '${themeId}' not found. Using current theme: ${this.currentTheme}`);
    return false;
  },

  /**
   * Get array of element display names for current theme
   * @returns {Array<string>} Element names (e.g., ['Santa', 'Present', ...])
   */
  getElements() {
    return this.getCurrentTheme().elements.map(e => e.displayName);
  },

  /**
   * Get asset base name for an element by its display name
   * @param {string} displayName - Element display name (e.g., 'Santa', 'Candy Cane')
   * @returns {string|null} Asset base name (e.g., 'santa', 'candycane') or null if not found
   */
  getElementAssetBase(displayName) {
    // Normalize the display name for comparison (remove spaces, lowercase)
    const normalizedName = displayName.toLowerCase().replace(/\s+/g, '');

    const element = this.getCurrentTheme().elements.find(e => {
      const elementNormalized = e.displayName.toLowerCase().replace(/\s+/g, '');
      return elementNormalized === normalizedName || e.id === normalizedName;
    });

    return element ? element.assetBase : null;
  },

  /**
   * Get asset base name for a feedback symbol
   * @param {string} symbolType - 'perfect' or 'close'
   * @returns {string|null} Asset base name or null if not found
   */
  getFeedbackAssetBase(symbolType) {
    const feedback = this.getCurrentTheme().feedback[symbolType];
    return feedback ? feedback.assetBase : null;
  },

  /**
   * Get color palette for current theme
   * @returns {Object} Color palette object
   */
  getColors() {
    return this.getCurrentTheme().colors;
  },

  /**
   * Get background gradients for current theme
   * @returns {Object} Background gradient definitions
   */
  getBackgrounds() {
    return this.getCurrentTheme().backgrounds;
  },

  /**
   * Get audio file path for current theme
   * @param {string} audioType - 'background', 'success', or 'win'
   * @returns {string} Full path to audio file
   */
  getAudioPath(audioType) {
    const theme = this.getCurrentTheme();
    const audioFile = theme.audio[audioType];
    if (!audioFile) {
      console.warn(`⚠️ Audio type '${audioType}' not found in theme '${theme.id}'`);
      return '';
    }
    return `${theme.assetPath}audio/${audioFile}`;
  },

  /**
   * Get full asset path for an element or feedback symbol
   * @param {string} assetBase - Base asset name (e.g., 'santa', 'feedback_perfect_star')
   * @param {string} resolution - '1x', '2x', or '3x'
   * @returns {string} Full path to asset file
   */
  getAssetPath(assetBase, resolution = '1x') {
    const theme = this.getCurrentTheme();
    return `${theme.assetPath}${assetBase}_${resolution}.png`;
  },

  /**
   * Get all available theme IDs (only themes with assets ready)
   * @returns {Array<string>} Array of theme identifiers
   */
  getAvailableThemes() {
    // Return only themes marked as available (with complete assets)
    return this.availableThemes || Object.keys(this.themes);
  },

  /**
   * Get theme info for display purposes
   * @param {string} themeId - Theme identifier
   * @returns {Object|null} Theme info {id, name, displayName} or null if not found
   */
  getThemeInfo(themeId) {
    const theme = this.themes[themeId];
    if (!theme) return null;

    return {
      id: theme.id,
      name: theme.name,
      displayName: theme.displayName
    };
  },

  /**
   * Validate that a theme has all required properties
   * @param {string} themeId - Theme identifier to validate
   * @returns {Object} {valid: boolean, errors: Array<string>}
   */
  validateTheme(themeId) {
    const theme = this.themes[themeId];
    const errors = [];

    if (!theme) {
      return { valid: false, errors: [`Theme '${themeId}' does not exist`] };
    }

    // Check required properties
    if (!theme.elements || theme.elements.length !== 6) {
      errors.push('Theme must have exactly 6 elements');
    }

    if (!theme.feedback || !theme.feedback.perfect || !theme.feedback.close) {
      errors.push('Theme must define perfect and close feedback symbols');
    }

    if (!theme.colors || !theme.colors.primary || !theme.colors.accent || !theme.colors.danger) {
      errors.push('Theme must define primary, accent, and danger colors');
    }

    if (!theme.backgrounds) {
      errors.push('Theme must define background gradients');
    }

    if (!theme.audio) {
      errors.push('Theme must define audio files');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
};

// Expose globally (project uses dynamic script loader, not ES module imports)
window.ThemeConfig = ThemeConfig;
