// HistoryRenderer.js - Handles history display and rendering logic

class HistoryRenderer {
  constructor(scene, historyManager) {
    this.scene = scene;
    this.historyManager = historyManager;
    this.historyElements = [];
    this.historyGroup = null;
  }

  displayGuessHistory(guessHistory, feedbackHistory, historyScrollOffset) {
    // Clear previous history display
    this.clearHistory();
    
    this.historyGroup = this.scene.add.group();
    
    const { width, height } = this.scene.cameras.main;
    const isSmallScreen = width < 500;
    const isVerySmallScreen = width < 400;
    
    // Calculate consistent positioning with ActiveRowManager and UILayoutManager
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const headerBottomY = isVerySmallScreen ? 145 : (isSmallScreen ? 120 : 95);
    
    // MOBILE OPTIMIZATION: No longer account for Christmas legend space (GameScreenMobileLayoutFix)
    // Legend removed to reclaim 65px of valuable header space
    // const legendItemHeight = 20;
    // const legendItems = 2; // perfect and close feedback symbols
    // const legendHeight = (legendItems * legendItemHeight) + 25;
    // const legendSpacing = 10;
    
    // History starts much higher for maximum space usage - expert mobile optimization
    const startY = Math.max(
      baseHeaderHeight, 
      height * 0.14, // Reduced from 0.18 to 0.14 for even higher positioning
      headerBottomY + 2 // Reduced from 5 to 2 for minimal gap
    );
    
    // Mobile-optimized row height for much bigger elements and excellent visibility
    // Increased from 55px to 65px to accommodate larger elements (45px + padding)
    const rowHeight = 65;
    const bottomMargin = isSmallScreen ? 40 : 50; // Reduced to use more space
    const maxVisibleRows = Math.floor((height - startY - bottomMargin) / rowHeight);
    
    const totalRows = guessHistory.length;
    const maxScrollOffset = Math.max(0, (totalRows * rowHeight) - (maxVisibleRows * rowHeight));
    
    // Validate scroll offset
    const validatedScrollOffset = Math.max(0, Math.min(maxScrollOffset, historyScrollOffset));
    
    if (totalRows <= maxVisibleRows) {
      // No scrolling needed
      this.renderAllRows(guessHistory, feedbackHistory, startY, rowHeight);
    } else {
      // Render visible rows only
      this.renderVisibleRows(guessHistory, feedbackHistory, startY, rowHeight, validatedScrollOffset, maxVisibleRows);
      this.renderScrollIndicators(totalRows, maxVisibleRows, validatedScrollOffset, startY, rowHeight);
    }
    
    return validatedScrollOffset;
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

  renderVisibleRows(guessHistory, feedbackHistory, startY, rowHeight, scrollOffset, maxVisibleRows) {
    const startIndex = Math.floor(scrollOffset / rowHeight);
    const endIndex = Math.min(guessHistory.length, startIndex + maxVisibleRows + 1);
    const baseDepth = GameUtils.getDepthLayers().HISTORY;
    
    guessHistory.slice(startIndex, endIndex).forEach((guess, displayIndex) => {
      const rowIndex = startIndex + displayIndex;
      const y = startY + (rowIndex * rowHeight) - scrollOffset;
      const feedback = feedbackHistory[rowIndex];
      const currentDepth = baseDepth + displayIndex * 0.1;
      
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
    const rowHeight = 65; // Current row height
    const rowBackground = this.scene.add.rectangle(
      width / 2, 
      y, 
      rowWidth, 
      rowHeight - 5, // Slight padding
      0x000000, 
      0.15 // Very subtle transparency
    ).setOrigin(0.5).setDepth(depth - 0.1);
    
    this.historyGroup.add(rowBackground);
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
      
      this.historyGroup.add(elementImage);
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
    
    this.historyGroup.add(elementText);
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
      
      this.historyGroup.add(symbolImage);
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
    
    this.historyGroup.add(circle);
    this.historyGroup.add(symbolText);
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
    
    this.historyGroup.add(rowNumberText);
    this.historyElements.push(rowNumberText);
  }

  renderScrollIndicators(totalRows, maxVisibleRows, scrollOffset, startY, rowHeight) {
    const { width, height } = this.scene.cameras.main;
    const startIndex = Math.floor(scrollOffset / rowHeight);
    const endIndex = Math.min(totalRows, startIndex + maxVisibleRows + 1);
    
    // Up scroll indicator
    if (startIndex > 0) {
      const upIndicator = this.scene.add.text(width - 50, startY - 20, '↑ Scroll up', {
        font: '10px Arial',
        fill: '#fff',
        backgroundColor: '#444',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI)
        .setInteractive({ useHandCursor: true });
      
      upIndicator.on('pointerdown', () => {
        this.historyManager.scrollHistory(-30);
      });
      
      this.historyGroup.add(upIndicator);
      this.historyElements.push(upIndicator);
    }
    
    // Down scroll indicator
    if (endIndex < totalRows) {
      const bottomMargin = height < 400 ? 40 : 60;
      const downButtonY = Math.min(startY + maxVisibleRows * rowHeight + 10, height - bottomMargin);
      const downIndicator = this.scene.add.text(width - 50, downButtonY, '↓ Scroll down', {
        font: '10px Arial',
        fill: '#fff',
        backgroundColor: '#444',
        padding: { left: 4, right: 4, top: 2, bottom: 2 }
      }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI + 10)
        .setInteractive({ useHandCursor: true });
      
      downIndicator.on('pointerdown', () => {
        this.historyManager.scrollHistory(30);
      });
      
      this.historyGroup.add(downIndicator);
      this.historyElements.push(downIndicator);
    }
    
    // Position indicator
    const scrollInfo = `${startIndex + 1}-${endIndex} of ${totalRows}`;
    const positionIndicator = this.scene.add.text(width - 50, startY - 40, scrollInfo, {
      font: '10px Arial',
      fill: '#ccc'
    }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI);
    
    this.historyGroup.add(positionIndicator);
    this.historyElements.push(positionIndicator);
  }

  clearHistory() {
    if (this.historyGroup) {
      this.historyGroup.clear(true, true);
      this.historyGroup.destroy();
      this.historyGroup = null;
    }
    
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