// HistoryRenderer.js - Handles history display and rendering logic

class HistoryRenderer {
  constructor(scene, historyManager) {
    this.scene = scene;
    this.historyManager = historyManager;
    this.historyElements = [];
    this.historyGroup = null;
  }

  displayGuessHistory(guessHistory, feedbackHistory) {
    // Clear previous history display
    this.clearHistory();
    
    this.historyGroup = this.scene.add.group();
    
    const { width, height } = this.scene.cameras.main;
    
    if (guessHistory.length === 0) return 0;

    // SCROLLABLE: Render all guesses (scrolling enabled in GameScene)
    console.log(`🔍 SCROLLABLE: Rendering all ${guessHistory.length} guesses`);

    // Simple fixed positioning (scroll handled by GameScene)
    const isSmallScreen = width < 500;
    // Increased top padding to prevent header overlap (matches ActiveRowManager)
    const containerRelativeY = isSmallScreen ? 30 : 25;
    const startY = Math.max(containerRelativeY, height * 0.02);
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;

    // Render all guesses
    this.renderAllRows(guessHistory, feedbackHistory, startY, rowHeight);

    return 0; // Scroll offset managed by GameScene
  }

  renderSlidingWindow(visibleGuesses, visibleFeedback, startIndex, startY, rowHeight) {
    const baseDepth = GameUtils.getDepthLayers().HISTORY;
    
    visibleGuesses.forEach((guess, displayIndex) => {
      const actualRowIndex = startIndex + displayIndex; // Original guess number
      const y = startY + (displayIndex * rowHeight);
      const feedback = visibleFeedback[displayIndex];
      const currentDepth = baseDepth + displayIndex * 0.1;
      
      this.renderGuessRow(guess, feedback, actualRowIndex, y, currentDepth);
    });
  }

  renderAllRows(guessHistory, feedbackHistory, startY, rowHeight) {
    const baseDepth = GameUtils.getDepthLayers().HISTORY;
    
    guessHistory.forEach((guess, rowIndex) => {
      const y = startY + (rowIndex * rowHeight);
      const feedback = feedbackHistory[rowIndex];
      const currentDepth = baseDepth + rowIndex * 0.1;
      
      this.renderGuessRow(guess, feedback, rowIndex, y, currentDepth);
    });
  }

  renderGuessRow(guess, feedback, rowIndex, y, depth) {
    const codeLength = guess.length;
    const { width } = this.scene.cameras.main;
    
    const isSmallScreen = width < 500;
    
    // IMPROVED: Much bigger elements for excellent visibility and family accessibility
    const elementSize = 45; // Increased from 35 to 45 for much better visibility
    const elementSpacing = 55; // Increased from 42 to 55 for better spacing
    
    // Add subtle row background for better visibility against Christmas background
    const rowWidth = width * 0.95;
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD; // Use consistent row height
    const rowBackground = this.scene.add.rectangle(
      width / 2, 
      y, 
      rowWidth, 
      rowHeight - 5, // Slight padding
      0x000000, 
      0.15 // Very subtle transparency
    ).setOrigin(0.5).setDepth(depth - 0.1);
    
    this.scene.scrollableContainer.add(rowBackground);
    this.historyElements.push(rowBackground);
    
    // MOBILE EXPERT DESIGN: Use much more screen width (90% vs ~60%)
    const totalRowWidth = (codeLength * elementSpacing) - elementSpacing + elementSize;
    const screenPadding = Math.min(20, width * 0.05); // 5% padding or 20px max
    const maxRowWidth = width - (screenPadding * 2);
    
    // Use wider layout by minimizing left margin  
    const startX = Math.max(screenPadding, screenPadding + (maxRowWidth - totalRowWidth) / 2);
    
    // Visual hierarchy: fade older guesses (GameScreenHistoryCompression task)
    // Most recent 2 rows stay full opacity, older rows fade to 80%
    const totalRows = this.historyManager.guessHistory.length;
    const rowAge = totalRows - rowIndex - 1; // 0 = newest, higher = older
    const opacity = rowAge <= 1 ? 1.0 : 0.8;
    
    // Render guess elements with opacity
    this.renderGuessElements(guess, startX, y, elementSpacing, elementSize, depth, opacity);
    
    // Render feedback with opacity (using RoundOver pattern)
    this.renderFeedback(feedback, startX, y, elementSpacing, codeLength, depth, opacity);
    
    // Render row number with opacity
    this.renderRowNumber(rowIndex, startX, y, depth, opacity);
  }

