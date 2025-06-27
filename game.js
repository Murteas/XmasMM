// XmasMM - Phaser.js MainMenu and Game scenes

class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }
  preload() {
    this.load.image('bg', 'assets/bg.jpg');
  }
  create() {
    const { width, height } = this.cameras.main;
    // Add background image, scaled to cover
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(0);

    // Title
    this.add.text(width / 2, height * 0.18, 'XmasMM', {
      font: '48px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1);

    // Start Game button
    const startBtn = this.add.text(width / 2, height * 0.45, 'Start Game', {
      font: '32px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 24, right: 24, top: 12, bottom: 12 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    startBtn.on('pointerdown', () => {
      this.scene.start('DifficultySelection');
    });

    // SFX Toggle
    this.registry.set('sfxOn', true);
    this.registry.set('musicOn', true);
    this.sfxBtn = this.add.text(width / 2, height * 0.65, 'SFX: ON', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#222',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    this.sfxBtn.on('pointerdown', () => {
      const current = this.registry.get('sfxOn');
      this.registry.set('sfxOn', !current);
      this.sfxBtn.setText('SFX: ' + (this.registry.get('sfxOn') ? 'ON' : 'OFF'));
    });

    // Music Toggle
    this.musicBtn = this.add.text(width / 2, height * 0.75, 'Music: ON', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#222',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    this.musicBtn.on('pointerdown', () => {
      const current = this.registry.get('musicOn');
      this.registry.set('musicOn', !current);
      this.musicBtn.setText('Music: ' + (this.registry.get('musicOn') ? 'ON' : 'OFF'));
    });
  }
}

class DifficultySelection extends Phaser.Scene {
  constructor() {
    super('DifficultySelection');
  }
  
  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(0);
    
