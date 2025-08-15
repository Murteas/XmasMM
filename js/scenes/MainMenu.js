// MainMenu.js - Main menu scene

class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    // Determine if we're running from tests directory
    const isTestEnvironment = window.location.pathname.includes('/tests/');
    const assetPath = isTestEnvironment ? '../assets/' : 'assets/';
    
    this.load.image('bg', `${assetPath}bg_mobile2.png`);
    
    // Preload game element images for help overlay
    this.load.image('santa_1x', `${assetPath}santa_1x.png`);
    this.load.image('present_1x', `${assetPath}present_1x.png`);
    this.load.image('star_1x', `${assetPath}star_1x.png`);
    this.load.image('tree_1x', `${assetPath}tree_1x.png`);
    this.load.image('snowflake_1x', `${assetPath}snowflake_1x.png`);
    this.load.image('candycane_1x', `${assetPath}candycane_1x.png`);
    
    // Preload feedback images for help overlay
    this.load.image('feedback_perfect_star_1x', `${assetPath}feedback_perfect_star_1x.png`);
    this.load.image('feedback_close_bell_1x', `${assetPath}feedback_close_bell_1x.png`);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Initialize settings first to get theme
    this.initializeSettings();
    
    // Christmas background with user's selected theme
    const currentTheme = this.registry.get('backgroundTheme') || 'traditional';
    this.updateBackground(currentTheme);

    // Playful Christmas title with clean styling
    this.add
      .text(width / 2, height * 0.18, "🎄 Christmas 🎄\n🎁 MasterMind 🎁", {
        fontFamily: "Comic Sans MS, Trebuchet MS, sans-serif",
        fontSize: "46px",
        fontWeight: "bold",
        fill: "#CC0000", // Slightly deeper Christmas red
        stroke: "#FFFFFF", // White outline for readability
        strokeThickness: 3,
        align: "center",
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#003300", // Darker green shadow
          blur: 2,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setDepth(GameUtils.getDepthLayers().UI);

    this.createButtons(width, height);
  }

  createButtons(width, height) {
    // Start Game button (primary variant)
    this.startBtn = ButtonFactory.createButton(this, width / 2, height * 0.35, 'Start Game', 'primary', {
      icon: '🎄',
      gradient: true,
      border: true,
      onClick: () => this.scene.start('DifficultySelection')
    });
    this.startBtn.setDepth(GameUtils.getDepthLayers().UI);

    // How to Play button (accent variant)
    this.helpBtn = ButtonFactory.createButton(this, width / 2, height * 0.48, 'How to Play', 'primary', {
      icon: '📘',
      gradient: true,
      border: true,
      onClick: () => this.showHelpOverlay()
    });
    this.helpBtn.setDepth(GameUtils.getDepthLayers().UI);

    // Theme Switcher button (new family-friendly feature!)
    const currentTheme = this.registry.get('backgroundTheme') || 'traditional';
    const themeNames = {
      traditional: 'Traditional 🌲',
      festive: 'Festive 🎁', 
      winter: 'Winter ❄️',
      red: 'Red 🎅'
    };
    this.themeBtn = ButtonFactory.createButton(this, width / 2, height * 0.58, themeNames[currentTheme], 'accent', {
      icon: '🎨',
      gradient: true,
      border: true,
      onClick: () => this.switchBackgroundTheme()
    });
    this.themeBtn.setDepth(GameUtils.getDepthLayers().UI);

    // SFX Toggle (danger variant for visual differentiation)
    const sfxLabel = 'SFX: ON';
    this.sfxBtn = ButtonFactory.createButton(this, width / 2, height * 0.68, sfxLabel, 'danger', {
      icon: '🔊',
      onClick: () => {
        const current = this.registry.get('sfxOn');
        this.registry.set('sfxOn', !current);
        const newLabel = 'SFX: ' + (this.registry.get('sfxOn') ? 'ON' : 'OFF');
        this.sfxBtn.setLabel(newLabel);
      }
    });
    this.sfxBtn.setDepth(GameUtils.getDepthLayers().UI);

    // Music Toggle (danger variant too; could differentiate later)
    this.musicBtn = ButtonFactory.createButton(this, width / 2, height * 0.78, 'Music: ON', 'danger', {
      icon: '🎵',
      onClick: () => {
        const current = this.registry.get('musicOn');
        this.registry.set('musicOn', !current);
        const newLabel = 'Music: ' + (this.registry.get('musicOn') ? 'ON' : 'OFF');
        this.musicBtn.setLabel(newLabel);
      }
    });
    this.musicBtn.setDepth(GameUtils.getDepthLayers().UI);
  }

  initializeSettings() {
    this.registry.set('sfxOn', true);
    this.registry.set('musicOn', true);
    // Initialize background theme if not set
    if (!this.registry.get('backgroundTheme')) {
      this.registry.set('backgroundTheme', 'traditional');
    }
  }

  switchBackgroundTheme() {
    const themes = BackgroundManager.getAvailableThemes();
    const currentTheme = this.registry.get('backgroundTheme') || 'traditional';
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    // Update registry
    this.registry.set('backgroundTheme', nextTheme);
    
    // Update button label with nice names and icons
    const themeNames = {
      traditional: 'Traditional 🌲',
      festive: 'Festive 🎁', 
      winter: 'Winter ❄️',
      red: 'Red 🎅'
    };
    this.themeBtn.setLabel(themeNames[nextTheme]);
    
    // Regenerate background with new theme
    this.updateBackground(nextTheme);
  }

  updateBackground(theme) {
    const { width, height } = this.cameras.main;
    
    // Clear existing background elements
    this.children.getAll().forEach(child => {
      if (child.texture && (
        child.texture.key.includes('christmas_gradient') || 
        child.texture.key.includes('snowflake') ||
        child.texture.key.includes('mainmenu')
      )) {
        child.destroy();
      }
    });
    
    // Create new background with selected theme
    BackgroundManager.createChristmasGradientBackground(this, width, height, `mainmenu_bg_${theme}`, theme);
    BackgroundManager.createEnhancedSnowflakeOverlay(this, width, height, `mainmenu_snow_${theme}`);
    
    // Add some magical animated snowflakes for extra atmosphere
    BackgroundManager.createMagicalSnowflakes(this, {
      count: 25,
      speed: 'medium',
      intensity: 'magical'
    });
  }

  addButtonTouchFeedback(button, config = {}) {
    const { 
      scaleDown = 0.95, 
      scaleUp = 1.05, 
      duration = 100,
      colorTint = 0xf39c12 
    } = config;
    
    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: scaleDown,
        scaleY: scaleDown,
        duration: duration,
        ease: 'Power2'
      });
      button.setTint(colorTint);
    });
    
    button.on('pointerup', () => {
      this.tweens.add({
        targets: button,
        scaleX: scaleUp,
        scaleY: scaleUp,
        duration: duration,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: button,
            scaleX: 1,
            scaleY: 1,
            duration: duration,
            ease: 'Power2'
          });
        }
      });
      button.clearTint();
    });
    
    button.on('pointerout', () => {
      this.tweens.killTweensOf(button);
      button.setScale(1);
      button.clearTint();
    });
  }

  showHelpOverlay() {
    const { width, height } = this.cameras.main;
    const layout = GameUtils.getResponsiveLayout(width, height);
    // Create overlay root + background
    this.helpOverlay = this.add.container(0,0);
    const helpBg = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9);
    
    // Make background interactive to block clicks to buttons below
    helpBg.setInteractive();
    
    this.helpOverlay.add(helpBg);

    // Inner content container for easy shifting if overflow
    const content = this.add.container(0,0);
    this.helpOverlay.add(content);

    const title = this.add
      .text(
        width / 2,
        height * 0.06,
        "🎄 How to Play 🎄\nChristmas MasterMind",
        {
          font: `${Math.round(24 * layout.fontScale)}px Arial`,
          fill: "#fff",
          fontStyle: "bold",
          align: "center",
          lineSpacing: 4,
        }
      )
      .setOrigin(0.5);
    content.add(title);

    let currentY = title.y + title.height/2 + 14;

    const blockWidth = width * 0.85;
    const makeText = (text, options={}) => {
      const t = this.add.text(width/2, currentY, text, Object.assign({
        font: `${Math.round(13 * layout.fontScale)}px Arial`,
        fill: '#fff',
        align: 'left',
        lineSpacing: Math.round(3 * layout.fontScale),
        wordWrap: { width: blockWidth }
      }, options)).setOrigin(0.5,0);
      content.add(t);
      currentY = t.y + t.height + 14;
      return t;
    };

    makeText('🎯 Goal: Guess Santa\'s secret Christmas code!\n\n📱 How to Play:\n• Tap empty slots to select Christmas elements\n• Choose from these Christmas elements:');

    // Elements grid
    const elementSize = Math.round(40 * layout.fontScale);
    const horizontalSpacing = Math.round(52 * layout.fontScale);
    const verticalSpacing = Math.round(52 * layout.fontScale);
    const gameElements = ['santa','present','star','tree','snowflake','candycane'];
    const elementImages = [];
    const gridTop = currentY + elementSize/2; // center of first row
    gameElements.forEach((element, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = width/2 - horizontalSpacing + col*horizontalSpacing;
      const y = gridTop + row*verticalSpacing;
      const textureKey = `${element}_1x`;
      if (!this.textures.exists(textureKey)) return;
      const img = this.add.image(x, y, textureKey).setDisplaySize(elementSize, elementSize).setOrigin(0.5).setDepth(1002);
      content.add(img);
      elementImages.push(img);
    });
    // Advance currentY after grid
    const rows = 2;
    currentY = gridTop + (rows-1)*verticalSpacing + elementSize/2 + 20;

    makeText('• Tap Submit when your guess is complete\n\n💡 Feedback Symbols:');

    // Feedback symbols section
    const feedbackSize = Math.round(30 * layout.fontScale);
    const feedbackSpacing = Math.round(140 * layout.fontScale);
    const feedbackElements = [
      { key: 'feedback_perfect_star_1x', label: 'Perfect Match!' },
      { key: 'feedback_close_bell_1x', label: 'Close Match!' }
    ];
    const feedbackCenterY = currentY + feedbackSize/2;
    const feedbackStartX = width/2 - feedbackSpacing/2;
    const feedbackImages = [];
    feedbackElements.forEach((f,i)=>{
      if (!this.textures.exists(f.key)) return;
      const x = feedbackStartX + i*feedbackSpacing;
      const img = this.add.image(x, feedbackCenterY, f.key).setDisplaySize(feedbackSize, feedbackSize).setOrigin(0.5).setDepth(1002);
      const label = this.add.text(x, feedbackCenterY + feedbackSize/2 + 6, f.label, { font: `${Math.round(10 * layout.fontScale)}px Arial`, fill:'#fff' }).setOrigin(0.5);
      content.add(img); content.add(label); feedbackImages.push(img,label);
    });
    currentY = feedbackCenterY + feedbackSize/2 + 40;

    makeText('• (No symbol) = Element not in the secret code\n\n🎁 Santa\'s Hint: Available after a few guesses!\n🏆 Win by guessing the complete code!\n\n🧮 Scoring Summary:\n  ★ Perfect = 180 pts | 🔔 Close = 80 pts\n  +250 solve bonus if you win\n  Unused guesses (before 10): first 3×80, next 3×50, rest×30\n  Santa\'s Hint: -220 (once)\n  Final = Elements + Solve + Speed +/- Hint');

    // Close button
    const closeBtn = ButtonFactory.createButton(this, width/2, currentY + 8, 'Let\'s Play!', 'accent', {
      icon: '🎄',
      onClick: () => this.hideHelpOverlay()
    });
    content.add(closeBtn);

    // Overflow handling: if content bottom goes beyond screen, shift upward slightly
    const contentBoundsBottom = closeBtn.y + closeBtn.height/2 + 20;
    if (contentBoundsBottom > height) {
      const shift = contentBoundsBottom - height;
      content.y -= shift;
    }

    // Store for cleanup
    this.helpElementImages = elementImages.concat(feedbackImages);
    this.helpOverlay.setDepth(1000).setAlpha(0).setScale(0.92);
    this.tweens.add({ targets: this.helpOverlay, alpha:1, scaleX:1, scaleY:1, duration:260, ease:'Back.easeOut'});
  }
  
  hideHelpOverlay() {
    if (this.helpOverlay) {
      this.tweens.add({
        targets: this.helpOverlay,
        alpha: 0,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 200,
        ease: 'Power2',
        onComplete: () => {
          this.helpOverlay.destroy();
          this.helpOverlay = null;
          
          // Clean up element images
          if (this.helpElementImages) {
            this.helpElementImages.forEach(img => img.destroy());
            this.helpElementImages = null;
          }
        }
      });
    }
  }
  
  /**
   * Create visual feedback legend using actual game assets when available
   * @param {number} x - X position for legend
   * @param {number} y - Y position for legend  
   * @param {object} container - Container to add elements to
   */
  createFeedbackLegend(x, y, container) {
    const legendItems = [
      { type: 'perfect', label: 'Perfect Match!', description: 'Right element, right spot' },
      { type: 'close', label: 'Close Match!', description: 'Right element, wrong spot' }
    ];
    
    legendItems.forEach((item, index) => {
      const itemY = y + (index * 30);
      
      try {
        // Try to use actual game assets
        const symbolKey = this.getFeedbackImageKey ? this.getFeedbackImageKey(item.type) : null;
        
        if (symbolKey && this.textures.exists(symbolKey)) {
          // Use actual game feedback symbol
          const symbol = this.add.image(x, itemY, symbolKey)
            .setOrigin(0, 0.5)
            .setDisplaySize(20, 20);
          container.add(symbol);
          
          const text = this.add.text(x + 30, itemY, `${item.label} - ${item.description}`, {
            font: '14px Arial',
            fill: '#fff'
          }).setOrigin(0, 0.5);
          container.add(text);
        } else {
          // Fallback to emoji/text
          const fallbackSymbols = { 'perfect': '★', 'close': '🔔' };
          const symbolText = this.add.text(x, itemY, fallbackSymbols[item.type], {
            font: '18px Arial',
            fill: '#FFD700'
          }).setOrigin(0, 0.5);
          container.add(symbolText);
          
          const text = this.add.text(x + 25, itemY, `${item.label} - ${item.description}`, {
            font: '14px Arial',
            fill: '#fff'
          }).setOrigin(0, 0.5);
          container.add(text);
        }
      } catch (error) {
        console.warn('Could not create feedback legend item:', error);
        // Simple fallback
        const fallbackSymbols = { 'perfect': '★', 'close': '🔔' };
        const text = this.add.text(x, itemY, `${fallbackSymbols[item.type]} ${item.label}`, {
          font: '14px Arial',
          fill: '#fff'
        }).setOrigin(0, 0.5);
        container.add(text);
      }
    });
  }
}
