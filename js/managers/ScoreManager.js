// ScoreManager.js - Handles scoring and hint availability

class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.currentScore = 0;
    this.hintUsed = false;
    this.hintThreshold = 500;
  }

  calculateScore(maxGuesses, guessesRemaining, codeLength) {
    const usedGuesses = maxGuesses - guessesRemaining;
    const multiplier = codeLength === 4 ? 100 : codeLength === 5 ? 150 : 200;
    this.currentScore = (maxGuesses - usedGuesses + 1) * multiplier;
    return this.currentScore;
  }

  updateScoreDisplay(scoreText) {
    scoreText.setText(`Score: ${this.currentScore}`);
  }

  checkHintAvailability(hintBtn, hintText) {
    if (!this.hintUsed && this.currentScore >= this.hintThreshold) {
      hintBtn.setStyle({ fill: '#fff', backgroundColor: '#e74c3c' });
      hintText.setText('Hint: Available').setStyle({ fill: '#fff' });
      return true;
    }
    return false;
  }

  useSantasHint(secretCode, currentGuess, hintBtn, hintText) {
    if (this.hintUsed || this.currentScore < this.hintThreshold) return null;
    
    this.hintUsed = true;
    const randomPosition = Math.floor(Math.random() * secretCode.length);
    const revealedElement = secretCode[randomPosition];
    
    // Update current guess with the hint
    currentGuess[randomPosition] = revealedElement;
    
    // Update UI
    hintBtn.setStyle({ fill: '#888', backgroundColor: '#333' });
    hintText.setText('Hint: Used').setStyle({ fill: '#888' });
    
    return {
      position: randomPosition,
      element: revealedElement
    };
  }

  reset() {
    this.currentScore = 0;
    this.hintUsed = false;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  isHintUsed() {
    return this.hintUsed;
  }
}
