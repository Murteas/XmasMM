// GameScene.js - Main game scene

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // Background already loaded by MainMenu, but ensure it's available
    if (!this.textures.exists('bg')) {
      this.load.image('bg', 'assets/bg.jpg');
    }
  }
  
  create() {
    this.initializeGame();
    this.setupBackground();
    this.setupGameState();
    this.setupManagers();
    this.setupUI();
    this.setupInlineGuessing();
    this.setupButtons();
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
    console.log('Secret code:', this.secretCode); // For testing
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
    
    // Guesses remaining
    this.guessesText = this.add.text(50, 70, `Guesses: ${this.guessesRemaining}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setDepth(GameUtils.getDepthLayers().UI);
    
    // Score
    this.scoreText = this.add.text(width - 50, 70, `Score: ${this.scoreManager.getCurrentScore()}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(GameUtils.getDepthLayers().UI);
    
    // Santa's Hint status
    this.hintText = this.add.text(width / 2, 70, 'Hint: Locked', {
      font: '18px Arial',
      fill: '#888'
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
      // Position button to the right of the active row
      this.submitBtn.setPosition(width - 70, activeRowY);
    }
  }
  
  setupButtons() {
    const { width, height } = this.cameras.main;
    
    // Submit button (will be repositioned by positionSubmitButton)
    this.submitBtn = this.add.text(width - 70, 300, 'Submit', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI + 1);
    
    this.submitBtn.on('pointerdown', () => {
      this.submitGuess();
    });
    
    // Santa's Hint button
    this.hintBtn = this.add.text(width / 2, 220, "Santa's Hint", {
      font: '18px Arial',
      fill: '#888',
      backgroundColor: '#333',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    this.hintBtn.setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerdown', () => {
      this.useSantasHint();
    });
    
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
    // Create a temporary error message
    const { width } = this.cameras.main;
    const errorText = this.add.text(width / 2, 240, 'Please fill all slots!', {
      font: '16px Arial',
      fill: '#e74c3c',
      backgroundColor: '#000',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 2);
    
    // Remove the error message after 2 seconds
    this.time.delayedCall(2000, () => {
      if (errorText) {
        errorText.destroy();
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
      // Apply the hint to the active row
      this.historyManager.activeRowGuess[hintResult.position] = hintResult.element;
      
      // Update the visual display of the active row
      if (this.historyManager.activeRowElements && this.historyManager.activeRowElements[hintResult.position]) {
        const elementData = this.historyManager.activeRowElements[hintResult.position];
        elementData.text.setText(hintResult.element);
        elementData.text.setFill('#fff');
      }
      
      // Visual feedback
      const { width } = this.cameras.main;
      const hintText = this.add.text(width / 2, 250, 
        `Santa's Hint: Position ${hintResult.position + 1} is ${hintResult.element}!`, {
        font: '16px Arial',
        fill: '#ffd700',
        backgroundColor: '#000',
        padding: { left: 8, right: 8, top: 4, bottom: 4 }
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 2);
      
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
    this.currentGuessSlots.forEach(slot => slot.slot.disableInteractive());
    
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
}
