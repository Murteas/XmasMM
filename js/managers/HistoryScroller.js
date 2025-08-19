// HistoryScroller.js - Handles history scrolling functionality
// Uses global LayoutConfig (loaded via ModuleLoader)

class HistoryScroller {
  constructor(scene, historyManager) {
    this.scene = scene;
    this.historyManager = historyManager;
    this.historyScrollOffset = 0;
    this.historyTouchArea = null;
    this.isDragging = false;
    this.startY = 0;
    
    this.setupHistoryScroll();
  }

  setupHistoryScroll() {
    const { width, height } = this.scene.cameras.main;
    
    // UNIFIED SCROLLABLE LAYOUT: Full-height touch area with no footer constraints
    const headerHeight = LayoutConfig.THREE_ZONE_HEADER;
    const historyStartY = headerHeight;
    const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
    const historyEndY = height - safeAreaInsets.bottom; // Use full available height
    
    // Create invisible touch area for history scrolling covering full scrollable area
    this.historyTouchArea = this.scene.add.rectangle(
      width / 2, 
      (historyStartY + historyEndY) / 2, 
      width, 
      historyEndY - historyStartY, 
      0x000000, 
      0
    ).setDepth(GameUtils.getDepthLayers().TOUCH_AREA)
     .setInteractive(); // Make it interactive to receive pointer events
    
    this.setupTouchEvents();
    
    if (TestConfig.shouldShowDebugLogs()) {
      console.log('📱 Unified scrollable touch area created');
      console.log(`  - Full height: ${historyStartY} to ${historyEndY} (${historyEndY - historyStartY}px)`);
      console.log(`  - No footer constraints`);
    }
  }

  setupTouchEvents() {
    this.historyTouchArea.on('pointerdown', (pointer) => {
      this.startY = pointer.y;
      this.isDragging = true;
    });
    
    this.historyTouchArea.on('pointermove', (pointer) => {
      if (!this.isDragging) return;
      
      const deltaY = pointer.y - this.startY;
      const sensitivity = 0.05;
      
      // Only process significant movements to prevent unnecessary refreshes
      if (Math.abs(deltaY) > 10) {
        const scrollDelta = Math.floor(deltaY * sensitivity);
        
        // Only call scrollHistory if there's actually a meaningful delta
        if (Math.abs(scrollDelta) > 0) {
          this.scrollHistory(-scrollDelta);
          this.startY = pointer.y;
        }
      }
    });
    
    this.historyTouchArea.on('pointerup', () => {
      this.isDragging = false;
    });
    
    this.historyTouchArea.on('pointerout', () => {
      this.isDragging = false;
    });
  }

