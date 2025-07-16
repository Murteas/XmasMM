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
    
    // Create persistent hint that can be clicked to dismiss
    const hintText = this.scene.add.text(width / 2, hintY, 
      `🎅 Hint: Position ${hintResult.position + 1} should be ${hintResult.element}! (tap to dismiss)`, {
      font: '14px Arial',
      fill: '#ffd700',
      backgroundColor: '#0d5016', // Forest green background
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().UI + 10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        hintText.destroy();
      });
    
    // Also highlight the suggested position with a pulsing glow
    const targetSlot = this.scene.historyManager.activeRowManager.activeRowElements[hintResult.position];
    console.log('🎅 Hint Debug:', {
      position: hintResult.position,
      activeRowElements: this.scene.historyManager.activeRowManager.activeRowElements,
      targetSlot: targetSlot
    });
    
    if (targetSlot && targetSlot.slot) {
      console.log('🎅 Creating glow effect at:', targetSlot.slot.x, targetSlot.slot.y);
      // Add pulsing green glow to the suggested slot
      const glowEffect = this.scene.add.rectangle(
        targetSlot.slot.x, 
        targetSlot.slot.y, 
        targetSlot.slot.width + 8, 
        targetSlot.slot.height + 8, 
        0x00ff00, 
        0.3
      ).setDepth(targetSlot.slot.depth - 0.1);
      
      // Pulsing animation
      this.scene.tweens.add({
        targets: glowEffect,
        alpha: { from: 0.3, to: 0.7 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });
      
      // Remove glow when hint text is dismissed or after 15 seconds
      const cleanupGlow = () => {
        if (glowEffect) {
          glowEffect.destroy();
        }
      };
      
      hintText.on('destroy', cleanupGlow);
      this.scene.time.delayedCall(15000, cleanupGlow);
    } else {
      console.log('🎅 No target slot found for glow effect');
    }
    
    // Auto-remove hint text after 15 seconds if not manually dismissed
    this.scene.time.delayedCall(15000, () => {
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