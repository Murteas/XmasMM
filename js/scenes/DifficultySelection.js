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
    this.add.text(width / 2, height * 0.3, 'Difficulty Level:', {
      font: '24px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    this.codeLength = 4; // Default to Easy
    this.codeLengthBtns = [];
    
    // Simplified: Only Easy (4 elements) and Standard (5 elements)
    const difficultyOptions = [
      { length: 4, label: 'Easy', description: '4 Christmas Elements' },
      { length: 5, label: 'Standard', description: '5 Christmas Elements' }
    ];
    
    difficultyOptions.forEach((option, index) => {
      const x = width / 2 + (index - 0.5) * 120;
      const y = height * 0.4;
      
      // Main button
      const btn = this.add.text(x, y, option.label, {
        font: '20px Arial',
        fill: option.length === 4 ? '#000' : '#fff',
        backgroundColor: option.length === 4 ? '#fff' : '#444',
        padding: { left: 16, right: 16, top: 10, bottom: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
      
      // Description text
      const desc = this.add.text(x, y + 35, option.description, {
        font: '12px Arial',
        fill: '#ccc'
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
      
      btn.on('pointerdown', () => {
        this.codeLength = option.length;
        this.updateCodeLengthButtons();
      });
      
      this.codeLengthBtns.push({ btn, desc, length: option.length, label: option.label });
    });
  }

  createGuessCountSelection(width, height) {
    // Fixed at 10 guesses - no user selection needed
    this.maxGuesses = 10;
    
    this.add.text(width / 2, height * 0.55, 'Maximum Guesses: 10', {
      font: '20px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    this.add.text(width / 2, height * 0.62, '(Fixed for optimal family gameplay)', {
      font: '14px Arial',
      fill: '#aaa'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
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
    this.codeLengthBtns.forEach(({ btn, desc, length, label }) => {
      if (length === this.codeLength) {
        btn.setStyle({ fill: '#000', backgroundColor: '#fff' });
        desc.setStyle({ fill: '#fff' });
      } else {
        btn.setStyle({ fill: '#fff', backgroundColor: '#444' });
        desc.setStyle({ fill: '#ccc' });
      }
    });
  }
}
