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
    
    // Calculate touch area dimensions with proper footer avoidance
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    
    // CRITICAL FIX: Use EXACT same footer calculations as GameScene to avoid overlap
    const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
    const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
    const swipeGestureMargin = 5; // REDUCED: Use same 5px margin as GameScene
    const footerTopY = height - footerHeight - safeAreaInsets.bottom - swipeGestureMargin;
    const historyEndY = footerTopY - 30; // INCREASED buffer to prevent touch overlap with footer
    
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
      // CRITICAL FIX: Ensure we're not in footer area before starting scroll
      const { height } = this.scene.cameras.main;
      const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
      const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
      const swipeGestureMargin = 5; // UPDATED: Use same 5px margin as GameScene
      const footerTopY = height - footerHeight - safeAreaInsets.bottom - swipeGestureMargin;
      
      // Don't start dragging if touch is in or near footer area
      if (pointer.y >= footerTopY - 20) {
        console.log(`🚫 HistoryScroller: Ignoring touch in footer area (y=${pointer.y}, footerTopY=${footerTopY})`);
        return;
      }
      
      this.startY = pointer.y;
      this.isDragging = true;
    });
    
    this.historyTouchArea.on('pointermove', (pointer) => {
      if (!this.isDragging) return;
      
      // CRITICAL FIX: Stop dragging if we move into footer area
      const { height } = this.scene.cameras.main;
      const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
      const safeAreaInsets = this.scene.safeAreaManager ? this.scene.safeAreaManager.getInsets() : { bottom: 0 };
      const swipeGestureMargin = 5; // UPDATED: Use same 5px margin as GameScene
      const footerTopY = height - footerHeight - safeAreaInsets.bottom - swipeGestureMargin;
      
      if (pointer.y >= footerTopY - 20) {
        console.log(`🚫 HistoryScroller: Stopping drag in footer area (y=${pointer.y}, footerTopY=${footerTopY})`);
        this.isDragging = false;
        return;
      }
      
      const deltaY = pointer.y - this.startY;
      const sensitivity = 0.05;
      
      // CRITICAL FIX: Only process significant movements to prevent unnecessary refreshes
      if (Math.abs(deltaY) > 10) {
        const scrollDelta = Math.floor(deltaY * sensitivity);
        
        // CRITICAL FIX: Only call scrollHistory if there's actually a meaningful delta
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
    const isSmallScreen = width < 500;
    const baseHeaderHeight = isSmallScreen ? 140 : 120;
    const historyStartY = Math.max(baseHeaderHeight, height * 0.22);
    
    // MOBILE EXPERT DESIGN: Use optimized footer height for better positioning
    const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME; // Now 150px
    const bottomMargin = footerHeight + 15; // Reduced buffer for closer positioning 
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD; // Now 75px for larger elements
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
    
    // EXPERT UX: Legend removed - no legend space calculations needed
    // Mobile space optimization: Reclaimed 65px for better layout
    
    // History starts below header only - legend space reclaimed
    const historyStartY = Math.max(
      baseHeaderHeight, 
      layout.contentStartY,
      headerBottomY + 10 // Minimal padding since legend removed
    );
    
    const rowHeight = LayoutConfig.HISTORY_ROW_HEIGHT_STANDARD; // Use updated 75px height
    const guessHistory = this.historyManager.getGuessHistory();
    
    // CRITICAL FIX: Calculate active row position AFTER the last completed guess
    const completedGuessesHeight = guessHistory.length * rowHeight;
    const lastCompletedGuessY = historyStartY + completedGuessesHeight;
    const activeRowSeparation = 15; // Extra space between completed guesses and active row
    const activeRowY = lastCompletedGuessY + activeRowSeparation;
    
    // MOBILE EXPERT FIX: Use optimized footer spacing for closer positioning
    const footerHeight = LayoutConfig.FOOTER_HEIGHT_GAME;
    const footerBuffer = 25; // Reduced for closer footer positioning
    const historyEndY = height - footerHeight - footerBuffer; // Respect footer and add buffer
    
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