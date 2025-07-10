// UILayoutManager.js - Handles UI setup and responsive positioning

class UILayoutManager {
  constructor(scene) {
    this.scene = scene;
    this.guessesText = null;
    this.scoreText = null;
    this.hintText = null;
    this.hintBtn = null;
  }

  setupUI() {
    const { width, height } = this.scene.cameras.main;
    
    // Title
    this.scene.add.text(width / 2, 30, 'XmasMM', {
      font: '24px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Create responsive header layout for game state info
    this.setupHeaderLayout();
  }

  setupHeaderLayout() {
    const { width } = this.scene.cameras.main;
    
    // Determine layout based on screen width
    const isSmallScreen = width < 400;
    
    if (isSmallScreen) {
      this.setupStackedHeader();
    } else {
      this.setupHorizontalHeader();
    }
  }

  setupStackedHeader() {
    const { width } = this.scene.cameras.main;
    
    // Row 1: Guesses and Score
    this.guessesText = this.scene.add.text(50, 70, `Guesses: ${this.scene.gameStateManager.guessesRemaining}`, {
      font: '16px Arial',
      fill: '#fff'
    }).setDepth(GameUtils.getDepthLayers().UI);
    
    this.scoreText = this.scene.add.text(width - 50, 70, `Score: ${this.scene.scoreManager.getCurrentScore()}`, {
      font: '16px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(GameUtils.getDepthLayers().UI);
    
    // Row 2: Hint status and button (centered)
    this.hintText = this.scene.add.text(width / 2, 100, 'Hint: Locked', {
      font: '14px Arial',
      fill: '#888'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Santa's Hint button positioned in header
    this.hintBtn = this.scene.add.text(width / 2, 130, "Santa's Hint", {
      font: '14px Arial',
      fill: '#888',
      backgroundColor: '#333',
      padding: { left: 10, right: 10, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
  }

  setupHorizontalHeader() {
    const { width } = this.scene.cameras.main;
    
    // Single row layout for larger screens
    this.guessesText = this.scene.add.text(50, 70, `Guesses: ${this.scene.gameStateManager.guessesRemaining}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setDepth(GameUtils.getDepthLayers().UI);
    
    this.scoreText = this.scene.add.text(width - 50, 70, `Score: ${this.scene.scoreManager.getCurrentScore()}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(GameUtils.getDepthLayers().UI);
    
    // Hint status (smaller, above button)
    this.hintText = this.scene.add.text(width / 2, 60, 'Hint: Locked', {
      font: '12px Arial',
      fill: '#888'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Santa's Hint button in header (center)
    this.hintBtn = this.scene.add.text(width / 2, 85, "Santa's Hint", {
      font: '16px Arial',
      fill: '#888',
      backgroundColor: '#333',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
  }

  setupButtons() {
    const { width, height } = this.scene.cameras.main;
    
    // Submit button (hidden since we're using integrated button in active row)
    this.submitBtn = this.scene.add.text(width - 70, 300, 'Submit', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI + 10);
    
    // Hide the external submit button since we're using integrated approach
    this.submitBtn.setVisible(false);
    
    this.submitBtn.on('pointerdown', () => {
      this.scene.submitGuess();
    });
    
    // Add touch feedback to submit button
    this.addButtonTouchFeedback(this.submitBtn, { colorTint: 0x2ecc71 });
    
    // Configure hint button interactivity
    this.hintBtn.setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerdown', () => {
      this.scene.useSantasHint();
    });
    
    // Add touch feedback to hint button
    this.addButtonTouchFeedback(this.hintBtn, { colorTint: 0xe67e22 });
    
    // Back button
    const backBtn = this.scene.add.text(50, height - 50, 'Back', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    backBtn.on('pointerdown', () => {
      this.scene.scene.start('DifficultySelection');
    });
    
    // Add touch feedback to back button
    this.addButtonTouchFeedback(backBtn, { colorTint: 0x7f8c8d });
  }

  setupBackground() {
    const { width, height } = this.scene.cameras.main;
    
    // Add background image
    const bg = this.scene.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(GameUtils.getDepthLayers().BACKGROUND);
    
    // Add dark overlay to improve contrast
    const overlay = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);
    overlay.setDepth(GameUtils.getDepthLayers().OVERLAY);
  }

  showLoadingState() {
    const { width, height } = this.scene.cameras.main;
    
    // Only create if not already created
    if (this.loadingContainer) return;
    
    // Create loading container
    this.loadingContainer = this.scene.add.container(0, 0);
    
    // Loading background
    const loadingBg = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    
    // Loading text
    this.loadingText = this.scene.add.text(width / 2, height / 2 - 20, 'Loading Christmas Magic...', {
      font: '24px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Simple loading indicator (spinning snowflake)
    this.loadingSpinner = this.scene.add.text(width / 2, height / 2 + 30, '❄️', {
      font: '32px Arial'
    }).setOrigin(0.5);
    
    // Add to container
    this.loadingContainer.add([loadingBg, this.loadingText, this.loadingSpinner]);
    this.loadingContainer.setDepth(1000);
    
    // Spin the snowflake
    this.loadingTween = this.scene.tweens.add({
      targets: this.loadingSpinner,
      rotation: Math.PI * 2,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
  }

  hideLoadingState() {
    if (this.loadingContainer) {
      // Stop the spinning animation safely
      if (this.loadingTween && this.loadingTween.isPlaying()) {
        this.loadingTween.remove();
      }
      this.loadingTween = null;
      
      this.scene.tweens.add({
        targets: this.loadingContainer,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          if (this.loadingContainer) {
            this.loadingContainer.destroy();
            this.loadingContainer = null;
            this.loadingText = null;
            this.loadingSpinner = null;
          }
        }
      });
    }
  }

  showIncompleteGuessError() {
    // Prevent multiple error messages
    if (this.errorMessage) return;
    
    const { width, height } = this.scene.cameras.main;
    
    // Create error container for better positioning
    this.errorMessage = this.scene.add.container(0, 0);
    
    // Error background with gentle animation
    const errorBg = this.scene.add.rectangle(width / 2, height / 2, width * 0.8, 100, 0x000000, 0.9);
    errorBg.setStrokeStyle(2, 0xe74c3c);
    
    // Friendly error message
    const errorText = this.scene.add.text(width / 2, height / 2 - 10, '🎄 Please select all Christmas elements! 🎄', {
      font: '18px Arial',
      fill: '#fff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: width * 0.7 }
    }).setOrigin(0.5);
    
    // Helpful hint
    const hintText = this.scene.add.text(width / 2, height / 2 + 15, 'Tap empty slots to choose elements', {
      font: '14px Arial',
      fill: '#f39c12',
      align: 'center'
    }).setOrigin(0.5);
    
    this.errorMessage.add([errorBg, errorText, hintText]);
    this.errorMessage.setDepth(GameUtils.getDepthLayers().UI + 2);
    
    // Gentle bounce animation
    this.errorMessage.setScale(0.8);
    this.scene.tweens.add({
      targets: this.errorMessage,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
    
    // Remove after 3 seconds with fade
    this.scene.time.delayedCall(3000, () => {
      if (this.errorMessage) {
        this.scene.tweens.add({
          targets: this.errorMessage,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.errorMessage.destroy();
            this.errorMessage = null;
          }
        });
      }
    });
  }

  showGameWon() {
    this.scene.add.text(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 'YOU WON!', {
      font: '36px Arial',
      fill: '#27ae60',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().GAME_OVER);
  }

  showGameLost(secretCode) {
    this.scene.add.text(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 'GAME OVER', {
      font: '36px Arial',
      fill: '#e74c3c',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().GAME_OVER);
    
    // Show solution
    this.scene.add.text(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2 + 50, 
      `Solution: ${secretCode.join(', ')}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().GAME_OVER);
  }

  showRestartButton() {
    this.scene.time.delayedCall(2000, () => {
      const restartBtn = this.scene.add.text(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2 + 100, 'Play Again', {
        font: '24px Arial',
        fill: '#fff',
        backgroundColor: '#3498db',
        padding: { left: 16, right: 16, top: 8, bottom: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().GAME_OVER);
      
      restartBtn.on('pointerdown', () => {
        this.scene.scene.start('DifficultySelection');
      });
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
      // Scale down and tint
      this.scene.tweens.add({
        targets: button,
        scaleX: scaleDown,
        scaleY: scaleDown,
        duration: duration,
        ease: 'Power2'
      });
      
      // Subtle color change
      button.setTint(colorTint);
    });
    
    button.on('pointerup', () => {
      // Scale back up with slight overshoot for satisfying feel
      this.scene.tweens.add({
        targets: button,
        scaleX: scaleUp,
        scaleY: scaleUp,
        duration: duration,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Return to normal scale
          this.scene.tweens.add({
            targets: button,
            scaleX: 1,
            scaleY: 1,
            duration: duration,
            ease: 'Power2'
          });
        }
      });
      
      // Clear tint
      button.clearTint();
    });
    
    // Handle pointer out (when finger moves off button)
    button.on('pointerout', () => {
      this.scene.tweens.killTweensOf(button);
      button.setScale(1);
      button.clearTint();
    });
  }

  updateGuessesDisplay(guessesRemaining) {
    if (this.guessesText) {
      this.guessesText.setText(`Guesses: ${guessesRemaining}`);
    }
  }

  updateScoreDisplay(scoreText) {
    if (this.scoreText) {
      this.scoreText.setText(scoreText);
    }
  }

  getUIElements() {
    return {
      guessesText: this.guessesText,
      scoreText: this.scoreText,
      hintText: this.hintText,
      hintBtn: this.hintBtn,
      submitBtn: this.submitBtn
    };
  }
}