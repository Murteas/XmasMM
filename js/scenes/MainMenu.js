// MainMenu.js - Main menu scene

class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    this.load.image('bg', 'assets/bg_mobile2.png');
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
    const helpBtn = this.add.text(width / 2, height * 0.48, 'How to Play', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#2c3e50',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
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
    
    // Create help overlay container
    this.helpOverlay = this.add.container(0, 0);
    
    // Background
    const helpBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9);
    
    // Title
    const helpTitle = this.add.text(width / 2, height * 0.15, '🎄 How to Play XmasMM 🎄', {
      font: '28px Arial',
      fill: '#fff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    
    // Instructions with emojis for family-friendly appeal
    const instructions = [
      '🎯 Goal: Guess Santa\'s secret Christmas code!',
      '',
      '📱 How to Play:',
      '• Tap empty slots to select Christmas elements',
      '• Use the element picker to choose from:',
      '  🎅 Santa, 🎁 Presents, 🌟 Stars, 🎄 Trees, ❄️ Snowflakes, 🪴 Mistletoe',
      '• Tap Submit when your guess is complete',
      '',
      '💡 Reading Feedback:',
      '• ⚫ Black peg = Right element, right position',
      '• ⚪ White peg = Right element, wrong position',
      '• No peg = Element not in the code',
      '',
      '🎁 Santa\'s Hint: Available after a few guesses!',
      '',
      '🏆 Win by guessing the complete code!'
    ];
    
    const instructionText = this.add.text(width / 2, height * 0.5, instructions.join('\n'), {
      font: '16px Arial',
      fill: '#fff',
      align: 'left',
      lineSpacing: 8,
      wordWrap: { width: width * 0.85 }
    }).setOrigin(0.5);
    
    // Close button
    const closeBtn = this.add.text(width / 2, height * 0.85, 'Got it! Let\'s Play! 🎄', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    closeBtn.on('pointerdown', () => {
      this.hideHelpOverlay();
    });
    
    // Add touch feedback to close button
    this.addButtonTouchFeedback(closeBtn, { colorTint: 0xe74c3c });
    
    // Add to container
    this.helpOverlay.add([helpBg, helpTitle, instructionText, closeBtn]);
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
        }
      });
    }
  }
}
