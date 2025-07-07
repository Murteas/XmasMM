// HistoryManager.js - Handles guess history display and scrolling

class HistoryManager {
  constructor(scene) {
    this.scene = scene;
    this.guessHistory = [];
    this.feedbackHistory = [];
    this.historyElements = [];
    this.historyScrollOffset = 0;
    this.historyGroup = null;
    this.historyTouchArea = null;
    
    // Inline editing properties
    this.hasActiveRow = false;
    this.activeRowElements = null;
    this.activeRowBackground = null;
    this.activeRowGuess = [];
    
    this.setupHistoryScroll();
  }

  setupHistoryScroll() {
    const { width, height } = this.scene.cameras.main;
    const historyStartY = 280;
    const historyEndY = height - 100;
    
    // Create invisible touch area for history scrolling
    this.historyTouchArea = this.scene.add.rectangle(
      width / 2, 
      (historyStartY + historyEndY) / 2, 
      width, 
      historyEndY - historyStartY, 
      0x000000, 
      0
    )
      .setInteractive()
      .setDepth(GameUtils.getDepthLayers().TOUCH_AREA);
    
    let startY = 0;
    let isDragging = false;
    
    this.historyTouchArea.on('pointerdown', (pointer) => {
      startY = pointer.y;
      isDragging = true;
    });
    
    this.historyTouchArea.on('pointermove', (pointer) => {
      if (!isDragging) return;
      
      const deltaY = pointer.y - startY;
      const sensitivity = 0.05;
      
      if (Math.abs(deltaY) > 10) {
        const scrollDelta = Math.floor(deltaY * sensitivity);
        this.scrollHistory(-scrollDelta);
        startY = pointer.y;
      }
    });
    
    this.historyTouchArea.on('pointerup', () => {
      isDragging = false;
    });
    
    this.historyTouchArea.on('pointerout', () => {
      isDragging = false;
    });
  }

