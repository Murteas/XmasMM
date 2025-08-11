// RoundOver.js - End game screen with score breakdown and options
// Uses global LayoutConfig (loaded early by ModuleLoader)

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
  const headerHeight = LayoutConfig.THREE_ZONE_HEADER;
    this.headerContainer = this.add.container(0, 0);
    
    // Scrollable content zone (solution + history)
  const footerHeight = LayoutConfig.FOOTER_HEIGHT_ROUND_OVER;
    const contentHeight = height - headerHeight - footerHeight;
    this.scrollableContainer = this.add.container(0, headerHeight);
    
    // Fixed footer zone (action buttons)
    this.footerContainer = this.add.container(0, height - footerHeight);
    
    // Create content for each zone
    this.createHeaderContent();
  this.createScrollableContent(contentHeight);
  // Enable touch / drag scrolling AFTER content is laid out
  this.enableScrollableInteraction(contentHeight);
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
    
    // Background protection for game over text
    const headerBg = this.add.rectangle(width / 2, 26, 180, 32, 0x000000, 0.4)
      .setOrigin(0.5);
    
  const header = this.add.text(width / 2, 26, gameOverText, {
      font: '28px Arial',
      fill: headerColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Compact score display
    const breakdown = this.gameData.scoreManager.getScoreBreakdown();
    
    // Background protection for score text
    const scoreBg = this.add.rectangle(width / 2, 60, 200, 28, 0x000000, 0.4)
      .setOrigin(0.5);
      
  const scoreText = this.add.text(width / 2, 60, `Score: ${breakdown.total} points`, {
      font: '20px Arial',
      fill: '#fff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Key score info in one line
    let scoreInfo = '';
    if (breakdown.elementPoints > 0) {
      const finalFeedback = this.gameData.scoreManager.calculateElementFeedback(
        this.gameData.finalGuess, 
        this.gameData.secretCode
      );
      
      // Build detailed score breakdown (avoid redundant '+' signs)
      const parts = [];
      const cfg = this.gameData.scoreManager.scoringConfig || { perfectElementPoints: 180, closeElementPoints: 80 };
      if (finalFeedback.perfect > 0) {
        parts.push(`${finalFeedback.perfect}★ (${finalFeedback.perfect * cfg.perfectElementPoints}pts)`);
      }
      if (finalFeedback.close > 0) {
        parts.push(`${finalFeedback.close}🔔 (${finalFeedback.close * cfg.closeElementPoints}pts)`);
      }
      if (breakdown.completeBonus > 0) {
        // No leading '+'; joiner will add plus between components
        parts.push(`${breakdown.completeBonus} solved bonus`);
      }
      if (breakdown.speedBonus !== 0) {
        const speedDesc = breakdown.speedBonus > 0 ? 'fast finish' : 'time penalty';
        parts.push(`${breakdown.speedBonus} ${speedDesc}`);
      }
      if (breakdown.hintPenalty < 0) {
        parts.push(`${breakdown.hintPenalty} for hints`);
      }

      scoreInfo = parts.join(' + ').replace(/ \+ -/g, ' - '); // Clean up patterns like ' + -75'
    } else {
      scoreInfo = 'Keep practicing!';
    }
    
    // Background protection for score details text
    const scoreDetailsBg = this.add.rectangle(width / 2, 90, Math.min(width - 40, scoreInfo.length * 8 + 20), 22, 0x000000, 0.4)
      .setOrigin(0.5);
    
  const scoreDetails = this.add.text(width / 2, 90, scoreInfo, {
      font: '14px Arial',
      fill: '#ddd',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

  this.headerContainer.add([headerBg, header, scoreBg, scoreText, scoreDetailsBg, scoreDetails]);

    // Info button (small circle i) to open scoring modal
    const infoBtn = this.add.text(width - 28, 18, 'ⓘ', {
      font: '20px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    infoBtn.on('pointerdown', () => this.showScoringModal());
    this.headerContainer.add(infoBtn);
  }

  createScrollableContent(contentHeight) {
    const { width } = this.cameras.main;
    let currentY = 20;
    
    // Solution display - educational reference at top
    // Background protection for solution label
    const solutionLabelBg = this.add.rectangle(width / 2, currentY, 100, 24, 0x000000, 0.4)
      .setOrigin(0.5);
    
    const solutionLabel = this.add.text(width / 2, currentY, 'Solution:', {
      font: '18px Arial',
      fill: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
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
    // Background protection for history label
    const historyLabelBg = this.add.rectangle(width / 2, currentY, 140, 22, 0x000000, 0.4)
      .setOrigin(0.5);
    
    const historyLabel = this.add.text(width / 2, currentY, 'Your Guesses:', {
      font: '16px Arial',
      fill: '#fff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    currentY += 30;
    
    // History rows (denser layout while preserving readability)
  const rowHeight = LayoutConfig.ROUND_OVER_ROW_HEIGHT_DENSE; // centralized constant
    this.gameData.guessHistory.forEach((guess, index) => {
      const feedback = this.gameData.feedbackHistory[index];
      this.createHistoryRow(guess, feedback, index + 1, currentY, this.scrollableContainer, rowHeight);
      currentY += rowHeight;
    });

    // Track total scrollable content height for drag constraints
    this.totalScrollableContentHeight = currentY + 10; // padding tail
    this.visibleScrollableHeight = contentHeight;
    
    this.scrollableContainer.add([solutionLabelBg, solutionLabel, solutionContainer, historyLabelBg, historyLabel]);
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
    
  const playAgainBtn = ButtonFactory.createButton(
      this,
      width / 2 - buttonSpacing,
      buttonY,
      'Play Again',
      'primary',
      {
    icon: '🔁',
    gradient: true,
    border: true,
        onClick: () => {
          this.scene.start('Game', {
            difficulty: this.gameData.difficulty,
            gameMode: this.gameData.gameMode
          });
        }
      }
    );

  const shareBtn = ButtonFactory.createButton(
      this,
      width / 2 + buttonSpacing,
      buttonY,
      'Share Score',
      'accent',
      {
    icon: '📤',
    gradient: true,
    border: true,
        onClick: () => this.shareScore()
      }
    );

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
        title: 'Christmas MasterMind Score',
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

  createHistoryRow(guess, feedback, rowNumber, y, container, rowHeight = LayoutConfig.ROUND_OVER_ROW_HEIGHT_DENSE) {
    const { width } = this.cameras.main;

    // Quality classification (family-friendly feedback)
    const quality = this.calculateGuessQuality(guess, this.gameData.secretCode);

    // Background with subtle quality tint
    const bgWidth = width - 32;
    const rowBackground = this.add.rectangle(width / 2, y, bgWidth, rowHeight - 4, quality.colorHex, 0.12)
      .setStrokeStyle(1, 0x444444, 0.4);
    container.add(rowBackground);

    // Row number & quality bar
    const numberX = 22;
    const rowText = this.add.text(numberX, y, `${rowNumber}`, {
      font: '13px Arial',
      fill: '#ffffff'
    }).setOrigin(0, 0.5);

    // Guess elements (slightly reduced spacing for density)
    const elementSize = 28;
    const elementSpacing = 32;
    const startX = 60;

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
            font: '12px Arial',
            fill: '#fff',
            backgroundColor: '#666',
            padding: { left: 4, right: 4, top: 3, bottom: 3 }
          }).setOrigin(0.5);
          container.add(elementText);
        }
      } catch (error) {
        const elementText = this.add.text(x, y, element.charAt(0).toUpperCase(), {
          font: '12px Arial',
          fill: '#fff',
          backgroundColor: '#666',
          padding: { left: 4, right: 4, top: 3, bottom: 3 }
        }).setOrigin(0.5);
        container.add(elementText);
      }
    });

    // Feedback symbols (stars/bells)
    const feedbackStartX = startX + (guess.length * elementSpacing) + 16;
    let feedbackX = feedbackStartX;
    for (let i = 0; i < feedback.black; i++) {
      this.createFeedbackSymbol('perfect', feedbackX, y, 14, container);
      feedbackX += 16;
    }
    for (let i = 0; i < feedback.white; i++) {
      this.createFeedbackSymbol('close', feedbackX, y, 14, container);
      feedbackX += 16;
    }

    // Quality label at far right (truncate if space constrained)
    const remainingSpace = (width - 20) - feedbackX;
    if (remainingSpace > 60) {
      const qualityLabel = this.add.text(width - 24, y, quality.label, {
        font: '12px Arial',
        fill: quality.color
      }).setOrigin(1, 0.5);
      container.add(qualityLabel);
    }

    container.add([rowText]);
  }

  enableScrollableInteraction(contentHeight) {
    // Skip if content fits
    if (!this.totalScrollableContentHeight || this.totalScrollableContentHeight <= contentHeight) return;

    this.isDraggingScroll = false;
    this.scrollDragStartY = 0;
    this.scrollContainerStartY = this.scrollableContainer.y;

    const onPointerDown = (pointer) => {
      if (pointer.y < 140 || pointer.y > (this.cameras.main.height - 100)) return; // outside scroll zone
      this.isDraggingScroll = true;
      this.scrollDragStartY = pointer.y;
      this.scrollContainerStartY = this.scrollableContainer.y;
    };
    const onPointerMove = (pointer) => {
      if (!this.isDraggingScroll) return;
      const delta = pointer.y - this.scrollDragStartY;
      this.scrollableContainer.y = this.clampScrollPosition(this.scrollContainerStartY + delta, contentHeight);
    };
    const endDrag = () => { this.isDraggingScroll = false; };

    this.input.on('pointerdown', onPointerDown);
    this.input.on('pointermove', onPointerMove);
    this.input.on('pointerup', endDrag);
    this.input.on('pointerupoutside', endDrag);

    // Wheel support (desktop)
    this.input.on('wheel', (pointer, gameObjects, dx, dy) => {
      const next = this.scrollableContainer.y - dy * 0.5;
      this.scrollableContainer.y = this.clampScrollPosition(next, contentHeight);
    });
  }

  clampScrollPosition(desiredY, contentHeight) {
  const headerY = 150; // adjusted to include legend line spacing
    const minY = headerY - (this.totalScrollableContentHeight - contentHeight); // max scroll up (content moves up, container y decreases)
    const maxY = headerY; // original position
    if (this.totalScrollableContentHeight <= contentHeight) return headerY;
    return Phaser.Math.Clamp(desiredY, minY, maxY);
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

  showScoringModal() {
    if (this.scoringModal) return; // prevent duplicates
    const { width, height } = this.cameras.main;
    const container = this.add.container(0,0);
    this.scoringModal = container;
    const backdrop = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.85)
      .setInteractive();
    const panelWidth = Math.min(520, width * 0.9);
    const maxPanelHeight = Math.min(420, height * 0.85);
    // Temporary panel placeholder; we'll resize after measuring content
    const panel = this.add.rectangle(width/2, height/2, panelWidth, maxPanelHeight, 0x0d2a40, 0.95)
      .setStrokeStyle(2, 0xffffff, 0.25);
    const title = this.add.text(width/2, height/2 - maxPanelHeight/2 + 40, 'Scoring Explained', {
      font: '22px Arial',
      fill: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const bodyText = [
      'Element Points:',
      '  ★ Perfect element right spot = 180 pts',
      '  🔔 Right element wrong spot = 80 pts',
      '',
      'Solve Bonus:',
      '  +250 for cracking the full code',
      '',
      'Speed Bonus (unused guesses before guess 10):',
      '  First 3 unused guesses ×80',
      '  Next 3 unused guesses ×50',
  '  Remaining unused guesses ×30',
      '',
      'Hint Penalty:',
      '  Using Santa\'s Hint costs 220 points (once per game)',
      '',
      'Final Score = Elements + Solve + Speed +/- Hint'
    ].join('\n');
    const body = this.add.text(width/2, title.y + 30, bodyText, {
      font: '14px Arial',
      fill: '#ffffff',
      align: 'left',
      lineSpacing: 4,
      wordWrap: { width: panelWidth - 60 }
    }).setOrigin(0.5, 0);
    // Position close button beneath body (measure after render)
    const closeBtn = this.add.text(width/2, 0, 'Close', {
      font: '18px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 18, right: 18, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.hideScoringModal());
    container.add([backdrop, panel, title, body, closeBtn]);

    // After next frame, adjust panel & close button vertically based on body height
    this.time.delayedCall(10, () => {
      const contentHeight = (body.y - panel.y + body.height) + 80; // 40 padding top + 40 bottom approx
      const finalPanelHeight = Math.min(maxPanelHeight, Math.max(260, contentHeight));
      panel.height = finalPanelHeight;
      panel.y = height/2; // ensure centered
      // Reposition title relative to new panel height
      title.y = panel.y - finalPanelHeight/2 + 40;
      body.y = title.y + 30;
      closeBtn.y = body.y + body.height + 28;
      // If close button exceeds panel, expand panel if room
      const needed = (closeBtn.y + closeBtn.height/2 + 24) - (panel.y + finalPanelHeight/2);
      if (needed > 0) {
        const expanded = Math.min(maxPanelHeight, finalPanelHeight + needed);
        panel.height = expanded;
        // Recompute center-based positions after expansion
        title.y = panel.y - expanded/2 + 40;
        body.y = title.y + 30;
        closeBtn.y = body.y + body.height + 28;
      }
    });
    container.setDepth(9999).setAlpha(0).setScale(0.95);
    this.tweens.add({ targets: container, alpha: 1, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.easeOut'});
  }

  hideScoringModal() {
    if (!this.scoringModal) return;
    const modal = this.scoringModal;
    this.scoringModal = null;
    this.tweens.add({
      targets: modal,
      alpha: 0,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 150,
      ease: 'Power2',
      onComplete: () => modal.destroy()
    });
  }
}
