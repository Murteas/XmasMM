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
    
    // Enhanced Christmas background with user's theme preference
    BackgroundManager.setupEnhancedChristmas(this, 'difficulty');
    
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
    // Remove redundant "Difficulty Level:" text since title already says "Select Difficulty"
    
    this.codeLength = 4; // Default to Easy
    this.codeLengthBtns = [];
    
    // Vertical stack layout for better mobile experience
    const difficultyOptions = [
      { length: 4, label: 'Easy 🎄', description: '4 Christmas Elements' },
      { length: 5, label: 'Standard 🎅', description: '5 Christmas Elements' }
    ];
    
    const centerX = width / 2;
    const startY = height * 0.4;
    const buttonSpacing = 80;
    
    difficultyOptions.forEach((option, index) => {
      const y = startY + (index * buttonSpacing);
      const isSelected = option.length === this.codeLength;
      const btn = ButtonFactory.createButton(
        this,
        centerX,
        y,
        option.label,
        isSelected ? 'danger' : 'primary',
        {
          icon: option.length === 4 ? '🎄' : '🎅',
          pattern: isSelected ? 'candycane' : null,
          selectable: true,
          selected: isSelected,
          onClick: () => { this.codeLength = option.length; this.updateCodeLengthButtons(); }
        }
      );
      btn.setDepth(GameUtils.getDepthLayers().UI);
      const desc = this.add.text(centerX, y + 40, option.description, { font: '14px Arial', fill: '#ccc' }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
      this.codeLengthBtns.push({ btn, desc, length: option.length, label: option.label });
    });
  }

  createGuessCountSelection(width, height) {
    // Simplified messaging - confident rather than defensive
    this.maxGuesses = 10;
    
    this.add.text(width / 2, height * 0.65, 'Maximum Guesses: 10', {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
  }

  createNavigationButtons(width, height) {
    // Expert mobile responsive positioning
    const layout = GameUtils.getResponsiveLayout(width, height);
    
    // Confirm button with responsive positioning - moved down for vertical layout
    const confirmBtn = ButtonFactory.createButton(
      this,
      width / 2,
      height * 0.75,
      'Start 🎁',
      'primary',
      {
        icon: '✅',
        gradient: true,
        border: true,
        onClick: () => {
          this.registry.set('codeLength', this.codeLength);
          this.registry.set('maxGuesses', this.maxGuesses);
          this.scene.start('Game');
        }
      }
    );
    confirmBtn.setDepth(GameUtils.getDepthLayers().UI);

    const backBtn = ButtonFactory.createButton(
      this,
      90,
      70,
      'Back',
      'danger',
      { icon: '↩️', pattern: 'candycane', onClick: () => this.scene.start('MainMenu') }
    );
    backBtn.setDepth(GameUtils.getDepthLayers().UI);
  }
  
  updateCodeLengthButtons() {
    this.codeLengthBtns.forEach(({ btn, desc, length, label }) => {
      const selected = length === this.codeLength;
      btn.setSelected && btn.setSelected(selected);
      btn.setLabel(label + (selected ? ' ✓' : ''));
      desc.setStyle({ fill: selected ? '#fff' : '#ccc' });
    });
  }

  shutdown() {
    // Clean up any remaining graphics or textures
    if (this.codeLengthBtns) {
      this.codeLengthBtns.forEach(({ btn }) => {
        if (btn && btn.destroy) {
          btn.destroy();
        }
      });
    }
  }
}
