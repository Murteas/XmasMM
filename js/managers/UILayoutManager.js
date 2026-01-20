// UILayoutManager.js - Handles UI setup and responsive positioning

class UILayoutManager {
  constructor(scene) {
    this.scene = scene;
    this.progressText = null; // MOBILE OPTIMIZATION: Renamed from guessesText for clarity
    this.scoreText = null;
    this.hintText = null;
    this.hintBtn = null;
  }

  setupUI() {
    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width, height } = viewport;
    
    // COMPACT: Abbreviated title for game screen header (saves 60% space)
    const titleY = this.scene.headerContainer ? 25 : 25; // Relative positioning in container
    
    // Smaller background for abbreviated title
    const titleBg = this.scene.add.rectangle(width / 2, titleY, 80, 28, 0x000000, 0.3)
      .setOrigin(0.5)
      .setDepth(GameUtils.getDepthLayers().UI - 0.1);
    
    const title = this.scene.add.text(width / 2, titleY, '🎄 CM', {
      fontFamily: 'Dancing Script, cursive',
      fontSize: '18px',
      fontWeight: '600',
      fill: '#F5F5DC',           // Warm cream for elegance
      stroke: '#0F4C36',         // Deep emerald green (matches buttons)
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#1A1A1A',        // Deep shadow
        blur: 2,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);

    // Subtle gold highlight for header title
    const titleHighlight = this.scene.add.text(width / 2, titleY, '🎄 CM', {
      fontFamily: 'Dancing Script, cursive',
      fontSize: '18px',
      fontWeight: '600',
      fill: 'transparent',
      stroke: '#DAA520',         // Sophisticated gold highlight
      strokeThickness: 1,
      alpha: 0.4
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 0.1);
    
    // Add to header container if available
    if (this.scene.headerContainer) {
      this.scene.headerContainer.add([titleBg, title, titleHighlight]);
      console.log('📱 Title added to header container');
    }
    
    // Create responsive header layout for game state info
    this.setupHeaderLayout();
  }

  setupHeaderLayout() {
    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width } = viewport;
    
    // Determine layout based on screen width
    const isSmallScreen = width < 400;
    
    if (isSmallScreen) {
      this.setupStackedHeader();
    } else {
      this.setupHorizontalHeader();
    }
  }

  setupStackedHeader() {
    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width, height } = viewport;
    
    // Expert mobile responsive layout with consolidated display
    const layout = GameUtils.getResponsiveLayout(width, height);
    
    // Single consolidated progress display (removes redundancy)
    this.progressText = GameUtils.createResponsiveText(
      this.scene,
      50,
      layout.headerY,
      `Progress: ${this.scene.gameStateManager.maxGuesses - this.scene.gameStateManager.guessesRemaining}/${this.scene.gameStateManager.maxGuesses}`,
      {
        fontSize: `${Math.round(16 * layout.fontScale)}px`,
        fontFamily: 'Arial',
        fill: '#fff'
      }
    ).setDepth(GameUtils.getDepthLayers().UI);
    
    // Hint button positioned below header (penalty inline; green primary variant)
    this.hintBtn = ButtonFactory.createButton(
      this.scene,
      width / 2,
      layout.headerY + Math.round(38 * layout.fontScale),
      `Hint (-${this.scene.scoreManager ? this.scene.scoreManager.scoringConfig.hintPenalty : 220})`,
      'primary',
      {
        icon: '💡',
        gradient: true,
        border: true,
        onClick: () => this.scene.useHint()
      }
    );
    this.hintBtn.setDepth(GameUtils.getDepthLayers().UI);
    
