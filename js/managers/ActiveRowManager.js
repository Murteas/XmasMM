// ActiveRowManager.js - Handles active row (inline editing) functionality
// Uses global LayoutConfig (loaded via ModuleLoader)

class ActiveRowManager {
  constructor(scene, historyManager, deductionEngine = null) {
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

    // Logic hint system integration
    this.deductionEngine = deductionEngine;
    this.ghostOverlayManager = null;

    if (this.deductionEngine) {
      this.ghostOverlayManager = new GhostOverlayManager(scene, this, deductionEngine);
      console.log('👻 GhostOverlayManager integrated with ActiveRowManager');
    }
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

    // INLINE LAYOUT: Active row with Submit button and ElementBar inline
    const activeRowY = this.calculateInlineActiveRowPosition();
    this.createActiveRowVisuals(activeRowY);
    this.createActiveRowSlots(activeRowY);
    this.createSubmitButton(activeRowY);  // Inline submit button next to slots
    this.createElementBar(activeRowY);    // Inline element bar below active row

    this.hasActiveRow = true;

    return activeRowY; // Return position for reference
  }

  calculateInlineActiveRowPosition() {
    // SCROLLABLE CONTENT: Position after ALL history rows (no sliding window)
    const { width, height } = this.scene.cameras.main;
    const isSmallScreen = width < 500;

    // Start with proper padding from top of scrollable container (increased to prevent header overlap)
    const containerRelativeY = isSmallScreen ? 30 : 25;
    const historyStartY = Math.max(containerRelativeY, height * 0.02);

    // Calculate position after ALL history rows (scrolling enabled)
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;
    const guessHistory = this.historyManager.getGuessHistory();

    // Position active row after all guesses (no window limit with scrolling)
    const visibleRowCount = guessHistory.length;
    const activeRowY = historyStartY + (visibleRowCount * rowHeight);

    console.log(`🔍 ACTIVE ROW: Positioned at Y=${activeRowY} after ${visibleRowCount} history rows`);

    return activeRowY;
  }

  // INLINE SUBMIT BUTTON - positioned next to active row slots
  createSubmitButton(activeRowY) {
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const isSmallScreen = width < 500;
    const positioning = this.calculateSlotPositioning(codeLength, width, isSmallScreen);
    
    // Calculate position after the last element with proper spacing
    const lastElementRightEdge = positioning.startX + ((codeLength - 1) * positioning.elementSpacing) + (positioning.elementWidth / 2);
    const submitButtonX = lastElementRightEdge + LayoutConfig.SPACING.SUBMIT_BUTTON_GAP + LayoutConfig.SPACING.SUBMIT_BUTTON_HALF_WIDTH;
    
    // Use ButtonFactory for consistent festive styling
    this.activeRowSubmitBtn = ButtonFactory.createButton(
      this.scene,
      submitButtonX,
      activeRowY,
      'GO',
      'primary',
      {
        pattern: 'candycane',
        gradient: true,
        font: 'bold 12px Arial',
        onClick: () => this.scene.submitGuess()
      }
    );
    
    if (!this.activeRowSubmitBtn) {
      console.error('❌ SUBMIT BUTTON: ButtonFactory returned null/undefined!');
      return;
    }
    
    // Set depth and data tag
    this.activeRowSubmitBtn.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 1.2);
    this.activeRowSubmitBtn.setData('uiType', 'submitButton');
    
    // Add submit button to scrollable container (inline with active row)
    this.scene.scrollableContainer.add(this.activeRowSubmitBtn);
  }

  // INLINE ELEMENT BAR - positioned below active row
  createElementBar(activeRowY) {
    // Element bar is positioned INSIDE scrollableContainer, so use container-relative coordinates
    // Simply position it below the active row - scrolling will handle visibility
    const elementBarY = activeRowY + LayoutConfig.SPACING.ELEMENT_BAR_OFFSET;

    console.log(`🔍 ELEMENT BAR: Positioned at container Y=${elementBarY} (below active row at ${activeRowY})`);

    // Create ElementBar in scrollable container (inline positioning)
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

    // Store slot positions for ghost overlay creation
    const slotPositions = [];

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
      slotPositions.push({ x, y: activeRowY });
    }

    // Create ghost overlays after all slots are created
    if (this.ghostOverlayManager) {
      this.ghostOverlayManager.createGhostOverlays(codeLength, slotPositions);
    }
  }

  calculateSlotPositioning(codeLength, width, isSmallScreen) {
    // MOBILE EXPERT DESIGN: Improved sizing for family accessibility
    // Submit button is INLINE (to the right of slots), so account for its width
    const elementWidth = isSmallScreen ? LayoutConfig.SPACING.ELEMENT_WIDTH_SMALL : LayoutConfig.SPACING.ELEMENT_WIDTH_DEFAULT;
    const elementSpacing = isSmallScreen ? LayoutConfig.SPACING.ELEMENT_SPACING_SMALL : LayoutConfig.SPACING.ELEMENT_SPACING_DEFAULT;
    
    // Calculate total width of element slots
    const totalElementsWidth = (codeLength * elementSpacing) - (elementSpacing - elementWidth);
    
    // Include submit button width + gap in centering calculation
    const submitButtonTotalWidth = LayoutConfig.SPACING.SUBMIT_BUTTON_GAP + LayoutConfig.SPACING.SUBMIT_BUTTON_WIDTH;
    const totalRowWidth = totalElementsWidth + submitButtonTotalWidth;
    
    // Center the entire row (slots + submit button) on screen
    const startX = (width - totalRowWidth) / 2 + elementWidth / 2;
    
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
    // No TAP hint needed - ghost overlays show possibilities
    return null;
  }

  setupSlotInteraction(slot, slotIndex) {
    slot.on('pointerdown', (pointer) => {
      this.addSlotTouchFeedback(slot, slotIndex);
      this.selectSlot(slotIndex);
    });
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
    // Get position from slot (not displayElement, which might be null for empty slots)
    const x = elementData.slot.x;
    const y = elementData.slot.y;

    // Clean up old display if it exists
    if (elementData.displayElement) {
      elementData.displayElement.destroy();
    }

    if (elementData.fallbackText) {
      elementData.fallbackText.destroy();
      elementData.fallbackText = null;
    }

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

    // Clean up ghost overlays first
    if (this.ghostOverlayManager) {
      this.ghostOverlayManager.destroy();
    }

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

    // Update ghost overlays after element selection
    if (this.ghostOverlayManager) {
      this.ghostOverlayManager.updateAllGhosts();
    }
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