// DifficultySelection.js - Difficulty selection scene

class DifficultySelection extends Phaser.Scene {
  constructor() {
    super('DifficultySelection');
  }

  preload() {
    // Background already loaded by MainMenu, but ensure it's available
    if (!this.textures.exists('bg')) {
      this.load.image('bg', 'assets/bg_mobile2.png');
    }
  }
  
  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(GameUtils.getDepthLayers().BACKGROUND);
    
    this.createTitle(width, height);
    this.createCodeLengthSelection(width, height);
    this.createGuessCountSelection(width, height);
    this.createNavigationButtons(width, height);
  }

  createTitle(width, height) {
    this.add.text(width / 2, height * 0.15, 'Select Difficulty', {
      font: '36px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
  }

  createCodeLengthSelection(width, height) {
    this.add.text(width / 2, height * 0.3, 'Code Length:', {
      font: '24px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    this.codeLength = 4; // Default
    this.codeLengthBtns = [];
    const lengthOptions = [4, 5, 6];
    
    lengthOptions.forEach((length, index) => {
      const x = width / 2 + (index - 1) * 80;
      const y = height * 0.4;
      const btn = this.add.text(x, y, length.toString(), {
        font: '24px Arial',
        fill: length === 4 ? '#000' : '#fff',
        backgroundColor: length === 4 ? '#fff' : '#444',
        padding: { left: 12, right: 12, top: 8, bottom: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
      
      btn.on('pointerdown', () => {
        this.codeLength = length;
        this.updateCodeLengthButtons();
      });
      
      this.codeLengthBtns.push({ btn, length });
    });
  }

  createGuessCountSelection(width, height) {
    this.add.text(width / 2, height * 0.55, 'Number of Guesses:', {
      font: '24px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    this.maxGuesses = 10; // Default
    this.guessText = this.add.text(width / 2, height * 0.65, this.maxGuesses.toString(), {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Decrease button
    const decreaseBtn = this.add.text(width / 2 - 80, height * 0.65, '-', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    decreaseBtn.on('pointerdown', () => {
      if (this.maxGuesses > 8) {
        this.maxGuesses--;
        this.guessText.setText(this.maxGuesses.toString());
      }
    });
    
    // Increase button
    const increaseBtn = this.add.text(width / 2 + 80, height * 0.65, '+', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    increaseBtn.on('pointerdown', () => {
      if (this.maxGuesses < 15) {
        this.maxGuesses++;
        this.guessText.setText(this.maxGuesses.toString());
      }
    });
  }

  createNavigationButtons(width, height) {
    // Expert mobile responsive positioning
    const layout = GameUtils.getResponsiveLayout(width, height);
    
    // Confirm button with responsive positioning
    const confirmBtn = GameUtils.createResponsiveText(
      this,
      width / 2, 
      layout.primaryButtonY, 
      'Confirm',
      {
        fontSize: `${Math.round(28 * layout.fontScale)}px`,
        fontFamily: 'Arial',
        fill: '#fff',
        backgroundColor: '#27ae60',
        padding: { 
          left: Math.round(24 * layout.fontScale), 
          right: Math.round(24 * layout.fontScale), 
          top: Math.round(12 * layout.fontScale), 
          bottom: Math.round(12 * layout.fontScale) 
        }
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    // Ensure minimum touch target size
    const buttonBounds = confirmBtn.getBounds();
    if (buttonBounds.width < layout.minTouchSize) {
      confirmBtn.setPadding(layout.minTouchSize / 2, confirmBtn.style.padding.top);
    }
    
    confirmBtn.on('pointerdown', () => {
      this.registry.set('codeLength', this.codeLength);
      this.registry.set('maxGuesses', this.maxGuesses);
      this.scene.start('Game');
    });
    
    // Back button
    const backBtn = this.add.text(50, 50, 'Back', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    backBtn.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
  
  updateCodeLengthButtons() {
    this.codeLengthBtns.forEach(({ btn, length }) => {
      if (length === this.codeLength) {
        btn.setStyle({ fill: '#000', backgroundColor: '#fff' });
      } else {
        btn.setStyle({ fill: '#fff', backgroundColor: '#444' });
      }
    });
  }
}
