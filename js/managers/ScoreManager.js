// ScoreManager.js - Handles element-based scoring and hint availability
// Simplified for maintainability

class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.currentScore = 0;
    this.hintUsed = false;
    this.hintThreshold = 500; // Keep for compatibility
    this.scoreBreakdown = {
      elementPoints: 0,
      completeBonus: 0,
      speedBonus: 0,
      hintPenalty: 0
    };

    // Simple configuration - no complex dependencies
    this.scoringConfig = {
      perfectElementPoints: 200,
      closeElementPoints: 100,
      completeBonus: 300,
      speedBonusPerGuess: 75,
      speedPenaltyPerGuess: 25,
      speedBonusThreshold: 10,
      hintPenalty: 200
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
    this.scoreBreakdown.elementPoints = (feedback.perfect * this.scoringConfig.perfectElementPoints) + (feedback.close * this.scoringConfig.closeElementPoints);

    // For winning games, ensure we got credit for all elements
    if (gameWon && feedback.perfect !== secretCode.length) {
      console.warn('Scoring issue: Won game but not all elements marked as perfect', {
        finalGuess, secretCode, feedback
      });
      // Force correct element points for winning game
      this.scoreBreakdown.elementPoints = secretCode.length * this.scoringConfig.perfectElementPoints;
    }

    // Complete solution bonus (only if won)
    if (gameWon) {
      this.scoreBreakdown.completeBonus = this.scoringConfig.completeBonus;
    }

    // Speed bonus/penalty
    if (guessesUsed < this.scoringConfig.speedBonusThreshold) {
      this.scoreBreakdown.speedBonus = (this.scoringConfig.speedBonusThreshold - guessesUsed) * this.scoringConfig.speedBonusPerGuess;
    } else if (guessesUsed > this.scoringConfig.speedBonusThreshold) {
      this.scoreBreakdown.speedBonus = (this.scoringConfig.speedBonusThreshold - guessesUsed) * this.scoringConfig.speedPenaltyPerGuess; // This will be negative
    }

    // Hint penalty
    if (this.hintUsed) {
      this.scoreBreakdown.hintPenalty = -this.scoringConfig.hintPenalty;
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
    // Now displays guess progress instead of misleading score
    const guessesUsed = this.scene.gameStateManager.maxGuesses - this.scene.gameStateManager.guessesRemaining;
    const maxGuesses = this.scene.gameStateManager.maxGuesses;
    scoreText.setText(`Guesses: ${guessesUsed}/${maxGuesses}`);
  }

  checkHintAvailability(hintBtn, hintText) {
    if (this.hintUsed) {
      // Already used hint this round
      hintBtn.setStyle({ fill: '#888', backgroundColor: '#444' });
      hintText.setText('Hint: Used').setStyle({ fill: '#888' });
      return false;
    } else {
      // Always available (with penalty warning)
      hintBtn.setStyle({ fill: '#fff', backgroundColor: '#0d5016' }); // Forest green when available
      hintText.setText(`🎅 Hint (-${this.scoringConfig.hintPenalty} pts)`).setStyle({ fill: '#fff' });
      return true;
    }
  }

  useSantasHint(secretCode, currentGuess, hintBtn, hintText) {
    if (this.hintUsed) return null;
    
    this.hintUsed = true;
    
    // Strategic hint selection: prioritize positions that are wrong or empty
    const wrongPositions = [];
    const emptyPositions = [];
    
    for (let i = 0; i < secretCode.length; i++) {
      if (!currentGuess[i] || currentGuess[i] === null) {
        emptyPositions.push(i);
      } else if (currentGuess[i] !== secretCode[i]) {
        wrongPositions.push(i);
      }
    }
    
    // Hint strategy:
    // 1. First priority: Fix wrong guesses
    // 2. Second priority: Fill empty slots
    // 3. Last resort: Random position (shouldn't happen in normal gameplay)
    let targetPosition;
    if (wrongPositions.length > 0) {
      // Pick random wrong position to fix
      targetPosition = wrongPositions[Math.floor(Math.random() * wrongPositions.length)];
    } else if (emptyPositions.length > 0) {
      // Pick random empty position to fill
      targetPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    } else {
      // Fallback: random position (all correct already?)
      targetPosition = Math.floor(Math.random() * secretCode.length);
    }
    
    const revealedElement = secretCode[targetPosition];
    
    // Update current guess with the hint
    currentGuess[targetPosition] = revealedElement;
    
    // Update UI to show hint used
    hintBtn.setStyle({ fill: '#888', backgroundColor: '#444' }); // Gray when used
    hintText.setText('Hint: Used').setStyle({ fill: '#888' });
    
    return {
      position: targetPosition,
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
      this.currentScore -= this.scoringConfig.hintPenalty;
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

  markHintUsed() {
    this.hintUsed = true;
  }
}
