// RoundOver.js - End game screen with score breakdown and options

class RoundOver extends Phaser.Scene {
  constructor() {
    super({ key: 'RoundOver' });
    this.gameData = null;
    // Remove history toggle - everything in one view now
    this.headerContainer = null;
    this.scrollableContainer = null;
    this.footerContainer = null;
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

    // Implement three-zone mobile architecture
    this.createThreeZoneLayout();
  }

  createThreeZoneLayout() {
    const { width, height } = this.cameras.main;
    
    // Fixed header zone (header info + score)
    const headerHeight = 140;
    this.headerContainer = this.add.container(0, 0);
    
    // Scrollable content zone (solution + history)
    const footerHeight = 100;
    const contentHeight = height - headerHeight - footerHeight;
    this.scrollableContainer = this.add.container(0, headerHeight);
    
    // Fixed footer zone (action buttons)
    this.footerContainer = this.add.container(0, height - footerHeight);
    
    // Create content for each zone
    this.createHeaderContent();
    this.createScrollableContent(contentHeight);
    this.createFooterContent();
    
    // Add masking for clean scroll boundaries
    const mask = this.make.graphics();
    mask.fillRect(0, headerHeight, width, contentHeight);
    this.scrollableContainer.setMask(mask.createGeometryMask());
  }

