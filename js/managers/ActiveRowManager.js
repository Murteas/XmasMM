// ActiveRowManager.js - Handles active row (inline editing) functionality

class ActiveRowManager {
  constructor(scene, historyManager) {
    this.scene = scene;
    this.historyManager = historyManager;
    this.activeRowElements = null;
    this.activeRowBackground = null;
    this.activeRowGlowEffect = null;
    this.activeRowSubmitBtn = null;
    this.activeRowGuess = [];
    this.hasActiveRow = false;
    this.elementPicker = new ElementPicker(scene, this);
  }

  createActiveRow(prefillGuess = null) {
    if (this.hasActiveRow) {
      this.removeActiveRow();
    }

    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width, height } = viewport;
    const codeLength = this.scene.codeLength;
    
    // Initialize the active row guess array
    this.activeRowGuess = new Array(codeLength).fill(null);
    
    // Pre-fill with previous guess if provided
    if (prefillGuess && Array.isArray(prefillGuess)) {
      for (let i = 0; i < Math.min(prefillGuess.length, codeLength); i++) {
        this.activeRowGuess[i] = prefillGuess[i];
      }
    }
    
    const activeRowY = this.calculateActiveRowPosition();
    this.createActiveRowVisuals(activeRowY);
    this.createActiveRowSlots(activeRowY);
    this.createSubmitButton(activeRowY);
    
    this.hasActiveRow = true;
    this.scrollToActiveRow();
    