  renderGuessElements(guess, startX, y, elementSpacing, elementSize, depth, opacity = 1.0) {
    guess.forEach((element, colIndex) => {
      const x = startX + colIndex * elementSpacing;
      
      // EXPERT DESIGN: Remove white borders like RoundOver screen for cleaner look and more space
      // No slot background - just place elements directly like the polished game end screen
      
      // Create element image with fallback and opacity
      const elementImage = this.createElementImage(element, x, y, elementSize, depth, opacity);
      
      this.scene.scrollableContainer.add(elementImage);
      this.historyElements.push(elementImage);
    });
  }

  createElementImage(element, x, y, elementWidth, depth, opacity = 1.0) {
    const imageKey = this.scene.getElementImageKey(element);
    let elementImage;
    
    try {
      elementImage = this.scene.add.image(x, y, imageKey);
      
      if (!elementImage.texture || elementImage.texture.key === '__MISSING') {
        console.warn(`History: Failed to create image for ${element}, using fallback`);
        elementImage.destroy();
        return this.createFallbackElement(element, x, y, elementWidth, depth, opacity);
      }
      
      // Scale image to fit in larger history slot and apply opacity
      const targetSize = elementWidth - 4; // Leave 2px padding on each side
      const imageScale = Math.min(targetSize / elementImage.width, targetSize / elementImage.height);
      elementImage.setScale(imageScale);
      elementImage.setOrigin(0.5).setDepth(depth + 0.01).setAlpha(opacity);
      
      return elementImage;
    } catch (error) {
      console.error(`History: Error creating image for ${element}:`, error);
      if (elementImage) elementImage.destroy();
      return this.createFallbackElement(element, x, y, elementWidth, depth, opacity);
    }
  }

  createFallbackElement(element, x, y, elementWidth, depth, opacity = 1.0) {
    const fallbackRect = this.scene.add.rectangle(x, y, elementWidth - 4, 26, 0xff6b6b)
      .setDepth(depth + 0.01)
      .setAlpha(opacity);
    
    const elementText = this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
      font: '10px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(depth + 0.02).setAlpha(opacity);
    
    this.scene.scrollableContainer.add(elementText);
    this.historyElements.push(elementText);
    
    return fallbackRect;
  }

  renderFeedback(feedback, startX, y, elementSpacing, codeLength, depth, opacity = 1.0) {
    // Calculate available space for feedback to prevent overflow
    const { width } = this.scene.cameras.main;
    const screenPadding = Math.min(20, width * 0.05);
    const feedbackStartX = startX + (codeLength * elementSpacing) + 5;
    const maxFeedbackWidth = width - screenPadding - feedbackStartX;
    
    // Create bigger Christmas feedback symbols with smart spacing
    this.renderChristmasFeedback(feedback, feedbackStartX, y, depth, opacity, maxFeedbackWidth);
  }

  /**
   * Render Christmas-themed feedback symbols instead of traditional Mastermind pegs
   * @param {Object} feedback - Object with black (perfect) and white (close) counts
   * @param {number} x - X position for feedback display
   * @param {number} y - Y position for feedback display  
   * @param {number} depth - Rendering depth
   */
  renderChristmasFeedback(feedback, x, y, depth, opacity = 1.0, maxWidth = null) {
    // Compact grid layout for perfect feedback display
    
    const totalFeedbackCount = feedback.black + feedback.white;
    if (totalFeedbackCount === 0) return;
    
    const iconSize = 16; // Slightly smaller for grid layout
    const gridSpacing = 18; // Tight spacing for compact grid
    
    // Create combined feedback array for grid arrangement
    const feedbackIcons = [];
    
    // Add perfect matches (stars) first
    for (let i = 0; i < feedback.black; i++) {
      feedbackIcons.push('perfect');
    }
    
    // Add close matches (bells) 
    for (let i = 0; i < feedback.white; i++) {
      feedbackIcons.push('close');
    }
    
    // Calculate optimal grid dimensions
    const totalIcons = feedbackIcons.length;
    let cols, rows;
    
    if (totalIcons <= 2) {
      cols = totalIcons;
      rows = 1;
    } else if (totalIcons <= 4) {
      cols = 2;
      rows = Math.ceil(totalIcons / 2);
    } else if (totalIcons <= 6) {
      cols = 3;
      rows = Math.ceil(totalIcons / 3);
    } else {
      // Fallback for edge cases
      cols = 3;
      rows = Math.ceil(totalIcons / 3);
    }
    
    // Calculate grid positioning
    const gridWidth = (cols - 1) * gridSpacing;
    const gridHeight = (rows - 1) * gridSpacing;
    const startX = x - gridWidth / 2;
    const startY = y - gridHeight / 2;
    
    // Render icons in grid
    feedbackIcons.forEach((iconType, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const iconX = startX + col * gridSpacing;
      const iconY = startY + row * gridSpacing;
      
      this.renderFeedbackSymbol(iconType, iconX, iconY, iconSize, depth + 0.01, opacity);
    });
  }

