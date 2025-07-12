// GameStateManager.js - Handles game state logic and progression

class GameStateManager {
  constructor(scene) {
    this.scene = scene;
    this.elements = GameUtils.getGameElements();
    this.codeLength = 4;
    this.maxGuesses = 10;
    this.guessesRemaining = 10;
    this.secretCode = [];
    this.isWon = false;
    this.gameComplete = false;
  }

  initializeGameState() {
    this.codeLength = this.scene.registry.get('codeLength') || 4;
    this.maxGuesses = this.scene.registry.get('maxGuesses') || 10;
    this.guessesRemaining = this.maxGuesses;
    
    // Generate random code
    this.secretCode = GameUtils.generateRandomCode(this.elements, this.codeLength);
  }

  processGuess(guess) {
    const feedback = GameUtils.calculateFeedback(guess, this.secretCode);
    
    // Update guesses remaining
    this.guessesRemaining--;
    
    // Check game state
    const isWin = feedback.black === this.codeLength;
    const isGameOver = this.guessesRemaining <= 0;
    
    // Update internal state
    if (isWin) {
      this.isWon = true;
      this.gameComplete = true;
    } else if (isGameOver) {
      this.gameComplete = true;
    }
    
    return {
      feedback,
      isWin,
      isGameOver,
      guessesRemaining: this.guessesRemaining
    };
  }

  isGameWon(feedback) {
    return feedback.black === this.codeLength;
  }

  isGameOver() {
    return this.guessesRemaining <= 0;
  }

  getSecretCode() {
    return [...this.secretCode];
  }

  getGameElements() {
    return [...this.elements];
  }

  getGameStats() {
    return {
      codeLength: this.codeLength,
      maxGuesses: this.maxGuesses,
      guessesRemaining: this.guessesRemaining,
      secretCode: [...this.secretCode],
      isWon: this.isWon,
      gameComplete: this.gameComplete
    };
  }

  reset() {
    this.guessesRemaining = this.maxGuesses;
    this.secretCode = GameUtils.generateRandomCode(this.elements, this.codeLength);
    this.isWon = false;
    this.gameComplete = false;
  }
}