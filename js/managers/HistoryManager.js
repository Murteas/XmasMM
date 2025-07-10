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
    // MOBILE-OPTIMIZED SPACING: Use percentage-based layout
    const isSmallScreen = width < 500; // Increased threshold for better mobile detection
    
    // Dynamic header space based on actual header content
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22); // Max 22% for header
    
    // CRITICAL: Use much more of available height
    const bottomMargin = isSmallScreen ? 60 : 80; // Reduced from 100
    const historyEndY = height - bottomMargin;
    
    // Create invisible touch area for history scrolling
    // TEMPORARY: Disable to test if this interferes with slot touches
    this.historyTouchArea = this.scene.add.rectangle(
      width / 2, 
      (historyStartY + historyEndY) / 2, 
      width, 
      historyEndY - historyStartY, 
      0x000000, 
      0
    )
      .setDepth(GameUtils.getDepthLayers().TOUCH_AREA); // Lower depth than slots
      // Temporarily disable interactivity to test
      // .setInteractive()
    
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
    
    const { width, height } = this.scene.cameras.main;
    // CONSISTENCY FIX: Use same responsive calculation as setupHistoryScroll
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    
    const rowHeight = 60;
    const bottomMargin = isSmallScreen ? 60 : 80;
    const maxVisibleRows = Math.floor((height - historyStartY - bottomMargin) / rowHeight);
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
    
    const { width, height } = this.scene.cameras.main;
    // CONSISTENCY FIX: Use same responsive calculation 
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    
    // Auto-scroll to show the newest guess
    const rowHeight = 60;
    const bottomMargin = isSmallScreen ? 60 : 80;
    const maxVisibleRows = Math.floor((height - historyStartY - bottomMargin) / rowHeight);
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
    
    const { width, height } = this.scene.cameras.main;
    // CONSISTENCY FIX: Use same responsive calculation
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const startY = Math.max(baseHeaderHeight, height * 0.22);
    const rowHeight = 60;
    const bottomMargin = isSmallScreen ? 60 : 80;
    const maxVisibleRows = Math.floor((height - startY - bottomMargin) / rowHeight);
    
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
    
    // CONSISTENCY FIX: Use same responsive thresholds
    const isSmallScreen = width < 500;
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
      
      // Display element image instead of text with error handling
      const imageKey = this.scene.getElementImageKey(element);
      let elementImage;
      
      try {
        elementImage = this.scene.add.image(x, y, imageKey);
        
        // Check if the image was created successfully
        if (!elementImage.texture || elementImage.texture.key === '__MISSING') {
          console.warn(`History: Failed to create image for ${element}, using fallback rectangle`);
          elementImage.destroy();
          
          // Create fallback colored rectangle
          elementImage = this.scene.add.rectangle(x, y, elementWidth - 4, 26, 0xff6b6b)
            .setDepth(depth + 0.01);
          
          // Add element initial text
          const elementText = this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
            font: '10px Arial',
            fill: '#fff',
            fontStyle: 'bold'
          }).setOrigin(0.5).setDepth(depth + 0.02);
          
          this.historyGroup.add(elementText);
          this.historyElements.push(elementText);
        } else {
          // Scale image to fit in history slot (smaller than active row)
          const imageScale = Math.min(24 / elementImage.width, 24 / elementImage.height);
          elementImage.setScale(imageScale);
          elementImage.setOrigin(0.5).setDepth(depth + 0.01);
        }
      } catch (error) {
        console.error(`History: Error creating image for ${element}:`, error);
        
        // Create fallback rectangle as safety measure
        elementImage = this.scene.add.rectangle(x, y, elementWidth - 4, 26, 0xff6b6b)
          .setDepth(depth + 0.01);
        
        const elementText = this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
          font: '10px Arial',
          fill: '#fff',
          fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(depth + 0.02);
        
        this.historyGroup.add(elementText);
        this.historyElements.push(elementText);
      }
      
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
        // MOBILE UX: Position scroll button safely with responsive margin
        const bottomMargin = height < 400 ? 40 : 60; // Smaller margin on small screens
        const downButtonY = Math.min(startY + maxVisibleRows * rowHeight + 10, height - bottomMargin);
        const downIndicator = this.scene.add.text(width - 50, downButtonY, '↓ Scroll down', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(GameUtils.getDepthLayers().UI + 10) // Much higher depth
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

    const { width, height } = this.scene.cameras.main;
    const codeLength = this.scene.codeLength;
    const elements = this.scene.elements;
    
    // Initialize the active row guess array
    this.activeRowGuess = new Array(codeLength).fill(null);
    
    // Pre-fill with previous guess if provided
    if (prefillGuess && Array.isArray(prefillGuess)) {
      console.log(`Create Active Row: Pre-filling with previous guess:`, prefillGuess);
      for (let i = 0; i < Math.min(prefillGuess.length, codeLength); i++) {
        this.activeRowGuess[i] = prefillGuess[i];
      }
    } else {
      console.log(`Create Active Row: Starting with empty guess`);
    }
    
    // CONSISTENCY FIX: Use same responsive calculation as setupHistoryScroll
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
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

    // Create interactive slots with mobile-optimized positioning
    this.activeRowElements = [];
    
    // MOBILE FIX: Better responsive positioning for different code lengths
    const elementWidth = isSmallScreen ? 35 : 40;
    const elementSpacing = isSmallScreen ? 42 : 50; // Tighter spacing on mobile
    const submitButtonWidth = 60;
    
    // Calculate total width needed and ensure it fits on screen with margins
    const totalElementsWidth = (codeLength * elementSpacing) - (elementSpacing - elementWidth);
    const totalRowWidth = totalElementsWidth + submitButtonWidth + 20; // 20px gap before submit
    const minMargin = 15; // Minimum margin from screen edges
    
    console.log(`Mobile Debug: Screen width: ${width}, Code length: ${codeLength}`);
    console.log(`Mobile Debug: Element spacing: ${elementSpacing}, Element width: ${elementWidth}`);
    console.log(`Mobile Debug: Total elements width: ${totalElementsWidth}, Total row width: ${totalRowWidth}`);
    
    // Calculate starting X position - center the row or use minimum margin
    let startX;
    if (totalRowWidth + (minMargin * 2) <= width) {
      // Center the row
      startX = (width - totalRowWidth) / 2;
      console.log(`Mobile Debug: Centering row, startX: ${startX}`);
    } else {
      // Use minimum margin and reduce spacing if needed
      startX = minMargin;
      const availableElementWidth = width - (minMargin * 2) - submitButtonWidth - 20;
      const adjustedSpacing = Math.max(30, availableElementWidth / codeLength);
      console.log(`Mobile Debug: Tight fit - adjusting spacing to ${adjustedSpacing}px for ${codeLength} elements`);
    }
    
    for (let i = 0; i < codeLength; i++) {
      const x = startX + i * elementSpacing;
      
      // Slot background with tap indicator 
      const slot = this.scene.add.rectangle(x, activeRowY, elementWidth, elementWidth, 0x666666, 0)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(GameUtils.getDepthLayers().TOUCH_AREA); // Lower depth so images can show on top
      
      // Element display (image or tap hint) with error handling
      let displayElement;
      if (this.activeRowGuess[i]) {
        // Show element image with error handling
        const element = this.activeRowGuess[i];
        const imageKey = this.scene.getElementImageKey(element);
        console.log(`Active Row Creation: Slot ${i} pre-filled with ${element}, using key ${imageKey}`);
        
        try {
          if (this.scene.textures.exists(imageKey) && imageKey !== '__MISSING') {
            displayElement = this.scene.add.image(x, activeRowY, imageKey);
            
            if (displayElement && displayElement.texture && displayElement.texture.key !== '__MISSING') {
              // Scale to fit in slot
              const imageScale = Math.min(28 / displayElement.width, 28 / displayElement.height);
              displayElement.setScale(imageScale);
              console.log(`Active Row Creation: Successfully created image for ${element}`);
            } else {
              console.warn(`Active Row Creation: Image created but texture invalid for ${element}`);
              displayElement.destroy();
              displayElement = null;
            }
          } else {
            console.warn(`Active Row Creation: Texture ${imageKey} does not exist for ${element}`);
            displayElement = null;
          }
          
          if (!displayElement) {
            console.log(`Active Row Creation: Creating fallback text for ${element}`);
            displayElement = this.scene.add.text(x, activeRowY, element.charAt(0).toUpperCase(), {
              font: '12px Arial',
              fill: '#fff',
              backgroundColor: '#ff6b6b',
              padding: { left: 4, right: 4, top: 2, bottom: 2 }
            });
          }
        } catch (error) {
          console.error(`Active Row Creation: Error creating image for ${element}:`, error);
          displayElement = this.scene.add.text(x, activeRowY, element.charAt(0).toUpperCase(), {
            font: '12px Arial',
            fill: '#fff',
            backgroundColor: '#ff6b6b',
            padding: { left: 4, right: 4, top: 2, bottom: 2 }
          });
        }
      } else {
        // Show "TAP" hint text
        console.log(`Active Row Creation: Slot ${i} empty, showing TAP hint`);
        displayElement = this.scene.add.text(x, activeRowY, 'TAP', {
          font: '9px Arial',
          fill: '#aaa'
        });
      }
      displayElement.setOrigin(0.5).setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2); // Above touch area but below UI
      
      // Click handler to open element picker (mobile-friendly UX)
      slot.on('pointerdown', (pointer) => {
        // Enhanced touch feedback
        this.addSlotTouchFeedback(slot, i);
        this.cycleActiveRowElement(i);
      });
      
      this.activeRowElements.push({ slot, displayElement });
    }
    
    // Create integrated submit button within the active row - positioned correctly
    const submitButtonX = startX + (codeLength * elementSpacing) + 10; // 10px gap from last element
    this.activeRowSubmitBtn = this.scene.add.text(submitButtonX, activeRowY, 'Submit', {
      font: '11px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 6, right: 6, top: 3, bottom: 3 }
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
    // MOBILE-OPTIMIZED: Use same responsive calculation as history
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    const bottomMargin = isSmallScreen ? 60 : 80;
    const historyEndY = height - bottomMargin;
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
    
    const { width, height } = this.scene.cameras.main;
    // CONSISTENCY FIX: Use same responsive calculation as setupHistoryScroll
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
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
      
      // MOBILE FIX: Use same responsive positioning logic as createActiveRow
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
      
      this.activeRowElements.forEach((elementData, i) => {
        const x = startX + i * elementSpacing;
        elementData.slot.setPosition(x, activeRowY);
        elementData.displayElement.setPosition(x, activeRowY);
      });
    }
    
    if (this.activeRowSubmitBtn) {
      // Use same positioning logic as elements
      const submitButtonX = startX + (codeLength * elementSpacing) + 10;
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

    // Create picker container with mobile-optimized sizing
    const pickerWidth = Math.min(320, gameWidth - 20); // Wider on mobile, less margin
    const baseHeight = gameHeight < 500 ? 300 : 280; // Taller on small screens
    const minMargin = gameHeight < 500 ? 40 : 100; // Less margin on small screens  
    const pickerHeight = Math.min(baseHeight, gameHeight - minMargin);
    
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
      
      // Store elements to add to picker container
      let elementsToAdd = [elementBg];
      
      // Check if image was created successfully
      if (!elementImage.texture || elementImage.texture.key === '__MISSING') {
        console.warn(`Mobile: Failed to load image for ${element}, using fallback`);
        // Create a fallback colored rectangle if image fails
        const fallbackRect = this.scene.add.rectangle(x, y, elementSize - 8, elementSize - 8, 0xff6b6b);
        const fallbackText = this.scene.add.text(x, y, element.charAt(0), {
          fontSize: '16px',
          fill: '#ffffff',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        elementsToAdd.push(fallbackRect, fallbackText);
      } else {
        // Scale image to fit within button while maintaining aspect ratio
        const imageScale = Math.min((elementSize - 8) / elementImage.width, (elementSize - 8) / elementImage.height);
        elementImage.setScale(imageScale);
        elementImage.setOrigin(0.5);
        elementsToAdd.push(elementImage);
      }

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

      this.elementPicker.add(elementsToAdd);
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
    console.log(`🔧 Select Debug: Selecting element ${element} for slot ${slotIndex}`);
    this.activeRowGuess[slotIndex] = element;
    
    // Update visual - replace display element with image
    const elementData = this.activeRowElements[slotIndex];
    if (!elementData) {
      console.error(`🔧 Select Debug: No element data for slot ${slotIndex}`);
      return;
    }
    
    const oldElement = elementData.displayElement;
    const x = oldElement.x;
    const y = oldElement.y;
    
    // Remove old element and any associated fallback text
    if (elementData.fallbackText) {
      elementData.fallbackText.destroy();
      elementData.fallbackText = null;
    }
    oldElement.destroy();
    
    // Create new image element with comprehensive error handling
    const imageKey = this.scene.getElementImageKey(element);
    console.log(`🔧 Select Debug: Using image key '${imageKey}' for element '${element}'`);
    
    let newImage;
    
    // First check if we have a valid texture
    if (this.scene.textures.exists(imageKey) && imageKey !== '__MISSING') {
      try {
        const texture = this.scene.textures.get(imageKey);
        console.log(`🔧 Select Debug: Texture found:`, texture);
        
        newImage = this.scene.add.image(x, y, imageKey);
        
        // Verify the image was created with valid texture
        if (newImage && newImage.texture && newImage.texture.key !== '__MISSING' && newImage.width > 0 && newImage.height > 0) {
          const imageScale = Math.min(32 / newImage.width, 32 / newImage.height);
          newImage.setScale(imageScale);
          newImage.setOrigin(0.5);
          newImage.setVisible(true); // Ensure visibility
          newImage.setAlpha(1); // Ensure full opacity
          console.log(`🔧 Select Debug: Successfully created image for ${element}, scale: ${imageScale}, visible: ${newImage.visible}, alpha: ${newImage.alpha}`);
          console.log(`🔧 Select Debug: Image dimensions: ${newImage.width}x${newImage.height}, position: ${newImage.x},${newImage.y}, depth: ${newImage.depth}`);
        } else {
          console.warn(`🔧 Select Debug: Image created but invalid dimensions for ${element}`);
          if (newImage) newImage.destroy();
          newImage = null;
        }
      } catch (error) {
        console.error(`🔧 Select Debug: Error creating image for ${element}:`, error);
        if (newImage) newImage.destroy();
        newImage = null;
      }
    } else {
      console.warn(`🔧 Select Debug: Texture ${imageKey} does not exist or is missing for ${element}`);
    }
    
    // Create fallback if image failed
    if (!newImage) {
      console.log(`🔧 Select Debug: Creating fallback display for ${element}`);
      
      // Create a simple colored rectangle with text as fallback
      newImage = this.scene.add.rectangle(x, y, 30, 30, 0x3498db);
      newImage.setStrokeStyle(2, 0x2980b9);
      newImage.setOrigin(0.5);
      
      // Add text on top of rectangle
      const fallbackText = this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
        font: 'bold 12px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
      
      // Set depths properly
      newImage.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2.1); // Slightly higher than existing display elements
      fallbackText.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2.2);
      
      // Store both elements for cleanup
      elementData.fallbackText = fallbackText;
    }
    
    if (newImage) {
      newImage.setDepth(GameUtils.getDepthLayers().TOUCH_AREA + 2.1); // Slightly higher than existing display elements
      
      // Update reference
      elementData.displayElement = newImage;
      console.log(`🔧 Select Debug: Element ${element} selection complete`);
    } else {
      console.error(`🔧 Select Debug: Failed to create any display element for ${element}`);
    }
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
      // Simple, reliable scale-down feedback
      button.setScale(0.9);
      button.setAlpha(0.8);
    });

    button.on('pointerup', () => {
      // Satisfying bounce back
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
      // Reset if finger moves off button
      this.scene.tweens.killTweensOf(button);
      button.setScale(1);
      button.setAlpha(1);
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
