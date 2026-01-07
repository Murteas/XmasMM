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
    
    // THREE-ZONE LAYOUT: Active row in content area, controls in fixed footer
    const activeRowY = this.calculateInlineActiveRowPosition();
    this.createActiveRowVisuals(activeRowY);
    this.createActiveRowSlots(activeRowY);
    // Submit button now in footer alongside ElementBar
    this.createElementBarInFooter(); // Creates ElementBar + Submit button in footer
    
    this.hasActiveRow = true;
    
    // Ensure the new active row and element bar are visible
    // No scrolling needed with sliding window approach
    
    return activeRowY; // Return position for reference
  }

  calculateInlineActiveRowPosition() {
    // SLIDING WINDOW: Simple fixed positioning - no scroll calculations needed
    const { width, height } = this.scene.cameras.main;
    const isSmallScreen = width < 500;
    
    // Use same starting coordinates as HistoryRenderer
    const containerRelativeY = isSmallScreen ? 20 : 15;
    const historyStartY = Math.max(containerRelativeY, height * 0.02);
    
    // Calculate position after visible history rows
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;
    const maxVisibleGuesses = LayoutConfig.HISTORY_SLIDING_WINDOW_SIZE;
    const guessHistory = this.historyManager.getGuessHistory();
    
    // Only count visible rows (sliding window)
    const visibleRowCount = Math.min(guessHistory.length, maxVisibleGuesses);
    const activeRowY = historyStartY + (visibleRowCount * rowHeight);
    
    console.log(`🔍 ACTIVE ROW: Positioned at Y=${activeRowY} after ${visibleRowCount} visible history rows`);
    
    return activeRowY;
  }

  createElementBarInFooter() {
    // THREE-ZONE LAYOUT: ElementBar + Submit button in fixed footer container
    const { width } = this.scene.cameras.main;
    const footer = LayoutConfig.FOOTER; // Use consolidated footer config
    
    // The footer container's total height includes safe area at bottom
    // Center controls in the usable portion (not the safe area padding)
    const usableHeight = footer.HEIGHT - footer.TOP_PADDING;
    const controlsY = footer.TOP_PADDING + (usableHeight / 2);
    
    // Calculate ElementBar dimensions from config
    const numElements = this.scene.elements.length;
    const elementBarWidth = numElements * footer.ELEMENT_BUTTON_SIZE + 
                           (numElements - 1) * footer.ELEMENT_BUTTON_SPACING;
    
    // Position ElementBar slightly left of center to make room for Submit button
    const totalWidth = elementBarWidth + footer.SUBMIT_BUTTON_GAP + footer.SUBMIT_BUTTON_WIDTH;
    const elementBarCenterX = (width - totalWidth) / 2 + elementBarWidth / 2;
    const submitButtonX = elementBarCenterX + elementBarWidth / 2 + 
                          footer.SUBMIT_BUTTON_GAP + footer.SUBMIT_BUTTON_WIDTH / 2;
    
    console.log(`🔍 FOOTER CONTROLS: ElementBar at X=${elementBarCenterX}, Submit at X=${submitButtonX}, Y=${controlsY}`);
    
    // Create ElementBar in footer container (pass custom X position)
    this.elementBar.createInFooter(this.scene.footerContainer, elementBarCenterX, controlsY);
    
    // Create Submit button in footer
    this.createSubmitButtonInFooter(submitButtonX, controlsY);
  }
  
  createSubmitButtonInFooter(x, y) {
    // Create compact Submit button in footer container (no icon, just text)
    this.activeRowSubmitBtn = ButtonFactory.createButton(
      this.scene,
      x,
      y,
      'GO',
      'primary',
      {
        pattern: 'candycane',
        gradient: true,
        font: 'bold 14px Arial',
        paddingX: 12, // Compact horizontal padding
        onClick: () => this.scene.submitGuess()
      }
    );
    
    this.activeRowSubmitBtn.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.2);
    this.activeRowSubmitBtn.setData('uiType', 'submitButton');
    
    // Add to footer container (not scrollable container)
    this.scene.footerContainer.add(this.activeRowSubmitBtn);
  }

  // Legacy method - redirects to new footer-based implementation
  createElementBar(activeRowY) {
    // DEPRECATED: ElementBar now created in footer via createElementBarInFooter()
    console.warn('⚠️ createElementBar() is deprecated - use createElementBarInFooter()');
    this.createElementBarInFooter();
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
    // Submit button is now in footer, so slots can be centered
    const elementWidth = isSmallScreen ? LayoutConfig.SPACING.ELEMENT_WIDTH_SMALL : LayoutConfig.SPACING.ELEMENT_WIDTH_DEFAULT;
    const elementSpacing = isSmallScreen ? LayoutConfig.SPACING.ELEMENT_SPACING_SMALL : LayoutConfig.SPACING.ELEMENT_SPACING_DEFAULT;
    
    // Calculate total width of just the element slots (no submit button)
    const totalElementsWidth = (codeLength * elementSpacing) - (elementSpacing - elementWidth);
    
    // Center the slots on screen
    const startX = (width - totalElementsWidth) / 2 + elementWidth / 2;
    
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

  // DEPRECATED: Submit button now created in footer via createSubmitButtonInFooter()
  createSubmitButton(activeRowY) {
    console.warn('⚠️ createSubmitButton() is deprecated - Submit button is now in footer');
    // No-op: Submit button is now created in createElementBarInFooter()
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

  // REMOVED: updateActiveRowPosition() - no longer needed with sliding window fixed positioning

  // Note: addSubmitButtonTouchFeedback method removed - ButtonFactory handles touch feedback automatically

  // REMOVED: scrollToActiveRow() - no longer needed with sliding window approach

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
    // Smart selection logic - selected slot takes priority over auto-fill
    const emptySlotIndex = this.activeRowGuess.findIndex(guess => guess === null);
    
    if (this.selectedSlotIndex !== null) {
      // Replace explicitly selected slot (user tapped a slot first)
      this.selectElement(this.selectedSlotIndex, element);
      this.clearSlotSelection();
    } else if (emptySlotIndex !== -1) {
      // Auto-fill next empty slot
      this.selectElement(emptySlotIndex, element);
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