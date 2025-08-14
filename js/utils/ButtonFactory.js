// ButtonFactory.js - central festive button creation utility
// Uses LayoutConfig.BUTTON_STYLE tokens. Produces a container with background + label (and optional emoji).
// Keeps styling code-driven (no external image assets).

class ButtonFactory {
  static createButton(scene, x, y, label, variant = 'primary', options = {}) {
    const cfg = LayoutConfig.BUTTON_STYLE;
    const scaleFactor = cfg.SMALL_SCREEN_SCALE(scene.cameras.main.width);
    const palette = this._resolveVariantColors(variant, cfg);
    const paddingX = (options.paddingX ?? cfg.PADDING_X) * scaleFactor;
    const paddingY = (options.paddingY ?? cfg.PADDING_Y) * scaleFactor;
    const font = options.font || cfg.FONT;

    const container = scene.add.container(x, y);

    // Enhanced text styling for mobile clarity (Option 2.5)
    const textStyle = { 
      font, 
      fill: palette.fg, 
      align: 'center',
      stroke: '#2d5a32', // Dark Christmas green for contrast
      strokeThickness: 2
    };
    const labelText = scene.add.text(0, 0, label, textStyle).setOrigin(0.5);
    
    let iconText = null;
    if (options.icon) {
      iconText = scene.add.text(0, 0, options.icon, textStyle).setOrigin(0.5);
    }
    const spacer = options.icon ? (options.iconSpacing || 8) : 0;
    const totalLabelWidth = labelText.width + (iconText ? iconText.width + spacer : 0);
    let btnWidth = Math.round(totalLabelWidth + paddingX * 2);
    let btnHeight = Math.round(Math.max(labelText.height, iconText ? iconText.height : 0) + paddingY * 2);

    const { bg, texKey } = this._generateBackground(scene, variant, palette, cfg, btnWidth, btnHeight, scaleFactor, options);

    if (iconText) {
      // Fix positioning calculation - place icon and text properly within container
      const contentWidth = iconText.width + spacer + labelText.width;
      const startX = -contentWidth / 2;
      
      iconText.x = startX + iconText.width / 2;
      labelText.x = startX + iconText.width + spacer + labelText.width / 2;
    }
    container.add(bg);
    if (iconText) container.add(iconText);
    container.add(labelText);

    container.labelText = labelText;
    container.setLabel = (newText) => {
      if (!container.labelText) return;
      const oldWidth = container.width;
      container.labelText.setText(newText);
      const newTotalLabelWidth = container.labelText.width + (iconText ? iconText.width + spacer : 0);
      const newBtnWidth = Math.round(newTotalLabelWidth + paddingX * 2);
      const newBtnHeight = Math.round(Math.max(container.labelText.height, iconText ? iconText.height : 0) + paddingY * 2);
      
      // Fix positioning when text changes
      if (iconText) {
        const contentWidth = iconText.width + spacer + container.labelText.width;
        const startX = -contentWidth / 2;
        
        iconText.x = startX + iconText.width / 2;
        container.labelText.x = startX + iconText.width + spacer + container.labelText.width / 2;
      }
      
      if (Math.abs(newBtnWidth - oldWidth) > 6) {
        // Only generate the texture, don't create a new image object
        const newTexKey = this._generateBackgroundTexture(scene, variant, palette, cfg, newBtnWidth, newBtnHeight, scaleFactor, options);
        bg.setTexture(newTexKey);
      }
      container.setSize(newBtnWidth, newBtnHeight).setInteractive({ useHandCursor: true });
      if (container._selectionOutline) {
        container._selectionOutline.setSize(newBtnWidth + 8, newBtnHeight + 8);
      }
    };

    if (options.selectable) {
      const outline = scene.add.rectangle(0, 0, btnWidth + 8, btnHeight + 8)
        .setStrokeStyle(3, Phaser.Display.Color.HexStringToColor(cfg.BORDER_GOLD || '#ffd700').color)
        .setOrigin(0.5)
        .setVisible(!!options.selected);
      container.addAt(outline, 0);
      container._selectionOutline = outline;
      container.setSelected = (state) => outline.setVisible(state);
    }

    container.setSize(btnWidth, btnHeight).setInteractive({ useHandCursor: true });
    
    // Enhanced interactive states using Phaser.js best practices
    const applyState = (state) => {
      if (state === 'hover') {
        // Subtle brightening for hover using Phaser's tint system
        bg.setTint(0xf0f0f0);
        labelText.setColor(palette.fg);
        if (iconText) iconText.setColor(palette.fg);
      } else if (state === 'active') {
        // Darker tint for pressed state
        bg.setTint(0xcccccc);
        labelText.setColor(palette.fg);
        if (iconText) iconText.setColor(palette.fg);
      } else {
        // Normal state - clear all effects
        bg.clearTint();
        labelText.setColor(palette.fg);
        if (iconText) iconText.setColor(palette.fg);
      }
    };

    // Professional button interaction using Phaser's tween system
    const attach = (target) => {
      target.on('pointerover', () => { 
        if (!container.disabled) {
          applyState('hover');
          // Subtle scale increase on hover
          scene.tweens.add({ 
            targets: container, 
            scale: 1.02, 
            duration: 100, 
            ease: 'Power2' 
          });
        }
      });
      
      target.on('pointerout', () => { 
        if (!container.disabled) { 
          applyState('normal'); 
          // Return to normal scale
          scene.tweens.add({ 
            targets: container, 
            scale: 1, 
            duration: 100, 
            ease: 'Power2' 
          });
        } 
      });
      
      target.on('pointerdown', () => { 
        if (!container.disabled) { 
          applyState('active'); 
          // Satisfying press feedback
          scene.tweens.add({ 
            targets: container, 
            scale: 0.96, 
            duration: 60, 
            ease: 'Power2' 
          }); 
        } 
      });
      
      target.on('pointerup', () => { 
        if (!container.disabled) { 
          applyState('hover'); 
          // Smooth bounce back with elastic easing
          scene.tweens.add({ 
            targets: container, 
            scale: 1.02, 
            duration: 120, 
            ease: 'Back.easeOut' 
          }); 
          if (options.onClick) options.onClick(); 
        } 
      });
    };
    attach(container); attach(bg);

    container.disableButton = () => {
      container.disabled = true;
      bg.clearTint();
      bg.setTintFill(Phaser.Display.Color.HexStringToColor(cfg.DISABLED_BG).color);
      labelText.setColor(cfg.DISABLED_FG);
      if (iconText) iconText.setColor(cfg.DISABLED_FG);
      container.alpha = 0.85;
    };
    container.enableButton = () => { container.disabled = false; applyState('normal'); container.alpha = 1; };
    applyState('normal');
    return container;
  }

