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
    
    // Account for Christmas legend space
    const legendItemHeight = 20;
    const legendItems = 2; // perfect and close feedback symbols
    const legendHeight = (legendItems * legendItemHeight) + 25;
    const legendSpacing = 10;
    
    // History starts below header and legend
    const startY = Math.max(
      baseHeaderHeight, 
      height * 0.22,
      headerBottomY + legendSpacing + legendHeight + 10 // Consistent with legend positioning
    );
    
    const rowHeight = 60;
    const bottomMargin = isSmallScreen ? 60 : 80;
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
    const elementSpacing = isSmallScreen ? 45 : 60;
    const elementWidth = isSmallScreen ? 35 : 40;
    
    // Center the row based on screen width and code length
    const totalRowWidth = (codeLength * elementSpacing) - elementSpacing + elementWidth;
    const startX = Math.max(30, (width - totalRowWidth) / 2);
    
    // Render guess elements
    this.renderGuessElements(guess, startX, y, elementSpacing, elementWidth, depth);
    
    // Render feedback
    this.renderFeedback(feedback, startX, y, elementSpacing, codeLength, depth);
    
    // Render row number
    this.renderRowNumber(rowIndex, startX, y, depth);
  }

  renderGuessElements(guess, startX, y, elementSpacing, elementWidth, depth) {
    guess.forEach((element, colIndex) => {
      const x = startX + colIndex * elementSpacing;
      
      // Create slot background
      const slot = this.scene.add.rectangle(x, y, elementWidth, 30, 0x666666)
        .setStrokeStyle(1, 0xffffff)
        .setDepth(depth);
      
      // Create element image with fallback
      const elementImage = this.createElementImage(element, x, y, elementWidth, depth);
      
      this.historyGroup.add(slot);
      this.historyGroup.add(elementImage);
      this.historyElements.push(slot, elementImage);
    });
  }

  createElementImage(element, x, y, elementWidth, depth) {
    const imageKey = this.scene.getElementImageKey(element);
    let elementImage;
    
    try {
      elementImage = this.scene.add.image(x, y, imageKey);
      
      if (!elementImage.texture || elementImage.texture.key === '__MISSING') {
        console.warn(`History: Failed to create image for ${element}, using fallback`);
        elementImage.destroy();
        return this.createFallbackElement(element, x, y, elementWidth, depth);
      }
      
      // Scale image to fit in history slot
      const imageScale = Math.min(24 / elementImage.width, 24 / elementImage.height);
      elementImage.setScale(imageScale);
      elementImage.setOrigin(0.5).setDepth(depth + 0.01);
      
      return elementImage;
    } catch (error) {
      console.error(`History: Error creating image for ${element}:`, error);
      if (elementImage) elementImage.destroy();
      return this.createFallbackElement(element, x, y, elementWidth, depth);
    }
  }

  createFallbackElement(element, x, y, elementWidth, depth) {
    const fallbackRect = this.scene.add.rectangle(x, y, elementWidth - 4, 26, 0xff6b6b)
      .setDepth(depth + 0.01);
    
    const elementText = this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
      font: '10px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(depth + 0.02);
    
    this.historyGroup.add(elementText);
    this.historyElements.push(elementText);
    
    return fallbackRect;
  }

  renderFeedback(feedback, startX, y, elementSpacing, codeLength, depth) {
    const lastElementX = startX + (codeLength - 1) * elementSpacing;
    const feedbackX = lastElementX + elementSpacing + 20;
    
    // Create Christmas feedback symbols instead of traditional pegs
    this.renderChristmasFeedback(feedback, feedbackX, y, depth);
  }

  /**
   * Render Christmas-themed feedback symbols instead of traditional Mastermind pegs
   * @param {Object} feedback - Object with black (perfect) and white (close) counts
   * @param {number} x - X position for feedback display
   * @param {number} y - Y position for feedback display  
   * @param {number} depth - Rendering depth
   */
  renderChristmasFeedback(feedback, x, y, depth) {
    const symbolSize = 16; // Size for each feedback symbol
    const symbolSpacing = 18; // Spacing between symbols
    
    // Calculate total width needed for all symbols
    const totalSymbols = feedback.black + feedback.white;
    const totalWidth = totalSymbols > 0 ? (totalSymbols * symbolSpacing) - (symbolSpacing - symbolSize) : 60;
    
    // Background for feedback area (slightly larger than text version for symbols)
    const feedbackBg = this.scene.add.rectangle(x, y, Math.max(totalWidth + 10, 60), 25, 0xffffff, 0.9)
      .setStrokeStyle(1, 0x333333)
      .setDepth(depth);
    
    this.historyGroup.add(feedbackBg);
    this.historyElements.push(feedbackBg);
    
    // No feedback case - show empty background
    if (totalSymbols === 0) {
      return;
    }
    
    // Start position for symbols (centered in feedback area)
    const startSymbolX = x - (totalWidth / 2) + (symbolSize / 2);
    let currentX = startSymbolX;
    
    // Render perfect feedback symbols (Christmas Stars)
    for (let i = 0; i < feedback.black; i++) {
      this.renderFeedbackSymbol('perfect', currentX, y, symbolSize, depth + 0.01);
      currentX += symbolSpacing;
    }
    
    // Render close feedback symbols (Christmas Bells)
    for (let i = 0; i < feedback.white; i++) {
      this.renderFeedbackSymbol('close', currentX, y, symbolSize, depth + 0.01);
      currentX += symbolSpacing;
    }
  }

  /**
   * Render individual Christmas feedback symbol with fallback
   * @param {string} symbolType - 'perfect', 'close', or 'wrong'
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} size - Symbol size
   * @param {number} depth - Rendering depth
   */
  renderFeedbackSymbol(symbolType, x, y, size, depth) {
    try {
      // Get the appropriate image key for this device
      const imageKey = this.scene.getFeedbackImageKey(symbolType);
      
      // Check if the texture exists
      if (!this.scene.textures.exists(imageKey)) {
        console.warn(`Feedback symbol texture not found: ${imageKey}, using fallback`);
        this.renderFallbackFeedbackSymbol(symbolType, x, y, size, depth);
        return;
      }
      
      // Create the Christmas symbol image
      const symbolImage = this.scene.add.image(x, y, imageKey);
      
      if (!symbolImage.texture || symbolImage.texture.key === '__MISSING') {
        console.warn(`Failed to create feedback symbol: ${imageKey}, using fallback`);
        symbolImage.destroy();
        this.renderFallbackFeedbackSymbol(symbolType, x, y, size, depth);
        return;
      }
      
      // Scale the symbol to fit the feedback area
      const imageScale = Math.min(size / symbolImage.width, size / symbolImage.height);
      symbolImage.setScale(imageScale);
      symbolImage.setOrigin(0.5).setDepth(depth);
      
      this.historyGroup.add(symbolImage);
      this.historyElements.push(symbolImage);
      
    } catch (error) {
      console.error(`Error creating Christmas feedback symbol ${symbolType}:`, error);
      this.renderFallbackFeedbackSymbol(symbolType, x, y, size, depth);
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
  renderFallbackFeedbackSymbol(symbolType, x, y, size, depth) {
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
    
    // Create a colored circle background
    const circle = this.scene.add.circle(x, y, size / 2, colors[symbolType])
      .setStrokeStyle(1, 0x333333)
      .setDepth(depth);
    
    // Add symbol text
    const symbolText = this.scene.add.text(x, y, symbols[symbolType], {
      font: `${Math.round(size * 0.8)}px Arial`,
      fill: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(depth + 0.01);
    
    this.historyGroup.add(circle);
    this.historyGroup.add(symbolText);
    this.historyElements.push(circle, symbolText);
  }

  renderRowNumber(rowIndex, startX, y, depth) {
    const rowNumberX = Math.max(15, startX - 20);
    const rowNumberText = this.scene.add.text(rowNumberX, y, `${rowIndex + 1}`, {
      font: '10px Arial',
      fill: '#aaa'
    }).setOrigin(0.5).setDepth(depth);
    
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