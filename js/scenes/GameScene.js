// GameScene.js - Main game scene (refactored for modular architecture)
// Uses global LayoutConfig (loaded via ModuleLoader)

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // Determine if we're running from tests directory
    // Dynamic asset path selection based on environment
    const isTestEnvironment = TestConfig.isTestEnvironment();
    const assetPath = TestConfig.getAssetPath();
    
    // Background already loaded by MainMenu, but ensure it's available
    if (!this.textures.exists('bg')) {
      this.load.image('bg', `${assetPath}bg_mobile2.png`);
    }
    
    // Load Christmas element images (responsive sizing for different screen densities)
    // Base resolution (1x) images
    this.load.image('santa_1x', `${assetPath}santa_1x.png`);
    this.load.image('present_1x', `${assetPath}present_1x.png`);
    this.load.image('candycane_1x', `${assetPath}candycane_1x.png`);
    this.load.image('star_1x', `${assetPath}star_1x.png`);
    this.load.image('tree_1x', `${assetPath}tree_1x.png`);
    this.load.image('snowflake_1x', `${assetPath}snowflake_1x.png`);
    
    // Load base images as fallbacks (present.png, star.png, tree.png, etc.)
    this.load.image('santa', `${assetPath}santa.png`);
    this.load.image('present', `${assetPath}present.png`);
    this.load.image('candycane', `${assetPath}candycane.png`);
    this.load.image('star', `${assetPath}star.png`);
    this.load.image('tree', `${assetPath}tree.png`);
    this.load.image('snowflake', `${assetPath}snowflake.png`);
    
    // Christmas feedback symbols (1x resolution)
    this.load.image('feedback_perfect_star_1x', `${assetPath}feedback_perfect_star_1x.png`);
    this.load.image('feedback_close_bell_1x', `${assetPath}feedback_close_bell_1x.png`);
    
    // Retina (2x) images
    this.load.image('santa_2x', `${assetPath}santa_2x.png`);
    this.load.image('present_2x', `${assetPath}present_2x.png`);
    this.load.image('candycane_2x', `${assetPath}candycane_2x.png`);
    this.load.image('star_2x', `${assetPath}star_2x.png`);
    this.load.image('tree_2x', `${assetPath}tree_2x.png`);
    this.load.image('snowflake_2x', `${assetPath}snowflake_2x.png`);
    
    // Christmas feedback symbols (2x resolution)
    this.load.image('feedback_perfect_star_2x', `${assetPath}feedback_perfect_star_2x.png`);
    this.load.image('feedback_close_bell_2x', `${assetPath}feedback_close_bell_2x.png`);
    
    // Super Retina (3x) images  
    this.load.image('santa_3x', `${assetPath}santa_3x.png`);
    this.load.image('present_3x', `${assetPath}present_3x.png`);
    this.load.image('candycane_3x', `${assetPath}candycane_3x.png`);
    this.load.image('star_3x', `${assetPath}star_3x.png`);
    this.load.image('tree_3x', `${assetPath}tree_3x.png`);
    this.load.image('snowflake_3x', `${assetPath}snowflake_3x.png`);
    
    // Christmas feedback symbols (3x resolution)
    this.load.image('feedback_perfect_star_3x', `${assetPath}feedback_perfect_star_3x.png`);
    this.load.image('feedback_close_bell_3x', `${assetPath}feedback_close_bell_3x.png`);
    
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
    
    // Log successful loads in test environment only
    this.load.on('fileload', (key, type, url) => {
      if (TestConfig.shouldShowDebugLogs()) {
        console.log(`✅ Loaded ${type}: ${key} from ${url}`);
      }
    });
    
    // When all assets are loaded, verify they're accessible
    this.load.on('complete', () => {
      if (TestConfig.shouldShowDebugLogs()) {
        console.log('🎄 Asset loading complete. Verifying textures...');
        const elements = ['santa', 'present', 'candycane', 'star', 'tree', 'snowflake'];
        elements.forEach(element => {
          const key1x = `${element}_1x`;
          const key2x = `${element}_2x`;
          const key3x = `${element}_3x`;
          
          console.log(`🔍 Checking ${element}:`);
          console.log(`  ${key1x}: ${this.textures.exists(key1x) ? '✅' : '❌'}`);
          console.log(`  ${key2x}: ${this.textures.exists(key2x) ? '✅' : '❌'}`);
          console.log(`  ${key3x}: ${this.textures.exists(key3x) ? '✅' : '❌'}`);
        });
      }
    });
  }
  
  create() {
    // Show loading state first (now that camera is ready)
    this.uiLayoutManager = new UILayoutManager(this);
    this.uiLayoutManager.showLoadingState();
    
    // Initialize debug mode
    this.debugMode = false;
    this.setupDebugKeys();
    
    // Small delay to ensure loading screen is visible
    this.time.delayedCall(100, () => {
      this.initializeGame();
      this.setupManagers();
      this.setupGameComponents();
      
      // Hide loading state with smooth transition
      this.uiLayoutManager.hideLoadingState();
    });
  }

  initializeGame() {
    const { width, height } = this.cameras.main;
    
    // Use subtle Christmas background with user's theme preference (less distracting for gameplay)
    BackgroundManager.setupSubtleChristmas(this, 'game');
  }

  setupManagers() {
    // Initialize all specialized managers
    this.gameStateManager = new GameStateManager(this);
    this.scoreManager = new ScoreManager(this);
    this.safeAreaManager = new SafeAreaManager(this);
    
    // Initialize audio manager for Christmas sound effects
    this.audioManager = new AudioManager(this);
    this.audioManager.initializeSounds();
    
    // SIMPLIFIED: Always use standard HistoryManager with Phaser containers
    // Create simple three-zone layout using pure Phaser containers
    this.createSimplePhaserLayout();
    
    this.historyManager = new HistoryManager(this);
    this.gameInputHandler = new GameInputHandler(this);
    
    // Initialize game state
    this.gameStateManager.initializeGameState();
    
    // Set up elements reference for compatibility
    this.elements = this.gameStateManager.getGameElements();
    this.codeLength = this.gameStateManager.getGameStats().codeLength;
    this.secretCode = this.gameStateManager.getSecretCode();
  }

  createSimplePhaserLayout() {
    // Simplified three-zone layout using pure Phaser containers
    const { width, height } = this.cameras.main;
    const safeAreaInsets = this.safeAreaManager.getInsets();
    
    // === SIMPLE THREE-ZONE LAYOUT WITH SAFE AREA SUPPORT ===
    // Header container (fixed at top)
    this.headerContainer = this.add.container(0, 0);
    this.headerContainer.setDepth(1000);
    
    // Scrollable content container (middle area)
  const headerHeight = LayoutConfig.THREE_ZONE_HEADER;
  const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
    this.scrollableContainer = this.add.container(0, headerHeight);
    this.scrollableContainer.setDepth(500);
    
    // Footer container (fixed at bottom with safe area support + minimal gesture margin)
    const swipeGestureMargin = 5; // REDUCED from 10px to 5px - Reclaim more space for gameplay area
    const footerY = height - footerHeight - safeAreaInsets.bottom - swipeGestureMargin;
    this.footerContainer = this.add.container(0, footerY);
    this.footerContainer.setDepth(1000);
    
    // Auto-update footer position when safe areas change
    this.safeAreaManager.onInsetsChanged((insets) => {
      const newFooterY = height - footerHeight - insets.bottom - swipeGestureMargin;
      this.footerContainer.y = newFooterY;
      if (TestConfig.shouldShowDebugLogs()) {
        console.log(`📱 Footer position updated: y=${newFooterY} (safe bottom: ${insets.bottom}px + ${swipeGestureMargin}px gesture margin)`);
      }
    });
    
    if (TestConfig.shouldShowDebugLogs()) {
      console.log('📱 Simple Phaser three-zone layout created with safe area support');
      console.log(`  - Header: y=0, depth=1000`);
      console.log(`  - Scrollable: y=${headerHeight}, depth=500`);
      console.log(`  - Footer: y=${footerY}, depth=1000 (safe bottom: ${safeAreaInsets.bottom}px + gesture margin: ${swipeGestureMargin}px)`);
    }
  }

  setupGameComponents() {
    // Set up all game components using the managers
    this.uiLayoutManager.setupBackground();
    this.uiLayoutManager.setupUI();
    this.uiLayoutManager.setupButtons();
    // EXPERT UX DECISION: Legend removed for maximum mobile space utilization
    // Modern mobile game pattern: Users learn from "How to Play", no persistent reminders needed
    // Saves 60-80px of valuable screen space - 25% improvement in usable area
    // this.uiLayoutManager.setupChristmasLegend(); // REMOVED for mobile optimization
    this.setupInlineGuessing();
  }
  
  setupInlineGuessing() {
    // Create the first active row for inline editing
    this.createNewActiveRow();
  }

  setupDebugKeys() {
  // Clean up any existing debug key listeners to prevent duplicates
  if (this._debugKeysRegistered) {
    this.input.keyboard.removeAllListeners('keydown');
  }
  this._debugKeysRegistered = true;

  // Set up keyboard input for debug mode (developer-only convenience)
  this.input.keyboard.on('keydown', (event) => {
      // Only process debug keys if we have game managers ready
      if (!this.gameInputHandler || !this.gameStateManager) return;
      
      const key = event.key.toUpperCase();
      
      switch (key) {
        case 'D':
          this.toggleDebugMode();
          break;
        case 'R':
          if (this.debugMode) this.gameInputHandler.fillRandomGuess();
          break;
        case 'W':
          if (this.debugMode) this.gameInputHandler.autoWin();
          break;
        case 'F':
          if (this.debugMode) this.gameInputHandler.fastForward();
          break;
        case 'L':
          if (this.debugMode) this.gameInputHandler.jumpToLastRound();
          break;
      }
    });
  }

  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    
    // Visual indicator
    if (this.debugMode) {
      console.log('🔧 DEBUG MODE ENABLED');
      console.log('  R - Random guess | W - Auto win | F - Fast forward | L - Last round | D - Toggle debug');
      
      // Show debug indicator on screen
      if (this.debugIndicator) this.debugIndicator.destroy();
      this.debugIndicator = this.add.text(10, 10, 'DEBUG', {
        font: '12px Arial',
        fill: '#ff0000',
        backgroundColor: '#000000',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setDepth(9999);
    } else {
      console.log('🔧 DEBUG MODE DISABLED');
      if (this.debugIndicator) {
        this.debugIndicator.destroy();
        this.debugIndicator = null;
      }
    }
  }

  createNewActiveRow() {
    // Determine if we should pre-fill with previous guess
    const lastGuess = this.historyManager.getGuessHistory().length > 0 
      ? this.historyManager.getGuessHistory().slice(-1)[0] 
      : null;
    
    // Create the active row in the history area
    this.historyManager.createActiveRow(lastGuess);
  }
  
  submitGuess() {
    this.gameInputHandler.processGuessSubmission();
  }

  showIncompleteGuessError() {
    this.uiLayoutManager.showIncompleteGuessError();
  }
  
  useSantasHint() {
    this.gameInputHandler.processSantasHint();
  }
  
  // Helper method to get appropriate image key based on device pixel ratio
  getElementImageKey(elementName) {
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Map element names to the exact asset keys loaded in preload()
    const normalizedName = elementName.toLowerCase().replace(/\s+/g, ''); // Remove spaces
    
    // For now, use only 1x images to ensure compatibility across all platforms
    // This avoids 404 errors on GitHub Pages where some asset files might be missing
    const suffix = '_1x';
    const imageKey = `${normalizedName}${suffix}`;
    
    // Enhanced debugging for asset loading
    if (TestConfig.shouldShowDebugLogs()) {
      console.log(`Asset Debug: Looking for element '${elementName}' -> normalized '${normalizedName}' -> key '${imageKey}'`);
    }
    
    // Verify the texture exists before returning the key
    if (this.textures.exists(imageKey)) {
      const texture = this.textures.get(imageKey);
      if (texture && texture.source && texture.source[0]) {
        if (TestConfig.shouldShowDebugLogs()) console.log(`Asset Debug: Found valid texture ${imageKey}`);
        return imageKey;
      } else {
        if (TestConfig.shouldShowDebugLogs()) console.warn(`Asset Debug: Texture ${imageKey} exists but is invalid`);
      }
    }
    
    // Try fallback to base image without suffix (e.g., Present.png, Star.png, Tree.png)
    if (TestConfig.shouldShowDebugLogs()) console.warn(`Asset Debug: Texture not found: ${imageKey}, trying base image fallback`);
    const baseKey = normalizedName;
    if (this.textures.exists(baseKey)) {
      const baseTexture = this.textures.get(baseKey);
      if (baseTexture && baseTexture.source && baseTexture.source[0]) {
        if (TestConfig.shouldShowDebugLogs()) console.log(`Asset Debug: Using valid base fallback ${baseKey}`);
        return baseKey;
      }
    }
    
    if (TestConfig.shouldShowDebugLogs()) {
      console.error(`Asset Debug: No valid texture found for ${elementName}`);
      console.log(`Asset Debug: Available texture keys:`, Object.keys(this.textures.list));
    }
    return '__MISSING'; // Return a key that will trigger Phaser's missing texture display
  }
  
  /**
   * Get the appropriate feedback symbol image key based on device pixel ratio
   * @param {string} symbolType - 'perfect', 'close', or 'wrong'
   * @returns {string} The image key for the feedback symbol
   */
  getFeedbackImageKey(symbolType) {
    const pixelRatio = window.devicePixelRatio || 1;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let suffix;
    if (isMobile) {
      // Force 1x for mobile devices to ensure compatibility
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
    
    // Map feedback types to Christmas symbols (Mastermind only uses perfect and close)
    const symbolMap = {
      'perfect': 'feedback_perfect_star',
      'close': 'feedback_close_bell'
    };
    
    const baseKey = symbolMap[symbolType];
    if (!baseKey) {
      console.warn(`Unknown feedback symbol type: ${symbolType}. Mastermind only uses 'perfect' and 'close'.`);
      return null; // No symbol for invalid types
    }
    
    return `${baseKey}${suffix}`;
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

  shutdown() {
    // Clean up debug key listeners to prevent conflicts on restart
    if (this._debugKeysRegistered) {
      this.input.keyboard.removeAllListeners('keydown');
      this._debugKeysRegistered = false;
    }
    
    // Clean up any remaining UI elements
    if (this.uiLayoutManager) {
      this.uiLayoutManager.destroy && this.uiLayoutManager.destroy();
    }
  }
}
