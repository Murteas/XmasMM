// HistoryScroller.js - Handles history scrolling functionality

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
    
    // Calculate touch area dimensions
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    const bottomMargin = isSmallScreen ? 60 : 80;
    const historyEndY = height - bottomMargin;
    
    // Create invisible touch area for history scrolling
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
      
      if (Math.abs(deltaY) > 10) {
        const scrollDelta = Math.floor(deltaY * sensitivity);
        this.scrollHistory(-scrollDelta);
        this.startY = pointer.y;
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
    const guessHistory = this.historyManager.getGuessHistory();
    const hasActiveRow = this.historyManager.hasActiveRow;
    
    if (guessHistory.length === 0 && !hasActiveRow) return;
    
    const scrollParams = this.calculateScrollParameters();
    const maxScrollOffset = this.calculateMaxScrollOffset(scrollParams, guessHistory.length, hasActiveRow);
    
    this.historyScrollOffset = Math.max(0, Math.min(maxScrollOffset, this.historyScrollOffset + delta));
    
    // Notify history manager to refresh display
    this.historyManager.refreshDisplay();
    
    // Update active row position if it exists
    if (hasActiveRow) {
      this.historyManager.updateActiveRowPosition();
    }
  }

  calculateScrollParameters() {
    const { width, height } = this.scene.cameras.main;
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    const bottomMargin = isSmallScreen ? 60 : 80;
    const rowHeight = 60;
    const maxVisibleRows = Math.floor((height - historyStartY - bottomMargin) / rowHeight);
    
    return {
      historyStartY,
      bottomMargin,
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
    
    // Use mobile viewport for proper device simulation support
    const viewport = GameUtils.getMobileViewport();
    const { width, height } = viewport;
    const layout = GameUtils.getResponsiveLayout(width, height);
    
    const isSmallScreen = width < 500;
    const isVerySmallScreen = width < 400;
    
    // Calculate header layout (consistent with ActiveRowManager)
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const headerBottomY = isVerySmallScreen ? 145 : (isSmallScreen ? 120 : 95);
    
    // Account for Christmas legend space
    const legendItemHeight = 20;
    const legendItems = 2;
    const legendHeight = (legendItems * legendItemHeight) + 25;
    const legendSpacing = 10;
    
    // History starts below header and legend
    const historyStartY = Math.max(
      baseHeaderHeight, 
      layout.contentStartY,
      headerBottomY + legendSpacing + legendHeight + 15
    );
    
    const rowHeight = 60;
    const guessHistory = this.historyManager.getGuessHistory();
    
    // CRITICAL FIX: Calculate active row position AFTER the last completed guess
    const completedGuessesHeight = guessHistory.length * rowHeight;
    const lastCompletedGuessY = historyStartY + completedGuessesHeight;
    const activeRowSeparation = 15; // Extra space between completed guesses and active row
    const activeRowY = lastCompletedGuessY + activeRowSeparation;
    
    // Use safe area aware bottom boundary
    const historyEndY = layout.contentEndY - 30; // Respect safe area bottom
    
    // Check if active row needs scrolling with better logic
    const activeRowBottomY = activeRowY + 30; // Account for active row height
    
    if (activeRowBottomY > historyEndY) {
      // Calculate scroll needed to fit active row properly in safe area
      const targetScroll = activeRowBottomY - historyEndY + 20; // Extra margin
      this.historyScrollOffset = Math.max(0, targetScroll);
      
      console.log(`🔄 Mobile scroll adjustment: activeRowY=${activeRowY}, historyEndY=${historyEndY}, scroll=${this.historyScrollOffset}`);
      
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