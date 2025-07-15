// SimpleGameScene.js - Phaser best practices for mobile Mastermind
// Replaces complex manager hierarchy with direct Phaser API usage

class SimpleGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SimpleGame' });
  }

  create() {
    // === PHASER BEST PRACTICE: Direct scene management ===
    this.setupMobileLayout();
    this.setupGameData();
    this.createActiveRow();
  }

  setupMobileLayout() {
    // === PHASER MOBILE PATTERN: Three-zone layout ===
    const { width, height } = this.scale.gameSize;
    
    // Header (fixed)
    this.headerContainer = this.add.container(0, 0);
    this.createHeader();
    
    // Scrollable content area
    const headerHeight = 140;
    const footerHeight = 120;
    const contentY = headerHeight;
    const contentHeight = height - headerHeight - footerHeight;
    
    this.scrollableContainer = this.add.container(0, contentY);
    this.historyContainer = this.add.container(0, 0);
    this.scrollableContainer.add(this.historyContainer);
    
    // Content mask for clean scrolling
    const mask = this.make.graphics();
    mask.fillRect(0, contentY, width, contentHeight);
    this.scrollableContainer.setMask(mask.createGeometryMask());
    
    // Footer (fixed)
    this.footerContainer = this.add.container(0, height - footerHeight);
    
    // Simple touch scrolling
    this.setupScrolling(contentHeight);
    
    console.log('📱 Simple mobile layout created');
  }

  createHeader() {
    // Simple header with legend
    const title = this.add.text(this.scale.width / 2, 30, 'Christmas Mastermind', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Legend - simple and direct
    const legendY = 70;
    const legendText = this.add.text(20, legendY, 'Guess the pattern:', {
      fontSize: '16px',
      color: '#ffffff'
    });
    
    this.headerContainer.add([title, legendText]);
  }

  setupGameData() {
    // === SIMPLE GAME STATE (no complex managers) ===
    this.gameElements = ['🎄', '🎁', '⭐', '🍪', '🔔', '❄️'];
    this.codeLength = 4;
    this.secretCode = this.generateSecretCode();
    this.guessHistory = [];
    this.feedbackHistory = [];
    this.currentGuess = new Array(this.codeLength).fill(null);
    this.selectedSlotIndex = 0; // Track which slot is selected for picker
    
    console.log('🎮 Game data initialized');
  }

  generateSecretCode() {
    const code = [];
    for (let i = 0; i < this.codeLength; i++) {
      code.push(this.gameElements[Math.floor(Math.random() * this.gameElements.length)]);
    }
    return code;
  }

  createActiveRow() {
    // === PHASER BEST PRACTICE: Direct element creation ===
    const activeY = 20;
    const slotSize = 60;
    const startX = 40;
    
    // Background with Christmas styling
    const background = this.add.rectangle(
      this.scale.width / 2, 
      activeY + 25, 
      this.scale.width - 20, 
      50, 
      0x2c5530, // Christmas green
      0.9
    ).setStrokeStyle(2, 0xffd700); // Gold border
    this.footerContainer.add(background);
    
    // Guess slots with better styling
    this.activeSlots = [];
    for (let i = 0; i < this.codeLength; i++) {
      const slot = this.add.rectangle(
        startX + (i * (slotSize + 10)), 
        activeY, 
        slotSize, 
        slotSize, 
        0x1a4a1a // Dark green
      )
      .setStrokeStyle(3, 0xffd700) // Gold border
      .setInteractive();
      
      const slotText = this.add.text(
        startX + (i * (slotSize + 10)), 
        activeY, 
        '❓', 
        { fontSize: '32px' }
      ).setOrigin(0.5);
      
      // Enhanced click handler with visual feedback
      slot.on('pointerdown', () => this.selectSlot(i));
      slot.on('pointerover', () => slot.setStrokeStyle(3, 0xffffff));
      slot.on('pointerout', () => {
        const color = i === this.selectedSlotIndex ? 0xffffff : 0xffd700;
        slot.setStrokeStyle(3, color);
      });
      
      this.activeSlots.push({ slot, text: slotText });
      this.footerContainer.add([slot, slotText]);
    }
    
    // Submit button with Christmas styling
    const submitBtn = this.add.text(
      this.scale.width - 60, 
      activeY, 
      '🎁 Submit', 
      { fontSize: '16px', color: '#00ff00', fontWeight: 'bold' }
    )
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => this.submitGuess())
    .on('pointerover', () => submitBtn.setStyle({ color: '#ffffff' }))
    .on('pointerout', () => submitBtn.setStyle({ color: '#00ff00' }));
    
    this.footerContainer.add(submitBtn);
    
    // Create element picker (hidden initially)
    this.createElementPicker();
    
    // Highlight first slot
    this.updateSlotSelection();
    
    console.log('🎯 Enhanced active row created in footer');
  }

  createElementPicker() {
    // Create picker container (positioned above footer)
    const pickerY = this.scale.height - 200;
    this.pickerContainer = this.add.container(0, pickerY);
    this.pickerContainer.setVisible(false);
    
    // Background
    const pickerBg = this.add.rectangle(
      this.scale.width / 2, 0, this.scale.width - 20, 60, 0x1a1a2e, 0.95
    ).setStrokeStyle(2, 0xffd700);
    this.pickerContainer.add(pickerBg);
    
    // Element buttons
    const elementSize = 45;
    const startX = (this.scale.width - (this.gameElements.length * (elementSize + 10))) / 2;
    
    this.gameElements.forEach((element, index) => {
      const elementButton = this.add.rectangle(
        startX + (index * (elementSize + 10)), 0, elementSize, elementSize, 0x2c5530
      )
      .setStrokeStyle(2, 0xffd700)
      .setInteractive();
      
      const elementText = this.add.text(
        startX + (index * (elementSize + 10)), 0, element, 
        { fontSize: '28px' }
      ).setOrigin(0.5);
      
      // Click handler
      elementButton.on('pointerdown', () => this.selectElement(element));
      elementButton.on('pointerover', () => elementButton.setStrokeStyle(2, 0xffffff));
      elementButton.on('pointerout', () => elementButton.setStrokeStyle(2, 0xffd700));
      
      this.pickerContainer.add([elementButton, elementText]);
    });
    
    console.log('🎰 Element picker created');
  }

  selectSlot(slotIndex) {
    // Update selected slot
    this.selectedSlotIndex = slotIndex;
    this.updateSlotSelection();
    
    // Show element picker
    this.pickerContainer.setVisible(true);
    
    console.log(`🎯 Selected slot ${slotIndex}, showing picker`);
  }

  selectElement(element) {
    // Set element in selected slot
    this.currentGuess[this.selectedSlotIndex] = element;
    this.activeSlots[this.selectedSlotIndex].text.setText(element);
    
    // Hide picker
    this.pickerContainer.setVisible(false);
    
    // Move to next empty slot automatically
    const nextEmptySlot = this.currentGuess.findIndex(slot => slot === null);
    if (nextEmptySlot !== -1) {
      this.selectedSlotIndex = nextEmptySlot;
      this.updateSlotSelection();
    }
    
    console.log(`🎰 Selected ${element} for slot ${this.selectedSlotIndex}`);
  }

  updateSlotSelection() {
    // Update visual selection indicator
    this.activeSlots.forEach((slot, index) => {
      const color = index === this.selectedSlotIndex ? 0xffffff : 0xffd700;
      slot.slot.setStrokeStyle(3, color);
    });
  }

  submitGuess() {
    // Check if guess is complete
    if (this.currentGuess.some(element => element === null)) {
      console.log('❌ Incomplete guess');
      return;
    }
    
    // Calculate feedback
    const feedback = this.calculateFeedback(this.currentGuess, this.secretCode);
    
    // Add to history
    this.guessHistory.push([...this.currentGuess]);
    this.feedbackHistory.push(feedback);
    
    // Create history row
    this.createHistoryRow(this.currentGuess, feedback, this.guessHistory.length - 1);
    
    // Reset active row
    this.currentGuess.fill(null);
    this.activeSlots.forEach(slot => slot.text.setText('?'));
    
    // Check win condition
    if (feedback.black === this.codeLength) {
      this.showWin();
    }
    
    console.log('✅ Guess submitted');
  }

  calculateFeedback(guess, secret) {
    let black = 0;
    let white = 0;
    const secretCopy = [...secret];
    const guessCopy = [...guess];
    
    // Count exact matches (black pegs)
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === secretCopy[i]) {
        black++;
        secretCopy.splice(i, 1);
        guessCopy.splice(i, 1);
      }
    }
    
    // Count element matches in wrong position (white pegs)
    guessCopy.forEach(element => {
      const index = secretCopy.indexOf(element);
      if (index !== -1) {
        white++;
        secretCopy.splice(index, 1);
      }
    });
    
    return { black, white };
  }

  createHistoryRow(guess, feedback, rowIndex) {
    const rowY = rowIndex * 70;
    const slotSize = 50;
    const startX = 40;
    
    // Row container with background
    const rowContainer = this.add.container(0, rowY);
    
    // Row background for better visibility
    const rowBg = this.add.rectangle(
      this.scale.width / 2, 0, this.scale.width - 40, 60, 0x0f2f0f, 0.7
    ).setStrokeStyle(1, 0x2c5530);
    rowContainer.add(rowBg);
    
    // Guess elements with better styling
    guess.forEach((element, i) => {
      // Element background
      const elementBg = this.add.rectangle(
        startX + (i * (slotSize + 10)), 0, slotSize - 5, slotSize - 5, 0x1a4a1a
      ).setStrokeStyle(1, 0xffd700);
      
      const elementText = this.add.text(
        startX + (i * (slotSize + 10)), 0, element, 
        { fontSize: '24px' }
      ).setOrigin(0.5);
      
      rowContainer.add([elementBg, elementText]);
    });
    
    // Enhanced feedback with better visuals
    const feedbackX = startX + (this.codeLength * (slotSize + 10)) + 30;
    
    // Black pegs (correct position)
    for (let i = 0; i < feedback.black; i++) {
      const blackPeg = this.add.circle(feedbackX + (i * 18), -8, 8, 0x000000)
        .setStrokeStyle(2, 0xffffff);
      rowContainer.add(blackPeg);
    }
    
    // White pegs (correct element, wrong position)
    for (let i = 0; i < feedback.white; i++) {
      const whitePeg = this.add.circle(feedbackX + ((feedback.black + i) * 18), 8, 8, 0xffffff)
        .setStrokeStyle(2, 0x000000);
      rowContainer.add(whitePeg);
    }
    
    this.historyContainer.add(rowContainer);
    
    // Auto-scroll to show new row
    this.scrollToBottom();
  }

  setupScrolling(contentHeight) {
    // === PHASER BEST PRACTICE: Simple input handling ===
    this.scrollY = 0;
    this.maxScroll = 0;
    this.contentHeight = contentHeight;
    
    // Touch input
    this.input.on('pointerdown', this.startScroll, this);
    this.input.on('pointermove', this.doScroll, this);
    this.input.on('pointerup', this.endScroll, this);
  }

  startScroll(pointer) {
    this.lastPointerY = pointer.y;
    this.isScrolling = false;
  }

  doScroll(pointer) {
    if (this.lastPointerY !== undefined) {
      const deltaY = pointer.y - this.lastPointerY;
      
      if (Math.abs(deltaY) > 5) {
        this.isScrolling = true;
        this.scrollY += deltaY;
        this.updateScroll();
      }
      
      this.lastPointerY = pointer.y;
    }
  }

  endScroll() {
    this.lastPointerY = undefined;
    this.isScrolling = false;
  }

  updateScroll() {
    // Calculate max scroll based on content
    const totalContentHeight = this.guessHistory.length * 70;
    this.maxScroll = Math.max(0, totalContentHeight - this.contentHeight);
    
    // Clamp scroll
    this.scrollY = Phaser.Math.Clamp(this.scrollY, -this.maxScroll, 0);
    
    // Apply to container
    this.historyContainer.y = this.scrollY;
  }

  scrollToBottom() {
    const totalContentHeight = this.guessHistory.length * 70;
    this.maxScroll = Math.max(0, totalContentHeight - this.contentHeight);
    this.scrollY = -this.maxScroll;
    this.updateScroll();
  }

  showWin() {
    const winText = this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2, 
      '🎉 You Win! 🎉', 
      { fontSize: '32px', color: '#00ff00' }
    ).setOrigin(0.5);
    
    winText.setDepth(1000);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleGameScene;
} else {
  window.SimpleGameScene = SimpleGameScene;
}
