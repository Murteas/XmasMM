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
    if (this.guessHistory.length === 0) return;
    
    const rowHeight = 40;
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - 280 - 100) / rowHeight);
    const totalRows = this.guessHistory.length;
    const maxScrollOffset = Math.max(0, totalRows - maxVisibleRows);
    
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset + delta));
    this.displayGuessHistory();
  }

  addGuess(guess, feedback) {
    this.guessHistory.push([...guess]);
    this.feedbackHistory.push(feedback);
    
    // Auto-scroll to show the newest guess
    const rowHeight = 40;
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - 280 - 100) / rowHeight);
    const totalRows = this.guessHistory.length;
    if (totalRows > maxVisibleRows) {
      this.historyScrollOffset = totalRows - maxVisibleRows;
    }
    
    this.displayGuessHistory();
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
    const rowHeight = 40;
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - startY - 100) / rowHeight);
    
    const totalRows = this.guessHistory.length;
    const maxScrollOffset = Math.max(0, totalRows - maxVisibleRows);
    
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset));
    
    if (totalRows <= maxVisibleRows) {
      this.historyScrollOffset = 0;
    }
    
    const startIndex = this.historyScrollOffset;
    const endIndex = Math.min(totalRows, startIndex + maxVisibleRows);
    
    const baseDepth = GameUtils.getDepthLayers().HISTORY;
    
    this.guessHistory.slice(startIndex, endIndex).forEach((guess, displayIndex) => {
      const rowIndex = startIndex + displayIndex;
      const y = startY + displayIndex * rowHeight;
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
}
