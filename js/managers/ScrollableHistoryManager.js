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
    
    this.setupIntegration();
    
    console.log('🎯 ScrollableHistoryManager initialized with direct Phaser containers');
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
    
    // Note: Footer migration (active row) will happen when createActiveRow is called
    
    console.log('🔄 UI elements migrated to Phaser container system (footer elements will migrate when active row is created)');
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
    
    console.log('🔍 migrateFooterElements DEBUG:');
    console.log('  - activeRowManager exists:', !!this.historyManager.activeRowManager);
    console.log('  - hasActiveRow:', this.historyManager.activeRowManager?.hasActiveRow);
    console.log('  - activeRowBackground:', !!this.historyManager.activeRowManager?.activeRowBackground);
    console.log('  - activeRowElements:', this.historyManager.activeRowManager?.activeRowElements?.length);
    
    // Direct Phaser container usage - add active row elements to footer
    if (this.historyManager.activeRowManager && this.historyManager.activeRowManager.hasActiveRow) {
      console.log('✅ Adding active row directly to footer container');
      this.addActiveRowToFooter(footerContainer);
    } else {
      console.log('❌ NOT adding active row - conditions not met');
    }

    // Add other controls directly to footer
    this.addControlsToFooter(footerContainer);
    
    console.log('⬇️ Active row and controls added directly to footer container');
  }
  
  addActiveRowToFooter(footerContainer) {
    const activeRowMgr = this.historyManager.activeRowManager;
    
    // Create a container for active row elements (for compatibility with debug scripts)
    this.activeRowContainer = this.scene.add.container(0, 0);
    
    // Direct addition to footer container - position elements at top of footer for visibility
    const activeRowY = 10; // Position near top of footer container
    
    if (activeRowMgr.activeRowBackground) {
      activeRowMgr.activeRowBackground.y = activeRowY;
      footerContainer.add(activeRowMgr.activeRowBackground);
      console.log('📦 Added background to footer at Y:', activeRowY);
    }
    
    if (activeRowMgr.activeRowGlowEffect) {
      activeRowMgr.activeRowGlowEffect.y = activeRowY;
      footerContainer.add(activeRowMgr.activeRowGlowEffect);
      console.log('✨ Added glow to footer at Y:', activeRowY);
    }
    
    if (activeRowMgr.activeRowElements) {
      activeRowMgr.activeRowElements.forEach(element => {
        if (element.slot) {
          element.slot.y = activeRowY;
          footerContainer.add(element.slot);
        }
        if (element.displayElement) {
          element.displayElement.y = activeRowY;
          footerContainer.add(element.displayElement);
        }
      });
      console.log(`🎰 Added ${activeRowMgr.activeRowElements.length} slots to footer at Y:`, activeRowY);
    }
    
    if (activeRowMgr.activeRowSubmitBtn) {
      activeRowMgr.activeRowSubmitBtn.y = activeRowY;
      footerContainer.add(activeRowMgr.activeRowSubmitBtn);
      console.log('📤 Added submit button to footer at Y:', activeRowY);
    }
    
    // Force footer and all children to be visible
    footerContainer.setVisible(true);
    footerContainer.setAlpha(1.0);
    
    // Set activeRowContainer visibility to match footer
    this.activeRowContainer.setVisible(true);
    this.activeRowContainer.setAlpha(1.0);
    
    console.log('🎯 Active row added directly to footer container at Y:', activeRowY);
  }
  
  addControlsToFooter(footerContainer) {
    // Find other game controls and add directly to footer
    const controls = this.scene.children.list.filter(child => 
      child.getData && child.getData('uiType') === 'gameControl'
    );
    
    controls.forEach(control => {
      control.y = 65; // Position below active row
      footerContainer.add(control);
    });
    
    console.log(`🎮 Added ${controls.length} controls directly to footer`);
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
  
  // === SCROLL CONTROL METHODS ===
  
  scrollToActiveRow() {
    // Active row is in fixed footer, so just scroll to show last completed guess
    this.scrollService.scrollToBottom(true);
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
    
    // Destroy embedded history manager
    if (this.historyManager) {
      this.historyManager.destroy();
    }
    
    console.log('🧹 ScrollableHistoryManager destroyed');
  }
  
  // === ACTIVE ROW MANAGER DELEGATION ===
  get activeRowManager() {
    return this.historyManager.activeRowManager;
  }

  get hasActiveRow() {
    return this.historyManager.hasActiveRow;
  }

  submitActiveRowGuess() {
    return this.historyManager.submitActiveRowGuess();
  }

  getActiveRowGuess() {
    return this.historyManager.getActiveRowGuess();
  }

  removeActiveRow() {
    this.historyManager.removeActiveRow();
  }

  selectElement(slotIndex, element) {
    this.historyManager.selectElement(slotIndex, element);
  }

  scrollHistory(delta) {
    this.historyManager.scrollHistory(delta);
  }

  // === CORE HISTORYMANAGER API DELEGATION ===
  
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
    console.log('🎯 ScrollableHistoryManager.createActiveRow() called');
    
    // Delegate to internal HistoryManager first
    this.historyManager.createActiveRow(lastGuess);
    
    console.log('🎯 After historyManager.createActiveRow() - hasActiveRow:', this.historyManager.activeRowManager?.hasActiveRow);
    
    // Now add active row directly to footer container
    this.migrateFooterElements();
    
    console.log('🎯 After migrateFooterElements() - using direct Phaser containers');
    
    return this.scrollService.getFooterContainer();
  }
  
  calculateActiveRowPosition() {
    // Return footer position (for compatibility with existing code)
    const footerContainer = this.scrollService.getFooterContainer();
    return footerContainer.y + 20; // 20px offset within footer
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
