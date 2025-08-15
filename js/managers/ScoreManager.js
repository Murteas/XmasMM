// ScoreManager.js - Handles scoring and progress tracking

class ScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.progressPoints = 0; // Tracks earned points during gameplay
    this.hintUsed = false;
    this.scoreBreakdown = {
      elementPoints: 0,
      completeBonus: 0,
      speedBonus: 0,
      hintPenalty: 0
    };

    this.scoringConfig = {
      perfectElementPoints: 180,
      closeElementPoints: 80,
      completeBonus: 250,
      speedBonusThreshold: 10,
      speedTier1Count: 3,
      speedTier1Value: 80,
      speedTier2Count: 3,
      speedTier2Value: 50,
      speedTier3Value: 30,
      speedPenaltyPerGuess: 25,
      hintPenalty: 220
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

    // Speed bonus / penalty (tiered bonus for unused guesses below threshold)
    if (guessesUsed < this.scoringConfig.speedBonusThreshold) {
      const unused = this.scoringConfig.speedBonusThreshold - guessesUsed;
      let remaining = unused;
      const tier1 = Math.min(remaining, this.scoringConfig.speedTier1Count); remaining -= tier1;
      const tier2 = Math.min(remaining, this.scoringConfig.speedTier2Count); remaining -= tier2;
      const tier3 = Math.max(remaining, 0);
      this.scoreBreakdown.speedBonus = (tier1 * this.scoringConfig.speedTier1Value) +
                                       (tier2 * this.scoringConfig.speedTier2Value) +
                                       (tier3 * this.scoringConfig.speedTier3Value);
    } else if (guessesUsed > this.scoringConfig.speedBonusThreshold) {
      this.scoreBreakdown.speedBonus = (this.scoringConfig.speedBonusThreshold - guessesUsed) * this.scoringConfig.speedPenaltyPerGuess; // negative
    }

    // Hint penalty
    if (this.hintUsed) {
      this.scoreBreakdown.hintPenalty = -this.scoringConfig.hintPenalty;
    }

    // Calculate final score
    const finalScore = this.scoreBreakdown.elementPoints + 
                      this.scoreBreakdown.completeBonus + 
                      this.scoreBreakdown.speedBonus + 
                      this.scoreBreakdown.hintPenalty;

    // Ensure score is never negative
    return Math.max(0, finalScore);
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
    // Calculate total from breakdown components
    const total = this.scoreBreakdown.elementPoints + 
                  this.scoreBreakdown.completeBonus + 
                  this.scoreBreakdown.speedBonus + 
                  this.scoreBreakdown.hintPenalty;
    
    return {
      ...this.scoreBreakdown,
      total: Math.max(0, total)
    };
  }

  /**
   * Generate share text for family party planner
   */
  generateShareText(codeLength, guessesUsed, gameWon) {
    const won = gameWon ? 'solved' : 'attempted';
    const hintText = this.hintUsed ? ', hint used' : '';
    
    // Calculate total score from breakdown
    const totalScore = this.scoreBreakdown.elementPoints + 
                      this.scoreBreakdown.completeBonus + 
                      this.scoreBreakdown.speedBonus + 
                      this.scoreBreakdown.hintPenalty;
    const finalScore = Math.max(0, totalScore);
    
    const breakdown = `(${this.scoreBreakdown.elementPoints}${
      this.scoreBreakdown.completeBonus > 0 ? ' + ' + this.scoreBreakdown.completeBonus : ''
    }${
      this.scoreBreakdown.speedBonus !== 0 ? (this.scoreBreakdown.speedBonus > 0 ? ' + ' : ' ') + this.scoreBreakdown.speedBonus : ''
    }${
      this.scoreBreakdown.hintPenalty !== 0 ? ' ' + this.scoreBreakdown.hintPenalty : ''
    } = ${finalScore}pts)`;
    
    return `Christmas MasterMind Score: ${finalScore}pts 🎄\n${codeLength} elements ${won}, ${guessesUsed} guesses${hintText}\n${breakdown}`;
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
      if (hintBtn && hintBtn.disableButton) {
        hintBtn.disableButton();
        if (hintBtn.setLabel) hintBtn.setLabel('Hint Used');
      } else if (hintBtn && hintBtn.setStyle) {
        hintBtn.setStyle({ fill: '#888', backgroundColor: '#444' });
      }
      if (hintText) hintText.setText('Hint: Used').setStyle({ fill: '#888' });
      return false;
    } else {
      // Available (with penalty warning)
      if (hintBtn && hintBtn.enableButton) {
        hintBtn.enableButton();
        if (hintBtn.setLabel) hintBtn.setLabel(`Hint (-${this.scoringConfig.hintPenalty})`);
      } else if (hintBtn && hintBtn.setStyle) {
        hintBtn.setStyle({ fill: '#fff', backgroundColor: '#0d5016' });
      }
      if (hintText) hintText.setText(`🎅 Hint (-${this.scoringConfig.hintPenalty} pts)`).setStyle({ fill: '#fff' });
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
    if (hintBtn && hintBtn.disableButton) {
      hintBtn.disableButton();
      if (hintBtn.setLabel) hintBtn.setLabel('Hint Used');
    } else if (hintBtn && hintBtn.setStyle) {
      hintBtn.setStyle({ fill: '#888', backgroundColor: '#444' });
    }
    if (hintText) hintText.setText('Hint: Used').setStyle({ fill: '#888' });
    
    return {
      position: targetPosition,
      element: revealedElement
    };
  }

  // Calculate progress points based on the MOST RECENT guess only
  updateProgressPoints() {
    // Reset progress points
    this.progressPoints = 0;
    
    // Get the most recent submitted guess and secret code
    const secretCode = this.scene.gameStateManager.getSecretCode();
    const guessHistory = this.scene.historyManager.getGuessHistory();
    
    // Calculate points only from the most recent guess
    if (guessHistory && guessHistory.length > 0) {
      const mostRecentGuess = guessHistory[guessHistory.length - 1];
      const feedback = this.calculateElementFeedback(mostRecentGuess, secretCode);
      this.progressPoints = (feedback.perfect * this.scoringConfig.perfectElementPoints) + 
                           (feedback.close * this.scoringConfig.closeElementPoints);
    }
  }

  getProgressPoints() {
    return this.progressPoints;
  }

  reset() {
    this.progressPoints = 0;
    this.hintUsed = false;
  }

  isHintUsed() {
    return this.hintUsed;
  }

  markHintUsed() {
    this.hintUsed = true;
  }
}
