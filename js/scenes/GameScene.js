// GameScene.js - Main game scene

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // Determine if we're running from tests directory
    const isTestEnvironment = window.location.pathname.includes('/tests/');
    const assetPath = isTestEnvironment ? '../assets/' : 'assets/';
    
    console.log(`Asset Debug: Running in ${isTestEnvironment ? 'test' : 'main'} environment, using path: ${assetPath}`);
    
    // Background already loaded by MainMenu, but ensure it's available
    if (!this.textures.exists('bg')) {
      this.load.image('bg', `${assetPath}bg_mobile2.png`);
    }
    
    // Load Christmas element images (responsive sizing for different screen densities)
    // Base resolution (1x) images
    this.load.image('santa_1x', `${assetPath}santa_1x.png`);
    this.load.image('present_1x', `${assetPath}present_1x.png`);
    this.load.image('mistletoe_1x', `${assetPath}mistletoe_1x.png`);
    this.load.image('star_1x', `${assetPath}star_1x.png`);
    this.load.image('tree_1x', `${assetPath}tree_1x.png`);
    this.load.image('snowflake_1x', `${assetPath}snowflake_1x.png`);
    
    // Retina (2x) images
    this.load.image('santa_2x', `${assetPath}santa_2x.png`);
    this.load.image('present_2x', `${assetPath}present_2x.png`);
    this.load.image('mistletoe_2x', `${assetPath}mistletoe_2x.png`);
    this.load.image('star_2x', `${assetPath}star_2x.png`);
    this.load.image('tree_2x', `${assetPath}tree_2x.png`);
    this.load.image('snowflake_2x', `${assetPath}snowflake_2x.png`);
    
    // Super Retina (3x) images  
    this.load.image('santa_3x', `${assetPath}santa_3x.png`);
    this.load.image('present_3x', `${assetPath}present_3x.png`);
    this.load.image('mistletoe_3x', `${assetPath}mistletoe_3x.png`);
    this.load.image('star_3x', `${assetPath}star_3x.png`);
    this.load.image('tree_3x', `${assetPath}tree_3x.png`);
    this.load.image('snowflake_3x', `${assetPath}snowflake_3x.png`);
    
    // Show loading progress
    this.load.on('progress', (value) => {
      if (this.loadingText) {
        this.loadingText.setText(`Loading Christmas Magic... ${Math.round(value * 100)}%`);
      }
    });
    
    // Handle loading errors with better reporting
    this.load.on('fileerror', (key, type, url) => {
      console.error(`🚨 Failed to load ${type}: ${key} from ${url}`);
    });
    
    // Log successful loads
    this.load.on('fileload', (key, type, url) => {
      console.log(`✅ Loaded ${type}: ${key} from ${url}`);
    });
    
    // When all assets are loaded, verify they're accessible
    this.load.on('complete', () => {
      console.log('🎄 Asset loading complete. Verifying textures...');
      const elements = ['santa', 'present', 'mistletoe', 'star', 'tree', 'snowflake'];
      elements.forEach(element => {
        const key1x = `${element}_1x`;
        const key2x = `${element}_2x`;
        const key3x = `${element}_3x`;
        
        console.log(`🔍 Checking ${element}:`);
        console.log(`  ${key1x}: ${this.textures.exists(key1x) ? '✅' : '❌'}`);
        console.log(`  ${key2x}: ${this.textures.exists(key2x) ? '✅' : '❌'}`);
        console.log(`  ${key3x}: ${this.textures.exists(key3x) ? '✅' : '❌'}`);
      });
    });
  }
  
  create() {
    // Show loading state first (now that camera is ready)
    this.showLoadingState();
    
    // Small delay to ensure loading screen is visible
    this.time.delayedCall(100, () => {
      this.initializeGame();
      this.setupBackground();
      this.setupGameState();
      this.setupManagers();
      this.setupUI();
      this.setupInlineGuessing();
      this.setupButtons();
      
      // Hide loading state with smooth transition
      this.hideLoadingState();
    });
  }

  initializeGame() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');
  }

  setupBackground() {
    const { width, height } = this.cameras.main;
    
    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(GameUtils.getDepthLayers().BACKGROUND);
    
    // Add dark overlay to improve contrast
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);
    overlay.setDepth(GameUtils.getDepthLayers().OVERLAY);
  }

  setupGameState() {
    this.elements = GameUtils.getGameElements();
    this.codeLength = this.registry.get('codeLength') || 4;
    this.maxGuesses = this.registry.get('maxGuesses') || 10;
    this.guessesRemaining = this.maxGuesses;
    
    // Generate random code
    this.secretCode = GameUtils.generateRandomCode(this.elements, this.codeLength);
  }

  setupManagers() {
    this.scoreManager = new ScoreManager(this);
    this.historyManager = new HistoryManager(this);
  }
  
  setupUI() {
    const { width, height } = this.cameras.main;
    
    // Title
    this.add.text(width / 2, 30, 'XmasMM', {
      font: '24px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Create responsive header layout for game state info
    this.setupHeaderLayout();
  }

  setupHeaderLayout() {
    const { width } = this.cameras.main;
    
    // MOBILE UX IMPROVEMENT: Responsive header layout
    // - Santa's Hint button moved to persistent header (never covered by scrolling)
    // - Responsive design: horizontal layout on larger screens, stacked on small screens
    // - Ensures 44px+ touch targets and proper spacing for mobile accessibility
    // - Follows mobile app best practices for persistent action positioning
    
    // Determine layout based on screen width
    const isSmallScreen = width < 400;
    
    if (isSmallScreen) {
      // Stacked layout for small screens (iPhone SE, etc.)
      this.setupStackedHeader();
    } else {
      // Horizontal layout for larger screens
      this.setupHorizontalHeader();
    }
  }

  setupStackedHeader() {
    const { width } = this.cameras.main;
    
    // Row 1: Guesses and Score
    this.guessesText = this.add.text(50, 70, `Guesses: ${this.guessesRemaining}`, {
      font: '16px Arial',
      fill: '#fff'
    }).setDepth(GameUtils.getDepthLayers().UI);
    
    this.scoreText = this.add.text(width - 50, 70, `Score: ${this.scoreManager.getCurrentScore()}`, {
      font: '16px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(GameUtils.getDepthLayers().UI);
    
    // Row 2: Hint status and button (centered)
    this.hintText = this.add.text(width / 2, 100, 'Hint: Locked', {
      font: '14px Arial',
      fill: '#888'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Santa's Hint button positioned in header
    this.hintBtn = this.add.text(width / 2, 130, "Santa's Hint", {
      font: '14px Arial',
      fill: '#888',
      backgroundColor: '#333',
      padding: { left: 10, right: 10, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
  }

  setupHorizontalHeader() {
    const { width } = this.cameras.main;
    
    // Single row layout for larger screens
    this.guessesText = this.add.text(50, 70, `Guesses: ${this.guessesRemaining}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setDepth(GameUtils.getDepthLayers().UI);
    
    this.scoreText = this.add.text(width - 50, 70, `Score: ${this.scoreManager.getCurrentScore()}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(GameUtils.getDepthLayers().UI);
    
    // Hint status (smaller, above button)
    this.hintText = this.add.text(width / 2, 60, 'Hint: Locked', {
      font: '12px Arial',
      fill: '#888'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    // Santa's Hint button in header (center)
    this.hintBtn = this.add.text(width / 2, 85, "Santa's Hint", {
      font: '16px Arial',
      fill: '#888',
      backgroundColor: '#333',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
  }
  
  setupInlineGuessing() {
    // Create the first active row for inline editing
    this.createNewActiveRow();
  }

  createNewActiveRow() {
    // Determine if we should pre-fill with previous guess
    const lastGuess = this.historyManager.getGuessHistory().length > 0 
      ? this.historyManager.getGuessHistory().slice(-1)[0] 
      : null;
    
    // Create the active row in the history area
    const activeRowY = this.historyManager.createActiveRow(lastGuess);
    
    // Position submit button near the active row
    this.positionSubmitButton(activeRowY);
  }

  positionSubmitButton(activeRowY) {
    const { width } = this.cameras.main;
    
    if (this.submitBtn) {
      // Fixed position approach - always position the button in the same location
      // Place it in the bottom right area, consistently positioned
      const buttonX = width - 80;
      const buttonY = 250; // Fixed Y position below the hint button
      this.submitBtn.setPosition(buttonX, buttonY);
    }
  }
  
  setupButtons() {
    const { width, height } = this.cameras.main;
    
    // Submit button (hidden since we're using integrated button in active row)
    this.submitBtn = this.add.text(width - 70, 300, 'Submit', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI + 10);
    
    // Hide the external submit button since we're using integrated approach
    this.submitBtn.setVisible(false);
    
    this.submitBtn.on('pointerdown', () => {
      this.submitGuess();
    });
    
    // Add touch feedback to submit button
    this.addButtonTouchFeedback(this.submitBtn, { colorTint: 0x2ecc71 });
    
    // Santa's Hint button is now set up in setupHeaderLayout() method
    // Configure its interactivity here
    this.hintBtn.setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerdown', () => {
      this.useSantasHint();
    });
    
    // Add touch feedback to hint button
    this.addButtonTouchFeedback(this.hintBtn, { colorTint: 0xe67e22 });
    
    // Back button
    const backBtn = this.add.text(50, height - 50, 'Back', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
    backBtn.on('pointerdown', () => {
      this.scene.start('DifficultySelection');
    });
    
    // Add touch feedback to back button
    this.addButtonTouchFeedback(backBtn, { colorTint: 0x7f8c8d });
  }
  
  submitGuess() {
    // Get the current guess from the active row
    const currentGuess = this.historyManager.submitActiveRowGuess();
    
    if (!currentGuess) {
      // The guess was incomplete or invalid
      return;
    }
    
    const feedback = GameUtils.calculateFeedback(currentGuess, this.secretCode);
    
    // Add to history
    this.historyManager.addGuess(currentGuess, feedback);
    
    // Update guesses remaining
    this.guessesRemaining--;
    this.guessesText.setText(`Guesses: ${this.guessesRemaining}`);
    
    // Check if won
    if (feedback.black === this.codeLength) {
      this.gameWon();
      return;
    }
    
    // Check if out of guesses
    if (this.guessesRemaining <= 0) {
      this.gameLost();
      return;
    }
    
    // Calculate and update score
    this.updateScore();
    
    // Check if Santa's Hint should be enabled
    this.scoreManager.checkHintAvailability(this.hintBtn, this.hintText);
    
    // Create new active row for next guess
    this.createNewActiveRow();
  }

  showIncompleteGuessError() {
    // Prevent multiple error messages
    if (this.errorMessage) return;
    
    const { width, height } = this.cameras.main;
    
    // Create error container for better positioning
    this.errorMessage = this.add.container(0, 0);
    
    // Error background with gentle animation
    const errorBg = this.add.rectangle(width / 2, height / 2, width * 0.8, 100, 0x000000, 0.9);
    errorBg.setStrokeStyle(2, 0xe74c3c);
    
    // Friendly error message
    const errorText = this.add.text(width / 2, height / 2 - 10, '🎄 Please select all Christmas elements! 🎄', {
      font: '18px Arial',
      fill: '#fff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: width * 0.7 }
    }).setOrigin(0.5);
    
    // Helpful hint
    const hintText = this.add.text(width / 2, height / 2 + 15, 'Tap empty slots to choose elements', {
      font: '14px Arial',
      fill: '#f39c12',
      align: 'center'
    }).setOrigin(0.5);
    
    this.errorMessage.add([errorBg, errorText, hintText]);
    this.errorMessage.setDepth(GameUtils.getDepthLayers().UI + 2);
    
    // Gentle bounce animation
    this.errorMessage.setScale(0.8);
    this.tweens.add({
      targets: this.errorMessage,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
    
    // Remove after 3 seconds with fade
    this.time.delayedCall(3000, () => {
      if (this.errorMessage) {
        this.tweens.add({
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
  
  updateScore() {
    this.scoreManager.calculateScore(this.maxGuesses, this.guessesRemaining, this.codeLength);
    this.scoreManager.updateScoreDisplay(this.scoreText);
  }
  
  useSantasHint() {
    // Get current guess from active row
    const currentGuess = this.historyManager.getActiveRowGuess();
    
    if (!currentGuess) {
      return;
    }
    
    const hintResult = this.scoreManager.useSantasHint(
      this.secretCode, 
      currentGuess, 
      this.hintBtn, 
      this.hintText
    );
    
    if (hintResult) {
      // Apply the hint to the active row using the proper method
      this.historyManager.selectElement(hintResult.position, hintResult.element);
      
      // Visual feedback with better positioning and higher depth
      const { width, height } = this.cameras.main;
      // Position hint text in a safe area (top of screen, below header)
      const isSmallScreen = width < 400;
      const hintY = isSmallScreen ? 140 : 110; // Position just below header
      
      const hintText = this.add.text(width / 2, hintY, 
        `Santa's Hint: Position ${hintResult.position + 1} is ${hintResult.element}!`, {
        font: '16px Arial',
        fill: '#ffd700',
        backgroundColor: '#000',
        padding: { left: 8, right: 8, top: 4, bottom: 4 }
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 10); // Higher depth for visibility over history
      
      // Remove hint text after 3 seconds
      this.time.delayedCall(3000, () => {
        if (hintText) {
          hintText.destroy();
        }
      });
    }
  }
  
  gameWon() {
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'YOU WON!', {
      font: '36px Arial',
      fill: '#27ae60',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().GAME_OVER);
    
    this.endGame();
  }
  
  gameLost() {
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'GAME OVER', {
      font: '36px Arial',
      fill: '#e74c3c',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().GAME_OVER);
    
    // Show solution
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 
      `Solution: ${this.secretCode.join(', ')}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().GAME_OVER);
    
    this.endGame();
  }
  
  endGame() {
    // Disable interactions
    this.submitBtn.disableInteractive();
    this.hintBtn.disableInteractive();
    
    // Disable active row interactions
    if (this.historyManager.hasActiveRow) {
      this.historyManager.removeActiveRow();
    }
    
    // Add restart button
    this.time.delayedCall(2000, () => {
      const restartBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Play Again', {
        font: '24px Arial',
        fill: '#fff',
        backgroundColor: '#3498db',
        padding: { left: 16, right: 16, top: 8, bottom: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().GAME_OVER);
      
      restartBtn.on('pointerdown', () => {
        this.scene.start('DifficultySelection');
      });
    });
  }
  
  // Helper method to get appropriate image key based on device pixel ratio
  getElementImageKey(elementName) {
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Map element names to the exact asset keys loaded in preload()
    const normalizedName = elementName.toLowerCase();
    
    // MOBILE FIX: Force 1x images for now to ensure compatibility
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let suffix;
    if (isMobile) {
      // Force 1x for mobile devices to ensure loading
      suffix = '_1x';
    } else {
      // Use device pixel ratio for desktop
      if (pixelRatio >= 3) {
        suffix = '_3x';
      } else if (pixelRatio >= 2) {
        suffix = '_2x';
      } else {
        suffix = '_1x';
      }
    }
    
    const imageKey = `${normalizedName}${suffix}`;
    
    // Enhanced debugging for asset loading (only show in test environments)
    const isTestEnvironment = window.location.pathname.includes('/tests/');
    if (isTestEnvironment) {
      console.log(`Asset Debug: Looking for element '${elementName}' -> normalized '${normalizedName}' -> key '${imageKey}'`);
    }
    
    // Verify the texture exists before returning the key
    if (this.textures.exists(imageKey)) {
      const texture = this.textures.get(imageKey);
      if (texture && texture.source && texture.source[0]) {
        if (isTestEnvironment) console.log(`Asset Debug: Found valid texture ${imageKey}`);
        return imageKey;
      } else {
        if (isTestEnvironment) console.warn(`Asset Debug: Texture ${imageKey} exists but is invalid`);
      }
    }
    
    if (isTestEnvironment) console.warn(`Asset Debug: Texture not found: ${imageKey}, trying fallback`);
    const fallbackKey = `${normalizedName}_1x`;
    if (this.textures.exists(fallbackKey)) {
      const fallbackTexture = this.textures.get(fallbackKey);
      if (fallbackTexture && fallbackTexture.source && fallbackTexture.source[0]) {
        if (isTestEnvironment) console.log(`Asset Debug: Using valid fallback ${fallbackKey}`);
        return fallbackKey;
      }
    }
    
    if (isTestEnvironment) {
      console.error(`Asset Debug: No valid texture found for ${elementName}`);
      console.log(`Asset Debug: Available texture keys:`, Object.keys(this.textures.list));
    }
    return '__MISSING'; // Return a key that will trigger Phaser's missing texture display
  }
  
  showLoadingState() {
    const { width, height } = this.cameras.main;
    
    // Only create if not already created
    if (this.loadingContainer) return;
    
    // Create loading container
    this.loadingContainer = this.add.container(0, 0);
    
    // Loading background
    const loadingBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    
    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 20, 'Loading Christmas Magic...', {
      font: '24px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Simple loading indicator (spinning snowflake)
    this.loadingSpinner = this.add.text(width / 2, height / 2 + 30, '❄️', {
      font: '32px Arial'
    }).setOrigin(0.5);
    
    // Add to container
    this.loadingContainer.add([loadingBg, this.loadingText, this.loadingSpinner]);
    this.loadingContainer.setDepth(1000);
    
    // Spin the snowflake
    this.loadingTween = this.tweens.add({
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
      
      this.tweens.add({
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
  
  addButtonTouchFeedback(button, config = {}) {
    const { 
      scaleDown = 0.95, 
      scaleUp = 1.05, 
      duration = 100,
      colorTint = 0xf39c12 
    } = config;
    
    button.on('pointerdown', () => {
      // Scale down and tint
      this.tweens.add({
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
      this.tweens.add({
        targets: button,
        scaleX: scaleUp,
        scaleY: scaleUp,
        duration: duration,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Return to normal scale
          this.tweens.add({
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
      this.tweens.killTweensOf(button);
      button.setScale(1);
      button.clearTint();
    });
  }
}