    // SIMPLIFIED: Add header elements to header container if available
    if (this.scene.headerContainer) {
      this.scene.headerContainer.add([this.progressText, this.hintBtn]);
      console.log('📱 Header elements added to header container');
    }
  }

  setupHorizontalHeader() {
    const { width } = this.scene.cameras.main;
    
    // UI-010: Move score below header row to avoid hint button overlap
    
    // Add subtle background protection for score text visibility
    const scoreTextBg = this.scene.add.rectangle(width / 2, 85, 120, 28, 0x000000, 0.4)
      .setOrigin(0.5, 0.5)
      .setDepth(GameUtils.getDepthLayers().UI - 0.1);
    
    this.progressText = this.scene.add.text(width / 2, 85, `Progress: 0`, {
      font: '16px Arial',
      fill: '#fff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Keep the right-aligned score as backup (will be hidden in favor of left score)
    this.scoreText = this.scene.add.text(width - 50, 70, `Progress: 0`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(GameUtils.getDepthLayers().UI).setVisible(false);
    
    // Hint button (using fixed ButtonFactory icon positioning)
    this.hintBtn = ButtonFactory.createButton(
      this.scene,
      width - 90,  // Positioned to fit properly
      50,  // Same level as back button for visual balance
      `Hint (-${this.scene.scoreManager ? this.scene.scoreManager.scoringConfig.hintPenalty : 220})`,  // Text without emoji
      'primary',
      {
        icon: '💡',  // Light bulb icon (theme-neutral)
        paddingX: 12,
        paddingY: 8,
        onClick: () => this.scene.useHint()
      }
    );
    this.hintBtn.setDepth(GameUtils.getDepthLayers().UI);
  }

  setupButtons() {
    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width, height } = viewport;
    
    // Submit button (hidden since we're using integrated button in active row)
    this.submitBtn = ButtonFactory.createButton(
      this.scene,
      width - 70,
      300,
      'Submit',
      'primary',
      {
        icon: '✅',
        onClick: () => this.scene.submitGuess()
      }
    );
    this.submitBtn.setDepth(GameUtils.getDepthLayers().UI + 10);
    this.submitBtn.setVisible(false); // Hidden with inline submission approach
    
    // Configure hint button interactivity
  // Hint button already configured in creation; ScoreManager will manage enabled/disabled state
    
    // Back button in top-left header (proper UX pattern) - GameScreenFooterLayoutFix
    const layout = GameUtils.getResponsiveLayout(width, height);
    const backBtn = ButtonFactory.createButton(
      this.scene,
      60,
      50,
      'Back',
      'danger',
      {
        icon: '↩️',
        pattern: 'candycane',
        border: true,
        paddingX: 12,  // Match hint button padding
        paddingY: 8,   // Match hint button padding to make it thinner
        onClick: () => this.scene.scene.start('MainMenu')
      }
    );
    backBtn.setDepth(GameUtils.getDepthLayers().UI);
  }

  setupBackground() {
    // Gentle Christmas background for gameplay (less distracting)
    BackgroundManager.setupGentleChristmas(this.scene, 'game');
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
    // Set very high depth to ensure modal appears above all content (header/footer are at 1000)
    this.errorMessage.setDepth(2000);
    
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

  // REMOVED: Game over overlays - now handled by RoundOver scene for consistency
  // showGameWon() and showGameLost() methods removed to eliminate redundant UI
  // All win/loss states now properly handled in RoundOver.js scene

  showRestartButton() {
    this.scene.time.delayedCall(2000, () => {
      const restartBtn = ButtonFactory.createButton(
        this.scene,
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height / 2 + 100,
        'Play Again',
        'primary',
        {
          icon: '🔁',
          onClick: () => this.scene.scene.start('MainMenu')
        }
      );
      restartBtn.setDepth(GameUtils.getDepthLayers().GAME_OVER);
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

  updateProgressDisplay() {
    // Single method for updating progress display
    const progressPoints = this.scene.scoreManager.getProgressPoints();
    const gameStats = this.scene.gameStateManager.getGameStats();
    
    // Update main progress display  
    if (this.progressText) {
      this.progressText.setText(`Progress: ${progressPoints}`);
    }
    
    // Update guesses remaining (if needed separately)
    if (this.guessesText) {
      this.guessesText.setText(`Guesses: ${gameStats.guessesRemaining}`);
    }
  }

  getUIElements() {
    return {
      progressText: this.progressText,
      scoreText: this.scoreText,
      hintText: this.hintText,
      hintBtn: this.hintBtn,
      submitBtn: this.submitBtn
    };
  }

  /**
   * Setup Christmas feedback legend - explains the new symbol meanings
   * Positioned responsively to not interfere with game elements
   */
  setupChristmasLegend() {
    const { width, height } = this.scene.cameras.main;
    
    // Christmas feedback legend configuration
    const legendItems = [
      { 
        symbolType: 'perfect', 
        description: 'Right symbol & spot', 
        explanation: 'Right spot'
      },
      { 
        symbolType: 'close', 
        description: 'Right symbol, wrong spot', 
        explanation: 'Wrong spot'
      }
    ];
    
    // MOBILE OPTIMIZATION: Compact horizontal legend at bottom of screen
    const isSmallScreen = width < 500;
    const legendHeight = 40; // Increased from 35px
    const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
    
    // Position legend at bottom with safe margins (unified layout - no footer)
    const bottomMargin = 20;
    const legendY = height - safeAreaInsets.bottom - bottomMargin - (legendHeight / 2);
    
    // Horizontal layout for compactness
    const totalWidth = isSmallScreen ? width - 40 : 300;
    const itemWidth = totalWidth / 2;
    const startX = (width - totalWidth) / 2;
    
    // Create compact legend background (properly centered)
    const legendBg = this.scene.add.rectangle(width / 2, legendY, totalWidth + 20, legendHeight, 0x1a1a1a, 0.9)
      .setStrokeStyle(1, 0xffd700, 0.4)
      .setDepth(GameUtils.getDepthLayers().UI);
    
    // Create legend items in horizontal layout (better alignment)
    legendItems.forEach((item, index) => {
      // Better balanced positioning
      const itemCenterX = startX + 30 + (index * (totalWidth / 2));
      const symbolX = itemCenterX - 30;        const textX = itemCenterX + 10; // Slightly more to the right for better alignment// Aligned better with symbols
      
      // Create Christmas symbol
      try {
        const symbolKey = this.scene.getFeedbackImageKey(item.symbolType);
        
        if (this.scene.textures.exists(symbolKey)) {
          const symbol = this.scene.add.image(symbolX, legendY, symbolKey)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(16, 16)
            .setDepth(GameUtils.getDepthLayers().UI + 0.1);
        } else {
          // Fallback to text symbols
          const fallbackSymbols = { 'perfect': '★', 'close': '🔔' };
          this.scene.add.text(symbolX, legendY, fallbackSymbols[item.symbolType] || '?', {
            font: '14px Arial',
            fill: '#FFD700'
          }).setOrigin(0.5, 0.5).setDepth(GameUtils.getDepthLayers().UI + 0.1);
        }
      } catch (error) {
        console.warn(`Could not create legend symbol for ${item.symbolType}:`, error);
        // Fallback text
        this.scene.add.text(symbolX, legendY, item.symbolType === 'perfect' ? '★' : '🔔', {
          font: '14px Arial',
          fill: '#FFD700'
        }).setOrigin(0.5, 0.5).setDepth(GameUtils.getDepthLayers().UI + 0.1);
      }
      
      // Description text (larger and better positioned)
      this.scene.add.text(textX, legendY, item.description, {
        font: `${isSmallScreen ? '12px' : '14px'} Arial`, // Increased from 10px/12px
        fill: '#fff'
      }).setOrigin(0, 0.5).setDepth(GameUtils.getDepthLayers().UI + 0.1);
    });
    
    // Store legend elements for potential future updates
    this.legendElements = {
      background: legendBg
    };
  }
}