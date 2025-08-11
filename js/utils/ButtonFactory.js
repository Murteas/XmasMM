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

    const labelText = scene.add.text(0, 0, label, { font, fill: palette.fg, align: 'center' }).setOrigin(0.5);
    let iconText = null;
    if (options.icon) {
      iconText = scene.add.text(0, 0, options.icon, { font, fill: palette.fg }).setOrigin(0.5);
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
        const newBg = this._generateBackground(scene, variant, palette, cfg, newBtnWidth, newBtnHeight, scaleFactor, options);
        bg.setTexture(newBg.texKey);
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
      let bgColor = palette.bg;
      if (state === 'hover') bgColor = palette.bgHover; else if (state === 'active') bgColor = palette.bgActive;
      bg.setTintFill(Phaser.Display.Color.HexStringToColor(bgColor).color);
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
    g.fillStyle(baseColorInt, 1);
    g.fillRoundedRect(0, 0, width, height, radius);
    if (opts.gradient) {
      // Overlay a subtle vertical gradient inside padding (no repeated rounded corners to prevent artifacts)
      const base = Phaser.Display.Color.IntegerToColor(baseColorInt);
      const lighter = { r: Math.min(255, base.red + 35), g: Math.min(255, base.green + 35), b: Math.min(255, base.blue + 35) };
      const darker = { r: Math.max(0, base.red - 45), g: Math.max(0, base.green - 45), b: Math.max(0, base.blue - 45) };
      const steps = 24;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const r = Phaser.Math.Linear(lighter.r, darker.r, t);
        const gCh = Phaser.Math.Linear(lighter.g, darker.g, t);
        const b = Phaser.Math.Linear(lighter.b, darker.b, t);
        g.fillStyle(Phaser.Display.Color.GetColor(r, gCh, b), 0.65);
        const sliceY = (height / steps) * i;
        g.fillRect(1, sliceY, width - 2, height / steps + 1); // inset 1px to avoid edge bleed
      }
    }
    if (opts.pattern === 'candycane') {
      const stripeWidth = 6;
      // Constrain stripe drawing to button bounds to prevent artifacts
      g.lineStyle(stripeWidth, 0xffffff, 0.22);
      for (let x = 0; x < width + height; x += stripeWidth * 2) { 
        g.beginPath(); 
        g.moveTo(Math.max(0, x), Math.max(0, x < height ? 0 : x - height)); 
        g.lineTo(Math.min(width, x + height), Math.min(height, x + height > width ? height : x + height)); 
        g.strokePath(); 
      }
      g.lineStyle(stripeWidth, 0xff0000, 0.25);
      for (let x = stripeWidth; x < width + height; x += stripeWidth * 2) { 
        g.beginPath(); 
        g.moveTo(Math.max(0, x), Math.max(0, x < height ? 0 : x - height)); 
        g.lineTo(Math.min(width, x + height), Math.min(height, x + height > width ? height : x + height)); 
        g.strokePath(); 
      }
    }
    if (opts.border) {
      const borderColorInt = Phaser.Display.Color.HexStringToColor(opts.borderColor || '#ffd700').color;
      g.lineStyle(2, borderColorInt, 1);
      g.strokeRoundedRect(0, 0, width, height, radius);
    }
    if (opts.highlight !== false) {
      const highlightHeight = Math.max(4, height * 0.22);
      g.fillStyle(0xffffff, 0.10);
      g.fillRoundedRect(0, 0, width, highlightHeight, { tl: radius, tr: radius, bl: 0, br: 0 });
    }
  }

  static _generateBackground(scene, variant, palette, cfg, btnWidth, btnHeight, scaleFactor, options) {
    const g = scene.add.graphics();
    this._drawButtonBackground(g, btnWidth, btnHeight, cfg.RADIUS * scaleFactor, palette.bg, palette.shadow, cfg.SHADOW_OFFSET_Y * scaleFactor, cfg.SHADOW_ALPHA, {
      gradient: options.gradient !== false,
      pattern: options.pattern || (variant === 'danger' && options.pattern !== 'none' ? 'candycane' : null),
      border: options.border !== false,
  borderColor: options.borderColor || (variant === 'primary' ? (cfg.BORDER_GOLD || '#ffd700') : variant === 'danger' ? (cfg.BORDER_GOLD || '#ffd700') : '#0d5016')
    });
    const texKey = `btn_${variant}_${btnWidth}_${btnHeight}_${Math.random().toString(36).slice(2,7)}`;
    g.generateTexture(texKey, btnWidth, btnHeight);
    g.destroy();
    const bg = scene.add.image(0, 0, texKey).setOrigin(0.5);
    return { bg, texKey };
  }
}

window.ButtonFactory = ButtonFactory;
