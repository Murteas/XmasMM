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
    this.setupCurrentGuessRow();
    this.setupButtons();
    this.initializeCurrentGuess();
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
    this.currentGuess = [];
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
  
  setupCurrentGuessRow() {
    const { width } = this.cameras.main;
    const startX = width / 2 - (this.codeLength * 30);
    const y = 120;
    
    this.currentGuessSlots = [];
    for (let i = 0; i < this.codeLength; i++) {
      const x = startX + i * 60;
      const slot = this.add.rectangle(x, y, 50, 50, 0x444444)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(GameUtils.getDepthLayers().CURRENT_GUESS);
      
      const text = this.add.text(x, y, this.elements[0], {
        font: '12px Arial',
        fill: '#fff'
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().CURRENT_GUESS + 0.1);
      
      slot.on('pointerdown', () => {
        this.cycleElement(i);
      });
      
      this.currentGuessSlots.push({ slot, text, index: i });
    }
  }
  
  setupButtons() {
    const { width, height } = this.cameras.main;
    
    // Submit button
    this.submitBtn = this.add.text(width / 2, 180, 'Submit Guess', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().UI);
    
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

  initializeCurrentGuess() {
    for (let i = 0; i < this.codeLength; i++) {
      this.currentGuess.push(this.elements[0]); // Default to Santa
    }
    this.updateCurrentGuessDisplay();
  }
  
  cycleElement(slotIndex) {
    const currentElement = this.currentGuess[slotIndex];
    const currentIndex = this.elements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % this.elements.length;
    this.currentGuess[slotIndex] = this.elements[nextIndex];
    this.updateCurrentGuessDisplay();
  }
  
  updateCurrentGuessDisplay() {
    this.currentGuessSlots.forEach((slot, index) => {
      slot.text.setText(this.currentGuess[index]);
    });
  }
  
  submitGuess() {
    const feedback = GameUtils.calculateFeedback(this.currentGuess, this.secretCode);
    
    // Add to history
    this.historyManager.addGuess(this.currentGuess, feedback);
    
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
  }
  
  updateScore() {
    this.scoreManager.calculateScore(this.maxGuesses, this.guessesRemaining, this.codeLength);
    this.scoreManager.updateScoreDisplay(this.scoreText);
  }
  
  useSantasHint() {
    const hintResult = this.scoreManager.useSantasHint(
      this.secretCode, 
      this.currentGuess, 
      this.hintBtn, 
      this.hintText
    );
    
    if (hintResult) {
      this.updateCurrentGuessDisplay();
      
      // Visual feedback
      this.add.text(this.cameras.main.width / 2, 250, 
        `Position ${hintResult.position + 1}: ${hintResult.element}`, {
        font: '16px Arial',
        fill: '#e74c3c'
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI);
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