    return activeRowY;
  }

  calculateActiveRowPosition() {
    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width, height } = viewport;
    const isSmallScreen = width < 500;
    const isVerySmallScreen = width < 400;
    
    // Get responsive layout with safe area consideration
    const layout = GameUtils.getResponsiveLayout(width, height);
    
    // Calculate header layout (same as UILayoutManager)
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const headerBottomY = isVerySmallScreen ? 145 : (isSmallScreen ? 120 : 95);
    
    // Account for Christmas legend space
    const legendItemHeight = 20;
    const legendItems = 2; // perfect and close feedback symbols
    const legendHeight = (legendItems * legendItemHeight) + 25;
    const legendSpacing = 10;
    
    // History starts below header and legend
    const historyStartY = Math.max(
      baseHeaderHeight, 
      layout.contentStartY, // Use safe area aware content start
      headerBottomY + legendSpacing + legendHeight + 15 // Extra padding for active row
    );
    
    const rowHeight = 60;
    const guessHistory = this.historyManager.getGuessHistory();
    const scrollOffset = this.historyManager.getScrollOffset();
    
    // CRITICAL FIX: Calculate active row position AFTER the last completed guess
    // Position active row below the last visible completed guess
    const completedGuessesHeight = guessHistory.length * rowHeight;
    const lastCompletedGuessY = historyStartY + completedGuessesHeight - scrollOffset;
    
    // Add proper spacing AFTER the last completed guess
    const activeRowSeparation = 15; // Extra space to prevent overlap
    let activeRowY = lastCompletedGuessY + activeRowSeparation;
    
    // CRITICAL FIX: Don't constrain active row by contentEndY when there are many guesses
    // The content area needs to expand to accommodate all guesses
    const guessCount = guessHistory.length;
    
    if (guessCount >= 7) {
      // For games with many guesses, allow active row to go beyond normal content area
      // but still respect absolute safe area (browser UI)
      const absoluteMaxY = height - 100; // Leave space for browser UI and submit button
      activeRowY = Math.min(activeRowY, absoluteMaxY);
      
      console.log(`🎯 ActiveRowManager: Many guesses (${guessCount}), using extended layout`);
      console.log(`  - Calculated activeRowY: ${lastCompletedGuessY + activeRowSeparation}`);
      console.log(`  - Absolute max Y: ${absoluteMaxY}`);
      console.log(`  - Final activeRowY: ${activeRowY}`);
    } else {
      // For normal games, use standard content area constraints
      const maxActiveRowY = layout.contentEndY - 30; // Extra margin for submit button
      activeRowY = Math.min(activeRowY, maxActiveRowY);
      
      console.log(`🎯 ActiveRowManager: Normal game (${guessCount} guesses), using standard layout`);
      console.log(`  - Content end Y: ${layout.contentEndY}`);
      console.log(`  - Max active row Y: ${maxActiveRowY}`);
    }
    
    // Ensure it doesn't go above the content area (this constraint is always valid)
    const minActiveRowY = layout.contentStartY + 50;
    activeRowY = Math.max(activeRowY, minActiveRowY);
    
    return activeRowY;
  }

  createActiveRowVisuals(activeRowY) {
    const { width } = this.scene.cameras.main;
    
    // Add subtle glow effect first (behind everything)
    this.activeRowGlowEffect = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 20,
      56, 
      0xffd700, 
      0.3
    ).setDepth(GameUtils.getDepthLayers().HISTORY);
    
    // Create active row background with golden glow
    this.activeRowBackground = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 20,
      50, 
      0x4a4a4a, 
      0.8
    )
      .setStrokeStyle(3, 0xffd700)
      .setDepth(GameUtils.getDepthLayers().HISTORY + 0.1);
  }

  createActiveRowSlots(activeRowY) {
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const isSmallScreen = width < 500;
    
    this.activeRowElements = [];
    
    const positioning = this.calculateSlotPositioning(codeLength, width, isSmallScreen);
    
    for (let i = 0; i < codeLength; i++) {
      const x = positioning.startX + i * positioning.elementSpacing;
      
      const slot = this.createSlot(x, activeRowY, positioning.elementWidth);
      const displayElement = this.createSlotDisplay(x, activeRowY, i);
      
      this.setupSlotInteraction(slot, i);
      
      this.activeRowElements.push({ slot, displayElement });
    }
  }

  calculateSlotPositioning(codeLength, width, isSmallScreen) {
    const elementWidth = isSmallScreen ? 35 : 40;
    const elementSpacing = isSmallScreen ? 42 : 50;
    const submitButtonWidth = 60;
    
    const totalElementsWidth = (codeLength * elementSpacing) - (elementSpacing - elementWidth);
    const totalRowWidth = totalElementsWidth + submitButtonWidth + 20;
    const minMargin = 15;
    
    let startX;
    if (totalRowWidth + (minMargin * 2) <= width) {
      startX = (width - totalRowWidth) / 2;
    } else {
      startX = minMargin;
    }
    
    return { startX, elementWidth, elementSpacing };
  }

  createSlot(x, y, elementWidth) {
    return this.scene.add.rectangle(x, y, elementWidth, elementWidth, 0x666666, 0)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .setDepth(GameUtils.getDepthLayers().TOUCH_AREA);
  }

  createSlotDisplay(x, y, slotIndex) {
    const element = this.activeRowGuess[slotIndex];
    
    if (element) {
      return this.createElementDisplay(element, x, y);
    } else {
      return this.createTapHint(x, y);
    }
  }

  createElementDisplay(element, x, y) {
    const imageKey = this.scene.getElementImageKey(element);
    
    try {
      if (this.scene.textures.exists(imageKey) && imageKey !== '__MISSING') {
        const displayElement = this.scene.add.image(x, y, imageKey);
        
        if (displayElement && displayElement.texture && displayElement.texture.key !== '__MISSING') {
          const imageScale = Math.min(28 / displayElement.width, 28 / displayElement.height);
          displayElement.setScale(imageScale);
          displayElement.setOrigin(0.5).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2);
          return displayElement;
        } else {
          displayElement.destroy();
        }
      }
    } catch (error) {
      console.error(`ActiveRow: Error creating image for ${element}:`, error);
    }
    
    // Fallback to text display
    return this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
      font: '12px Arial',
      fill: '#fff',
      backgroundColor: '#ff6b6b',
      padding: { left: 4, right: 4, top: 2, bottom: 2 }
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2);
  }

  createTapHint(x, y) {
    return this.scene.add.text(x, y, 'TAP', {
      font: '9px Arial',
      fill: '#aaa'
    }).setOrigin(0.5).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2);
  }

  setupSlotInteraction(slot, slotIndex) {
    slot.on('pointerdown', (pointer) => {
      this.addSlotTouchFeedback(slot, slotIndex);
      this.showElementPicker(slotIndex);
    });
  }

  createSubmitButton(activeRowY) {
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const isSmallScreen = width < 500;
    const positioning = this.calculateSlotPositioning(codeLength, width, isSmallScreen);
    
    const submitButtonX = positioning.startX + (codeLength * positioning.elementSpacing) + 10;
    
    this.activeRowSubmitBtn = this.scene.add.text(submitButtonX, activeRowY, 'Submit', {
      font: '11px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 6, right: 6, top: 3, bottom: 3 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.2);
    
    this.activeRowSubmitBtn.on('pointerdown', () => {
      this.scene.submitGuess();
    });
    
    this.addSubmitButtonTouchFeedback(this.activeRowSubmitBtn);
  }

  showElementPicker(slotIndex) {
    this.elementPicker.showElementPicker(slotIndex, this.activeRowGuess);
  }

  selectElement(slotIndex, element) {
    this.activeRowGuess[slotIndex] = element;
    
    const elementData = this.activeRowElements[slotIndex];
    if (!elementData) {
      console.error(`No element data for slot ${slotIndex}`);
      return;
    }
    
    this.updateSlotDisplay(elementData, element);
  }

  updateSlotDisplay(elementData, element) {
    const oldElement = elementData.displayElement;
    const x = oldElement.x;
    const y = oldElement.y;
    
    // Clean up old display
    if (elementData.fallbackText) {
      elementData.fallbackText.destroy();
      elementData.fallbackText = null;
    }
    oldElement.destroy();
    
    // Create new display
    const newDisplay = this.createElementDisplay(element, x, y);
    elementData.displayElement = newDisplay;
  }

  addSlotTouchFeedback(slot, slotIndex) {
    const isEmptySlot = !this.activeRowGuess[slotIndex];
    
    if (isEmptySlot) {
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
      
      slot.setStrokeStyle(2, 0xf39c12, 0.8);
      this.scene.time.delayedCall(300, () => {
        slot.setStrokeStyle(2, 0x3498db);
      });
    } else {
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
      button.setScale(0.9);
      button.setAlpha(0.8);
    });

    button.on('pointerup', () => {
      this.scene.tweens.add({
        targets: button,
        scale: 1.1,
        alpha: 1,
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
    });
    
    button.on('pointerout', () => {
      this.scene.tweens.killTweensOf(button);
      button.setScale(1);
      button.setAlpha(1);
    });
  }

  updateActiveRowPosition() {
    if (!this.hasActiveRow) return;
    
    const activeRowY = this.calculateActiveRowPosition();
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const isSmallScreen = width < 500;
    
    // Update background positions
    if (this.activeRowBackground) {
      this.activeRowBackground.setY(activeRowY);
    }
    
    if (this.activeRowGlowEffect) {
      this.activeRowGlowEffect.setY(activeRowY);
    }
    
    // Update slot positions
    if (this.activeRowElements) {
      const positioning = this.calculateSlotPositioning(codeLength, width, isSmallScreen);
      
      this.activeRowElements.forEach((elementData, i) => {
        const x = positioning.startX + i * positioning.elementSpacing;
        elementData.slot.setPosition(x, activeRowY);
        elementData.displayElement.setPosition(x, activeRowY);
      });
    }
    
    // Update submit button position
    if (this.activeRowSubmitBtn) {
      const positioning = this.calculateSlotPositioning(codeLength, width, isSmallScreen);
      const submitButtonX = positioning.startX + (codeLength * positioning.elementSpacing) + 10;
      this.activeRowSubmitBtn.setPosition(submitButtonX, activeRowY);
    }
  }

  scrollToActiveRow() {
    this.historyManager.scrollToActiveRow();
  }

  submitActiveRowGuess() {
    if (!this.hasActiveRow) return null;
    
    if (this.activeRowGuess.includes(null)) {
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
        if (elementData.fallbackText) elementData.fallbackText.destroy();
      });
      this.activeRowElements = null;
    }
    
    // Clean up backgrounds
    if (this.activeRowBackground) {
      this.activeRowBackground.destroy();
      this.activeRowBackground = null;
    }
    
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
  }

  reset() {
    this.removeActiveRow();
    this.elementPicker.destroy();
  }

  destroy() {
    this.reset();
  }
}