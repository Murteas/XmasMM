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
    
    // Element picker properties (mobile-friendly UX)
    this.elementPicker = null;
    this.pickerBackdrop = null;
    
    this.setupHistoryScroll();
  }

  setupHistoryScroll() {
    const { width, height } = this.scene.cameras.main;
    
    // Adjust history start position to account for new header layout
    // Responsive spacing based on screen size
    const isSmallScreen = width < 400;
    const historyStartY = isSmallScreen ? 160 : 120; // More space for stacked header on small screens
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
    
    const { width } = this.scene.cameras.main;
    const isSmallScreen = width < 400;
    const historyStartY = isSmallScreen ? 160 : 120;
    
    const rowHeight = 60; // Updated to match active row height
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - historyStartY - 100) / rowHeight);
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
    
    const { width } = this.scene.cameras.main;
    const isSmallScreen = width < 400;
    const historyStartY = isSmallScreen ? 160 : 120;
    
    // Auto-scroll to show the newest guess
    const rowHeight = 60; // Updated to match active row height
    const maxVisibleRows = Math.floor((this.scene.cameras.main.height - historyStartY - 100) / rowHeight);
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
    
    const { width } = this.scene.cameras.main;
    const isSmallScreen = width < 400;
    const startY = isSmallScreen ? 160 : 120;
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
    const { width } = this.scene.cameras.main;
    
    // Responsive positioning that matches active row layout
    const isSmallScreen = width < 400;
    const elementSpacing = isSmallScreen ? 45 : 60; // Tighter spacing on mobile
    const elementWidth = isSmallScreen ? 35 : 40;   // Smaller slots on mobile
    
    // Center the row based on screen width and code length (same logic as active row)
    const totalRowWidth = (codeLength * elementSpacing) - elementSpacing + elementWidth;
    const startX = Math.max(30, (width - totalRowWidth) / 2); // Ensure minimum margin
    
    // Display guess elements with images
    guess.forEach((element, colIndex) => {
      const x = startX + colIndex * elementSpacing;
      const slot = this.scene.add.rectangle(x, y, elementWidth, 30, 0x666666)
        .setStrokeStyle(1, 0xffffff)
        .setDepth(depth);
      
      // Display element image instead of text
      const imageKey = this.scene.getElementImageKey(element);
      const elementImage = this.scene.add.image(x, y, imageKey);
      
      // Scale image to fit in history slot (smaller than active row)
      const imageScale = Math.min(24 / elementImage.width, 24 / elementImage.height);
      elementImage.setScale(imageScale);
      elementImage.setOrigin(0.5).setDepth(depth + 0.01);
      
      this.historyGroup.add(slot);
      this.historyGroup.add(elementImage);
      this.historyElements.push(slot, elementImage);
    });
    
    // Display feedback - position relative to last element
    const lastElementX = startX + (codeLength - 1) * elementSpacing;
    const feedbackX = lastElementX + elementSpacing + 20; // Position after last element with margin
    
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
    
    // Add row number - position it to the left with proper margin
    const rowNumberX = Math.max(15, startX - 20); // Ensure it doesn't go off screen
    const rowNumberText = this.scene.add.text(rowNumberX, y, `${rowIndex + 1}`, {
      font: '10px Arial',
      fill: '#aaa'
    }).setOrigin(0.5).setDepth(depth);
    
    this.historyGroup.add(rowNumberText);
    this.historyElements.push(rowNumberText);
  }

  renderScrollIndicators(totalRows, maxVisibleRows, startIndex, endIndex, startY, rowHeight, baseDepth) {
    if (totalRows > maxVisibleRows) {
      const { width, height } = this.scene.cameras.main;
      const scrollInfo = `${startIndex + 1}-${endIndex} of ${totalRows}`;
      
      if (startIndex > 0) {
        const upIndicator = this.scene.add.text(width - 50, startY - 20, '↑ Scroll up', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI) // Higher depth for visibility
          .setInteractive({ useHandCursor: true }); // Make it clickable
        
        upIndicator.on('pointerdown', () => {
          this.scrollHistory(-30); // Scroll up
        });
        
        this.historyGroup.add(upIndicator);
        this.historyElements.push(upIndicator);
      }
      
      if (endIndex < totalRows) {
        // Position scroll down button at a safe location that's always visible
        const downButtonY = Math.min(startY + maxVisibleRows * rowHeight + 10, height - 80);
        const downIndicator = this.scene.add.text(width - 50, downButtonY, '↓ Scroll down', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI) // Higher depth for visibility
          .setInteractive({ useHandCursor: true }); // Make it clickable
        
        downIndicator.on('pointerdown', () => {
          this.scrollHistory(30); // Scroll down
        });
        
        this.historyGroup.add(downIndicator);
        this.historyElements.push(downIndicator);
      }
      
      const positionIndicator = this.scene.add.text(width - 50, startY - 40, scrollInfo, {
        font: '10px Arial',
        fill: '#ccc'
      }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI);
      
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
    const isSmallScreen = width < 400;
    const historyStartY = isSmallScreen ? 160 : 120;
    const rowHeight = 60;
    const activeRowY = historyStartY + (this.guessHistory.length * rowHeight) - this.historyScrollOffset;
    
    // Add subtle glow effect first (behind everything)
    const glowEffect = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 20, // Wider to accommodate submit button inside
      56, 
      0xffd700, 
      0.3
    ).setDepth(GameUtils.getDepthLayers().HISTORY);
    
    // Create active row background with golden glow
    this.activeRowBackground = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 20, // Wider to accommodate submit button inside
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
    const startX = width / 2 - (codeLength * 25) - 30; // Shifted left to make room for submit button
    
    for (let i = 0; i < codeLength; i++) {
      const x = startX + i * 50;
      
      // Slot background with tap indicator
      const slot = this.scene.add.rectangle(x, activeRowY, 40, 40, 0x666666)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1); // Above touch area
      
      // Element display (image or tap hint)
      let displayElement;
      if (this.activeRowGuess[i]) {
        // Show element image
        const imageKey = this.scene.getElementImageKey(this.activeRowGuess[i]);
        displayElement = this.scene.add.image(x, activeRowY, imageKey);
        // Scale to fit in slot
        const imageScale = Math.min(32 / displayElement.width, 32 / displayElement.height);
        displayElement.setScale(imageScale);
      } else {
        // Show "TAP" hint text
        displayElement = this.scene.add.text(x, activeRowY, 'TAP', {
          font: '10px Arial',
          fill: '#aaa'
        });
      }
      displayElement.setOrigin(0.5).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.1); // Above touch area
      
      // Click handler to open element picker (mobile-friendly UX)
      slot.on('pointerdown', () => {
        // Enhanced touch feedback
        this.addSlotTouchFeedback(slot, i);
        this.cycleActiveRowElement(i);
      });
      
      this.activeRowElements.push({ slot, displayElement });
    }
    
    // Create integrated submit button within the active row
    const submitButtonX = startX + (codeLength * 50) + 25;
    this.activeRowSubmitBtn = this.scene.add.text(submitButtonX, activeRowY, 'Submit', {
      font: '12px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.2);
    
    this.activeRowSubmitBtn.on('pointerdown', () => {
      this.scene.submitGuess();
    });
    
    // Add touch feedback to submit button using the method defined in HistoryManager
    this.addSubmitButtonTouchFeedback(this.activeRowSubmitBtn);
    
    // Store the glow effect reference for cleanup
    this.activeRowGlowEffect = glowEffect;
    
    this.hasActiveRow = true;
    
    // Ensure active row is visible
    this.scrollToActiveRow();
    
    return activeRowY;
  }

  scrollToActiveRow() {
    if (!this.hasActiveRow) return;
    
    const { width, height } = this.scene.cameras.main;
    // Use responsive positioning
    const isSmallScreen = width < 400;
    const historyStartY = isSmallScreen ? 160 : 120;
    const historyEndY = height - 100;
    const rowHeight = 60;
    const activeRowY = historyStartY + (this.guessHistory.length * rowHeight);
    
    // Check if active row is below visible area
    if (activeRowY > historyEndY - 50) {
      const targetScroll = activeRowY - historyEndY + 100;
      this.historyScrollOffset = Math.max(0, targetScroll);
      this.displayGuessHistory();
      this.updateActiveRowPosition();
    }
  }

  updateActiveRowPosition() {
    if (!this.hasActiveRow) return;
    
    const { width } = this.scene.cameras.main;
    const isSmallScreen = width < 400;
    const historyStartY = isSmallScreen ? 160 : 120;
    const rowHeight = 60;
    const activeRowY = historyStartY + (this.guessHistory.length * rowHeight) - this.historyScrollOffset;
    
    // Update positions of active row elements
    if (this.activeRowBackground) {
      this.activeRowBackground.setY(activeRowY);
    }
    
    if (this.activeRowGlowEffect) {
      this.activeRowGlowEffect.setY(activeRowY);
    }
    
    if (this.activeRowElements) {
      const codeLength = this.scene.codeLength;
      const startX = width / 2 - (codeLength * 25) - 30;
      
      this.activeRowElements.forEach((elementData, i) => {
        const x = startX + i * 50;
        elementData.slot.setPosition(x, activeRowY);
        elementData.displayElement.setPosition(x, activeRowY);
      });
    }
    
    if (this.activeRowSubmitBtn) {
      const codeLength = this.scene.codeLength;
      const startX = width / 2 - (codeLength * 25) - 30;
      const submitButtonX = startX + (codeLength * 50) + 25;
      this.activeRowSubmitBtn.setPosition(submitButtonX, activeRowY);
    }
  }

  cycleActiveRowElement(index) {
    // Show element picker modal instead of cycling
    this.showElementPicker(index);
  }

  showElementPicker(slotIndex) {
    if (this.elementPicker) {
      return; // Picker already open
    }

    const elements = this.scene.elements;
    // Use camera dimensions instead of config for responsive canvas
    const gameWidth = this.scene.cameras.main.width;
    const gameHeight = this.scene.cameras.main.height;

    // Create modal backdrop
    this.pickerBackdrop = this.scene.add.rectangle(
      gameWidth / 2, 
      gameHeight / 2, 
      gameWidth, 
      gameHeight, 
      0x000000, 
      0.7
    ).setDepth(GameUtils.getDepthLayers().MODAL).setInteractive();

    // Close picker when clicking backdrop
    this.pickerBackdrop.on('pointerdown', () => {
      this.closeElementPicker();
    });

    // Create picker container with proper height for cancel button
    const pickerWidth = Math.min(300, gameWidth - 40);
    const baseHeight = 280; // Increased to accommodate cancel button
    const pickerHeight = Math.min(baseHeight, gameHeight - 100);
    
    this.elementPicker = this.scene.add.container(gameWidth / 2, gameHeight / 2);
    this.elementPicker.setDepth(GameUtils.getDepthLayers().MODAL + 1);

    // Picker background with rounded corners effect
    const pickerBg = this.scene.add.rectangle(0, 0, pickerWidth, pickerHeight, 0x2c3e50);
    pickerBg.setStrokeStyle(2, 0x34495e);
    this.elementPicker.add(pickerBg);

    // Title
    const title = this.scene.add.text(0, -pickerHeight/2 + 30, 'Choose Element', {
      font: 'bold 18px Arial',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    this.elementPicker.add(title);

    // Element grid (2x3 layout for 6 elements) - responsive sizing
    const cols = 3;
    const rows = 2;
    // Increase minimum touch target for mobile and scale with screen size
    const minTouchTarget = 48; // iOS/Android recommended minimum
    const elementSize = Math.max(minTouchTarget, Math.min(80, pickerWidth / 5)); // Scale with picker width
    const spacing = Math.max(10, elementSize * 0.2); // Proportional spacing
    const startX = -(cols - 1) * (elementSize + spacing) / 2;
    const startY = -40; // Move elements up to make room for cancel button

    elements.forEach((element, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (elementSize + spacing);
      const y = startY + row * (elementSize + spacing);

      // Element button background
      const elementBg = this.scene.add.rectangle(x, y, elementSize, elementSize, 0x3498db);
      elementBg.setStrokeStyle(2, 0x2980b9);
      elementBg.setInteractive({ useHandCursor: true });
      
      // Element image instead of text
      const imageKey = this.scene.getElementImageKey(element);
      const elementImage = this.scene.add.image(x, y, imageKey);
      
      // Scale image to fit within button while maintaining aspect ratio
      const imageScale = Math.min((elementSize - 8) / elementImage.width, (elementSize - 8) / elementImage.height);
      elementImage.setScale(imageScale);
      elementImage.setOrigin(0.5);

      // Highlight if currently selected
      const currentElement = this.activeRowGuess[slotIndex];
      if (element === currentElement) {
        elementBg.setFillStyle(0xe74c3c);
        elementBg.setStrokeStyle(3, 0xc0392b);
      }

      // Click handler with selection feedback
      elementBg.on('pointerdown', () => {
        // Brief visual feedback
        elementBg.setScale(0.95);
        this.scene.tweens.add({
          targets: elementBg,
          scale: 1,
          duration: 100,
          ease: 'Power2'
        });
        
        // Select element and close picker
        this.selectElement(slotIndex, element);
        this.scene.time.delayedCall(150, () => {
          this.closeElementPicker();
        });
      });

      // Touch feedback
      elementBg.on('pointerover', () => {
        if (element !== currentElement) {
          elementBg.setFillStyle(0x5dade2);
        }
      });

      elementBg.on('pointerout', () => {
        if (element !== currentElement) {
          elementBg.setFillStyle(0x3498db);
        }
      });

      this.elementPicker.add([elementBg, elementImage]);
    });

    // Close button with proper touch target size - positioned below elements
    const closeBtnHeight = Math.max(36, 44); // Ensure minimum touch target
    const cancelButtonY = pickerHeight/2 - 25; // Closer to bottom edge
    
    // Add subtle divider line before cancel button
    const dividerY = cancelButtonY - 35;
    const divider = this.scene.add.rectangle(0, dividerY, pickerWidth - 40, 1, 0x7f8c8d);
    this.elementPicker.add(divider);
    const closeBtn = this.scene.add.text(0, cancelButtonY, 'Cancel', {
      font: 'bold 14px Arial',
      fill: '#fff',
      backgroundColor: '#95a5a6',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      this.closeElementPicker();
    });

    this.elementPicker.add(closeBtn);

    // Close on backdrop click
    this.pickerBackdrop.on('pointerdown', () => {
      this.closeElementPicker();
    });

    // Smooth entrance animation
    this.elementPicker.setScale(0.8);
    this.elementPicker.setAlpha(0);
    this.scene.tweens.add({
      targets: this.elementPicker,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  selectElement(slotIndex, element) {
    this.activeRowGuess[slotIndex] = element;
    
    // Update visual - replace display element with image
    const elementData = this.activeRowElements[slotIndex];
    const oldElement = elementData.displayElement;
    const x = oldElement.x;
    const y = oldElement.y;
    
    // Remove old element
    oldElement.destroy();
    
    // Create new image element
    const imageKey = this.scene.getElementImageKey(element);
    const newImage = this.scene.add.image(x, y, imageKey);
    const imageScale = Math.min(32 / newImage.width, 32 / newImage.height);
    newImage.setScale(imageScale);
    newImage.setOrigin(0.5).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.1);
    
    // Update reference
    elementData.displayElement = newImage;
  }

  closeElementPicker() {
    if (!this.elementPicker) {
      return;
    }

    // Store reference to avoid race conditions
    const pickerToDestroy = this.elementPicker;
    const backdropToDestroy = this.pickerBackdrop;
    
    // Clear references immediately to prevent multiple calls
    this.elementPicker = null;
    this.pickerBackdrop = null;

    // Smooth exit animation
    this.scene.tweens.add({
      targets: pickerToDestroy,
      scale: 0.8,
      alpha: 0,
      duration: 150,
      ease: 'Back.easeIn',
      onComplete: () => {
        if (pickerToDestroy) {
          pickerToDestroy.destroy();
        }
        if (backdropToDestroy) {
          backdropToDestroy.destroy();
        }
      }
    });
  }

  addSlotTouchFeedback(slot, slotIndex) {
    // Enhanced visual feedback for slot interaction
    const isEmptySlot = !this.activeRowGuess[slotIndex];
    
    if (isEmptySlot) {
      // Pulse effect for empty slots to guide user
      slot.setScale(0.95);
      this.scene.tweens.add({
        targets: slot,
        scale: 1.1,
        duration: 150,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.scene.tweens.add({
            targets: slot,
            scale: 1,
            duration: 100,
            ease: 'Power2'
          });
        }
      });
      
      // Subtle glow effect
      slot.setStrokeStyle(2, 0xf39c12, 0.8);
      this.scene.time.delayedCall(300, () => {
        slot.setStrokeStyle(2, 0x3498db);
      });
    } else {
      // Scale feedback for filled slots
      slot.setScale(0.9);
      this.scene.tweens.add({
        targets: slot,
        scale: 1,
        duration: 150,
        ease: 'Bounce.easeOut'
      });
    }
  }
  
  addSubmitButtonTouchFeedback(button) {
    button.on('pointerdown', () => {
      // Scale down with color change
      button.setScale(0.95);
      button.setStyle({ backgroundColor: '#2ecc71' });
    });
    
    button.on('pointerup', () => {
      // Satisfying bounce back
      this.scene.tweens.add({
        targets: button,
        scale: 1.05,
        duration: 100,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.scene.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: 'Power2'
          });
        }
      });
      button.setStyle({ backgroundColor: '#27ae60' });
    });
    
    button.on('pointerout', () => {
      // Reset if finger moves off button
      this.scene.tweens.killTweensOf(button);
      button.setScale(1);
      button.setStyle({ backgroundColor: '#27ae60' });
    });
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

  getActiveRowGuess() {
    return this.hasActiveRow ? [...this.activeRowGuess] : null;
  }

  removeActiveRow() {
    if (!this.hasActiveRow) return;
    
    // Clean up active row elements
    if (this.activeRowElements) {
      this.activeRowElements.forEach(elementData => {
        if (elementData.slot) elementData.slot.destroy();
        if (elementData.displayElement) elementData.displayElement.destroy();
      });
      this.activeRowElements = null;
    }
    
    // Clean up active row background
    if (this.activeRowBackground) {
      this.activeRowBackground.destroy();
      this.activeRowBackground = null;
    }
    
    // Clean up glow effect
    if (this.activeRowGlowEffect) {
      this.activeRowGlowEffect.destroy();
      this.activeRowGlowEffect = null;
    }
    
    // Clean up submit button
    if (this.activeRowSubmitBtn) {
      this.activeRowSubmitBtn.destroy();
      this.activeRowSubmitBtn = null;
    }
    
    // Reset state
    this.hasActiveRow = false;
    this.activeRowGuess = [];
    
    // Refresh display
    this.displayGuessHistory();
  }
}