  scrollHistory(delta) {
    if (this.guessHistory.length === 0 && !this.hasActiveRow) return;
    
    const rowHeight = 60; // Updated to match active row height
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - 280 - 100) / rowHeight);
    const totalRows = this.guessHistory.length + (this.hasActiveRow ? 1 : 0);
    const maxScrollOffset = Math.max(0, (totalRows * rowHeight) - (maxVisibleRows * rowHeight));
    
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset + delta));
    this.displayGuessHistory();
    
    // Update active row position if it exists
    if (this.hasActiveRow) {
      this.updateActiveRowPosition();
    }
  }

  addGuess(guess, feedback) {
    this.guessHistory.push([...guess]);
    this.feedbackHistory.push(feedback);
    
    // Auto-scroll to show the newest guess
    const rowHeight = 60; // Updated to match active row height
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - 280 - 100) / rowHeight);
    const totalRows = this.guessHistory.length + (this.hasActiveRow ? 1 : 0);
    const maxScrollRange = (totalRows * rowHeight) - (maxVisibleRows * rowHeight);
    
    if (maxScrollRange > 0) {
      this.historyScrollOffset = Math.max(0, maxScrollRange);
    }
    
    this.displayGuessHistory();
    
    // Update active row position if it exists
    if (this.hasActiveRow) {
      this.updateActiveRowPosition();
    }
  }

  displayGuessHistory() {
    // Clear previous history display
    if (this.historyGroup) {
      this.historyGroup.clear(true, true);
      this.historyGroup.destroy();
    }
    
    if (this.historyElements) {
      this.historyElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
    }
    this.historyElements = [];
    
    this.historyGroup = this.scene.add.group();
    
    const startY = 280;
    const rowHeight = 60; // Updated to match active row height
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - startY - 100) / rowHeight);
    
    const totalRows = this.guessHistory.length;
    const maxScrollOffset = Math.max(0, (totalRows * rowHeight) - (maxVisibleRows * rowHeight));
    
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset));
    
    if (totalRows <= maxVisibleRows) {
      this.historyScrollOffset = 0;
    }
    
    const startIndex = Math.floor(this.historyScrollOffset / rowHeight);
    const endIndex = Math.min(totalRows, startIndex + maxVisibleRows + 1);
    
    const baseDepth = GameUtils.getDepthLayers().HISTORY;
    
    this.guessHistory.slice(startIndex, endIndex).forEach((guess, displayIndex) => {
      const rowIndex = startIndex + displayIndex;
      const y = startY + (rowIndex * rowHeight) - this.historyScrollOffset;
      const feedback = this.feedbackHistory[rowIndex];
      const currentDepth = baseDepth + displayIndex * 0.1;
      
      this.renderGuessRow(guess, feedback, rowIndex, y, currentDepth);
    });
    
    this.renderScrollIndicators(totalRows, maxVisibleRows, startIndex, endIndex, startY, rowHeight, baseDepth);
  }

  renderGuessRow(guess, feedback, rowIndex, y, depth) {
    const codeLength = guess.length;
    
    // Display guess elements
    guess.forEach((element, colIndex) => {
      const x = 100 + colIndex * 60;
      const slot = this.scene.add.rectangle(x, y, 40, 30, 0x666666)
        .setStrokeStyle(1, 0xffffff)
        .setDepth(depth);
      
      const text = this.scene.add.text(x, y, element, {
        font: '10px Arial',
        fill: '#fff'
      }).setOrigin(0.5).setDepth(depth + 0.01);
      
      this.historyGroup.add(slot);
      this.historyGroup.add(text);
      this.historyElements.push(slot, text);
    });
    
    // Display feedback
    const feedbackX = 100 + codeLength * 60 + 40;
    
    const feedbackBg = this.scene.add.rectangle(feedbackX, y, 60, 25, 0xffffff, 0.9)
      .setStrokeStyle(1, 0x333333)
      .setDepth(depth);
    
    const feedbackText = this.scene.add.text(feedbackX, y, `●${feedback.black} ○${feedback.white}`, {
      font: '12px Arial',
      fill: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(depth + 0.01);
    
    this.historyGroup.add(feedbackBg);
    this.historyGroup.add(feedbackText);
    this.historyElements.push(feedbackBg, feedbackText);
    
    // Add row number
    const rowNumberText = this.scene.add.text(50, y, `${rowIndex + 1}`, {
      font: '10px Arial',
      fill: '#aaa'
    }).setOrigin(0.5).setDepth(depth);
    
    this.historyGroup.add(rowNumberText);
    this.historyElements.push(rowNumberText);
  }

  renderScrollIndicators(totalRows, maxVisibleRows, startIndex, endIndex, startY, rowHeight, baseDepth) {
    if (totalRows > maxVisibleRows) {
      const { width } = this.scene.cameras.main;
      const scrollInfo = `${startIndex + 1}-${endIndex} of ${totalRows}`;
      
      if (startIndex > 0) {
        const upIndicator = this.scene.add.text(width - 50, startY - 20, '↑ Scroll up', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(baseDepth);
        
        this.historyGroup.add(upIndicator);
        this.historyElements.push(upIndicator);
      }
      
      if (endIndex < totalRows) {
        const downIndicator = this.scene.add.text(width - 50, startY + maxVisibleRows * rowHeight + 10, '↓ Scroll down', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(baseDepth);
        
        this.historyGroup.add(downIndicator);
        this.historyElements.push(downIndicator);
      }
      
      const positionIndicator = this.scene.add.text(width - 50, startY - 40, scrollInfo, {
        font: '10px Arial',
        fill: '#ccc'
      }).setOrigin(1, 0.5).setDepth(baseDepth);
      
      this.historyGroup.add(positionIndicator);
      this.historyElements.push(positionIndicator);
    }
  }

  reset() {
    this.guessHistory = [];
    this.feedbackHistory = [];
    this.historyScrollOffset = 0;
    
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

  getGuessCount() {
    return this.guessHistory.length;
  }

  getGuessHistory() {
    return [...this.guessHistory];
  }

  getFeedbackHistory() {
    return [...this.feedbackHistory];
  }

  // Inline editing methods
  createActiveRow(prefillGuess = null) {
    if (this.hasActiveRow) {
      this.removeActiveRow();
    }

    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const elements = this.scene.elements;
    
    // Calculate position for active row (always at the bottom of history)
    const historyStartY = 280;
    const rowHeight = 60;
    const activeRowY = historyStartY + (this.guessHistory.length * rowHeight) - this.historyScrollOffset;
    
    // Add subtle glow effect first (behind everything)
    const glowEffect = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 34, 
      56, 
      0xffd700, 
      0.3
    ).setDepth(GameUtils.getDepthLayers().HISTORY);
    
    // Create active row background with golden glow
    this.activeRowBackground = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 40, 
      50, 
      0x4a4a4a, 
      0.8
    )
      .setStrokeStyle(3, 0xffd700) // Golden border
      .setDepth(GameUtils.getDepthLayers().HISTORY + 0.1);

    // Initialize active guess
    this.activeRowGuess = prefillGuess ? [...prefillGuess] : new Array(codeLength).fill(null);
    
    // Create interactive slots
    this.activeRowElements = [];
    const startX = width / 2 - (codeLength * 25);
    
    for (let i = 0; i < codeLength; i++) {
      const x = startX + i * 50;
      
      // Slot background
      const slot = this.scene.add.rectangle(x, activeRowY, 40, 40, 0x666666)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(GameUtils.getDepthLayers().HISTORY + 0.2);
      
      // Element text
      const elementText = this.activeRowGuess[i] || '?';
      const text = this.scene.add.text(x, activeRowY, elementText, {
        font: '14px Arial',
        fill: this.activeRowGuess[i] ? '#fff' : '#aaa'
      }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().HISTORY + 0.3);
      
      // Click handler to cycle through elements
      slot.on('pointerdown', () => {
        this.cycleActiveRowElement(i);
      });
      
      this.activeRowElements.push({ slot, text });
    }
    
    // Store the glow effect reference for cleanup
    this.activeRowGlowEffect = glowEffect;
    
    this.hasActiveRow = true;
    
    // Ensure active row is visible
    this.scrollToActiveRow();
    
    return activeRowY;
  }

  cycleActiveRowElement(index) {
    const elements = this.scene.elements;
    const currentElement = this.activeRowGuess[index];
    let nextIndex = 0;
    
    if (currentElement) {
      const currentIndex = elements.indexOf(currentElement);
      nextIndex = (currentIndex + 1) % elements.length;
    }
    
    this.activeRowGuess[index] = elements[nextIndex];
    
    // Update visual
    const elementData = this.activeRowElements[index];
    elementData.text.setText(elements[nextIndex]);
    elementData.text.setFill('#fff');
  }

  removeActiveRow() {
    if (!this.hasActiveRow) return;
    
    // Clean up active row elements
    if (this.activeRowBackground) {
      this.activeRowBackground.destroy();
      this.activeRowBackground = null;
    }
    
    if (this.activeRowGlowEffect) {
      this.activeRowGlowEffect.destroy();
      this.activeRowGlowEffect = null;
    }
    
    if (this.activeRowElements) {
      this.activeRowElements.forEach(element => {
        element.slot.destroy();
        element.text.destroy();
      });
      this.activeRowElements = null;
    }
    
    this.hasActiveRow = false;
    this.activeRowGuess = [];
  }

  submitActiveRowGuess() {
    if (!this.hasActiveRow) return null;
    
    // Check if all slots are filled
    if (this.activeRowGuess.includes(null)) {
      // Show error or highlight empty slots
      this.scene.showIncompleteGuessError();
      return null;
    }
    
    const guess = [...this.activeRowGuess];
    this.removeActiveRow();
    return guess;
  }

  scrollToActiveRow() {
    if (!this.hasActiveRow) return;
    
    const { height } = this.scene.cameras.main;
    const historyStartY = 280;
    const historyEndY = height - 100;
    const rowHeight = 60;
    const activeRowY = historyStartY + (this.guessHistory.length * rowHeight);
    
    // Check if active row is below visible area
    if (activeRowY > historyEndY - 50) {
      const targetScroll = activeRowY - historyEndY + 100;
      this.historyScrollOffset = Math.max(0, targetScroll);
      this.updateHistoryDisplay();
      this.updateActiveRowPosition();
    }
  }

  updateActiveRowPosition() {
    if (!this.hasActiveRow) return;
    
    const { width } = this.scene.cameras.main;
    const historyStartY = 280;
    const rowHeight = 60;
    const activeRowY = historyStartY + (this.guessHistory.length * rowHeight) - this.historyScrollOffset;
    
    // Update background position
    if (this.activeRowBackground) {
      this.activeRowBackground.setY(activeRowY);
    }
    
    // Update glow effect position
    if (this.activeRowGlowEffect) {
      this.activeRowGlowEffect.setY(activeRowY);
    }
    
    // Update element positions
    if (this.activeRowElements) {
      const codeLength = this.scene.codeLength;
      const startX = width / 2 - (codeLength * 25);
      
      this.activeRowElements.forEach((element, i) => {
        const x = startX + i * 50;
        element.slot.setPosition(x, activeRowY);
        element.text.setPosition(x, activeRowY);
      });
    }
    
    // Update submit button position
    if (this.scene.submitBtn) {
      this.scene.positionSubmitButton(activeRowY);
    }
  }

  updateHistoryDisplay() {
    this.displayGuessHistory();
  }

  getActiveRowGuess() {
    return this.hasActiveRow ? [...this.activeRowGuess] : null;
  }

  isActiveRowComplete() {
    return this.hasActiveRow && !this.activeRowGuess.includes(null);
  }
}
