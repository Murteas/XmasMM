// GameInputHandler.js - Handles game input processing and validation

class GameInputHandler {
  constructor(scene) {
    this.scene = scene;
    this.activeHint = null; // Track active hint to prevent multiple hints
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
    // Game won - transition to RoundOver scene (no more overlay)
    this.endGame();
  }

  handleGameLost() {
    // Game lost - transition to RoundOver scene (no more overlay) 
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
    
    // UI-010: Update the main header score display
    this.scene.uiLayoutManager.updateGuessesDisplay(gameStats.guessesRemaining);
  }

  processSantasHint() {
    // Get current guess from active row
    const currentGuess = this.scene.historyManager.getActiveRowGuess();
    
    if (!currentGuess) {
      return false;
    }
    
    const secretCode = this.scene.gameStateManager.getSecretCode();
    const uiElements = this.scene.uiLayoutManager.getUIElements();
    
    // Check if hint is available first and show feedback if not
    if (this.scene.scoreManager.isHintUsed()) {
      this.showHintUnavailableMessage("🎅 You've already used your hint this round!");
      return false;
    }
    
    const hintResult = this.scene.scoreManager.useSantasHint(
      secretCode, 
      currentGuess, 
      uiElements.hintBtn, 
      uiElements.hintText
    );
    
    if (hintResult) {
      // Apply the hint to the active row
      this.scene.historyManager.selectElement(hintResult.position, hintResult.element);
      
      // Show visual feedback with penalty warning
      this.showHintFeedback(hintResult);
      return true;
    }
    
    return false;
  }

  showHintUnavailableMessage(message) {
    const { width } = this.scene.cameras.main;
    const isSmallScreen = width < 400;
    const messageY = isSmallScreen ? 140 : 110;
    
    // Create temporary message
    const messageText = this.scene.add.text(width / 2, messageY, message, {
      font: '14px Arial',
      fill: '#ff6b6b',
      backgroundColor: '#4a1a1a',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 10);
    
    // Auto-remove after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      if (messageText) {
        messageText.destroy();
      }
    });
  }

  showHintFeedback(hintResult) {
    // Clear any existing hint first
    if (this.activeHint) {
      this.activeHint.cleanup();
    }

    const { width, height } = this.scene.cameras.main;
    
    // Position hint text in a safe area (top of screen, below header)
    const isSmallScreen = width < 400;
    const hintY = isSmallScreen ? 140 : 110;
    
    // Create persistent hint that can be clicked to dismiss
    const hintText = this.scene.add.text(width / 2, hintY, 
      `🎅 Hint: Position ${hintResult.position + 1} should be ${hintResult.element}! (-${this.scene.scoreManager.scoringConfig.hintPenalty} pts) (tap to dismiss)`, {
      font: '14px Arial',
      fill: '#ffd700',
      backgroundColor: '#0d5016', // Forest green background
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 10)
      .setInteractive({ useHandCursor: true });
    
    let glowEffect = null;
    
    // Also highlight the suggested position with a pulsing glow
    const targetSlot = this.scene.historyManager.activeRowManager.activeRowElements[hintResult.position];
    
    if (targetSlot && targetSlot.slot) {
      // Add glow directly to footer container (same coordinate space as the slot)
      glowEffect = this.scene.add.rectangle(
        targetSlot.slot.x, 
        targetSlot.slot.y, 
        targetSlot.slot.width + 8, 
        targetSlot.slot.height + 8, 
        0x00ff00, 
        0.7
      );
      
      // Add to footer container so it uses the same coordinate space
      this.scene.footerContainer.add(glowEffect);
      
      // Set depth relative to other footer elements
      glowEffect.setDepth(targetSlot.slot.depth + 1);
      
      // Pulsing animation
      this.scene.tweens.add({
        targets: glowEffect,
        alpha: { from: 0.4, to: 0.9 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }
    
    // Create cleanup function
    const cleanup = () => {
      if (hintText) {
        hintText.destroy();
      }
      if (glowEffect) {
        glowEffect.destroy();
      }
      this.activeHint = null;
    };
    
    // Set up hint object to track this hint
    this.activeHint = {
      hintText: hintText,
      glowEffect: glowEffect,
      cleanup: cleanup
    };
    
    // Only manual dismiss - no auto-dismiss timer
    hintText.on('pointerdown', cleanup);
  }

  endGame() {
    // Clean up any active hint
    if (this.activeHint) {
      this.activeHint.cleanup();
    }

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
    
    // PERF-001: Reduce transition delay from 2000ms to 100ms for better mobile UX
    // This minimal delay allows users to see the final guess result before transition
    this.scene.time.delayedCall(100, () => {
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