  createHeaderContent() {
    const { width } = this.cameras.main;
    
    // Game over text
    const gameOverText = this.gameData.won ? 'Success!' : 'Game Over';
    const headerColor = this.gameData.won ? '#27ae60' : '#e74c3c';
    
    const header = this.add.text(width / 2, 30, gameOverText, {
      font: '28px Arial',
      fill: headerColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Compact score display
    const breakdown = this.gameData.scoreManager.getScoreBreakdown();
    const scoreText = this.add.text(width / 2, 65, `Score: ${breakdown.total} points`, {
      font: '20px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Key score info in one line
    let scoreInfo = '';
    if (breakdown.elementPoints > 0) {
      const finalFeedback = this.gameData.scoreManager.calculateElementFeedback(
        this.gameData.finalGuess, 
        this.gameData.secretCode
      );
      
      // Build detailed score breakdown
      const parts = [];
      if (finalFeedback.perfect > 0) {
        parts.push(`${finalFeedback.perfect}★ (${finalFeedback.perfect * 200}pts)`);
      }
      if (finalFeedback.close > 0) {
        parts.push(`${finalFeedback.close}🔔 (${finalFeedback.close * 100}pts)`);
      }
      if (breakdown.completeBonus > 0) {
        parts.push(`+${breakdown.completeBonus} solved bonus`);
      }
      if (breakdown.speedBonus !== 0) {
        const speedLabel = breakdown.speedBonus > 0 ? '+' : '';
        const speedDesc = breakdown.speedBonus > 0 ? 'fast finish' : 'time penalty';
        parts.push(`${speedLabel}${breakdown.speedBonus} ${speedDesc}`);
      }
      if (breakdown.hintPenalty < 0) {
        parts.push(`${breakdown.hintPenalty} for hints`);
      }
      
      scoreInfo = parts.join(' + ');
    } else {
      scoreInfo = 'Keep practicing!';
    }
    
    const scoreDetails = this.add.text(width / 2, 95, scoreInfo, {
      font: '14px Arial',
      fill: '#ddd'
    }).setOrigin(0.5);
    
    this.headerContainer.add([header, scoreText, scoreDetails]);
  }

  createScrollableContent(contentHeight) {
    const { width } = this.cameras.main;
    let currentY = 20;
    
    // Solution display - educational reference at top
    const solutionLabel = this.add.text(width / 2, currentY, 'Solution:', {
      font: '18px Arial',
      fill: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    currentY += 35;
    
    // Solution elements
    const solutionContainer = this.add.container(width / 2, currentY);
    const elementSize = 28;
    const elementSpacing = 35;
    const totalWidth = (this.gameData.secretCode.length - 1) * elementSpacing;
    
    this.gameData.secretCode.forEach((element, index) => {
      const x = -(totalWidth / 2) + (index * elementSpacing);
      
      try {
        const imageKey = this.getElementImageKey(element);
        if (this.textures.exists(imageKey)) {
          const elementImage = this.add.image(x, 0, imageKey)
            .setDisplaySize(elementSize, elementSize);
          solutionContainer.add(elementImage);
        } else {
          const elementText = this.add.text(x, 0, element.charAt(0).toUpperCase(), {
            font: '14px Arial',
            fill: '#ffd700',
            backgroundColor: '#0d5016',
            padding: { left: 4, right: 4, top: 3, bottom: 3 }
          }).setOrigin(0.5);
          solutionContainer.add(elementText);
        }
      } catch (error) {
        const elementText = this.add.text(x, 0, element.charAt(0).toUpperCase(), {
          font: '14px Arial',
          fill: '#ffd700',
          backgroundColor: '#0d5016',
          padding: { left: 4, right: 4, top: 3, bottom: 3 }
        }).setOrigin(0.5);
        solutionContainer.add(elementText);
      }
    });
    currentY += 50;
    
    // History section
    const historyLabel = this.add.text(width / 2, currentY, 'Your Guesses:', {
      font: '16px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    currentY += 30;
    
    // History rows
    const rowHeight = 45;
    this.gameData.guessHistory.forEach((guess, index) => {
      const feedback = this.gameData.feedbackHistory[index];
      this.createHistoryRow(guess, feedback, index + 1, currentY, this.scrollableContainer);
      currentY += rowHeight;
    });
    
    this.scrollableContainer.add([solutionLabel, solutionContainer, historyLabel]);
  }

  createSolutionDisplay() {
    const { width, height } = this.cameras.main;
    // Better vertical spacing - more space after score breakdown
    const solutionY = Math.min(280, height * 0.52);
    
    // Larger, more prominent "The answer was:" label for mobile readability
    const labelText = this.add.text(width / 2, solutionY, 'The answer was:', {
      font: `${Math.max(16, Math.min(20, width * 0.045))}px Arial`,
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Solution elements container with better mobile spacing
    const solutionContainer = this.add.container(width / 2, solutionY + Math.max(45, height * 0.09));
    
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

  createFooterContent() {
    const { width } = this.cameras.main;
    
    // Two-button layout optimized for mobile
    const buttonY = 25; // Centered in footer
    const buttonSpacing = width * 0.25;
    
    // Play Again Button
    const playAgainBtn = this.add.text(width / 2 - buttonSpacing, buttonY, 'Play Again', {
      font: '18px Arial',
      fill: '#fff',
      backgroundColor: '#0d5016',
      padding: { left: 20, right: 20, top: 12, bottom: 12 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('Game', { 
          difficulty: this.gameData.difficulty,
          gameMode: this.gameData.gameMode 
        });
      })
      .on('pointerover', function() {
        this.setStyle({ backgroundColor: '#156b1f' });
      })
      .on('pointerout', function() {
        this.setStyle({ backgroundColor: '#0d5016' });
      });
    
    // Share Score Button
    const shareBtn = this.add.text(width / 2 + buttonSpacing, buttonY, 'Share Score', {
      font: '18px Arial',
      fill: '#0d5016',
      backgroundColor: '#ffd700',
      padding: { left: 20, right: 20, top: 12, bottom: 12 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.shareScore();
      })
      .on('pointerover', function() {
        this.setStyle({ backgroundColor: '#ffe55c' });
      })
      .on('pointerout', function() {
        this.setStyle({ backgroundColor: '#ffd700' });
      });
    
    this.footerContainer.add([playAgainBtn, shareBtn]);
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
        this.showCopyFeedback();
      }).catch(() => {
        // Final fallback: show text in alert
        alert(shareText);
      });
    }
  }

  createHistoryRow(guess, feedback, rowNumber, y, container) {
    const { width } = this.cameras.main;
    
    // Add subtle background highlight for better mobile separation
    const rowBackground = this.add.rectangle(width / 2, y, width - 40, 40, 0x000000, 0.2)
      .setStrokeStyle(1, 0x444444, 0.5);
    container.add(rowBackground);
    
    // Row number
    const rowText = this.add.text(30, y, `${rowNumber}:`, {
      font: '14px Arial',
      fill: '#fff'
    }).setOrigin(0, 0.5);
    
    // Guess elements - optimized for scrollable view with larger size for better visibility
    const elementSize = 30; // Increased from 24 for better mobile readability
    const elementSpacing = 35; // Increased from 28 to accommodate larger elements
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
            font: '12px Arial', // Increased from 10px for better readability
            fill: '#fff',
            backgroundColor: '#666',
            padding: { left: 4, right: 4, top: 3, bottom: 3 } // Increased padding
          }).setOrigin(0.5);
          container.add(elementText);
        }
      } catch (error) {
        const elementText = this.add.text(x, y, element.charAt(0).toUpperCase(), {
          font: '12px Arial', // Increased from 10px for better readability
          fill: '#fff',
          backgroundColor: '#666',
          padding: { left: 4, right: 4, top: 3, bottom: 3 } // Increased padding
        }).setOrigin(0.5);
        container.add(elementText);
      }
    });
    
    // Feedback symbols
    const feedbackStartX = startX + (guess.length * elementSpacing) + 25;
    let feedbackX = feedbackStartX;
    
    // Perfect matches (stars)
    for (let i = 0; i < feedback.black; i++) {
      this.createFeedbackSymbol('perfect', feedbackX, y, 14, container);
      feedbackX += 16;
    }
    
    // Close matches (bells)
    for (let i = 0; i < feedback.white; i++) {
      this.createFeedbackSymbol('close', feedbackX, y, 14, container);
      feedbackX += 16;
    }
    
    container.add([rowText]);
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

  // ...existing code...
}
