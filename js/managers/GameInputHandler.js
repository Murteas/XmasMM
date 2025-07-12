// GameInputHandler.js - Handles game input processing and validation

class GameInputHandler {
  constructor(scene) {
    this.scene = scene;
  }

  processGuessSubmission() {
    // Get the current guess from the active row
    const currentGuess = this.scene.historyManager.submitActiveRowGuess();
    
    if (!currentGuess) {
      // The guess was incomplete or invalid - error already shown by historyManager
      return false;
    }
    
    // Process the guess through game state manager
    const result = this.scene.gameStateManager.processGuess(currentGuess);
    
    // Add to history
    this.scene.historyManager.addGuess(currentGuess, result.feedback);
    
    // Update UI
    this.scene.uiLayoutManager.updateGuessesDisplay(result.guessesRemaining);
    
    // Handle game state changes
    if (result.isWin) {
      this.handleGameWon();
      return true;
    }
    
    if (result.isGameOver) {
      this.handleGameLost();
      return true;
    }
    
    // Continue game
    this.handleContinueGame();
    return true;
  }

  handleGameWon() {
    this.scene.uiLayoutManager.showGameWon();
    this.endGame();
  }

  handleGameLost() {
    const secretCode = this.scene.gameStateManager.getSecretCode();
    this.scene.uiLayoutManager.showGameLost(secretCode);
    this.endGame();
  }

  handleContinueGame() {
    // Calculate and update score
    this.updateScore();
    
    // Check if Santa's Hint should be enabled
    const uiElements = this.scene.uiLayoutManager.getUIElements();
    this.scene.scoreManager.checkHintAvailability(uiElements.hintBtn, uiElements.hintText);
    
    // Create new active row for next guess
    this.scene.createNewActiveRow();
  }

  updateScore() {
    const gameStats = this.scene.gameStateManager.getGameStats();
    this.scene.scoreManager.calculateScore(
      gameStats.maxGuesses, 
      gameStats.guessesRemaining, 
      gameStats.codeLength
    );
    
    const uiElements = this.scene.uiLayoutManager.getUIElements();
    this.scene.scoreManager.updateScoreDisplay(uiElements.scoreText);
  }

  processSantasHint() {
    // Get current guess from active row
    const currentGuess = this.scene.historyManager.getActiveRowGuess();
    
    if (!currentGuess) {
      return false;
    }
    
    const secretCode = this.scene.gameStateManager.getSecretCode();
    const uiElements = this.scene.uiLayoutManager.getUIElements();
    
    const hintResult = this.scene.scoreManager.useSantasHint(
      secretCode, 
      currentGuess, 
      uiElements.hintBtn, 
      uiElements.hintText
    );
    
    if (hintResult) {
      // Apply the hint to the active row
      this.scene.historyManager.selectElement(hintResult.position, hintResult.element);
      
      // Show visual feedback
      this.showHintFeedback(hintResult);
      return true;
    }
    
    return false;
  }

  showHintFeedback(hintResult) {
    const { width, height } = this.scene.cameras.main;
    
    // Position hint text in a safe area (top of screen, below header)
    const isSmallScreen = width < 400;
    const hintY = isSmallScreen ? 140 : 110;
    
    const hintText = this.scene.add.text(width / 2, hintY, 
      `Santa's Hint: Position ${hintResult.position + 1} is ${hintResult.element}!`, {
      font: '16px Arial',
      fill: '#ffd700',
      backgroundColor: '#000',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 10);
    
    // Remove hint text after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      if (hintText) {
        hintText.destroy();
      }
    });
  }

  endGame() {
    const uiElements = this.scene.uiLayoutManager.getUIElements();
    
    // Disable interactions
    if (uiElements.submitBtn) {
      uiElements.submitBtn.disableInteractive();
    }
    if (uiElements.hintBtn) {
      uiElements.hintBtn.disableInteractive();
    }
    
    // Disable active row interactions
    if (this.scene.historyManager.hasActiveRow) {
      this.scene.historyManager.removeActiveRow();
    }
    
    // Transition to Round Over screen after a brief delay
    this.scene.time.delayedCall(2000, () => {
      this.transitionToRoundOver();
    });
  }

  transitionToRoundOver() {
    const gameStats = this.scene.gameStateManager.getGameStats();
    const finalGuess = this.scene.historyManager.getLastGuess();
    const secretCode = this.scene.gameStateManager.getSecretCode();
    const guessesUsed = gameStats.maxGuesses - gameStats.guessesRemaining;
    
    // Calculate final score using proper element-based scoring
    this.scene.scoreManager.calculateFinalScore(
      finalGuess,
      secretCode,
      guessesUsed,
      gameStats.isWon
    );
    
    const gameData = {
      won: gameStats.isWon,
      finalGuess: finalGuess,
      secretCode: secretCode,
      guessesUsed: guessesUsed,
      scoreManager: this.scene.scoreManager,
      guessHistory: this.scene.historyManager.getGuessHistory(),
      feedbackHistory: this.scene.historyManager.getFeedbackHistory()
    };
    
    this.scene.scene.start('RoundOver', gameData);
  }
}