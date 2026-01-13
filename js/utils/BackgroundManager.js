// BackgroundManager.js - Centralized Christmas background creation utility
// Follows Phaser.js best practices for reusable graphics generation

class BackgroundManager {
  /**
   * Creates professional Christmas gradient background with family-friendly theme variants
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {number} width - Background width
   * @param {number} height - Background height
   * @param {string} textureKey - Unique texture key for this scene
   * @param {string} theme - 'traditional', 'festive', 'winter', or 'red'
   * @returns {Phaser.GameObjects.Image} The background image object
   */
  static createChristmasGradientBackground(scene, width, height, textureKey = 'christmas_gradient_bg', theme = 'traditional') {
    // Check if texture already exists to avoid regeneration
    if (scene.textures.exists(textureKey)) {
      return scene.add.image(width / 2, height / 2, textureKey)
        .setDepth(GameUtils.getDepthLayers().BACKGROUND);
    }

    // Create graphics object for gradient using Phaser best practices
    const gradientGraphics = scene.make.graphics({});

    // Get background themes from theme configuration
    const backgroundThemes = ThemeConfig.getBackgrounds();

    const selectedTheme = backgroundThemes[theme] || backgroundThemes.traditional;
    
    // Professional Christmas color palette with theme support
    const topColor = Phaser.Display.Color.HexStringToColor(selectedTheme.top);
    const bottomColor = Phaser.Display.Color.HexStringToColor(selectedTheme.bottom);
    
    // Draw smooth vertical gradient using Phaser's color interpolation
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = Math.round(Phaser.Math.Linear(topColor.red, bottomColor.red, t));
      const g = Math.round(Phaser.Math.Linear(topColor.green, bottomColor.green, t));
      const b = Math.round(Phaser.Math.Linear(topColor.blue, bottomColor.blue, t));
      
      gradientGraphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      gradientGraphics.fillRect(0, y, width, 1);
    }
    
    // Generate texture and clean up graphics
    gradientGraphics.generateTexture(textureKey, width, height);
    gradientGraphics.destroy(); // Proper memory management
    