  /**
   * Render individual Christmas feedback symbol with fallback
   * @param {string} symbolType - 'perfect', 'close', or 'wrong'
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} size - Symbol size
   * @param {number} depth - Rendering depth
   */
  renderFeedbackSymbol(symbolType, x, y, size, depth, opacity = 1.0) {
    try {
      // Get the appropriate image key for this device
      const imageKey = this.scene.getFeedbackImageKey(symbolType);
      
      // Check if the texture exists
      if (!this.scene.textures.exists(imageKey)) {
        console.warn(`Feedback symbol texture not found: ${imageKey}, using fallback`);
        this.renderFallbackFeedbackSymbol(symbolType, x, y, size, depth, opacity);
        return;
      }
      
      // Create the Christmas symbol image
      const symbolImage = this.scene.add.image(x, y, imageKey);
      
      if (!symbolImage.texture || symbolImage.texture.key === '__MISSING') {
        console.warn(`Failed to create feedback symbol: ${imageKey}, using fallback`);
        symbolImage.destroy();
        this.renderFallbackFeedbackSymbol(symbolType, x, y, size, depth, opacity);
        return;
      }
      
      // Scale the symbol to fit the feedback area and apply opacity
      const imageScale = Math.min(size / symbolImage.width, size / symbolImage.height);
      symbolImage.setScale(imageScale);
      symbolImage.setOrigin(0.5).setDepth(depth).setAlpha(opacity);
      
      this.scene.scrollableContainer.add(symbolImage);
      this.historyElements.push(symbolImage);
      
    } catch (error) {
      console.error(`Error creating Christmas feedback symbol ${symbolType}:`, error);
      this.renderFallbackFeedbackSymbol(symbolType, x, y, size, depth, opacity);
    }
  }

  /**
   * Render fallback symbols if Christmas assets fail to load
   * @param {string} symbolType - 'perfect', 'close', or 'wrong'
   * @param {number} x - X position
   * @param {number} y - Y position  
   * @param {number} size - Symbol size
   * @param {number} depth - Rendering depth
   */
  renderFallbackFeedbackSymbol(symbolType, x, y, size, depth, opacity = 1.0) {
    const colors = {
      'perfect': 0xFFD700, // Gold for perfect
      'close': 0xC0C0C0,   // Silver for close
      'wrong': 0xFF6B6B    // Red for wrong
    };
    
    const symbols = {
      'perfect': '★',
      'close': '◇', 
      'wrong': '✕'
    };
    
    // Create a colored circle background with opacity
    const circle = this.scene.add.circle(x, y, size / 2, colors[symbolType])
      .setStrokeStyle(1, 0x333333)
      .setDepth(depth)
      .setAlpha(opacity);
    
    // Add symbol text with opacity
    const symbolText = this.scene.add.text(x, y, symbols[symbolType], {
      font: `${Math.round(size * 0.8)}px Arial`,
      fill: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(depth + 0.01).setAlpha(opacity);
    
    this.scene.scrollableContainer.add(circle);
    this.scene.scrollableContainer.add(symbolText);
    this.historyElements.push(circle, symbolText);
  }

  renderRowNumber(rowIndex, startX, y, depth, opacity = 1.0) {
    // MOBILE EXPERT FIX: Move row numbers further left to avoid larger element overlap
    const rowNumberX = Math.max(15, startX - 50); // Increased spacing from 35 to 50
    const rowNumberText = this.scene.add.text(rowNumberX, y, `${rowIndex + 1}`, {
      font: '14px Arial', // Larger font (was 12px)
      fill: '#fff',       
      fontStyle: 'bold'   
    }).setOrigin(0.5).setDepth(depth).setAlpha(opacity);
    
    this.scene.scrollableContainer.add(rowNumberText);
    this.historyElements.push(rowNumberText);
  }

  clearHistory() {
    // Clean up historyGroup (used for organization but not as container)
    if (this.historyGroup) {
      this.historyGroup.clear(true, true);
      this.historyGroup.destroy();
      this.historyGroup = null;
    }
    
    // Clean up individual elements (added directly to game container)
    if (this.historyElements) {
      this.historyElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      this.historyElements = [];
    }
  }

  reset() {
    this.clearHistory();
  }
}