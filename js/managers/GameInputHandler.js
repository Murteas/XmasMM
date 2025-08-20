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
    
    // Play jingle bells sound for guess submission
    if (this.scene.audioManager) {
      this.scene.audioManager.playGuessSubmission();
    }
    
    // Process the guess through game state manager
    const result = this.scene.gameStateManager.processGuess(currentGuess);
    
    // Add to history
    this.scene.historyManager.addGuess(currentGuess, result.feedback);
    
    // Update UI progress display
    this.scene.uiLayoutManager.updateProgressDisplay();
    
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
    // Play Christmas celebration sound
    if (this.scene.audioManager) {
      this.scene.audioManager.playGameWon();
    }
    
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
    // Update progress points based on all guesses so far
    this.scene.scoreManager.updateProgressPoints();
    
    // Update UI display
    this.scene.uiLayoutManager.updateProgressDisplay();
    
    // Check if Santa's Hint should be enabled
    const uiElements = this.scene.uiLayoutManager.getUIElements();
    this.scene.scoreManager.checkHintAvailability(uiElements.hintBtn, uiElements.hintText);
  }

  processSantasHint() {
    // Get current guess from active row - allow empty/partial guesses for hints
    let currentGuess = this.scene.historyManager.getActiveRowGuess();
    
    // If no active row exists or it's empty, create an empty guess array for hint calculation
    if (!currentGuess) {
      const codeLength = this.scene.gameStateManager.getGameStats().codeLength;
      currentGuess = new Array(codeLength).fill(null);
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
      // Play Santa chuckle sound for hint usage
      if (this.scene.audioManager) {
        this.scene.audioManager.playHintUsed();
      }
      
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
    const messageY = isSmallScreen ? 180 : 160; // Match hint feedback positioning
    
    // Create temporary message
    const messageText = this.scene.add.text(width / 2, messageY, message, {
      font: '13px Arial',         // Match hint feedback font size
      fill: '#ff6b6b',
      backgroundColor: '#4a1a1a',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }  // Match hint feedback padding
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
    
    // Position hint text BELOW the header area to avoid overlapping
    const isSmallScreen = width < 400;
    const hintY = isSmallScreen ? 180 : 160; // Moved further down to avoid header crowding
    
    // Create persistent hint that can be clicked to dismiss
    const hintText = this.scene.add.text(width / 2, hintY, 
      `🎅 Hint: Position ${hintResult.position + 1} should be ${hintResult.element}! (-${this.scene.scoreManager.scoringConfig.hintPenalty} pts) (tap to dismiss)`, {
      font: '13px Arial',        // Slightly smaller to reduce visual weight
      fill: '#ffd700',
      backgroundColor: '#0d5016', // Forest green background
      padding: { left: 10, right: 10, top: 5, bottom: 5 }  // Reduced padding
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().POPUP)
      .setInteractive({ useHandCursor: true });
    
    let glowEffect = null;
    
    // Also highlight the suggested position with a pulsing glow
    const targetSlot = this.scene.historyManager.activeRowManager.activeRowElements[hintResult.position];
    
    if (targetSlot && targetSlot.slot) {
      // Add glow effect to game container
      glowEffect = this.scene.add.rectangle(
        targetSlot.slot.x, 
        targetSlot.slot.y, 
        targetSlot.slot.width + 8, 
        targetSlot.slot.height + 8, 
        0x00ff00, 
        0.7
      );
      
      // Add to game container
      this.scene.scrollableContainer.add(glowEffect);
      
      // Set depth relative to other elements
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

  // === DEBUG METHODS ===
  
  fillRandomGuess() {
    // Check if we have an active row to fill
    if (!this.scene.historyManager.hasActiveRow) {
      console.log('🔧 DEBUG: No active row to fill');
      return;
    }

    // Generate random guess using existing utility
    const gameStats = this.scene.gameStateManager.getGameStats();
    const elements = this.scene.gameStateManager.getGameElements();
    const randomGuess = GameUtils.generateRandomCode(elements, gameStats.codeLength);
    
    // Fill the active row with random elements
    this.scene.historyManager.fillActiveRowWithElements(randomGuess);
    
    console.log('🔧 DEBUG: Filled random guess:', randomGuess);
  }

  autoWin() {
    // Fill active row with the secret code (guaranteed win)
    if (!this.scene.historyManager.hasActiveRow) {
      console.log('🔧 DEBUG: No active row to fill');
      return;
    }

    const secretCode = this.scene.gameStateManager.getSecretCode();
    this.scene.historyManager.fillActiveRowWithElements(secretCode);
    
    console.log('🔧 DEBUG: Filled winning guess:', secretCode);
  }

  fastForward() {
    // Auto-play several random guesses to speed up testing
    console.log('🔧 DEBUG: Fast-forwarding with random guesses...');
    
    let guessesAdded = 0;
    const maxAutoGuesses = 5;
    
    const autoGuessInterval = this.scene.time.addEvent({
      delay: 200, // 200ms between auto-guesses
      repeat: maxAutoGuesses - 1,
      callback: () => {
        // Stop if game is over or no active row
        if (!this.scene.historyManager.hasActiveRow) {
          autoGuessInterval.destroy();
          return;
        }

        // Fill and submit random guess
        this.fillRandomGuess();
        
        // Submit after a small delay
        this.scene.time.delayedCall(100, () => {
          if (this.scene.historyManager.hasActiveRow) {
            this.processGuessSubmission();
            guessesAdded++;
          }
        });
      }
    });
  }

  jumpToLastRound() {
    // Auto-play until we're at the last guess
    console.log('🔧 DEBUG: Jumping to last round...');
    
    const gameStats = this.scene.gameStateManager.getGameStats();
    const currentGuessCount = this.scene.historyManager.getGuessHistory().length;
    const targetGuessCount = Math.max(0, gameStats.maxGuesses - 2); // Leave 2 guesses remaining
    
    if (currentGuessCount >= targetGuessCount) {
      console.log('🔧 DEBUG: Already at or past target round');
      return;
    }

    const guessesNeeded = targetGuessCount - currentGuessCount;
    console.log(`🔧 DEBUG: Adding ${guessesNeeded} auto-guesses...`);
    
    let guessesAdded = 0;
    const autoGuessInterval = this.scene.time.addEvent({
      delay: 150,
      repeat: guessesNeeded - 1,
      callback: () => {
        if (!this.scene.historyManager.hasActiveRow || guessesAdded >= guessesNeeded) {
          autoGuessInterval.destroy();
          return;
        }

        this.fillRandomGuess();
        this.scene.time.delayedCall(50, () => {
          if (this.scene.historyManager.hasActiveRow) {
            this.processGuessSubmission();
            guessesAdded++;
          }
        });
      }
    });
  }
}