// GameStateManager.js - Handles game state logic and progression

class GameStateManager {
  constructor(scene) {
    this.scene = scene;
    this.elements = GameUtils.getGameElements();
    this.codeLength = 4;
    this.maxGuesses = 10;
    this.guessesRemaining = 10;
    this.secretCode = [];
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
    
    return {
      feedback,
      isWin: feedback.black === this.codeLength,
      isGameOver: this.guessesRemaining <= 0,
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
      secretCode: [...this.secretCode]
    };
  }

  reset() {
    this.guessesRemaining = this.maxGuesses;
    this.secretCode = GameUtils.generateRandomCode(this.elements, this.codeLength);
  }
}