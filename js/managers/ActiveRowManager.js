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
    this.selectedSlotIndex = null; // Track which slot is selected for replacement
    this.elementBar = new ElementBar(scene, this);
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
    
    // UNIFIED SCROLLABLE LAYOUT: Always position inline after last guess in scrollable container
    const activeRowY = this.calculateInlineActiveRowPosition();
    this.createActiveRowVisuals(activeRowY);
    this.createActiveRowSlots(activeRowY);
    this.createSubmitButton(activeRowY);
    this.createElementBar(activeRowY);
    
    this.hasActiveRow = true;
    
    // Ensure the new active row and element bar are visible
    this.scrollToActiveRow();
    
    return activeRowY; // Return position for reference
  }

  calculateInlineActiveRowPosition() {
    // Calculate position for active row inline after the last completed guess
    const { width, height } = this.scene.cameras.main;
    const isSmallScreen = width < 500;
    const isVerySmallScreen = width < 400;
    
    // Use same coordinate system as HistoryRenderer (container-relative)
    const baseStartY = isSmallScreen ? LayoutConfig.SPACING.CONTAINER_TOP_SMALL : LayoutConfig.SPACING.CONTAINER_TOP_DEFAULT;
    const containerRelativeY = isVerySmallScreen ? LayoutConfig.SPACING.CONTAINER_TOP_VERY_SMALL : baseStartY;
    
    const historyStartY = Math.max(
      containerRelativeY,
      height * 0.02  // Same as HistoryRenderer
    );
    
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;
    const guessHistory = this.historyManager.getGuessHistory();
    const scrollOffset = this.historyManager.getScrollOffset();
    
    // Match HistoryRenderer logic: only apply scroll offset when scrolling is actually happening
    const activeAreaReserved = LayoutConfig.SPACING.ACTIVE_ROW_HEIGHT + LayoutConfig.SPACING.ELEMENT_BAR_HEIGHT + LayoutConfig.SPACING.CONTENT_MARGIN;
    const bottomMargin = isSmallScreen ? activeAreaReserved : activeAreaReserved;
    const maxVisibleRows = Math.floor((height - historyStartY - bottomMargin) / rowHeight);
    
    const nextRowIndex = guessHistory.length;
    let activeRowY;
    
    if (guessHistory.length <= maxVisibleRows) {
      // No scrolling needed - match renderAllRows behavior
      activeRowY = historyStartY + (nextRowIndex * rowHeight);
    } else {
      // Scrolling needed - match renderVisibleRows behavior  
      activeRowY = historyStartY + (nextRowIndex * rowHeight) - scrollOffset;
    }
    
    return activeRowY;
  }

  createElementBar(activeRowY) {
    // Create element bar BELOW active row slots with proper mobile spacing
    const { height } = this.scene.cameras.main;
    const elementBarHeight = LayoutConfig.SPACING.ELEMENT_BAR_HEIGHT;
    const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
    const minBottomMargin = LayoutConfig.SPACING.BOTTOM_MARGIN_MIN;
    
    // Calculate ideal position below active row
    const idealElementBarY = activeRowY + LayoutConfig.SPACING.ELEMENT_BAR_OFFSET;
    
    // Calculate maximum allowed Y position to keep element bar visible
    const maxElementBarY = height - safeAreaInsets.bottom - elementBarHeight - minBottomMargin;
    
    // Use the lower of the two positions to ensure visibility
    const elementBarY = Math.min(idealElementBarY, maxElementBarY);
    
    this.elementBar.create(this.scene.scrollableContainer, elementBarY);
  }

  // Old calculateActiveRowPosition method removed - was causing conflicts with unified layout
  // Now using calculateInlineActiveRowPosition for all positioning

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
    
    // Add visual elements to scrollable container
    this.scene.scrollableContainer.add([this.activeRowGlowEffect, this.activeRowBackground]);
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
      
      // Add slot elements to scrollable container
      this.scene.scrollableContainer.add(slot);
      if (displayElement) {
        this.scene.scrollableContainer.add(displayElement);
      }
      
      this.activeRowElements.push({ slot, displayElement });
    }
  }

  calculateSlotPositioning(codeLength, width, isSmallScreen) {
    // MOBILE EXPERT DESIGN: Improved sizing for family accessibility
    const elementWidth = isSmallScreen ? LayoutConfig.SPACING.ELEMENT_WIDTH_SMALL : LayoutConfig.SPACING.ELEMENT_WIDTH_DEFAULT;
    const elementSpacing = isSmallScreen ? LayoutConfig.SPACING.ELEMENT_SPACING_SMALL : LayoutConfig.SPACING.ELEMENT_SPACING_DEFAULT;
    const submitButtonWidth = LayoutConfig.SUBMIT_BUTTON_WIDTH;
    
    const totalElementsWidth = (codeLength * elementSpacing) - (elementSpacing - elementWidth);
    const totalRowWidth = totalElementsWidth + submitButtonWidth + LayoutConfig.SPACING.CONTENT_MARGIN;
    const minMargin = LayoutConfig.SPACING.CONTAINER_TOP_DEFAULT;
    
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
      this.selectSlot(slotIndex);
    });
  }

  createSubmitButton(activeRowY) {
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const isSmallScreen = width < 500;
    const positioning = this.calculateSlotPositioning(codeLength, width, isSmallScreen);
    
    // Calculate position after the last element with proper spacing
    const lastElementRightEdge = positioning.startX + ((codeLength - 1) * positioning.elementSpacing) + (positioning.elementWidth / 2);
    const submitButtonX = lastElementRightEdge + LayoutConfig.SPACING.SUBMIT_BUTTON_GAP + LayoutConfig.SPACING.SUBMIT_BUTTON_HALF_WIDTH;
    
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
    
    // Set depth and data tag
    this.activeRowSubmitBtn.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.2);
    this.activeRowSubmitBtn.setData('uiType', 'submitButton');
    
    // Add submit button to scrollable container
    this.scene.scrollableContainer.add(this.activeRowSubmitBtn);
    
    // ButtonFactory handles touch feedback automatically, no need for addSubmitButtonTouchFeedback
  }

  // Element selection is handled by ElementBar, no separate picker needed
  
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
    
    // Add to scrollable container (unified layout)
    this.scene.scrollableContainer.add(newDisplay);
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
    if (!this.hasActiveRow) {
      console.error('CRITICAL: updateActiveRowPosition() called but hasActiveRow=false');
      return;
    }
    
    // CRITICAL FIX: Prevent excessive position updates
    const now = Date.now();
    if (this.lastPositionUpdate && (now - this.lastPositionUpdate) < LayoutConfig.ANIMATION.THROTTLE_60FPS) {
      return;
    }
    this.lastPositionUpdate = now;
    
    const activeRowY = this.calculateInlineActiveRowPosition();
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
    
    // CRITICAL FIX: Update element bar position when active row moves
    if (this.elementBar) {
      const { height } = this.scene.cameras.main;
      const elementBarHeight = 50; // Height of element bar
      const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
      const minBottomMargin = 10; // Minimum margin from bottom
      
      // Calculate ideal position below active row
      const idealElementBarY = activeRowY + 55; // Same spacing as createElementBar
      
      // Calculate maximum allowed Y position to keep element bar visible
      const maxElementBarY = height - safeAreaInsets.bottom - elementBarHeight - minBottomMargin;
      
      // Use the lower of the two positions to ensure visibility
      const elementBarY = Math.min(idealElementBarY, maxElementBarY);
      this.elementBar.updatePosition(elementBarY);
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
    
    // Clean up element bar
    if (this.elementBar) {
      this.elementBar.destroy();
    }
    
    // Reset state
    this.hasActiveRow = false;
    this.activeRowGuess = [];
    
    // Recreate element bar for next use
    this.elementBar = new ElementBar(this.scene, this);
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
  }

  reset() {
    this.removeActiveRow();
    this.elementBar.destroy();
  }

  // New element bar integration methods
  selectSlot(slotIndex) {
    // Clear previous selection
    this.clearSlotSelection();
    
    // Select new slot
    this.selectedSlotIndex = slotIndex;
    
    // Visual feedback for selected slot
    if (this.activeRowElements && this.activeRowElements[slotIndex]) {
      const slot = this.activeRowElements[slotIndex].slot;
      slot.setStrokeStyle(4, 0xffd700, 1.0); // Gold highlight
    }
  }

  clearSlotSelection() {
    if (this.selectedSlotIndex !== null && this.activeRowElements && this.activeRowElements[this.selectedSlotIndex]) {
      const slot = this.activeRowElements[this.selectedSlotIndex].slot;
      slot.setStrokeStyle(3, 0xffffff, 0.9); // Reset to normal
    }
    this.selectedSlotIndex = null;
  }

  handleElementSelection(element) {
    // Smart selection logic
    const emptySlotIndex = this.activeRowGuess.findIndex(guess => guess === null);
    
    if (emptySlotIndex !== -1) {
      // Auto-fill next empty slot
      this.selectElement(emptySlotIndex, element);
      this.clearSlotSelection();
    } else if (this.selectedSlotIndex !== null) {
      // Replace selected slot
      this.selectElement(this.selectedSlotIndex, element);
      this.clearSlotSelection();
    } else {
      // All slots full, no slot selected - show feedback
      this.showSlotSelectionHint();
    }
    
    // Update element bar visual state
    this.elementBar.updateUsedElements(this.activeRowGuess);
  }

  showSlotSelectionHint() {
    // Position hint near the footer/active row area
    const { width, height } = this.scene.cameras.main;
    const hintY = height - 120; // Near footer but above it
    
    const hintText = this.scene.add.text(width / 2, hintY, 'Tap a slot first to replace an element', {
      fontSize: '14px',
      fill: '#ffd700',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5).setDepth(1000);
    
    // Fade out after 2 seconds
    this.scene.tweens.add({
      targets: hintText,
      alpha: 0,
      duration: 2000,
      onComplete: () => hintText.destroy()
    });
  }

  destroy() {
    this.reset();
  }
}