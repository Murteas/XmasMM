// ScrollableHistoryManager.js - Integrates with Phaser MobileScrollService
// Replaces complex positioning calculations with Phaser container system

class ScrollableHistoryManager {
  constructor(scene) {
    this.scene = scene;
    
    // Create embedded HistoryManager for business logic compatibility
    this.historyManager = new HistoryManager(scene);
    
    // Initialize mobile scroll service with Phaser containers
    this.scrollService = new MobileScrollService(scene, {
      headerHeight: 140,
      footerHeight: 120,
      rowHeight: 60,
      scrollSensitivity: 1.0,
      momentum: 0.95
    });
    
    // Row containers for efficient management
    this.rowContainers = [];
    this.activeRowContainer = null;
    
    this.setupIntegration();
    
    console.log('🎯 ScrollableHistoryManager initialized with Phaser containers');
  }
  
  setupIntegration() {
    // Listen to scroll events for debugging and optimization
    this.scrollService.on('scroll', this.handleScroll.bind(this));
    this.scrollService.on('contentAdded', this.handleContentAdded.bind(this));
    
    // Move existing UI elements to appropriate containers
    this.migrateExistingUI();
  }
  
  migrateExistingUI() {
    // Move header elements (title, legend) to header container
    this.migrateHeaderElements();
    
    // Move existing history to scrollable content
    this.migrateHistoryElements();
    
    // Move active row and submit button to footer
    this.migrateFooterElements();
    
    console.log('🔄 UI elements migrated to Phaser container system');
  }
  
  migrateHeaderElements() {
    const headerContainer = this.scrollService.getHeaderContainer();
    
    // Find and move title elements
    const titleElements = this.scene.children.list.filter(child => 
      child.getData && child.getData('uiType') === 'title'
    );
    
    titleElements.forEach(element => {
      headerContainer.add(element);
    });
    
    console.log(`� Moved ${titleElements.length} header elements to container`);
  }
  
  migrateHistoryElements() {
    const contentContainer = this.scrollService.getContentContainer();
    
    // Get existing history from HistoryRenderer
    if (this.historyManager.historyRenderer) {
      const historyElements = this.historyManager.historyRenderer.historyElements || [];
      
      historyElements.forEach((rowData, index) => {
        this.createRowContainer(rowData, index);
      });
    }
    
    console.log(`📜 Migrated ${this.rowContainers.length} history rows to scrollable container`);
  }
  
  migrateFooterElements() {
    const footerContainer = this.scrollService.getFooterContainer();
    
    // Move active row to footer (always visible)
    if (this.historyManager.activeRowManager) {
      this.createActiveRowInFooter();
    }
    
    // Move submit button and other controls to footer
    this.moveControlsToFooter();
    
    console.log('⬇️ Active row and controls moved to fixed footer');
  }
  
  createRowContainer(rowData, index) {
    const rowContainer = this.scene.add.container(0, index * 60);
    
    // Add guess elements to row container
    if (rowData.elements) {
      rowData.elements.forEach(element => {
        rowContainer.add(element);
      });
    }
    
    // Add feedback elements to row container  
    if (rowData.feedbackElements) {
      rowData.feedbackElements.forEach(element => {
        rowContainer.add(element);
      });
    }
    
    // Add row to scrollable content
    this.scrollService.addContent(rowContainer);
    this.rowContainers[index] = rowContainer;
    
    return rowContainer;
  }
  
  createActiveRowInFooter() {
    const footerContainer = this.scrollService.getFooterContainer();
    const safeArea = this.scrollService.safeAreaManager.getInsets();
    
    // Calculate responsive positioning within footer using Phaser-native safe area
    const footerContentTop = 15; // Top margin within footer
    const activeRowY = footerContentTop; // Safe positioning from footer top
    
    // Create active row container in footer (always visible)
    this.activeRowContainer = this.scene.add.container(0, activeRowY);
    
    // Move existing active row elements to footer container
    if (this.historyManager.activeRowManager.activeRowElements) {
      this.historyManager.activeRowManager.activeRowElements.forEach(element => {
        if (element.slot) {
          element.slot.y = 0; // Reset Y since container handles positioning
          this.activeRowContainer.add(element.slot);
        }
      });
    }
    
    // Add active row background to footer
    if (this.historyManager.activeRowManager.activeRowBackground) {
      this.historyManager.activeRowManager.activeRowBackground.y = 0;
      this.activeRowContainer.add(this.historyManager.activeRowManager.activeRowBackground);
    }
    
    footerContainer.add(this.activeRowContainer);
    
    console.log(`🎯 Active row created in footer at Y:${activeRowY} (Phaser-native safe area bottom: ${safeArea.bottom}px)`);
  }
  
  moveControlsToFooter() {
    const footerContainer = this.scrollService.getFooterContainer();
    const safeArea = this.scrollService.safeAreaManager.getInsets();
    
    // Calculate responsive button position within footer using Phaser-native safe area
    const buttonY = 65; // Position below active row, above safe area
    
    // Find submit button and other controls
    const controls = this.scene.children.list.filter(child => 
      child.getData && (
        child.getData('uiType') === 'submitButton' ||
        child.getData('uiType') === 'gameControl'
      )
    );
    
    controls.forEach(control => {
      control.y = buttonY; // Responsive position in footer
      footerContainer.add(control);
    });
    
    console.log(`🎮 Moved ${controls.length} controls to footer at Y:${buttonY} (Phaser-native safe from ${safeArea.bottom}px bottom inset)`);
  }
  
