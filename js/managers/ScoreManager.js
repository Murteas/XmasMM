// ScoreManager.js - Handles element-based scoring and hint availability

class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.currentScore = 0;
    this.hintUsed = false;
    this.hintThreshold = 500; // Keep for compatibility, but scoring will change
    this.scoreBreakdown = {
      elementPoints: 0,
      completeBonus: 0,
      speedBonus: 0,
      hintPenalty: 0
    };
  }

  /**
   * Calculate final score based on element-based scoring system
   * @param {Array} finalGuess - The final guess made (win or lose)
   * @param {Array} secretCode - The correct answer
   * @param {number} guessesUsed - Number of guesses used
   * @param {boolean} gameWon - Whether the game was won
   */
  calculateFinalScore(finalGuess, secretCode, guessesUsed, gameWon) {
    this.scoreBreakdown = {
      elementPoints: 0,
      completeBonus: 0,
      speedBonus: 0,
      hintPenalty: 0
    };

    // Calculate element points from final guess
    const feedback = this.calculateElementFeedback(finalGuess, secretCode);
    this.scoreBreakdown.elementPoints = (feedback.perfect * 200) + (feedback.close * 100);

    // Complete solution bonus (only if won)
    if (gameWon) {
      this.scoreBreakdown.completeBonus = 300;
    }

    // Speed bonus/penalty
    if (guessesUsed < 10) {
      this.scoreBreakdown.speedBonus = (10 - guessesUsed) * 75;
    } else if (guessesUsed > 10) {
      this.scoreBreakdown.speedBonus = (10 - guessesUsed) * 25; // This will be negative
    }

    // Hint penalty
    if (this.hintUsed) {
      this.scoreBreakdown.hintPenalty = -200;
    }

    // Calculate final score
    this.currentScore = this.scoreBreakdown.elementPoints + 
                       this.scoreBreakdown.completeBonus + 
                       this.scoreBreakdown.speedBonus + 
                       this.scoreBreakdown.hintPenalty;

    // Ensure score is never negative
    this.currentScore = Math.max(0, this.currentScore);

    return this.currentScore;
  }

  /**
   * Calculate element feedback for scoring (separate from game feedback)
   */
  calculateElementFeedback(guess, code) {
    let perfect = 0;
    let close = 0;
    
    const guessCopy = [...guess];
    const codeCopy = [...code];
    
    // First pass: count perfect matches
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === codeCopy[i]) {
        perfect++;
        guessCopy.splice(i, 1);
        codeCopy.splice(i, 1);
      }
    }
    
    // Second pass: count close matches
    for (let i = 0; i < guessCopy.length; i++) {
      const index = codeCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        close++;
        codeCopy.splice(index, 1);
      }
    }
    
    return { perfect, close };
  }

  /**
   * Get detailed score breakdown for display
   */
  getScoreBreakdown() {
    return {
      ...this.scoreBreakdown,
      total: this.currentScore
    };
  }

  /**
   * Generate share text for family party planner
   */
  generateShareText(codeLength, guessesUsed, gameWon) {
    const won = gameWon ? 'solved' : 'attempted';
    const hintText = this.hintUsed ? ', hint used' : '';
    
    const breakdown = `(${this.scoreBreakdown.elementPoints}${
      this.scoreBreakdown.completeBonus > 0 ? ' + ' + this.scoreBreakdown.completeBonus : ''
    }${
      this.scoreBreakdown.speedBonus !== 0 ? (this.scoreBreakdown.speedBonus > 0 ? ' + ' : ' ') + this.scoreBreakdown.speedBonus : ''
    }${
      this.scoreBreakdown.hintPenalty !== 0 ? ' ' + this.scoreBreakdown.hintPenalty : ''
    } = ${this.currentScore}pts)`;
    
    return `XmasMM Score: ${this.currentScore}pts 🎄\n${codeLength} elements ${won}, ${guessesUsed} guesses${hintText}\n${breakdown}`;
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

  /**
   * Calculate ongoing score during gameplay (simplified for real-time updates)
   * @param {number} maxGuesses - Maximum guesses allowed
   * @param {number} guessesRemaining - Guesses remaining
   * @param {number} codeLength - Length of the code
   */
  calculateScore(maxGuesses, guessesRemaining, codeLength) {
    // Simple ongoing score calculation - just track guesses used
    const guessesUsed = maxGuesses - guessesRemaining;
    
    // Basic score: starts high, decreases with more guesses
    this.currentScore = Math.max(0, 1000 - (guessesUsed * 100));
    
    // Apply hint penalty if used
    if (this.hintUsed) {
      this.currentScore -= 200;
    }
    
    // Ensure score doesn't go negative
    this.currentScore = Math.max(0, this.currentScore);
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
