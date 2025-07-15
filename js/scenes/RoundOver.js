// RoundOver.js - End game screen with score breakdown and options

class RoundOver extends Phaser.Scene {
  constructor() {
    super({ key: 'RoundOver' });
    this.gameData = null;
    this.showingHistory = false;
    this.mainContainer = null;
    this.historyContainer = null;
  }

  init(data) {
    this.gameData = data;
    // Expected data: { 
    //   won: boolean, 
    //   finalGuess: Array, 
    //   secretCode: Array, 
    //   guessesUsed: number,
    //   scoreManager: ScoreManager,
    //   guessHistory: Array,
    //   feedbackHistory: Array
    // }
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Set background
    this.add.image(width / 2, height / 2, 'bg')
      .setDisplaySize(width, height);

    // Create main content container
    this.mainContainer = this.add.container(0, 0);
    
    this.createGameOverHeader();
    this.createScoreDisplay();
    this.createSolutionDisplay();
    this.createActionButtons();
    
    // Create hidden history container
    this.historyContainer = this.add.container(0, 0);
    this.historyContainer.setVisible(false);
  }

  createGameOverHeader() {
    const { width, height } = this.cameras.main;
    // Use mobile-responsive positioning - start higher for better space utilization
    const headerY = Math.min(80, height * 0.12);
    
    const gameOverText = this.gameData.won ? 'Success!' : 'Game Over';
    const headerColor = this.gameData.won ? '#27ae60' : '#e74c3c';
    
    // Larger, more prominent header for mobile
    const header = this.add.text(width / 2, headerY, gameOverText, {
      font: `${Math.max(28, Math.min(36, width * 0.08))}px Arial`,
      fill: headerColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.mainContainer.add(header);
  }

  createScoreDisplay() {
    const { width, height } = this.cameras.main;
    // Better vertical distribution - place score after header with proper spacing
    const scoreY = Math.min(140, height * 0.25);
    
    const breakdown = this.gameData.scoreManager.getScoreBreakdown();
    
    // Larger, more prominent main score for mobile
    const scoreText = this.add.text(width / 2, scoreY, `Score: ${breakdown.total} points`, {
      font: `${Math.max(22, Math.min(28, width * 0.06))}px Arial`,
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Score breakdown with family-friendly explanations
    let breakdownParts = [];
    
    // Calculate and show detailed breakdown using symbols families understand
    const finalFeedback = this.gameData.scoreManager.calculateElementFeedback(
      this.gameData.finalGuess, 
      this.gameData.secretCode
    );
    
    // Build detailed breakdown showing symbol counts and points
    const perfectCount = finalFeedback.perfect;
    const closeCount = finalFeedback.close;
    
    let pointsExplanation = [];
    if (perfectCount > 0) {
      pointsExplanation.push(`${perfectCount} Star${perfectCount > 1 ? 's' : ''} (${perfectCount}×200)`);
    }
    if (closeCount > 0) {
      pointsExplanation.push(`${closeCount} Bell${closeCount > 1 ? 's' : ''} (${closeCount}×100)`);
    }
    
    if (pointsExplanation.length === 0) {
      breakdownParts.push(`Pattern Points: ${breakdown.elementPoints} (Keep trying!)`);
    } else {
      breakdownParts.push(`Pattern Points: ${breakdown.elementPoints} (${pointsExplanation.join(' + ')})`);
    }
    
    // Show bonuses and penalties (can be 0 but still informative)
    if (breakdown.completeBonus !== 0) {
      breakdownParts.push(`Puzzle Solved: +${breakdown.completeBonus}`);
    }
    if (breakdown.speedBonus !== 0) {
      const speedLabel = breakdown.speedBonus > 0 ? 'Speed Bonus' : 'Time Penalty';
      const speedSign = breakdown.speedBonus > 0 ? '+' : '';
      const timeContext = breakdown.speedBonus > 0 ? ' (Great timing!)' : ' (Take your time next game)';
      breakdownParts.push(`${speedLabel}: ${speedSign}${breakdown.speedBonus}${timeContext}`);
    }
    if (breakdown.hintPenalty !== 0) {
      breakdownParts.push(`Santa's Hints: ${breakdown.hintPenalty} (Learning bonus!)`);
    }
    
    // If no breakdown parts exist (all zeros), show encouraging basic calculation  
    if (breakdownParts.length === 1 && breakdown.elementPoints === 0) {
      breakdownParts = [`Pattern Points: ${breakdown.elementPoints} (No matches yet - try again!)  Total: ${breakdown.total}`];
    }
    
    // Expert mobile responsive text with better spacing and larger fonts
    const layout = GameUtils.getResponsiveLayout(width, height);
    const breakdownText = GameUtils.createResponsiveText(
      this,
      width / 2, 
      scoreY + Math.round(45 * layout.fontScale), // More space after main score
      breakdownParts.join('\n'), // Use line breaks instead of spaces for mobile
      {
        fontSize: `${Math.round(Math.max(15, 16 * layout.fontScale))}px`, // Larger text for mobile readability
        fontFamily: 'Arial',
        fill: '#ddd', // Slightly brighter for better mobile visibility
        align: 'center',
        lineSpacing: Math.round(8 * layout.fontScale), // More line spacing for mobile
        wordWrap: { 
          width: Math.min(width * 0.9, 450), // Wider text area for mobile
          useAdvancedWrap: true 
        }
      }
    ).setOrigin(0.5);
    
    this.mainContainer.add([scoreText, breakdownText]);
  }

  createSolutionDisplay() {
    const { width, height } = this.cameras.main;
    // Better vertical spacing - place solution display after score breakdown
    const solutionY = Math.min(220, height * 0.45);
    
    // Larger, more prominent "The answer was:" label for mobile readability
    const labelText = this.add.text(width / 2, solutionY, 'The answer was:', {
      font: `${Math.max(16, Math.min(20, width * 0.045))}px Arial`,
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Solution elements container with better mobile spacing
    const solutionContainer = this.add.container(width / 2, solutionY + Math.max(40, height * 0.08));
    
    // Responsive element sizing for mobile
    const elementSize = Math.max(30, Math.min(40, width * 0.08));
    const elementSpacing = Math.max(40, elementSize + 15);
    const totalWidth = (this.gameData.secretCode.length - 1) * elementSpacing;
    const startX = -totalWidth / 2;
    
    this.gameData.secretCode.forEach((element, index) => {
      const x = startX + (index * elementSpacing);
      
      try {
        const imageKey = this.getElementImageKey(element);
        if (this.textures.exists(imageKey)) {
          const elementImage = this.add.image(x, 0, imageKey)
            .setDisplaySize(elementSize, elementSize);
          solutionContainer.add(elementImage);
        } else {
          // Fallback to text
          const elementText = this.add.text(x, 0, element.charAt(0).toUpperCase(), {
            font: '16px Arial',
            fill: '#fff',
            backgroundColor: '#666',
            padding: { left: 6, right: 6, top: 4, bottom: 4 }
          }).setOrigin(0.5);
          solutionContainer.add(elementText);
        }
      } catch (error) {
        console.error('Error creating solution element:', error);
        const elementText = this.add.text(x, 0, element.charAt(0).toUpperCase(), {
          font: '16px Arial',
          fill: '#fff',
          backgroundColor: '#666',
          padding: { left: 6, right: 6, top: 4, bottom: 4 }
        }).setOrigin(0.5);
        solutionContainer.add(elementText);
      }
    });
    
    this.mainContainer.add([labelText, solutionContainer]);
  }

  createActionButtons() {
    const { width, height } = this.cameras.main;
    
    // Better mobile responsive positioning - use more vertical space
    const layout = GameUtils.getResponsiveLayout(width, height);
    // Start buttons lower to use more space, but ensure they fit
    const buttonStartY = Math.max(layout.secondaryButtonY, height * 0.65);
    const buttonSpacing = Math.max(layout.minTouchSize + layout.touchSpacing, Math.min(60, height * 0.08));
    
    // View History Button with responsive design and larger touch targets
    const historyBtn = GameUtils.createResponsiveText(
      this,
      width / 2, 
      buttonStartY,
      'View History',
      {
        fontSize: `${Math.round(16 * layout.fontScale)}px`,
        fontFamily: 'Arial',
        fill: '#fff',
        backgroundColor: '#3498db',
        padding: { 
          left: Math.round(18 * layout.fontScale), 
          right: Math.round(18 * layout.fontScale), 
          top: Math.round(12 * layout.fontScale), 
          bottom: Math.round(12 * layout.fontScale) 
        }
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    historyBtn.on('pointerdown', () => this.showHistory());
    this.addButtonFeedback(historyBtn);
    
    // Play Again Button - larger and more prominent for mobile
    const playAgainBtn = this.add.text(width / 2, buttonStartY + buttonSpacing, 'Play Again', {
      font: `${Math.max(16, Math.min(20, width * 0.045))}px Arial`,
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 22, right: 22, top: 12, bottom: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    playAgainBtn.on('pointerdown', () => {
      this.scene.start('DifficultySelection');
    });
    this.addButtonFeedback(playAgainBtn);
    
    // Share Button - improved spacing for mobile
    const shareBtn = this.add.text(width / 2, buttonStartY + (buttonSpacing * 2), 'Share Score', {
      font: `${Math.max(14, Math.min(16, width * 0.035))}px Arial`,
      fill: '#fff',
      backgroundColor: '#9b59b6',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    shareBtn.on('pointerdown', () => this.shareScore());
    this.addButtonFeedback(shareBtn);
    
    this.mainContainer.add([historyBtn, playAgainBtn, shareBtn]);
  }

  showHistory() {
    if (this.showingHistory) return;
    
    this.showingHistory = true;
    this.mainContainer.setVisible(false);
    this.createHistoryView();
    this.historyContainer.setVisible(true);
  }

  createHistoryView() {
    const { width, height } = this.cameras.main;
    
    // Clear previous history content
    this.historyContainer.removeAll(true);
    
    // History header
    const headerText = this.add.text(width / 2, 40, 'Guess History', {
      font: '24px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Add quality summary for learning encouragement
    this.createQualitySummary(width, 70);
    
    // Scrollable history area with improved spacing (UI-002 fix)
    const historyArea = this.add.container(0, 0);
    const startY = 140;
    const rowHeight = 60; // Increased from 50 to 60 for better touch targets and spacing
    const maxVisibleRows = Math.floor((height - 220) / rowHeight);
    
    this.gameData.guessHistory.forEach((guess, index) => {
      const y = startY + (index * rowHeight);
      const feedback = this.gameData.feedbackHistory[index];
      
      this.createHistoryRow(guess, feedback, index + 1, y, historyArea);
    });
    
    // Back button
    const backBtn = this.add.text(width / 2, height - 80, 'Back to Results', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#95a5a6',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    backBtn.on('pointerdown', () => this.hideHistory());
    this.addButtonFeedback(backBtn);
    
    this.historyContainer.add([headerText, historyArea, backBtn]);
  }

  createHistoryRow(guess, feedback, rowNumber, y, container) {
    const { width } = this.cameras.main;
    
    // Calculate guess quality for this row
    const quality = this.calculateGuessQuality(guess, this.gameData.secretCode);
    
    // Add subtle background highlight for quality with improved visibility (UI-002 fix)
    const rowBackground = this.add.rectangle(width / 2, y, width - 40, 45, 0x000000, 0.3)
      .setStrokeStyle(2, quality.colorHex, 0.8); // Increased border width and opacity for better visibility
    container.add(rowBackground);
    
    // Row number
    const rowText = this.add.text(30, y, `${rowNumber}:`, {
      font: '14px Arial',
      fill: '#fff'
    }).setOrigin(0, 0.5);
    
    // Guess elements
    const elementSize = 20;
    const elementSpacing = 25;
    const startX = 70;
    
    guess.forEach((element, index) => {
      const x = startX + (index * elementSpacing);
      
      try {
        const imageKey = this.getElementImageKey(element);
        if (this.textures.exists(imageKey)) {
          const elementImage = this.add.image(x, y, imageKey)
            .setDisplaySize(elementSize, elementSize);
          container.add(elementImage);
        } else {
          const elementText = this.add.text(x, y, element.charAt(0).toUpperCase(), {
            font: '10px Arial',
            fill: '#fff',
            backgroundColor: '#666',
            padding: { left: 3, right: 3, top: 2, bottom: 2 }
          }).setOrigin(0.5);
          container.add(elementText);
        }
      } catch (error) {
        const elementText = this.add.text(x, y, element.charAt(0).toUpperCase(), {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#666',
          padding: { left: 3, right: 3, top: 2, bottom: 2 }
        }).setOrigin(0.5);
        container.add(elementText);
      }
    });
    
    // Feedback symbols
    const feedbackStartX = startX + (guess.length * elementSpacing) + 20;
    let feedbackX = feedbackStartX;
    
    // Perfect matches (stars)
    for (let i = 0; i < feedback.black; i++) {
      this.createFeedbackSymbol('perfect', feedbackX, y, 12, container);
      feedbackX += 15;
    }
    
    // Close matches (bells)
    for (let i = 0; i < feedback.white; i++) {
      this.createFeedbackSymbol('close', feedbackX, y, 12, container);
      feedbackX += 15;
    }
    
    // Add quality label with encouraging message
    const qualityLabel = this.add.text(feedbackX + 20, y, quality.label, {
      font: '12px Arial',
      fill: quality.color,
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    
    container.add([rowText, qualityLabel]);
  }

  createFeedbackSymbol(symbolType, x, y, size, container) {
    try {
      const imageKey = this.getFeedbackImageKey(symbolType);
      if (this.textures.exists(imageKey)) {
        const symbol = this.add.image(x, y, imageKey)
          .setDisplaySize(size, size);
        container.add(symbol);
      } else {
        // Fallback to text symbols
        const fallbackSymbols = { 'perfect': '★', 'close': '🔔' };
        const symbolText = this.add.text(x, y, fallbackSymbols[symbolType], {
          font: `${size}px Arial`,
          fill: '#FFD700'
        }).setOrigin(0.5);
        container.add(symbolText);
      }
    } catch (error) {
      const fallbackSymbols = { 'perfect': '★', 'close': '🔔' };
      const symbolText = this.add.text(x, y, fallbackSymbols[symbolType], {
        font: `${size}px Arial`,
        fill: '#FFD700'
      }).setOrigin(0.5);
      container.add(symbolText);
    }
  }

  hideHistory() {
    this.showingHistory = false;
    this.historyContainer.setVisible(false);
    this.mainContainer.setVisible(true);
  }

  shareScore() {
    const shareText = this.gameData.scoreManager.generateShareText(
      this.gameData.secretCode.length,
      this.gameData.guessesUsed,
      this.gameData.won
    );
    
    // Try to use native share API if available
    if (navigator.share) {
      navigator.share({
        title: 'XmasMM Score',
        text: shareText
      }).catch(err => {
        console.log('Share cancelled');
        this.showShareCancelledFeedback();
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        // Show feedback that text was copied
        this.showCopyFeedback();
      }).catch(() => {
        // Final fallback: show text in alert
        alert(shareText);
      });
    }
  }

  showCopyFeedback() {
    const { width, height } = this.cameras.main;
    
    const feedback = this.add.text(width / 2, height - 40, 'Score copied to clipboard!', {
      font: '14px Arial',
      fill: '#27ae60',
      backgroundColor: '#000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);
    
    // Fade out after 2 seconds
    this.tweens.add({
      targets: feedback,
      alpha: 0,
      duration: 2000,
      onComplete: () => feedback.destroy()
    });
  }

  showShareCancelledFeedback() {
    const { width, height } = this.cameras.main;
    
    const feedback = this.add.text(width / 2, height - 40, 'Share cancelled', {
      font: '14px Arial',
      fill: '#f39c12',
      backgroundColor: '#000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);
    
    // Fade out after 1.5 seconds
    this.tweens.add({
      targets: feedback,
      alpha: 0,
      duration: 1500,
      onComplete: () => feedback.destroy()
    });
  }

  addButtonFeedback(button) {
    button.on('pointerdown', () => {
      button.setScale(0.95);
      button.setAlpha(0.8);
    });

    button.on('pointerup', () => {
      this.tweens.add({
        targets: button,
        scale: 1.05,
        alpha: 1,
        duration: 100,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100
          });
        }
      });
    });

    button.on('pointerout', () => {
      this.tweens.killTweensOf(button);
      button.setScale(1);
      button.setAlpha(1);
    });
  }

  getElementImageKey(element) {
    // Use same logic as GameScene for consistency
    const pixelRatio = window.devicePixelRatio || 1;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let suffix;
    if (isMobile) {
      suffix = '_1x';
    } else {
      if (pixelRatio >= 3) {
        suffix = '_3x';
      } else if (pixelRatio >= 2) {
        suffix = '_2x';
      } else {
        suffix = '_1x';
      }
    }
    
    const elementMap = {
      'Santa': 'santa',
      'Present': 'present', 
      'Candy Cane': 'candycane',
      'Star': 'star',
      'Tree': 'tree',
      'Snowflake': 'snowflake'
    };
    
    return elementMap[element] + suffix;
  }

  getFeedbackImageKey(symbolType) {
    // Use same logic as GameScene for consistency
    const pixelRatio = window.devicePixelRatio || 1;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let suffix;
    if (isMobile) {
      suffix = '_1x';
    } else {
      if (pixelRatio >= 3) {
        suffix = '_3x';
      } else if (pixelRatio >= 2) {
        suffix = '_2x';
      } else {
        suffix = '_1x';
      }
    }
    
    const feedbackMap = {
      'perfect': 'feedback_perfect_star',
      'close': 'feedback_close_bell'
      // No 'wrong' symbol needed in Mastermind - empty space indicates no match
    };
    
    const mappedSymbol = feedbackMap[symbolType];
    return mappedSymbol ? mappedSymbol + suffix : null;
  }

  // Quality assessment methods for family-friendly feedback
  calculateGuessQuality(guess, secretCode) {
    const feedback = this.calculateElementFeedback(guess, secretCode);
    const totalElements = secretCode.length;
    const correctPositions = feedback.perfect;
    const totalCorrectElements = feedback.perfect + feedback.close;
    
    const positionAccuracy = correctPositions / totalElements;
    const elementAccuracy = totalCorrectElements / totalElements;
    
    // Quality categories with family-friendly labels
    if (positionAccuracy >= 0.75) {
      return {
        category: 'excellent',
        label: 'Excellent!',
        description: 'Amazing detective work!',
        color: '#FFD700', // Gold
        colorHex: 0xFFD700, // Gold for Phaser
        bgColor: 'rgba(255, 215, 0, 0.1)'
      };
    } else if (elementAccuracy >= 0.50) {
      return {
        category: 'good',
        label: 'Good job!',
        description: 'You\'re getting closer!',
        color: '#4CAF50', // Green 
        colorHex: 0x4CAF50, // Green for Phaser
        bgColor: 'rgba(76, 175, 80, 0.1)'
      };
    } else if (elementAccuracy >= 0.25) {
      return {
        category: 'fair',
        label: 'Getting warmer!',
        description: 'Keep up the great thinking!',
        color: '#FF9800', // Orange
        colorHex: 0xFF9800, // Orange for Phaser
        bgColor: 'rgba(255, 152, 0, 0.1)'
      };
    } else {
      return {
        category: 'learning',
        label: 'Keep trying!',
        description: 'Every guess teaches us something!',
        color: '#FFFFFF', // WHITE - Maximum contrast against blue background (UI-002 fix)
        colorHex: 0xFFFFFF, // WHITE for Phaser - High visibility border
        bgColor: 'rgba(255, 255, 255, 0.1)'
      };
    }
  }

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

  createQualitySummary(width, y) {
    // Calculate quality distribution across all guesses
    const qualityStats = {
      excellent: 0,
      good: 0,
      fair: 0,
      learning: 0
    };
    
    this.gameData.guessHistory.forEach(guess => {
      const quality = this.calculateGuessQuality(guess, this.gameData.secretCode);
      qualityStats[quality.category]++;
    });
    
    const totalGuesses = this.gameData.guessHistory.length;
    let summaryText = '';
    
    if (qualityStats.excellent > 0) {
      summaryText = `Amazing! ${qualityStats.excellent} excellent guess${qualityStats.excellent > 1 ? 'es' : ''}!`;
    } else if (qualityStats.good > 0) {
      summaryText = `Great job! ${qualityStats.good} good guess${qualityStats.good > 1 ? 'es' : ''}!`;
    } else if (qualityStats.fair > 0) {
      summaryText = `You're learning! ${qualityStats.fair} warm guess${qualityStats.fair > 1 ? 'es' : ''}!`;
    } else {
      summaryText = 'Every guess teaches us something new!';
    }
    
    const summaryLabel = this.add.text(width / 2, y, summaryText, {
      font: '14px Arial',
      fill: '#4CAF50',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    this.historyContainer.add(summaryLabel);
  }

  // ...existing code...
}