  // === HISTORY MANAGEMENT (Replaces complex positioning) ===
  
  addGuess(guess, feedback) {
    // Use existing history manager logic
    this.historyManager.addGuess(guess, feedback);
    
    // Create new row container for this guess
    const rowIndex = this.historyManager.getGuessCount() - 1;
    const rowData = this.createRowFromGuess(guess, feedback, rowIndex);
    const rowContainer = this.createRowContainer(rowData, rowIndex);
    
    // Auto-scroll to show new content (smooth Phaser animation)
    this.scrollService.scrollToBottom(true);
    
    console.log(`➕ Added guess ${rowIndex + 1} to scrollable history`);
  }
  
  createRowFromGuess(guess, feedback, index) {
    // Create visual elements for the guess row
    const elements = [];
    const feedbackElements = [];
    
    // Create guess element sprites/graphics
    guess.forEach((element, slotIndex) => {
      const sprite = this.scene.add.sprite(
        30 + (slotIndex * 70), // X position within row
        0, // Y handled by container
        'elements',
        element
      );
      sprite.setScale(0.8);
      elements.push(sprite);
    });
    
    // Create feedback elements
    const feedbackX = 350;
    for (let i = 0; i < feedback.black; i++) {
      const blackPeg = this.scene.add.circle(feedbackX + (i * 15), 0, 5, 0x000000);
      feedbackElements.push(blackPeg);
    }
    
    for (let i = 0; i < feedback.white; i++) {
      const whitePeg = this.scene.add.circle(feedbackX + ((feedback.black + i) * 15), 0, 5, 0xffffff);
      feedbackElements.push(whitePeg);
    }
    
    return { elements, feedbackElements };
  }
  
  // === INTEGRATION WITH EXISTING SYSTEM ===
  
  refreshDisplay() {
    // Delegate to existing history manager for business logic
    this.historyManager.refreshDisplay();
    
    // Refresh container layout
    this.updateScrollableContent();
  }
  
  updateScrollableContent() {
    // Clear existing containers
    this.rowContainers.forEach(container => {
      if (container) container.destroy();
    });
    this.rowContainers = [];
    
    // Recreate from current history
    const guessHistory = this.historyManager.getGuessHistory();
    const feedbackHistory = this.historyManager.getFeedbackHistory();
    
    guessHistory.forEach((guess, index) => {
      const feedback = feedbackHistory[index];
      const rowData = this.createRowFromGuess(guess, feedback, index);
      this.createRowContainer(rowData, index);
    });
    
    console.log('� Scrollable content refreshed');
  }
  
  // === ACTIVE ROW MANAGEMENT (No More Position Calculations!) ===
  
  updateActiveRowPosition() {
    // No complex calculations needed! Active row is in fixed footer
    console.log('🎯 Active row position update: Using fixed footer (no calculations needed)');
    
    // Just ensure active row is visible and properly styled
    if (this.activeRowContainer) {
      this.activeRowContainer.setVisible(true);
      this.activeRowContainer.setAlpha(1.0);
    }
  }
  
  calculateActiveRowPosition() {
    // Return footer position (for compatibility with existing code)
    const footerContainer = this.scrollService.getFooterContainer();
    return footerContainer.y + 20; // 20px offset within footer
  }
  
  // === SCROLL CONTROL METHODS ===
  
  scrollToActiveRow() {
    // Active row is in fixed footer, so just scroll to show last completed guess
    this.scrollService.scrollToBottom(true);
  }
  
  getScrollOffset() {
    return this.scrollService.scrollY;
  }
  
  // === EVENT HANDLERS ===
  
  handleScroll(event) {
    console.log(`📜 Scrolled to ${event.y}px (${(event.progress * 100).toFixed(1)}%)`);
  }
  
  handleContentAdded(event) {
    console.log('📋 Content added to scroll area');
  }
  
  // === CLEANUP ===
  
  destroy() {
    // Clean up row containers
    this.rowContainers.forEach(container => {
      if (container) container.destroy();
    });
    
    // Destroy scroll service
    if (this.scrollService) {
      this.scrollService.destroy();
    }
    
    console.log('🧹 ScrollableHistoryManager destroyed');
  }
  
  // === HISTORYMANAGER API DELEGATION ===
  // Make ScrollableHistoryManager a drop-in replacement for HistoryManager
  
  getGuessHistory() {
    return this.historyManager.getGuessHistory();
  }
  
  getFeedbackHistory() {
    return this.historyManager.getFeedbackHistory();
  }
  
  getGuessCount() {
    return this.historyManager.getGuessCount();
  }
  
  createActiveRow(lastGuess = null) {
    // Delegate to internal HistoryManager first
    this.historyManager.createActiveRow(lastGuess);
    
    // Then move to our footer container
    this.createActiveRowInFooter();
  }
  
  updateActiveRowPosition() {
    // No complex calculations needed! Active row is in fixed footer
    console.log('🎯 Active row position update: Using fixed footer (no calculations needed)');
    
    // Just ensure active row is visible and properly styled
    if (this.activeRowContainer) {
      this.activeRowContainer.setVisible(true);
      this.activeRowContainer.setAlpha(1.0);
    }
  }
  
  getScrollOffset() {
    return this.scrollService.scrollY;
  }

  // === END DELEGATION ===
}

// Export for browser use (like other manager classes)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollableHistoryManager;
} else {
  // Ensure global availability in browser
  window.ScrollableHistoryManager = ScrollableHistoryManager;
}
