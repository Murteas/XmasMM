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
    
    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(GameUtils.getDepthLayers().BACKGROUND);

    // Title
    this.add.text(width / 2, height * 0.18, 'XmasMM', {
      font: '48px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);

    this.createButtons(width, height);
    this.initializeSettings();
  }

  createButtons(width, height) {
    // Start Game button
    const startBtn = this.add.text(width / 2, height * 0.35, 'Start Game', {
      font: '32px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 24, right: 24, top: 12, bottom: 12 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    startBtn.on('pointerdown', () => {
      this.scene.start('DifficultySelection');
    });

    // How to Play button
    const helpBtn = this.add
      .text(width / 2, height * 0.48, "How to Play", {
        font: "24px Arial",
        fill: "#fff",
        backgroundColor: "#27ae60",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        borderRadius: 6,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(GameUtils.getDepthLayers().UI);
    
    helpBtn.on('pointerdown', () => {
      this.showHelpOverlay();
    });

    // SFX Toggle
    this.sfxBtn = this.add.text(width / 2, height * 0.65, 'SFX: ON', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#222',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    this.sfxBtn.on('pointerdown', () => {
      const current = this.registry.get('sfxOn');
      this.registry.set('sfxOn', !current);
      this.sfxBtn.setText('SFX: ' + (this.registry.get('sfxOn') ? 'ON' : 'OFF'));
    });

    // Music Toggle
    this.musicBtn = this.add.text(width / 2, height * 0.75, 'Music: ON', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#222',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    this.musicBtn.on('pointerdown', () => {
      const current = this.registry.get('musicOn');
      this.registry.set('musicOn', !current);
      this.musicBtn.setText('Music: ' + (this.registry.get('musicOn') ? 'ON' : 'OFF'));
    });

    // Add touch feedback to all buttons
    this.addButtonTouchFeedback(startBtn, { colorTint: 0xe74c3c });
    this.addButtonTouchFeedback(helpBtn, { colorTint: 0x34495e });
    this.addButtonTouchFeedback(this.sfxBtn, { colorTint: 0x555 });
    this.addButtonTouchFeedback(this.musicBtn, { colorTint: 0x555 });
  }

  initializeSettings() {
    this.registry.set('sfxOn', true);
    this.registry.set('musicOn', true);
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
    
    // Create help overlay container
    this.helpOverlay = this.add.container(0, 0);
    
    // Background
    const helpBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);
    
    // Title with responsive sizing - increased size
    const helpTitle = this.add.text(width / 2, height * 0.06, '🎄 How to Play XmasMM 🎄', {
      font: `${Math.round(28 * layout.fontScale)}px Arial`, // Increased from 24 to 28
      fill: '#fff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Part 1: Instructions up to element list
    const instructionsPart1 = this.add.text(width / 2, height * 0.15, 
      '🎯 Goal: Guess Santa\'s secret Christmas code!\n\n' +
      '📱 How to Play:\n' +
      '• Tap empty slots to select Christmas elements\n' +
      '• Choose from these Christmas elements:\n', 
      {
        font: `${Math.round(13 * layout.fontScale)}px Arial`,
        fill: '#fff',
        align: 'left',
        lineSpacing: Math.round(3 * layout.fontScale),
        wordWrap: { width: width * 0.85 }
      }
    ).setOrigin(0.5);

    // Element images positioned closer to text in 2 rows of 3
    const elementStartY = height * 0.28; // Moved closer to text (was 0.32)
    const elementSize = Math.round(40 * layout.fontScale); // Much bigger images (was 32)
    const horizontalSpacing = Math.round(45 * layout.fontScale); // Spacing between columns
    const verticalSpacing = Math.round(48 * layout.fontScale); // Spacing between rows
    
    const gameElements = ['santa', 'present', 'star', 'tree', 'snowflake', 'candycane'];
    
    // Store images separately to add to container later
    const elementImages = [];
    
    gameElements.forEach((element, index) => {
      const row = Math.floor(index / 3); // 0 for first row, 1 for second row
      const col = index % 3; // 0, 1, 2 for columns
      
      // Calculate position for 2 rows of 3
      const x = width / 2 - horizontalSpacing + (col * horizontalSpacing);
      const y = elementStartY + (row * verticalSpacing);
      
      const textureKey = `${element}_1x`;
      
      if (!this.textures.exists(textureKey)) {
        console.error(`Missing texture: ${textureKey}`);
        return;
      }
      
      const img = this.add.image(x, y, textureKey)
        .setDisplaySize(elementSize, elementSize)
        .setOrigin(0.5)
        .setVisible(true)
        .setDepth(1002); // Higher depth than container
      
      elementImages.push(img);
    });

    // Part 2: Instructions up to feedback symbols - adjusted position for 2-row layout
    const instructionsPart2 = this.add.text(width / 2, height * 0.52,
      '• Tap Submit when your guess is complete\n\n' +
      '💡 Feedback Symbols:', 
      {
        font: `${Math.round(13 * layout.fontScale)}px Arial`,
        fill: '#fff',
        align: 'left',
        lineSpacing: Math.round(3 * layout.fontScale),
        wordWrap: { width: width * 0.85 }
      }
    ).setOrigin(0.5);

    // Feedback symbol images positioned after part 2 - adjusted for new layout
    const feedbackY = height * 0.62; // Moved down to accommodate 2-row element layout
    const feedbackSize = Math.round(28 * layout.fontScale); // Even bigger feedback images (was 24)
    const feedbackSpacing = Math.round(120 * layout.fontScale); // Closer together (was 140)
    
    // Create feedback images with labels
    const feedbackElements = [
      { key: 'feedback_perfect_star_1x', label: 'Perfect Match!' },
      { key: 'feedback_close_bell_1x', label: 'Close Match!' }
    ];
    
    const feedbackStartX = width / 2 - feedbackSpacing / 2;
    const feedbackImages = [];
    
    feedbackElements.forEach((feedback, index) => {
      const x = feedbackStartX + (index * feedbackSpacing);
      
      if (!this.textures.exists(feedback.key)) {
        console.error(`Missing feedback texture: ${feedback.key}`);
        return;
      }
      
      const img = this.add.image(x, feedbackY, feedback.key)
        .setDisplaySize(feedbackSize, feedbackSize)
        .setOrigin(0.5)
        .setVisible(true)
        .setDepth(1002);
      
      const label = this.add.text(x, feedbackY + feedbackSize/2 + 8, feedback.label, {
        font: `${Math.round(10 * layout.fontScale)}px Arial`,
        fill: '#fff',
        align: 'center'
      }).setOrigin(0.5).setDepth(1002);
      
      feedbackImages.push(img, label);
    });

    // Part 3: Remaining instructions positioned after feedback images
    const instructionsPart3 = this.add.text(width / 2, height * 0.72,
      '• (No symbol) = Element not in the secret code\n\n' +
      '🎁 Santa\'s Hint: Available after a few guesses!\n' +
      '🏆 Win by guessing the complete code!', 
      {
        font: `${Math.round(13 * layout.fontScale)}px Arial`,
        fill: '#fff',
        align: 'left',
        lineSpacing: Math.round(3 * layout.fontScale),
        wordWrap: { width: width * 0.85 }
      }
    ).setOrigin(0.5);

    // Close button - adjusted for new layout
    const closeBtn = this.add.text(width / 2, height * 0.82, 'Got it! Let\'s Play! 🎄', {
      font: `${Math.round(16 * layout.fontScale)}px Arial`,
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { 
        left: Math.round(16 * layout.fontScale), 
        right: Math.round(16 * layout.fontScale), 
        top: Math.round(8 * layout.fontScale), 
        bottom: Math.round(8 * layout.fontScale) 
      },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    closeBtn.on('pointerdown', () => {
      this.hideHelpOverlay();
    });
    
    // Add touch feedback to close button
    this.addButtonTouchFeedback(closeBtn, { colorTint: 0xe74c3c });
    // Add all elements to container
    this.helpOverlay.add([helpBg, helpTitle, instructionsPart1, instructionsPart2, instructionsPart3, closeBtn]);
    
    // Store element images and feedback images for cleanup
    this.helpElementImages = elementImages.concat(feedbackImages);
    this.helpOverlay.setDepth(1000);

    // Smooth entrance animation
    this.helpOverlay.setAlpha(0);
    this.helpOverlay.setScale(0.9);
    this.tweens.add({
      targets: this.helpOverlay,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
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
