// ThemeManager.js - Runtime theme management utilities
// Handles theme switching, persistence, and validation

class ThemeManager {
  /**
   * Initialize theme system
   * Loads saved theme from localStorage if available
   */
  static initialize() {
    const savedTheme = this.loadThemePreference();

    // Check if saved theme is in available themes list (has assets)
    const availableThemes = ThemeConfig.getAvailableThemes();

    if (savedTheme && availableThemes.includes(savedTheme) && ThemeConfig.setTheme(savedTheme)) {
      console.log(`🎨 Restored saved theme: ${savedTheme}`);
    } else {
      if (savedTheme && !availableThemes.includes(savedTheme)) {
        console.warn(`⚠️ Saved theme '${savedTheme}' not available (missing assets). Using default.`);
        // Clear invalid preference
        this.clearThemePreference();
      }
      console.log(`🎨 Using default theme: ${ThemeConfig.currentTheme}`);
    }
  }

  /**
   * Switch to a different theme and save preference
   * @param {string} themeId - Theme identifier to switch to
   * @param {boolean} savePreference - Whether to save to localStorage (default: true)
   * @returns {boolean} True if switch was successful
   */
  static switchTheme(themeId, savePreference = true) {
    // Validate theme before switching
    const validation = ThemeConfig.validateTheme(themeId);
    if (!validation.valid) {
      console.error(`❌ Cannot switch to theme '${themeId}':`, validation.errors);
      return false;
    }

    // Switch theme
    const success = ThemeConfig.setTheme(themeId);

    // Save preference if requested
    if (success && savePreference) {
      this.saveThemePreference(themeId);
    }

    return success;
  }

  /**
   * Get the next theme in the rotation (for cycling through themes)
   * @returns {string} Next theme identifier
   */
  static getNextTheme() {
    const themes = ThemeConfig.getAvailableThemes();
    const currentIndex = themes.indexOf(ThemeConfig.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex];
  }

  /**
   * Cycle to the next available theme
   * @param {boolean} savePreference - Whether to save to localStorage (default: true)
   * @returns {string} The new theme identifier
   */
  static cycleTheme(savePreference = true) {
    const nextTheme = this.getNextTheme();
    this.switchTheme(nextTheme, savePreference);
    return nextTheme;
  }

  /**
   * Save theme preference to localStorage
   * @param {string} themeId - Theme identifier to save
   */
  static saveThemePreference(themeId) {
    try {
      localStorage.setItem('xmasmm_theme', themeId);
      console.log(`💾 Theme preference saved: ${themeId}`);
    } catch (error) {
      console.warn('⚠️ Could not save theme preference to localStorage:', error);
    }
  }

  /**
   * Load theme preference from localStorage
   * @returns {string|null} Saved theme identifier or null if not found
   */
  static loadThemePreference() {
    try {
      return localStorage.getItem('xmasmm_theme');
    } catch (error) {
      console.warn('⚠️ Could not load theme preference from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear saved theme preference
   */
  static clearThemePreference() {
    try {
      localStorage.removeItem('xmasmm_theme');
      console.log('🗑️ Theme preference cleared');
    } catch (error) {
      console.warn('⚠️ Could not clear theme preference from localStorage:', error);
    }
  }

  /**
   * Get theme info for all available themes
   * @returns {Array<Object>} Array of theme info objects
   */
  static getAllThemeInfo() {
    return ThemeConfig.getAvailableThemes().map(themeId => {
      return ThemeConfig.getThemeInfo(themeId);
    });
  }

  /**
   * Check if all required assets exist for a theme
   * Note: This is a basic check - doesn't actually verify file existence on server
   * @param {string} themeId - Theme identifier to check
   * @returns {Object} {complete: boolean, missingAssets: Array<string>}
   */
  static checkThemeAssets(themeId) {
    const theme = ThemeConfig.themes[themeId];
    if (!theme) {
      return { complete: false, missingAssets: ['Theme not found'] };
    }

    const missingAssets = [];

    // Check element assets (we'll assume they're missing if assetBase is not defined)
    theme.elements.forEach(element => {
      if (!element.assetBase) {
        missingAssets.push(`Element asset: ${element.displayName}`);
      }
    });

    // Check feedback assets
    if (!theme.feedback.perfect.assetBase) {
      missingAssets.push('Feedback asset: perfect');
    }
    if (!theme.feedback.close.assetBase) {
      missingAssets.push('Feedback asset: close');
    }

    return {
      complete: missingAssets.length === 0,
      missingAssets: missingAssets
    };
  }

  /**
   * Get a preview of theme colors (useful for theme selection UI)
   * @param {string} themeId - Theme identifier
   * @returns {Object|null} Color preview object or null if theme not found
   */
  static getThemeColorPreview(themeId) {
    const theme = ThemeConfig.themes[themeId];
    if (!theme) return null;

    return {
      primary: theme.colors.primary.bg,
      accent: theme.colors.accent.bg,
      danger: theme.colors.danger.bg,
      background: theme.backgrounds.traditional.top
    };
  }

  /**
   * Emit a custom event when theme changes (for UI updates)
   * @param {string} themeId - New theme identifier
   */
  static emitThemeChangeEvent(themeId) {
    const event = new CustomEvent('themeChanged', {
      detail: {
        themeId: themeId,
        theme: ThemeConfig.getCurrentTheme()
      }
    });
    window.dispatchEvent(event);
    console.log(`📢 Theme change event emitted: ${themeId}`);
  }

  /**
   * Switch theme with scene reload support
   * Useful for switching themes during gameplay
   * @param {Phaser.Scene} scene - Current Phaser scene
   * @param {string} themeId - Theme identifier to switch to
   */
  static switchThemeWithReload(scene, themeId) {
    if (!ThemeConfig.themes[themeId]) {
      console.error(`❌ Theme '${themeId}' not found`);
      return;
    }

    // Switch theme
    this.switchTheme(themeId, true);

    // Emit event for UI updates
    this.emitThemeChangeEvent(themeId);

    // Restart current scene to reload assets
    console.log(`🔄 Reloading scene with new theme: ${themeId}`);
    scene.scene.restart();
  }

  /**
   * Get readable theme name for display
   * @param {string} themeId - Theme identifier
   * @returns {string} Display name or 'Unknown Theme'
   */
  static getThemeDisplayName(themeId) {
    const info = ThemeConfig.getThemeInfo(themeId);
    return info ? info.name : 'Unknown Theme';
  }
}

// Expose globally (project uses dynamic script loader, not ES module imports)
window.ThemeManager = ThemeManager;
