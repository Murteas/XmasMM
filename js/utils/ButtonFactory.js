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
      iconText.x = -totalLabelWidth / 2 + iconText.width / 2;
      labelText.x = iconText.x + iconText.width / 2 + spacer + labelText.width / 2;
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
    const applyState = (state) => {
      // Use subtle tinting instead of tintFill to preserve custom graphics
      if (state === 'hover') {
        bg.setTint(0xdddddd); // Slight darkening for hover
      } else if (state === 'active') {
        bg.setTint(0xbbbbbb); // More darkening for active
      } else {
        bg.clearTint(); // Normal state shows original graphics
      }
      labelText.setColor(palette.fg);
      if (iconText) iconText.setColor(palette.fg);
    };

    const attach = (target) => {
      target.on('pointerover', () => { if (!container.disabled) applyState('hover'); });
      target.on('pointerout', () => { if (!container.disabled) { applyState('normal'); container.setScale(1); container.alpha = 1; } });
      target.on('pointerdown', () => { if (!container.disabled) { applyState('active'); scene.tweens.add({ targets: container, scale: 0.94, duration: 60 }); } });
      target.on('pointerup', () => { if (!container.disabled) { applyState('hover'); scene.tweens.add({ targets: container, scale: 1, duration: 100, ease: 'Back.easeOut' }); if (options.onClick) options.onClick(); } });
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
    if (shadowAlpha > 0) { g.fillStyle(shadowColor, shadowAlpha); g.fillRoundedRect(0, shadowOffsetY, width, height, radius); }
    const baseColorInt = Phaser.Display.Color.HexStringToColor(colorHex).color;
    
    if (opts.gradient) {
      // Elegant Christmas gradient with sophisticated color stops
      const base = Phaser.Display.Color.IntegerToColor(baseColorInt);
      const colorStops = this._getElegantColorStops(base);
      
      // Multi-stop gradient for premium feel
      for (let i = 0; i < height; i++) {
        const t = i / height;
        let stopIndex = Math.floor(t * 3);
        let localT = (t * 3) - stopIndex;
        if (stopIndex >= 3) { stopIndex = 2; localT = 1; }
        
        const color1 = colorStops[stopIndex];
        const color2 = colorStops[stopIndex + 1] || colorStops[stopIndex];
        
        const r = Math.round(Phaser.Math.Linear(color1.r, color2.r, localT));
        const gCh = Math.round(Phaser.Math.Linear(color1.g, color2.g, localT));
        const b = Math.round(Phaser.Math.Linear(color1.b, color2.b, localT));
        
        g.fillStyle(Phaser.Display.Color.GetColor(r, gCh, b), 1);
        g.fillRect(1, i, width - 2, 1);
      }
    } else {
      // Fallback solid color
      g.fillStyle(baseColorInt, 1);
      g.fillRoundedRect(0, 0, width, height, radius);
    }
    
    if (opts.pattern === 'candycane') {
      // Bigger candy cane stripes (12px wide, more visible)
      // Constrain coordinates to stay within button bounds
      const stripeWidth = 12;
      const spacing = stripeWidth * 2;
      
      // White stripes (more opaque)
      g.lineStyle(stripeWidth, 0xffffff, 0.4);
      for (let x = 0; x < width; x += spacing) { 
        g.beginPath(); 
        g.moveTo(Math.max(0, x), 0); 
        g.lineTo(Math.min(width, x + height), height); 
        g.strokePath(); 
      }
      
      // Red stripes (more opaque)
      g.lineStyle(stripeWidth, 0xff0000, 0.45);
      for (let x = stripeWidth; x < width; x += spacing) { 
        g.beginPath(); 
        g.moveTo(Math.max(0, x), 0); 
        g.lineTo(Math.min(width, x + height), height); 
        g.strokePath(); 
      }
    }
    
    if (opts.border) {
      // Elegant gold border with inner glow
      const borderColorInt = Phaser.Display.Color.HexStringToColor(opts.borderColor || '#ffd700').color;
      g.lineStyle(2, borderColorInt, 0.9);
      g.strokeRoundedRect(0, 0, width, height, radius);
      
      // Inner glow for premium feel
      g.lineStyle(1, 0xffffff, 0.3);
      g.strokeRoundedRect(2, 2, width - 4, height - 4, Math.max(0, radius - 2));
    }
    
    if (opts.highlight !== false) {
      // Subtle top highlight
      const highlightHeight = Math.max(4, height * 0.25);
      g.fillStyle(0xffffff, 0.12);
      g.fillRoundedRect(0, 0, width, highlightHeight, { tl: radius, tr: radius, bl: 0, br: 0 });
    }
  }

  static _getElegantColorStops(baseColor) {
    // Create sophisticated Christmas color gradients
    return [
      { r: Math.min(255, baseColor.red + 40), g: Math.min(255, baseColor.green + 40), b: Math.min(255, baseColor.blue + 40) },
      { r: Math.min(255, baseColor.red + 15), g: Math.min(255, baseColor.green + 15), b: Math.min(255, baseColor.blue + 15) },
      { r: baseColor.red, g: baseColor.green, b: baseColor.blue },
      { r: Math.max(0, baseColor.red - 30), g: Math.max(0, baseColor.green - 30), b: Math.max(0, baseColor.blue - 30) }
    ];
  }

  static _generateBackground(scene, variant, palette, cfg, btnWidth, btnHeight, scaleFactor, options) {
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