    // Create and return background image
    return scene.add.image(width / 2, height / 2, textureKey)
      .setDepth(GameUtils.getDepthLayers().BACKGROUND);
  }

  /**
   * Creates subtle snowflake overlay for Christmas atmosphere
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {number} width - Overlay width
   * @param {number} height - Overlay height
   * @param {string} textureKey - Unique texture key for this scene
   * @returns {Phaser.GameObjects.Image} The snowflake overlay image object
   */
  static createSnowflakeOverlay(scene, width, height, textureKey = 'snowflake_overlay') {
    // Check if texture already exists to avoid regeneration
    if (scene.textures.exists(textureKey)) {
      return scene.add.image(width / 2, height / 2, textureKey)
        .setDepth(GameUtils.getDepthLayers().BACKGROUND + 0.1);
    }

    // Create subtle snowflake pattern for Christmas atmosphere
    const snowGraphics = scene.make.graphics({});
    
    // Sparse, elegant snowflake distribution
    const snowflakeCount = Math.floor((width * height) / 8000);
    
    for (let i = 0; i < snowflakeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1; // Small, subtle snowflakes (1-3px)
      
      // Very subtle white snowflakes
      snowGraphics.fillStyle(0xffffff, 0.08);
      snowGraphics.fillCircle(x, y, size);
    }
    
    // Generate texture and clean up graphics
    snowGraphics.generateTexture(textureKey, width, height);
    snowGraphics.destroy(); // Proper memory management
    
    // Create and return overlay image
    return scene.add.image(width / 2, height / 2, textureKey)
      .setDepth(GameUtils.getDepthLayers().BACKGROUND + 0.1);
  }

  /**
   * Complete Christmas background setup (gradient + snowflakes) with theme support
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {string} scenePrefix - Unique prefix for texture keys (e.g., 'mainmenu', 'game')
   * @param {Object} options - Optional animation settings and theme
   * @returns {Object} Object containing background and overlay references
   */
  static setupChristmasBackground(scene, scenePrefix = 'scene', options = {}) {
    const { width, height } = scene.cameras.main;
    
    // Get theme from options or scene registry or default to traditional
    const theme = options.theme || 
                 (scene.registry && scene.registry.get('backgroundTheme')) || 
                 'traditional';
    
    const background = this.createChristmasGradientBackground(
      scene, 
      width, 
      height, 
      `christmas_bg_${scenePrefix}_${theme}`,
      theme
    );
    
    // Choose overlay type based on options
    const overlay = options.enhanced ? 
      this.createEnhancedSnowflakeOverlay(scene, width, height, `snowflake_${scenePrefix}_${theme}`) :
      this.createSnowflakeOverlay(scene, width, height, `snowflake_${scenePrefix}_${theme}`);
    
    // Add animated snowflakes if requested
    let animatedSnowflakes = null;
    if (options.animated) {
      animatedSnowflakes = this.createMagicalSnowflakes(scene, options);
    }
    
    return { background, overlay, animatedSnowflakes };
  }

  /**
   * Quick setup methods for different Christmas atmosphere levels
   */
  static setupSubtleChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { enhanced: false, animated: false });
  }

  static setupEnhancedChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { enhanced: true, animated: false });
  }

  static setupMagicalChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { 
      enhanced: true, 
      animated: true, 
      count: 15, // PERFORMANCE: Reduced from 25
      speed: 'medium',
      intensity: 'magical'
    });
  }
   static setupBlizzardChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { 
      enhanced: true, 
      animated: true, 
      count: 20, // PERFORMANCE: Reduced from 45
      speed: 'fast',
      intensity: 'magical'
    });
  }

  static setupGentleChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { 
      enhanced: true, 
      animated: true, 
      count: 10, // PERFORMANCE: Reduced from 15
      speed: 'slow',
      intensity: 'normal'
    });
  }

  /**
   * Enhanced Christmas background with animated snowflakes
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {string} scenePrefix - Unique prefix for texture keys
   * @param {Object} options - Animation options
   * @returns {Object} Object containing background, overlay, and animated snowflakes
   */
  static setupChristmasBackgroundWithAnimation(scene, scenePrefix = 'scene', options = {}) {
    const { width, height } = scene.cameras.main;
    
    const background = this.createChristmasGradientBackground(
      scene, 
      width, 
      height, 
      `christmas_bg_${scenePrefix}`
    );
    
    // Create more dense static snowflake overlay
    const overlay = this.createEnhancedSnowflakeOverlay(
      scene, 
      width, 
      height, 
      `snowflake_${scenePrefix}`
    );
    
    // Add animated snowflakes for magical effect (PERFORMANCE: Reduced default count)
    const animatedSnowflakes = this.createMagicalSnowflakes(scene, {
      count: options.snowflakeCount || 15, // PERFORMANCE: Reduced from 30
      speed: options.snowflakeSpeed || 'medium',
      intensity: options.intensity || 'normal'
    });
    
    return { background, overlay, animatedSnowflakes };
  }

  /**
   * Creates enhanced snowflake overlay with more density and variety
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {number} width - Overlay width
   * @param {number} height - Overlay height
   * @param {string} textureKey - Unique texture key for this scene
   * @returns {Phaser.GameObjects.Image} The enhanced snowflake overlay
   */
  static createEnhancedSnowflakeOverlay(scene, width, height, textureKey = 'enhanced_snowflake_overlay') {
    if (scene.textures.exists(textureKey)) {
      return scene.add.image(width / 2, height / 2, textureKey)
        .setDepth(GameUtils.getDepthLayers().BACKGROUND + 0.1);
    }

    const snowGraphics = scene.make.graphics({});
    
    // More dense snowflake distribution for richer atmosphere
    const snowflakeCount = Math.floor((width * height) / 4000); // Doubled density
    
    for (let i = 0; i < snowflakeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3.5 + 0.8; // Increased sizes (0.8-4.3px)
      const opacity = Math.random() * 0.12 + 0.03; // Varied opacity (3-15%)
      
      // Create snowflakes with different opacities for depth
      snowGraphics.fillStyle(0xffffff, opacity);
      snowGraphics.fillCircle(x, y, size);
      
      // Add more star-shaped snowflakes for variety (doubled from 15% to 30%)
      if (Math.random() < 0.30) { // Doubled star frequency!
        this.drawSnowflakeShape(snowGraphics, x, y, Math.max(size * 1.5, 2), Math.min(opacity * 1.5, 0.3));
      }
      
      // Add family-friendly golden sparkles for magical atmosphere (more visible)
      if (Math.random() < 0.08) { // Increased to 8% chance
        const sparkleSize = Math.random() * 2.5 + 1; // Larger sparkles (1-3.5px)
        const sparkleOpacity = Math.random() * 0.15 + 0.05; // More visible sparkles (5-20%)
        snowGraphics.fillStyle(0xffd700, sparkleOpacity); // Golden color
        snowGraphics.fillCircle(x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 6, sparkleSize);
      }
    }
    
    snowGraphics.generateTexture(textureKey, width, height);
    snowGraphics.destroy();
    
    return scene.add.image(width / 2, height / 2, textureKey)
      .setDepth(GameUtils.getDepthLayers().BACKGROUND + 0.1);
  }

  /**
   * Creates magical animated snowflakes with realistic physics (PERFORMANCE OPTIMIZED)
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {Object} options - Animation configuration
   * @returns {Phaser.GameObjects.Group} Group containing animated snowflakes
   */
  static createMagicalSnowflakes(scene, options = {}) {
    const { width, height } = scene.cameras.main;
    const count = Math.min(options.count || 20, 20); // PERFORMANCE: Cap at 20 snowflakes max
    const speed = options.speed || 'medium';
    const intensity = options.intensity || 'normal';
    
    const snowflakeGroup = scene.add.group();
    
    // Speed configurations (PERFORMANCE: Reduced complexity)
    const speedConfigs = {
      slow: { fallSpeed: 0.4, swaySpeed: 0.6, swayAmount: 20 },
      medium: { fallSpeed: 0.8, swaySpeed: 1.0, swayAmount: 30 },
      fast: { fallSpeed: 1.2, swaySpeed: 1.4, swayAmount: 40 }
    };
    
    const config = speedConfigs[speed] || speedConfigs.medium;
    
    for (let i = 0; i < count; i++) {
      // Random starting positions (some start above screen)
      const x = Math.random() * (width + 100) - 50;
      const y = Math.random() * height - Math.random() * 200;
      const size = Math.random() * 2.5 + 1; // Slightly smaller for performance
      const opacity = Math.random() * 0.3 + 0.1; // 10-40% opacity
      
      // Create snowflake with random characteristics
      const snowflake = scene.add.circle(x, y, size, 0xffffff, opacity);
      
      // PERFORMANCE: Reduce golden sparkles (only 5% instead of 10%)
      if (Math.random() < 0.05) {
        const sparkleX = x + (Math.random() - 0.5) * 30;
        const sparkleY = y + (Math.random() - 0.5) * 30;
        const sparkleSize = Math.random() * 1.2 + 0.5;
        const sparkleOpacity = Math.random() * 0.25 + 0.1;
        const sparkle = scene.add.circle(sparkleX, sparkleY, sparkleSize, 0xffd700, sparkleOpacity);
        
        // Simple sparkle animation (no sway, just fall)
        sparkle.startX = sparkleX;
        sparkle.resetY = -20;
        sparkle.fallSpeed = config.fallSpeed * 0.9;
        snowflakeGroup.add(sparkle);
        
        // Single tween for sparkles
        scene.tweens.add({
          targets: sparkle,
          y: height + 50,
          duration: (height + 70) / sparkle.fallSpeed * 80,
          ease: 'Linear',
          repeat: -1,
          delay: Math.random() * 2000,
          onRepeat: () => {
            sparkle.x = sparkle.startX + (Math.random() - 0.5) * 40;
            sparkle.y = sparkle.resetY;
          }
        });
      }
      
      // Store original position for reset
      snowflake.startX = x;
      snowflake.resetY = -20;
      snowflake.fallSpeed = config.fallSpeed * (0.8 + Math.random() * 0.4);
      snowflake.swayAmount = config.swayAmount * (0.6 + Math.random() * 0.8);
      
      // PERFORMANCE: Combined fall + sway in single tween using complex value
      scene.tweens.add({
        targets: snowflake,
        y: height + 50,
        x: {
          from: snowflake.x,
          to: snowflake.x + (Math.random() - 0.5) * snowflake.swayAmount * 2
        },
        duration: (height + 70) / snowflake.fallSpeed * 80,
        ease: 'Linear',
        repeat: -1,
        delay: Math.random() * 2000,
        onRepeat: () => {
          // Reset position with slight randomization
          snowflake.x = snowflake.startX + (Math.random() - 0.5) * 60;
          snowflake.y = snowflake.resetY;
        }
      });
      
      // PERFORMANCE: Only add rotation to larger snowflakes, simpler animation
      if (size > 1.8 && Math.random() < 0.4) { // Only 40% of large snowflakes get rotation
        scene.tweens.add({
          targets: snowflake,
          rotation: Math.PI * (Math.random() > 0.5 ? 2 : -2),
          duration: 10000 + Math.random() * 5000, // Slower, less frequent
          ease: 'Linear',
          repeat: -1,
          delay: Math.random() * 2000
        });
      }
      
      // PERFORMANCE: Simplified intensity effect (no alpha breathing for all)
      if (intensity === 'magical' && Math.random() < 0.3) { // Only 30% get breathing effect
        scene.tweens.add({
          targets: snowflake,
          alpha: opacity * 1.3,
          duration: 2000 + Math.random() * 1000,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 4000
        });
      }
      
      snowflakeGroup.add(snowflake);
    }
    
    snowflakeGroup.setDepth(GameUtils.getDepthLayers().BACKGROUND + 0.2);
    return snowflakeGroup;
  }

  /**
   * Draws decorative snowflake shapes (6-pointed stars)
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   * @param {number} x - Center X position
   * @param {number} y - Center Y position
   * @param {number} size - Size of the snowflake
   * @param {number} opacity - Opacity of the snowflake
   */
  static drawSnowflakeShape(graphics, x, y, size, opacity) {
    graphics.lineStyle(1.2, 0xffffff, Math.min(opacity, 0.4)); // Thicker lines, capped opacity
    
    // Draw 6-pointed star shape
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      const x2 = x + Math.cos(angle) * size * 0.3;
      const y2 = y + Math.sin(angle) * size * 0.3;
      
      // Main spokes
      graphics.lineBetween(x, y, x1, y1);
      // Cross pieces for more definition
      graphics.lineBetween(x2, y2, x + Math.cos(angle + Math.PI/6) * size * 0.6, y + Math.sin(angle + Math.PI/6) * size * 0.6);
    }
  }

  /**
   * Quick helper for family-friendly theme selection
   * @returns {Array} Available theme names for easy selection
   */
  static getAvailableThemes() {
    return ['traditional', 'festive', 'winter', 'red'];
  }

  /**
   * Get a random theme for variety in family gameplay sessions
   * @returns {string} Random theme name
   */
  static getRandomTheme() {
    const themes = this.getAvailableThemes();
    return themes[Math.floor(Math.random() * themes.length)];
  }
}

// Expose globally for project's dynamic loading system
window.BackgroundManager = BackgroundManager;
