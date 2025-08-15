// BackgroundManager.js - Centralized Christmas background creation utility
// Follows Phaser.js best practices for reusable graphics generation

class BackgroundManager {
  /**
   * Creates professional Christmas gradient background with family-friendly theme variants
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {number} width - Background width
   * @param {number} height - Background height
   * @param {string} textureKey - Unique texture key for this scene
   * @param {string} theme - 'traditional', 'festive', 'winter', or 'warm'
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
    
    // Family-friendly Christmas theme color palettes
    const christmasThemes = {
      traditional: {
        top: '#0d3820',      // Deep forest green (original)
        bottom: '#051610'    // Very dark green (original)
      },
      festive: {
        top: '#1e4d3f',      // Rich emerald green
        bottom: '#0a2817'    // Deep emerald
      },
      winter: {
        top: '#2C4F6B',      // Icy blue-green
        bottom: '#1A3445'    // Deep winter blue
      },
      warm: {
        top: '#8B4513',      // Warm Christmas brown
        bottom: '#5D2F0A'    // Deep cozy brown
      }
    };
    
    const selectedTheme = christmasThemes[theme] || christmasThemes.traditional;
    
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
   * Complete Christmas background setup (gradient + snowflakes)
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {string} scenePrefix - Unique prefix for texture keys (e.g., 'mainmenu', 'game')
   * @param {Object} options - Optional animation settings
   * @returns {Object} Object containing background and overlay references
   */
  static setupChristmasBackground(scene, scenePrefix = 'scene', options = {}) {
    const { width, height } = scene.cameras.main;
    
    const background = this.createChristmasGradientBackground(
      scene, 
      width, 
      height, 
      `christmas_bg_${scenePrefix}`
    );
    
    // Choose overlay type based on options
    const overlay = options.enhanced ? 
      this.createEnhancedSnowflakeOverlay(scene, width, height, `snowflake_${scenePrefix}`) :
      this.createSnowflakeOverlay(scene, width, height, `snowflake_${scenePrefix}`);
    
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
      count: 25,
      speed: 'medium',
      intensity: 'magical'
    });
  }
   static setupBlizzardChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { 
      enhanced: true, 
      animated: true, 
      count: 45,
      speed: 'fast',
      intensity: 'magical'
    });
  }

  static setupGentleChristmas(scene, scenePrefix) {
    return this.setupChristmasBackground(scene, scenePrefix, { 
      enhanced: true, 
      animated: true, 
      count: 15,
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
    
    // Add animated snowflakes for magical effect
    const animatedSnowflakes = this.createMagicalSnowflakes(scene, {
      count: options.snowflakeCount || 30,
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
      const size = Math.random() * 3 + 0.5; // Varied sizes (0.5-3.5px)
      const opacity = Math.random() * 0.12 + 0.03; // Varied opacity (3-15%)
      
      // Create snowflakes with different opacities for depth
      snowGraphics.fillStyle(0xffffff, opacity);
      snowGraphics.fillCircle(x, y, size);
      
      // Add some star-shaped snowflakes for variety
      if (Math.random() < 0.1) { // 10% chance for star shapes
        this.drawSnowflakeShape(snowGraphics, x, y, size, opacity);
      }
      
      // Add family-friendly golden sparkles for magical atmosphere (5% chance)
      if (Math.random() < 0.05) {
        const sparkleSize = Math.random() * 1.5 + 0.3; // Smaller sparkles (0.3-1.8px)
        const sparkleOpacity = Math.random() * 0.08 + 0.02; // Subtle sparkles (2-10%)
        snowGraphics.fillStyle(0xffd700, sparkleOpacity); // Golden color
        snowGraphics.fillCircle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, sparkleSize);
      }
    }
    
    snowGraphics.generateTexture(textureKey, width, height);
    snowGraphics.destroy();
    
    return scene.add.image(width / 2, height / 2, textureKey)
      .setDepth(GameUtils.getDepthLayers().BACKGROUND + 0.1);
  }

  /**
   * Creates magical animated snowflakes with realistic physics
   * @param {Phaser.Scene} scene - The Phaser scene instance
   * @param {Object} options - Animation configuration
   * @returns {Phaser.GameObjects.Group} Group containing animated snowflakes
   */
  static createMagicalSnowflakes(scene, options = {}) {
    const { width, height } = scene.cameras.main;
    const count = options.count || 30;
    const speed = options.speed || 'medium';
    const intensity = options.intensity || 'normal';
    
    const snowflakeGroup = scene.add.group();
    
    // Speed configurations
    const speedConfigs = {
      slow: { fallSpeed: 0.3, swaySpeed: 0.5, swayAmount: 15 },
      medium: { fallSpeed: 0.6, swaySpeed: 0.8, swayAmount: 25 },
      fast: { fallSpeed: 1.0, swaySpeed: 1.2, swayAmount: 35 }
    };
    
    const config = speedConfigs[speed] || speedConfigs.medium;
    
    for (let i = 0; i < count; i++) {
      // Random starting positions (some start above screen)
      const x = Math.random() * (width + 100) - 50;
      const y = Math.random() * height - Math.random() * 200;
      const size = Math.random() * 2.5 + 0.5; // 0.5-3px
      const opacity = Math.random() * 0.4 + 0.1; // 10-50% opacity
      
      // Create snowflake with random characteristics
      const snowflake = scene.add.circle(x, y, size, 0xffffff, opacity);
      
      // Store original position for reset
      snowflake.startX = x;
      snowflake.resetY = -20;
      snowflake.fallSpeed = config.fallSpeed * (0.7 + Math.random() * 0.6); // Vary individual speeds
      snowflake.swayAmount = config.swayAmount * (0.5 + Math.random() * 1.0);
      snowflake.swayPhase = Math.random() * Math.PI * 2; // Random phase offset
      
      // Falling animation with realistic sway
      const fallTween = scene.tweens.add({
        targets: snowflake,
        y: height + 50,
        duration: (height + 70) / snowflake.fallSpeed * 100, // Adjust duration based on speed
        ease: 'Linear',
        repeat: -1,
        delay: Math.random() * 3000, // Stagger start times
        onRepeat: () => {
          // Reset position with slight randomization
          snowflake.x = snowflake.startX + (Math.random() - 0.5) * 100;
          snowflake.y = snowflake.resetY;
        }
      });
      
      // Side-to-side sway animation
      const swayTween = scene.tweens.add({
        targets: snowflake,
        x: `+=${snowflake.swayAmount}`,
        duration: 2000 + Math.random() * 1000, // 2-3 second cycles
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2000
      });
      
      // Subtle rotation for more natural movement
      if (size > 1.5) { // Only larger snowflakes get rotation
        scene.tweens.add({
          targets: snowflake,
          rotation: Math.PI * 2,
          duration: 8000 + Math.random() * 4000, // 8-12 second rotations
          ease: 'Linear',
          repeat: -1,
          delay: Math.random() * 1000
        });
      }
      
      // Intensity-based alpha breathing for sparkle effect
      if (intensity === 'magical') {
        scene.tweens.add({
          targets: snowflake,
          alpha: opacity * 1.5,
          duration: 1500 + Math.random() * 1000,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 3000
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
    graphics.lineStyle(0.5, 0xffffff, opacity * 0.8);
    
    // Draw 6-pointed star shape
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      const x2 = x + Math.cos(angle) * size * 0.3;
      const y2 = y + Math.sin(angle) * size * 0.3;
      
      graphics.lineBetween(x, y, x1, y1);
      graphics.lineBetween(x2, y2, x + Math.cos(angle + Math.PI/6) * size * 0.6, y + Math.sin(angle + Math.PI/6) * size * 0.6);
    }
  }

  /**
   * Quick helper for family-friendly theme selection
   * @returns {Array} Available theme names for easy selection
   */
  static getAvailableThemes() {
    return ['traditional', 'festive', 'winter', 'warm'];
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