  static _resolveVariantColors(variant, cfg) {
    switch (variant) {
      case 'accent':
        return { bg: cfg.ACCENT_BG, bgHover: cfg.ACCENT_BG_HOVER, bgActive: cfg.ACCENT_BG_ACTIVE, fg: cfg.ACCENT_FG, shadow: 0x222222 };
      case 'danger':
        return { bg: cfg.DANGER_BG, bgHover: cfg.DANGER_BG_HOVER, bgActive: cfg.DANGER_BG_ACTIVE, fg: cfg.DANGER_FG, shadow: 0x000000 };
      case 'primary':
      default:
        return { bg: cfg.PRIMARY_BG, bgHover: cfg.PRIMARY_BG_HOVER, bgActive: cfg.PRIMARY_BG_ACTIVE, fg: cfg.PRIMARY_FG, shadow: 0x000000 };
    }
  }

  static _drawButtonBackground(g, width, height, radius, colorHex, shadowColor, shadowOffsetY, shadowAlpha, opts = {}) {
    // Professional Christmas button design using Phaser.js best practices
    
    // Shadow layer
    if (shadowAlpha > 0) { 
      g.fillStyle(shadowColor, shadowAlpha); 
      g.fillRoundedRect(0, shadowOffsetY, width, height, radius); 
    }
    
    const baseColorInt = Phaser.Display.Color.HexStringToColor(colorHex).color;
    
    if (opts.gradient) {
      // Enhanced Christmas gradient using Phaser's color interpolation
      const base = Phaser.Display.Color.IntegerToColor(baseColorInt);
      const colorStops = this._getChristmasColorStops(base);
      
      // Create smooth vertical gradient
      for (let i = 0; i < height; i++) {
        const t = i / height;
        let stopIndex = Math.floor(t * (colorStops.length - 1));
        let localT = (t * (colorStops.length - 1)) - stopIndex;
        
        if (stopIndex >= colorStops.length - 1) { 
          stopIndex = colorStops.length - 2; 
          localT = 1; 
        }
        
        const color1 = colorStops[stopIndex];
        const color2 = colorStops[stopIndex + 1];
        
        const r = Math.round(Phaser.Math.Linear(color1.r, color2.r, localT));
        const gCh = Math.round(Phaser.Math.Linear(color1.g, color2.g, localT));
        const b = Math.round(Phaser.Math.Linear(color1.b, color2.b, localT));
        
        g.fillStyle(Phaser.Display.Color.GetColor(r, gCh, b), 1);
        g.fillRect(0, i, width, 1);
      }
    } else {
      // Solid color fallback
      g.fillStyle(baseColorInt, 1);
      g.fillRoundedRect(0, 0, width, height, radius);
    }
    
    // Professional border with Christmas styling
    if (opts.border) {
      const borderColorInt = Phaser.Display.Color.HexStringToColor(opts.borderColor || '#ffd700').color;
      g.lineStyle(2, borderColorInt, 0.8);
      g.strokeRoundedRect(1, 1, width - 2, height - 2, radius);
    }
    
    // Subtle top highlight for depth (Phaser best practice for button lighting)
    if (opts.highlight !== false) {
      const highlightHeight = Math.max(3, height * 0.3);
      g.fillStyle(0xffffff, 0.15);
      g.fillRoundedRect(2, 2, width - 4, highlightHeight, { 
        tl: Math.max(0, radius - 2), 
        tr: Math.max(0, radius - 2), 
        bl: 0, 
        br: 0 
      });
    }
    
    // Subtle inner glow for premium feel
    if (opts.gradient) {
      g.lineStyle(1, 0xffffff, 0.2);
      g.strokeRoundedRect(1, 1, width - 2, height - 2, Math.max(0, radius - 1));
    }
  }

