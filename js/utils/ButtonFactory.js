// ButtonFactory.js - central festive button creation utility
// Uses LayoutConfig.BUTTON_STYLE tokens. Produces a container with background + label (and optional emoji).
// Keeps styling code-driven (no external image assets).

class ButtonFactory {
  static createButton(scene, x, y, label, variant = 'primary', options = {}) {
    const cfg = LayoutConfig.BUTTON_STYLE;
    const scaleFactor = cfg.SMALL_SCREEN_SCALE(scene.cameras.main.width);

    const palette = this._resolveVariantColors(variant, cfg);

    const paddingX = (options.paddingX || cfg.PADDING_X) * scaleFactor;
    const paddingY = (options.paddingY || cfg.PADDING_Y) * scaleFactor;
    const font = options.font || cfg.FONT;

    // Create container
    const container = scene.add.container(x, y);

    // Label text (measure first for width)
  const labelText = scene.add.text(0, 0, label, {
      font: font,
      fill: palette.fg,
      align: 'center'
    }).setOrigin(0.5);

    // Optional icon/emoji left of text
    let iconText = null;
    if (options.icon) {
      iconText = scene.add.text(0, 0, options.icon, {
        font: font,
        fill: palette.fg
      }).setOrigin(0.5);
    }

    // Compute width/height
    const totalLabelWidth = labelText.width + (iconText ? iconText.width + 8 : 0);
    const btnWidth = totalLabelWidth + paddingX * 2;
    const btnHeight = Math.max(labelText.height, iconText ? iconText.height : 0) + paddingY * 2;

    // Background rounded rectangle via Graphics -> generateTexture for performance
    const g = scene.add.graphics();
    this._drawButtonBackground(g, btnWidth, btnHeight, cfg.RADIUS * scaleFactor, palette.bg, palette.shadow, cfg.SHADOW_OFFSET_Y * scaleFactor, cfg.SHADOW_ALPHA);
    const texKey = `btn_${variant}_${btnWidth}_${btnHeight}_${Math.random().toString(36).slice(2,7)}`; // pseudo-unique; small risk OK
    g.generateTexture(texKey, btnWidth, btnHeight);
    g.destroy();

    const bg = scene.add.image(0, 0, texKey).setOrigin(0.5);

    // Position label & icon
    if (iconText) {
      iconText.x = -totalLabelWidth / 2 + iconText.width / 2;
      labelText.x = iconText.x + iconText.width / 2 + 8 + labelText.width / 2;
    }

    container.add(bg);
    if (iconText) container.add(iconText);
    container.add(labelText);

    // Expose label for dynamic updates (e.g., toggles) without leaking internal structure elsewhere
    container.labelText = labelText;
    container.setLabel = (newText) => {
      if (container.labelText) {
        container.labelText.setText(newText);
        // Recompute widths minimally (avoid full texture regen) when label changes length materially
        const textWidth = container.labelText.width + (iconText ? iconText.width + 8 : 0);
        const newBtnWidth = textWidth + paddingX * 2;
        const newBtnHeight = Math.max(container.labelText.height, iconText ? iconText.height : 0) + paddingY * 2;
        // Update interactive hit area & size (keep existing background scale; minor overflow acceptable)
        container.setSize(newBtnWidth, newBtnHeight);
      }
    };

    // Interactive states
    container.setSize(btnWidth, btnHeight);
    container.setInteractive(new Phaser.Geom.Rectangle(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);

    const applyState = (state) => {
      let bgColor;
      if (state === 'hover') bgColor = palette.bgHover; else if (state === 'active') bgColor = palette.bgActive; else bgColor = palette.bg;
      // redraw lightweight tint using fill pipeline instead of regenerating texture
      bg.setTintFill(Phaser.Display.Color.HexStringToColor(bgColor).color);
      labelText.setColor(palette.fg);
      if (iconText) iconText.setColor(palette.fg);
    };

    container.on('pointerover', () => { if (!container.disabled) applyState('hover'); });
    container.on('pointerout', () => { if (!container.disabled) { applyState('normal'); container.setScale(1); container.alpha = 1; } });
    container.on('pointerdown', () => { if (!container.disabled) { applyState('active'); scene.tweens.add({ targets: container, scale: 0.94, duration: 60 }); } });
    container.on('pointerup', () => {
      if (!container.disabled) {
        applyState('hover');
        scene.tweens.add({ targets: container, scale: 1, duration: 100, ease: 'Back.easeOut' });
        if (options.onClick) options.onClick();
      }
    });

    container.disableButton = () => {
      container.disabled = true;
      bg.clearTint();
      bg.setTintFill(Phaser.Display.Color.HexStringToColor(cfg.DISABLED_BG).color);
      labelText.setColor(cfg.DISABLED_FG);
      if (iconText) iconText.setColor(cfg.DISABLED_FG);
      container.alpha = 0.85;
    };

    container.enableButton = () => {
      container.disabled = false;
      applyState('normal');
      container.alpha = 1;
    };

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

  static _drawButtonBackground(g, width, height, radius, colorHex, shadowColor, shadowOffsetY, shadowAlpha) {
    // Shadow
    if (shadowAlpha > 0) {
      g.fillStyle(shadowColor, shadowAlpha);
      g.fillRoundedRect(0, shadowOffsetY, width, height, radius);
    }
    // Main fill
    g.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 1);
    g.fillRoundedRect(0, 0, width, height, radius);
    // Inner highlight (top overlay)
    const highlightHeight = Math.max(4, height * 0.22);
    g.fillStyle(0xffffff, 0.12);
    g.fillRoundedRect(0, 0, width, highlightHeight, { tl: radius, tr: radius, bl: 0, br: 0 });
  }
}

window.ButtonFactory = ButtonFactory;