  scrollHistory(delta) {
    // CRITICAL FIX: Don't process meaningless scroll deltas
    if (Math.abs(delta) === 0) {
      console.log('🔧 DEBUG: Ignoring zero delta scroll');
      return;
    }
    
    // CRITICAL DEBUG: Track scroll events that might be causing active row issues
    console.log('🔧 DEBUG: scrollHistory() called with delta:', delta);
    console.log('🔧 DEBUG: isDragging:', this.isDragging);
    
    const guessHistory = this.historyManager.getGuessHistory();
    const hasActiveRow = this.historyManager.hasActiveRow;
    
    console.log('🔧 DEBUG: guessHistory.length:', guessHistory.length, 'hasActiveRow:', hasActiveRow);
    
    if (guessHistory.length === 0 && !hasActiveRow) return;
    
    const scrollParams = this.calculateScrollParameters();
    const maxScrollOffset = this.calculateMaxScrollOffset(scrollParams, guessHistory.length, hasActiveRow);
    
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset + delta));
    
    console.log('🔧 DEBUG: Before refreshDisplay() - hasActiveRow:', hasActiveRow);
    
    // Notify history manager to refresh display
    this.historyManager.refreshDisplay();
    
    console.log('🔧 DEBUG: After refreshDisplay() - hasActiveRow:', this.historyManager.hasActiveRow);
    
    // Update active row position if it exists
    if (hasActiveRow) {
      console.log('🔧 DEBUG: Calling updateActiveRowPosition() - confirming hasActiveRow:', this.historyManager.hasActiveRow);
      if (this.historyManager.hasActiveRow) {
        this.historyManager.updateActiveRowPosition();
      } else {
        console.log('🚨 CRITICAL: hasActiveRow mismatch! Local hasActiveRow=true but historyManager.hasActiveRow=false');
      }
    } else {
      console.log('🔧 DEBUG: Skipping updateActiveRowPosition() - no active row');
    }
  }

  calculateScrollParameters() {
    const { width, height } = this.scene.cameras.main;
    const headerHeight = LayoutConfig.THREE_ZONE_HEADER;
    const historyStartY = headerHeight + 20; // Space below header
    
    // UNIFIED SCROLLABLE LAYOUT: Use full available height with safe area consideration
    const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
    const availableHeight = height - historyStartY - safeAreaInsets.bottom - 20; // Small margin
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;
    const maxVisibleRows = Math.floor(availableHeight / rowHeight);
    
    return {
      historyStartY,
      availableHeight,
      rowHeight,
      maxVisibleRows
    };
  }

  calculateMaxScrollOffset(scrollParams, guessHistoryLength, hasActiveRow) {
    const totalRows = guessHistoryLength + (hasActiveRow ? 1 : 0);
    const maxScrollRange = (totalRows * scrollParams.rowHeight) - (scrollParams.maxVisibleRows * scrollParams.rowHeight);
    return Math.max(0, maxScrollRange);
  }

  autoScrollToNewest() {
    const guessHistory = this.historyManager.getGuessHistory();
    const hasActiveRow = this.historyManager.hasActiveRow;
    
    const scrollParams = this.calculateScrollParameters();
    const totalRows = guessHistory.length + (hasActiveRow ? 1 : 0);
    const maxScrollRange = (totalRows * scrollParams.rowHeight) - (scrollParams.maxVisibleRows * scrollParams.rowHeight);
    
    if (maxScrollRange > 0) {
      this.historyScrollOffset = Math.max(0, maxScrollRange);
    }
  }

  scrollToActiveRow() {
    const hasActiveRow = this.historyManager.hasActiveRow;
    if (!hasActiveRow) return;
    
    // UNIFIED SCROLLABLE LAYOUT: Use container-relative coordinates
    const { width, height } = this.scene.cameras.main;
    const isSmallScreen = width < 500;
    const isVerySmallScreen = width < 400;
    
    // Use same coordinate system as HistoryRenderer and ActiveRowManager
    const baseStartY = isSmallScreen ? 20 : 15;
    const containerRelativeY = isVerySmallScreen ? 25 : baseStartY;
    const historyStartY = Math.max(containerRelativeY, height * 0.02);
    
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD;
    const guessHistory = this.historyManager.getGuessHistory();
    
    // Calculate active row position after completed guesses (match ActiveRowManager calculation)
    const completedGuessesHeight = guessHistory.length * rowHeight;
    const scrollOffset = this.historyScrollOffset;
    const activeRowY = historyStartY + completedGuessesHeight - scrollOffset + 10;
    
    // Ensure active row AND element bar are visible within available space
    const activeRowHeight = 45; // Height of active row elements
    const elementBarHeight = 50; // Height of element selection bar
    const activeAreaReserved = activeRowHeight + elementBarHeight + 20; // Total space needed
    const maxVisibleY = height - activeAreaReserved;
    
    if (activeRowY > maxVisibleY) {
      const targetScroll = activeRowY - maxVisibleY + 10; // Reduced extra margin
      this.historyScrollOffset = Math.max(0, targetScroll);
      
      console.log(`🔄 Unified scroll adjustment: activeRowY=${activeRowY}, maxVisibleY=${maxVisibleY}, scroll=${this.historyScrollOffset}`);
      
      this.historyManager.refreshDisplay();
      this.historyManager.updateActiveRowPosition();
    }
  }

  getScrollOffset() {
    return this.historyScrollOffset;
  }

  setScrollOffset(offset) {
    this.historyScrollOffset = Math.max(0, offset);
  }

  reset() {
    this.historyScrollOffset = 0;
    this.isDragging = false;
    this.startY = 0;
    
    if (this.historyTouchArea) {
      this.historyTouchArea.destroy();
      this.historyTouchArea = null;
    }
  }

  destroy() {
    this.reset();
  }
}