  static _getChristmasColorStops(baseColor) {
    // Professional Christmas gradients using Phaser.js color science
    // Creates depth and visual interest without being distracting
    return [
      { 
        r: Math.min(255, baseColor.red + 35), 
        g: Math.min(255, baseColor.green + 35), 
        b: Math.min(255, baseColor.blue + 35) 
      }, // Lighter top
      { 
        r: Math.min(255, baseColor.red + 10), 
        g: Math.min(255, baseColor.green + 10), 
        b: Math.min(255, baseColor.blue + 10) 
      }, // Slightly lighter
      { 
        r: baseColor.red, 
        g: baseColor.green, 
        b: baseColor.blue 
      }, // Base color
      { 
        r: Math.max(0, baseColor.red - 25), 
        g: Math.max(0, baseColor.green - 25), 
        b: Math.max(0, baseColor.blue - 25) 
      } // Darker bottom
    ];
  }

  static _generateBackground(scene, variant, palette, cfg, btnWidth, btnHeight, scaleFactor, options) {
    // Create graphics object using Phaser best practices
    const g = scene.make.graphics({});
    
    const stylingOpts = {
      gradient: options.gradient !== false, // Default to gradient for modern look
      border: options.border !== false,    // Default to border for definition
      borderColor: options.borderColor || (variant === 'primary' ? '#ffd700' : variant === 'accent' ? '#0F4C36' : '#ffd700'),
      highlight: options.highlight !== false // Default to highlight for depth
    };
    
    this._drawButtonBackground(g, btnWidth, btnHeight, cfg.RADIUS * scaleFactor, palette.bg, palette.shadow, cfg.SHADOW_OFFSET_Y * scaleFactor, cfg.SHADOW_ALPHA, stylingOpts);
    
    // Generate unique texture key using Phaser's built-in utilities
    const texKey = `btn_${variant}_${btnWidth}_${btnHeight}_${scene.time.now}`;
    g.generateTexture(texKey, btnWidth, btnHeight);
    g.destroy(); // Clean up graphics object
    
    const bg = scene.add.image(0, 0, texKey).setOrigin(0.5);
    return { bg, texKey };
  }

  static _generateBackgroundTexture(scene, variant, palette, cfg, btnWidth, btnHeight, scaleFactor, options) {
    // Create graphics object WITHOUT adding to scene display list
    const g = scene.make.graphics({});
    
    const stylingOpts = {
      gradient: options.gradient !== false,
      pattern: options.pattern || (variant === 'danger' && options.pattern !== 'none' ? 'candycane' : null),
      border: options.border !== false,
      borderColor: options.borderColor || (variant === 'primary' ? (cfg.BORDER_GOLD || '#ffd700') : variant === 'danger' ? (cfg.BORDER_GOLD || '#ffd700') : '#0d5016')
    };
    
    this._drawButtonBackground(g, btnWidth, btnHeight, cfg.RADIUS * scaleFactor, palette.bg, palette.shadow, cfg.SHADOW_OFFSET_Y * scaleFactor, cfg.SHADOW_ALPHA, stylingOpts);
    const texKey = `btn_${variant}_${btnWidth}_${btnHeight}_${Math.random().toString(36).slice(2,7)}`;
    g.generateTexture(texKey, btnWidth, btnHeight);
    g.destroy();
    // Return only the texture key, don't create an image object
    return texKey;
  }
}

window.ButtonFactory = ButtonFactory;