    // Title
    this.add.text(width / 2, height * 0.15, 'Select Difficulty', {
      font: '36px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1);
    
    // Code Length Selection
    this.add.text(width / 2, height * 0.3, 'Code Length:', {
      font: '24px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(1);
    
    this.codeLength = 4; // Default
    this.codeLengthBtns = [];
    const lengthOptions = [4, 5, 6];
    lengthOptions.forEach((length, index) => {
      const x = width / 2 + (index - 1) * 80;
      const y = height * 0.4;
      const btn = this.add.text(x, y, length.toString(), {
        font: '24px Arial',
        fill: length === 4 ? '#000' : '#fff',
        backgroundColor: length === 4 ? '#fff' : '#444',
        padding: { left: 12, right: 12, top: 8, bottom: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
      
      btn.on('pointerdown', () => {
        this.codeLength = length;
        this.updateCodeLengthButtons();
      });
      
      this.codeLengthBtns.push({ btn, length });
    });
    
    // Number of Guesses Selection
    this.add.text(width / 2, height * 0.55, 'Number of Guesses:', {
      font: '24px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(1);
    
    this.maxGuesses = 10; // Default
    this.guessText = this.add.text(width / 2, height * 0.65, this.maxGuesses.toString(), {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setDepth(1);
    
    // Decrease button
    const decreaseBtn = this.add.text(width / 2 - 80, height * 0.65, '-', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    
    decreaseBtn.on('pointerdown', () => {
      if (this.maxGuesses > 8) {
        this.maxGuesses--;
        this.guessText.setText(this.maxGuesses.toString());
      }
    });
    
    // Increase button
    const increaseBtn = this.add.text(width / 2 + 80, height * 0.65, '+', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    
    increaseBtn.on('pointerdown', () => {
      if (this.maxGuesses < 15) {
        this.maxGuesses++;
        this.guessText.setText(this.maxGuesses.toString());
      }
    });
    
    // Confirm button
    const confirmBtn = this.add.text(width / 2, height * 0.8, 'Confirm', {
      font: '28px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 24, right: 24, top: 12, bottom: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    
    confirmBtn.on('pointerdown', () => {
      this.registry.set('codeLength', this.codeLength);
      this.registry.set('maxGuesses', this.maxGuesses);
      this.scene.start('Game');
    });
    
    // Back button
    const backBtn = this.add.text(50, 50, 'Back', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    
    backBtn.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
  
  updateCodeLengthButtons() {
    this.codeLengthBtns.forEach(({ btn, length }) => {
      if (length === this.codeLength) {
        btn.setStyle({ fill: '#000', backgroundColor: '#fff' });
      } else {
        btn.setStyle({ fill: '#fff', backgroundColor: '#444' });
      }
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  
  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(0);
    
    // Add dark overlay to improve contrast for feedback dots
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);
    overlay.setDepth(0.5);
    
    // Game state
    this.elements = ['Santa', 'Present', 'Mistletoe', 'Star', 'Tree', 'Snowflake'];
    this.codeLength = this.registry.get('codeLength') || 4;
    this.maxGuesses = this.registry.get('maxGuesses') || 10;
    this.currentGuess = [];
    this.guessHistory = [];
    this.feedbackHistory = [];
    this.historyElements = []; // Track history elements for cleanup
    this.historyScrollOffset = 0; // Track scroll position in history
    this.guessesRemaining = this.maxGuesses;
    this.currentScore = 0;
    this.hintUsed = false;
    
    // Generate random code
    this.secretCode = this.generateRandomCode();
    console.log('Secret code:', this.secretCode); // For testing
    
    // UI Setup
    this.setupUI();
    this.setupCurrentGuessRow();
    this.setupButtons();
    
    // Initialize current guess
    for (let i = 0; i < this.codeLength; i++) {
      this.currentGuess.push(this.elements[0]); // Default to Santa
    }
    this.updateCurrentGuessDisplay();
  }
  
  generateRandomCode() {
    const code = [];
    for (let i = 0; i < this.codeLength; i++) {
      const randomElement = this.elements[Math.floor(Math.random() * this.elements.length)];
      code.push(randomElement);
    }
    return code;
  }
  
  setupUI() {
    const { width, height } = this.cameras.main;
    
    // Title
    this.add.text(width / 2, 30, 'XmasMM', {
      font: '24px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1);
    
    // Guesses remaining
    this.guessesText = this.add.text(50, 70, `Guesses: ${this.guessesRemaining}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setDepth(1);
    
    // Score
    this.scoreText = this.add.text(width - 50, 70, `Score: ${this.currentScore}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(1, 0).setDepth(1);
    
    // Santa's Hint status
    this.hintText = this.add.text(width / 2, 70, 'Hint: Locked', {
      font: '18px Arial',
      fill: '#888'
    }).setOrigin(0.5).setDepth(1);
  }
  
  setupCurrentGuessRow() {
    const { width } = this.cameras.main;
    const startX = width / 2 - (this.codeLength * 30);
    const y = 120;
    
    this.currentGuessSlots = [];
    for (let i = 0; i < this.codeLength; i++) {
      const x = startX + i * 60;
      const slot = this.add.rectangle(x, y, 50, 50, 0x444444)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .setDepth(1);
      
      const text = this.add.text(x, y, this.elements[0], {
        font: '12px Arial',
        fill: '#fff'
      }).setOrigin(0.5).setDepth(2);
      
      slot.on('pointerdown', () => {
        this.cycleElement(i);
      });
      
      this.currentGuessSlots.push({ slot, text, index: i });
    }
  }
  
  setupButtons() {
    const { width, height } = this.cameras.main;
    
    // Submit button
    this.submitBtn = this.add.text(width / 2, 180, 'Submit Guess', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: '#27ae60',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    
    this.submitBtn.on('pointerdown', () => {
      this.submitGuess();
    });
    
    // Santa's Hint button
    this.hintBtn = this.add.text(width / 2, 220, "Santa's Hint", {
      font: '18px Arial',
      fill: '#888',
      backgroundColor: '#333',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setDepth(1);
    
    this.hintBtn.setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerdown', () => {
      this.useSantasHint();
    });
    
    // Back button
    const backBtn = this.add.text(50, height - 50, 'Back', {
      font: '16px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    
    backBtn.on('pointerdown', () => {
      this.scene.start('DifficultySelection');
    });
    
    // Setup touch scroll for history area
    this.setupHistoryScroll();
  }
  
  setupHistoryScroll() {
    const { width, height } = this.cameras.main;
    const historyStartY = 280;
    const historyEndY = height - 100;
    
    // Create invisible touch area for history scrolling
    this.historyTouchArea = this.add.rectangle(width / 2, (historyStartY + historyEndY) / 2, width, historyEndY - historyStartY, 0x000000, 0)
      .setInteractive()
      .setDepth(5); // Above history elements but below game over messages
    
    let startY = 0;
    let isDragging = false;
    
    this.historyTouchArea.on('pointerdown', (pointer) => {
      startY = pointer.y;
      isDragging = true;
    });
    
    this.historyTouchArea.on('pointermove', (pointer) => {
      if (!isDragging) return;
      
      const deltaY = pointer.y - startY;
      const sensitivity = 0.05; // Adjust sensitivity
      
      if (Math.abs(deltaY) > 10) { // Minimum movement threshold
        const scrollDelta = Math.floor(deltaY * sensitivity);
        this.scrollHistory(-scrollDelta); // Negative because we want opposite direction
        startY = pointer.y; // Update start position for continuous scrolling
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
    const maxVisibleRows = Math.floor((this.cameras.main.height - 280 - 100) / rowHeight);
    const totalRows = this.guessHistory.length;
    const maxScrollOffset = Math.max(0, totalRows - maxVisibleRows);
    
    // Update scroll offset with bounds checking
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset + delta));
    
    // Redraw history with new offset
    this.displayGuessHistory();
  }
  
  cycleElement(slotIndex) {
    const currentElement = this.currentGuess[slotIndex];
    const currentIndex = this.elements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % this.elements.length;
    this.currentGuess[slotIndex] = this.elements[nextIndex];
    this.updateCurrentGuessDisplay();
  }
  
  updateCurrentGuessDisplay() {
    this.currentGuessSlots.forEach((slot, index) => {
      slot.text.setText(this.currentGuess[index]);
    });
  }
  
  submitGuess() {
    // Validate guess (all slots filled - they always are with cycling)
    const feedback = this.calculateFeedback(this.currentGuess, this.secretCode);
    
    // Add to history
    this.guessHistory.push([...this.currentGuess]);
    this.feedbackHistory.push(feedback);
    
    // Update guesses remaining
    this.guessesRemaining--;
    this.guessesText.setText(`Guesses: ${this.guessesRemaining}`);
    
    // Auto-scroll to show the newest guess
    const rowHeight = 40;
    const maxVisibleRows = Math.floor((this.cameras.main.height - 280 - 100) / rowHeight);
    const totalRows = this.guessHistory.length;
    if (totalRows > maxVisibleRows) {
      this.historyScrollOffset = totalRows - maxVisibleRows;
    }
    
    // Display guess in history
    this.displayGuessHistory();
    
    // Check if won
    if (feedback.black === this.codeLength) {
      this.gameWon();
      return;
    }
    
    // Check if out of guesses
    if (this.guessesRemaining <= 0) {
      this.gameLost();
      return;
    }
    
    // Calculate and update score
    this.updateScore();
    
    // Check if Santa's Hint should be enabled
    this.checkHintAvailability();
  }
  
  calculateFeedback(guess, code) {
    let black = 0; // Correct element and position
    let white = 0; // Correct element, wrong position
    
    const guessCopy = [...guess];
    const codeCopy = [...code];
    
    // First pass: count black pegs (exact matches)
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        guessCopy.splice(i, 1);
        codeCopy.splice(i, 1);
      }
    }
    
    // Second pass: count white pegs (element exists but wrong position)
    for (let i = 0; i < guessCopy.length; i++) {
      const index = codeCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        white++;
        codeCopy.splice(index, 1);
      }
    }
    
    return { black, white };
  }
  
  displayGuessHistory() {
    // Clear previous history display more thoroughly
    if (this.historyGroup) {
      this.historyGroup.clear(true, true); // Remove and destroy all children
      this.historyGroup.destroy();
    }
    
    // Also clear any orphaned history elements
    if (this.historyElements) {
      this.historyElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
    }
    this.historyElements = [];
    
    this.historyGroup = this.add.group();
    
    const startY = 280;
    const rowHeight = 40;
    const maxVisibleRows = Math.floor((this.cameras.main.height - startY - 100) / rowHeight);
    
    // Calculate which rows to show based on scroll offset
    const totalRows = this.guessHistory.length;
    const maxScrollOffset = Math.max(0, totalRows - maxVisibleRows);
    
    // Ensure scroll offset is within bounds
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset));
    
    // If we have fewer rows than can fit, auto-scroll to show most recent
    if (totalRows <= maxVisibleRows) {
      this.historyScrollOffset = 0;
    }
    
    const startIndex = this.historyScrollOffset;
    const endIndex = Math.min(totalRows, startIndex + maxVisibleRows);
    
    // Base depth for history elements (higher than overlay but lower than current guess)
    const baseDepth = 3;
    
    this.guessHistory.slice(startIndex, endIndex).forEach((guess, displayIndex) => {
      const rowIndex = startIndex + displayIndex;
      const y = startY + displayIndex * rowHeight;
      const feedback = this.feedbackHistory[rowIndex];
      const currentDepth = baseDepth + displayIndex * 0.1; // Slightly increase depth for each row
      
      // Display guess
      guess.forEach((element, colIndex) => {
        const x = 100 + colIndex * 60;
        const slot = this.add.rectangle(x, y, 40, 30, 0x666666)
          .setStrokeStyle(1, 0xffffff)
          .setDepth(currentDepth);
        
        const text = this.add.text(x, y, element, {
          font: '10px Arial',
          fill: '#fff'
        }).setOrigin(0.5).setDepth(currentDepth + 0.01);
        
        this.historyGroup.add(slot);
        this.historyGroup.add(text);
        this.historyElements.push(slot, text);
      });
      
      // Display feedback
      const feedbackX = 100 + this.codeLength * 60 + 40;
      
      // Create background for feedback to improve visibility
      const feedbackBg = this.add.rectangle(feedbackX, y, 60, 25, 0xffffff, 0.9)
        .setStrokeStyle(1, 0x333333)
        .setDepth(currentDepth);
      
      const feedbackText = this.add.text(feedbackX, y, `●${feedback.black} ○${feedback.white}`, {
        font: '12px Arial',
        fill: '#000',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(currentDepth + 0.01);
      
      this.historyGroup.add(feedbackBg);
      this.historyGroup.add(feedbackText);
      this.historyElements.push(feedbackBg, feedbackText);
      
      // Add row number for clarity
      const rowNumberText = this.add.text(50, y, `${rowIndex + 1}`, {
        font: '10px Arial',
        fill: '#aaa'
      }).setOrigin(0.5).setDepth(currentDepth);
      
      this.historyGroup.add(rowNumberText);
      this.historyElements.push(rowNumberText);
    });
    
    // Add enhanced scroll indicators
    if (totalRows > maxVisibleRows) {
      const { width } = this.cameras.main;
      const scrollInfo = `${startIndex + 1}-${endIndex} of ${totalRows}`;
      
      if (startIndex > 0) {
        const upIndicator = this.add.text(width - 50, startY - 20, '↑ Scroll up', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(baseDepth);
        
        this.historyGroup.add(upIndicator);
        this.historyElements.push(upIndicator);
      }
      
      if (endIndex < totalRows) {
        const downIndicator = this.add.text(width - 50, startY + maxVisibleRows * rowHeight + 10, '↓ Scroll down', {
          font: '10px Arial',
          fill: '#fff',
          backgroundColor: '#444',
          padding: { left: 4, right: 4, top: 2, bottom: 2 }
        }).setOrigin(1, 0.5).setDepth(baseDepth);
        
        this.historyGroup.add(downIndicator);
        this.historyElements.push(downIndicator);
      }
      
      // Show current position
      const positionIndicator = this.add.text(width - 50, startY - 40, scrollInfo, {
        font: '10px Arial',
        fill: '#ccc'
      }).setOrigin(1, 0.5).setDepth(baseDepth);
      
      this.historyGroup.add(positionIndicator);
      this.historyElements.push(positionIndicator);
    }
  }
  
  updateScore() {
    // Score calculation: (Max guesses - Used guesses + 1) × Difficulty multiplier
    const usedGuesses = this.maxGuesses - this.guessesRemaining;
    const multiplier = this.codeLength === 4 ? 100 : this.codeLength === 5 ? 150 : 200;
    this.currentScore = (this.maxGuesses - usedGuesses + 1) * multiplier;
    this.scoreText.setText(`Score: ${this.currentScore}`);
  }
  
  checkHintAvailability() {
    if (!this.hintUsed && this.currentScore >= 500) {
      this.hintBtn.setStyle({ fill: '#fff', backgroundColor: '#e74c3c' });
      this.hintText.setText('Hint: Available').setStyle({ fill: '#fff' });
    }
  }
  
  useSantasHint() {
    if (this.hintUsed || this.currentScore < 500) return;
    
    this.hintUsed = true;
    const randomPosition = Math.floor(Math.random() * this.codeLength);
    const revealedElement = this.secretCode[randomPosition];
    
    // Update current guess with the hint
    this.currentGuess[randomPosition] = revealedElement;
    this.updateCurrentGuessDisplay();
    
    // Update UI
    this.hintBtn.setStyle({ fill: '#888', backgroundColor: '#333' });
    this.hintText.setText('Hint: Used').setStyle({ fill: '#888' });
    
    // Visual feedback
    this.add.text(this.cameras.main.width / 2, 250, `Position ${randomPosition + 1}: ${revealedElement}`, {
      font: '16px Arial',
      fill: '#e74c3c'
    }).setOrigin(0.5).setDepth(1);
  }
  
  gameWon() {
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'YOU WON!', {
      font: '36px Arial',
      fill: '#27ae60',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(10);
    
    this.endGame();
  }
  
  gameLost() {
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'GAME OVER', {
      font: '36px Arial',
      fill: '#e74c3c',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(10);
    
    // Show solution
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, `Solution: ${this.secretCode.join(', ')}`, {
      font: '18px Arial',
      fill: '#fff'
    }).setOrigin(0.5).setDepth(10);
    
    this.endGame();
  }
  
  endGame() {
    // Disable interactions
    this.submitBtn.disableInteractive();
    this.hintBtn.disableInteractive();
    this.currentGuessSlots.forEach(slot => slot.slot.disableInteractive());
    
    // Add restart button
    this.time.delayedCall(2000, () => {
      const restartBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Play Again', {
        font: '24px Arial',
        fill: '#fff',
        backgroundColor: '#3498db',
        padding: { left: 16, right: 16, top: 8, bottom: 8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(10);
      
      restartBtn.on('pointerdown', () => {
        this.scene.start('DifficultySelection');
      });
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  scene: [MainMenu, DifficultySelection, GameScene]
};

window.onload = function() {
  new Phaser.Game(config);
};
