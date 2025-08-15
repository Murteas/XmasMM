// ActiveRowManager.js - Handles active row (inline editing) functionality
// Uses global LayoutConfig (loaded via ModuleLoader)

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
    
    // SIMPLIFIED: Use footer container if available, otherwise use calculated position
    if (this.scene.footerContainer) {
      console.log('📱 Using simple footer container for active row');
      this.createActiveRowInFooter();
    } else {
      console.log('🖥️ Using calculated position for active row');
      const activeRowY = this.calculateActiveRowPosition();
      this.createActiveRowVisuals(activeRowY);
      this.createActiveRowSlots(activeRowY);
      this.createSubmitButton(activeRowY);
    }
    
    this.hasActiveRow = true;
    
    return this.scene.footerContainer ? 40 : this.calculateActiveRowPosition(); // Return relative position
  }

  createActiveRowInFooter() {
    // MOBILE EXPERT DESIGN: Better footer layout with proper spacing
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    
    // MOBILE EXPERT FIX: Position active row higher in footer to prevent overlap
    const footerActiveRowY = 30; // Moved up from 40 for better separation
    
    // Create background in footer container (relative positioning)
    this.activeRowBackground = this.scene.add.rectangle(
      width / 2,
      footerActiveRowY,
      width - 20,
      50,
      0x4a4a4a,
      0.8
    )
      .setStrokeStyle(3, 0xffd700);
    
    this.scene.footerContainer.add(this.activeRowBackground);
    
    // MOBILE EXPERT DESIGN: Better slot sizing for family accessibility
    this.activeRowElements = [];
    const slotSize = Math.min(45, (width - 140) / codeLength); // Larger touch targets
    const slotSpacing = 10; // Better spacing between slots
    const totalSlotsWidth = codeLength * slotSize + (codeLength - 1) * slotSpacing;
    // MOBILE EXPERT DESIGN: Better submit button sizing and positioning  
    const submitButtonWidth = 85; // Wider for better touch target
    const submitButtonGap = 15; // More space between slots and button
    const totalRowWidth = totalSlotsWidth + submitButtonWidth + submitButtonGap;
    const startX = (width - totalRowWidth) / 2;
    
    for (let i = 0; i < codeLength; i++) {
      const slotX = startX + i * (slotSize + slotSpacing);
      const slot = this.scene.add.rectangle(slotX + slotSize/2, footerActiveRowY, slotSize, slotSize, 0x2a2a2a)
        .setStrokeStyle(3, 0xffffff, 0.9)
        .setInteractive()
        .on('pointerdown', () => this.elementPicker.showElementPicker(i, this.activeRowGuess));
      
      // Create display element based on current guess state (handles pre-filled guesses)
      const displayElement = this.createSlotDisplay(slotX + slotSize/2, footerActiveRowY, i);
      
      this.scene.footerContainer.add([slot, displayElement]);
      
      // Structure expected by updateSlotDisplay method
      this.activeRowElements.push({ slot, displayElement });
    }
    
    // MOBILE EXPERT DESIGN: Christmas-themed submit button with better positioning
    const submitButtonX = startX + totalSlotsWidth + submitButtonGap; // Better spacing
    this.activeRowSubmitBtn = this.scene.add.rectangle(submitButtonX, footerActiveRowY, submitButtonWidth, 45, 0x0d5016) // Taller for better touch
      .setStrokeStyle(2, 0x0a4012) // Darker green border
      .setInteractive()
      .on('pointerdown', () => this.scene.submitGuess());

    const submitText = this.scene.add.text(submitButtonX, footerActiveRowY, '🎁 Submit', {
      fontSize: '14px', // Slightly larger text
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.scene.footerContainer.add([this.activeRowSubmitBtn, submitText]);
    
    console.log('📱 Active row created in footer container with relative positioning');
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
  // Use centralized layout constants
  const baseHeaderHeight = LayoutConfig.getBaseHeaderHeight(isSmallScreen);
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
    
  const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;
    const guessHistory = this.historyManager.getGuessHistory();
    const scrollOffset = this.historyManager.getScrollOffset();
    
    // CRITICAL FIX: Calculate active row position AFTER the last completed guess
    // Position active row below the last visible completed guess
    const completedGuessesHeight = guessHistory.length * rowHeight;
    const lastCompletedGuessY = historyStartY + completedGuessesHeight - scrollOffset;
    
    // Add proper spacing AFTER the last completed guess
    const activeRowSeparation = 15; // Extra space to prevent overlap
    let activeRowY = lastCompletedGuessY + activeRowSeparation;
    
    // MOBILE EXPERT FIX: Don't constrain active row by contentEndY when there are many guesses
    // The content area needs to expand to accommodate all guesses
    const guessCount = guessHistory.length;
    
    if (guessCount >= 7) {
      // MOBILE EXPERT DESIGN: For games with many guesses, allow active row to go beyond normal content area
      // but still respect absolute safe area and PREVENT OVERLAP with footer
      const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
      const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME; // Use updated footer height
      const footerBuffer = 20; // Extra buffer above footer
      const absoluteMaxY = height - footerHeight - footerBuffer - safeAreaInsets.bottom;
      activeRowY = Math.min(activeRowY, absoluteMaxY);
      
      console.log(`🎯 ActiveRowManager: Many guesses (${guessCount}), using extended layout`);
      console.log(`  - Calculated activeRowY: ${lastCompletedGuessY + activeRowSeparation}`);
      console.log(`  - Footer height: ${footerHeight}px`);
      console.log(`  - Absolute max Y: ${absoluteMaxY} (safe bottom: ${safeAreaInsets.bottom}px)`);
      console.log(`  - Final activeRowY: ${activeRowY}`);
    } else {
      // MOBILE EXPERT DESIGN: For normal games, use improved content area constraints with footer awareness
      const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
      const footerBuffer = 30; // Extra margin above footer
      const maxActiveRowY = height - footerHeight - footerBuffer;
      activeRowY = Math.min(activeRowY, maxActiveRowY);
      
      console.log(`🎯 ActiveRowManager: Normal game (${guessCount} guesses), using improved layout`);
      console.log(`  - Footer height: ${footerHeight}px`);
      console.log(`  - Max active row Y: ${maxActiveRowY}`);
      console.log(`  - Final activeRowY: ${activeRowY}`);
    }
    
    // Ensure it doesn't go above the content area (this constraint is always valid)
    const minActiveRowY = layout.contentStartY + 50;
    activeRowY = Math.max(activeRowY, minActiveRowY);
    
    return activeRowY;
  }

  createActiveRowVisuals(activeRowY) {
    const { width } = this.scene.cameras.main;
    
    // Enhanced Christmas glow effect (GameScreenMobileLayoutFix: better prominence)
    this.activeRowGlowEffect = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 15, // Wider glow for more prominence 
      62, // Taller glow
      0xffd700, // Gold Christmas glow
      0.5 // Increased opacity for stronger effect
    ).setDepth(GameUtils.getDepthLayers().HISTORY);
    
    // Create active row with stronger Christmas styling
    this.activeRowBackground = this.scene.add.rectangle(
      width / 2, 
      activeRowY, 
      width - 20,
      50, 
      0x0f4f1a, // Stronger Christmas green background
      0.95 // Higher opacity for more prominence
    )
      .setStrokeStyle(4, 0xffd700) // Thicker gold border
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
    // MOBILE EXPERT DESIGN: Improved sizing for family accessibility
    const elementWidth = isSmallScreen ? 42 : 45; // Larger touch targets
    const elementSpacing = isSmallScreen ? 48 : 55; // Better spacing
    const submitButtonWidth = 85; // Consistent with footer layout
    
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
    return this.scene.add.rectangle(x, y, elementWidth, elementWidth, 0x2a2a2a, 0.8)
      .setStrokeStyle(3, 0xffffff, 0.9)
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
    
    // Use ButtonFactory for consistent festive styling with candy cane stripes
    this.activeRowSubmitBtn = ButtonFactory.createButton(
      this.scene,
      submitButtonX,
      activeRowY,
      'Submit',
      'primary',
      {
        icon: '🎯', // Target icon - perfect for "submit guess"
        pattern: 'candycane', // Christmas candy cane stripes
        gradient: true, // Festive gradient effect
        font: '11px Arial', // Maintain current mobile sizing
        onClick: () => this.scene.submitGuess()
      }
    );
    
    // Set depth and data tag for ScrollableHistoryManager
    this.activeRowSubmitBtn.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.2);
    this.activeRowSubmitBtn.setData('uiType', 'submitButton');
    
    // ButtonFactory handles touch feedback automatically, no need for addSubmitButtonTouchFeedback
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
    
    // Add to footer container if using footer layout
    if (this.scene.footerContainer) {
      this.scene.footerContainer.add(newDisplay);
    }
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

  // Note: addSubmitButtonTouchFeedback method removed - ButtonFactory handles touch feedback automatically

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

  // === DEBUG HELPER METHODS ===
  
  fillAllElements(elements) {
    // Fill all slots with the provided elements array
    if (!this.hasActiveRow) {
      console.warn('No active row to fill');
      return;
    }
    
    if (!Array.isArray(elements)) {
      console.warn('Elements must be an array');
      return;
    }
    
    const maxSlots = Math.min(elements.length, this.activeRowGuess.length);
    
    for (let i = 0; i < maxSlots; i++) {
      if (elements[i]) {
        this.selectElement(i, elements[i]);
      }
    }
    
    console.log('🔧 DEBUG: Filled active row with:', elements.slice(0, maxSlots));
  }

  reset() {
    this.removeActiveRow();
    this.elementPicker.destroy();
  }

  destroy() {
    this.reset();
  }
}