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
      
      // Christmas-themed buttons with clear selection indicators
      const isSelected = option.length === 4;
      const btn = this.add.text(centerX, y, option.label + (isSelected ? ' ✓' : ''), {
        font: '24px Arial', // Keep normal weight for readability
        fill: '#fff',
        backgroundColor: isSelected ? '#c0392b' : '#27ae60', // Christmas red or green
        padding: { left: 24, right: 24, top: 12, bottom: 12 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
      
      // Add a visible border using a background rectangle for selected button
      if (isSelected) {
        const borderRect = this.add.rectangle(centerX, y, btn.width + 8, btn.height + 8, 0xffffff, 0)
          .setStrokeStyle(3, 0xffffff)
          .setDepth(GameUtils.getDepthLayers().UI - 1);
      }
      
      // Description text positioned further below with better spacing
      const desc = this.add.text(centerX, y + 40, option.description, {
        font: '14px Arial',
        fill: '#ccc'
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
      
      btn.on('pointerdown', () => {
        this.codeLength = option.length;
        this.updateCodeLengthButtons();
      });
      
      this.codeLengthBtns.push({ 
        btn, 
        desc, 
        length: option.length, 
        label: option.label,
        borderRect: isSelected ? this.children.list[this.children.list.length - 2] : null // Get the border rect if it exists
      });
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
    const confirmBtn = GameUtils.createResponsiveText(
      this,
      width / 2, 
      height * 0.75, // Moved down to accommodate vertical difficulty buttons
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
    this.codeLengthBtns.forEach(({ btn, desc, length, label, borderRect }) => {
      if (length === this.codeLength) {
        // Selected button: Christmas red + checkmark + white border
        btn.setText(label + ' ✓');
        btn.setStyle({ 
          font: '24px Arial',
          fill: '#fff', 
          backgroundColor: '#c0392b'
        });
        desc.setStyle({ fill: '#fff' });
        
        // Create or show border
        if (!borderRect) {
          const newBorder = this.add.rectangle(btn.x, btn.y, btn.width + 8, btn.height + 8, 0xffffff, 0)
            .setStrokeStyle(3, 0xffffff)
            .setDepth(GameUtils.getDepthLayers().UI - 1);
          this.codeLengthBtns.find(item => item.length === length).borderRect = newBorder;
        } else {
          borderRect.setVisible(true);
        }
      } else {
        // Unselected button: Christmas green + no checkmark + no border
        btn.setText(label);
        btn.setStyle({ 
          font: '24px Arial',
          fill: '#fff', 
          backgroundColor: '#27ae60'
        });
        desc.setStyle({ fill: '#ccc' });
        
        // Hide border if it exists
        if (borderRect) {
          borderRect.setVisible(false);
        }
      }
    });
  }
}
