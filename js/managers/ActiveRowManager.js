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
    // CORRECTED: Submit button on FAR RIGHT as requested
    const { width } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    
    // MOBILE EXPERT FIX: Position active row higher in footer to prevent overlap
    const footerActiveRowY = 30;
    
    // Create clean background in footer container - no border for modern design
    this.activeRowBackground = this.scene.add.rectangle(
      width / 2,
      footerActiveRowY,
      width - 20,
      60,
      0x4a4a4a,
      0.8
    ); // REMOVED: .setStrokeStyle(3, 0xffd700) for clean borderless design
    
    this.scene.footerContainer.add(this.activeRowBackground);
    
    // CORRECTED: Right-side submit button approach with PROPER SPACING
    const submitBtnWidth = 75; // Compact width for right side
    const buttonSlotGap = 20; // INCREASED gap between slots and submit button
    const sideMargins = 15; // Margins from screen edges
    
    // CRITICAL FIX: Calculate slot positions properly to prevent overlap
    const availableWidth = width - (sideMargins * 2) - submitBtnWidth - buttonSlotGap;
    const slotSize = Math.floor(availableWidth / codeLength) - 5; // 5px spacing between slots
    const actualSlotsWidth = codeLength * slotSize; // No extra spacing in total width
    
    // Position layout from left margin
    const slotsStartX = sideMargins;
    const submitX = slotsStartX + actualSlotsWidth + buttonSlotGap + (submitBtnWidth / 2);
    
    console.log(`🔧 Layout Debug: width=${width}, slotsStart=${slotsStartX}, slotsWidth=${actualSlotsWidth}, gap=${buttonSlotGap}, submitX=${submitX}, submitWidth=${submitBtnWidth}`);
    
    // CREATE SLOTS FIRST (properly spaced from left)
    this.activeRowElements = [];
    
    for (let i = 0; i < codeLength; i++) {
      const slotX = slotsStartX + (i * slotSize) + (slotSize / 2); // CORRECTED positioning
      const slot = this.scene.add.rectangle(slotX, footerActiveRowY, slotSize - 2, slotSize - 2, 0x2a2a2a)
        .setStrokeStyle(3, 0xffffff, 0.9)
        .setInteractive()
        .on('pointerdown', () => this.elementPicker.showElementPicker(i, this.activeRowGuess));
      
      const displayElement = this.createSlotDisplay(slotX, footerActiveRowY, i);
      
      this.scene.footerContainer.add([slot, displayElement]);
      this.activeRowElements.push({ slot, displayElement });
    }
    
    // CREATE SUBMIT BUTTON (far right, with guaranteed gap)
    this.activeRowSubmitBtn = this.scene.add.rectangle(submitX, footerActiveRowY, submitBtnWidth, 50, 0x0d5016)
      .setStrokeStyle(2, 0x0a4012)
      .setInteractive()
      .on('pointerdown', () => this.scene.submitGuess());

    const submitText = this.scene.add.text(submitX, footerActiveRowY, '🎁 Submit', {
      fontSize: '12px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.scene.footerContainer.add([this.activeRowSubmitBtn, submitText]);
    
    console.log(`📱 Fixed layout: ${codeLength} slots of ${slotSize}px each, ${buttonSlotGap}px gap, submit at x=${submitX}`);
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
    
    // EXPERT UX: Legend removed - no legend space calculations needed
    // Reclaimed 65px of valuable mobile screen space for better game layout
    
    // History starts below header only - legend space reclaimed
    const historyStartY = Math.max(
      baseHeaderHeight, 
      layout.contentStartY, // Use safe area aware content start
      headerBottomY + 10 // Minimal padding since legend removed
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
      // MOBILE EXPERT DESIGN: Push active row very close to safe area for maximum space usage
      const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
      const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME; // Use updated footer height
      const footerBuffer = 5; // Minimal buffer - just barely above safe area
      const absoluteMaxY = height - footerHeight - footerBuffer - safeAreaInsets.bottom;
      activeRowY = Math.min(activeRowY, absoluteMaxY);
      
      console.log(`🎯 ActiveRowManager: Many guesses (${guessCount}), pushing to barely above safe area`);
      console.log(`  - Calculated activeRowY: ${lastCompletedGuessY + activeRowSeparation}`);
      console.log(`  - Footer height: ${footerHeight}px`);
      console.log(`  - Footer buffer: ${footerBuffer}px (minimal - barely above safe area)`);
      console.log(`  - Absolute max Y: ${absoluteMaxY} (safe bottom: ${safeAreaInsets.bottom}px)`);
      console.log(`  - Final activeRowY: ${activeRowY}`);
    } else {
      // MOBILE EXPERT DESIGN: For normal games, also push closer to safe area
      const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
      const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
      const footerBuffer = 8; // Small buffer to move very close to safe area
      const maxActiveRowY = height - footerHeight - footerBuffer - safeAreaInsets.bottom;
      activeRowY = Math.min(activeRowY, maxActiveRowY);
      
      console.log(`🎯 ActiveRowManager: Normal game (${guessCount} guesses), pushing closer to safe area`);
      console.log(`  - Footer height: ${footerHeight}px`);
      console.log(`  - Footer buffer: ${footerBuffer}px (small - close to safe area)`);
      console.log(`  - Max active row Y: ${maxActiveRowY} (safe bottom: ${safeAreaInsets.bottom}px)`);
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