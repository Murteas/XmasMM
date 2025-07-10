// HistoryManager.js - Core coordination for history management (refactored)

class HistoryManager {
  constructor(scene) {
    this.scene = scene;
    this.guessHistory = [];
    this.feedbackHistory = [];
    
    // Initialize specialized managers
    this.renderer = new HistoryRenderer(scene, this);
    this.scroller = new HistoryScroller(scene, this);
    this.activeRowManager = new ActiveRowManager(scene, this);
  }

  // Delegation methods to specialized managers
  scrollHistory(delta) {
    this.scroller.scrollHistory(delta);
  }

  getScrollOffset() {
    return this.scroller.getScrollOffset();
  }

  scrollToActiveRow() {
    this.scroller.scrollToActiveRow();
  }

  createActiveRow(prefillGuess = null) {
    return this.activeRowManager.createActiveRow(prefillGuess);
  }

  submitActiveRowGuess() {
    return this.activeRowManager.submitActiveRowGuess();
  }

  getActiveRowGuess() {
    return this.activeRowManager.getActiveRowGuess();
  }

  removeActiveRow() {
    this.activeRowManager.removeActiveRow();
  }

  updateActiveRowPosition() {
    this.activeRowManager.updateActiveRowPosition();
  }

  selectElement(slotIndex, element) {
    this.activeRowManager.selectElement(slotIndex, element);
  }

  get hasActiveRow() {
    return this.activeRowManager.hasActiveRow;
  }

  // Core history management methods
  addGuess(guess, feedback) {
    this.guessHistory.push([...guess]);
    this.feedbackHistory.push(feedback);
    
    // Auto-scroll to show the newest guess
    this.scroller.autoScrollToNewest();
    this.refreshDisplay();
    
    // Update active row position if it exists
    if (this.hasActiveRow) {
      this.updateActiveRowPosition();
    }
  }

  refreshDisplay() {
    const validatedScrollOffset = this.renderer.displayGuessHistory(
      this.guessHistory, 
      this.feedbackHistory, 
      this.scroller.getScrollOffset()
    );
    
    // Update scroller with validated offset
    this.scroller.setScrollOffset(validatedScrollOffset);
  }

  displayGuessHistory() {
    this.refreshDisplay();
  }

  // Data access methods
  getGuessCount() {
    return this.guessHistory.length;
  }

  getGuessHistory() {
    return [...this.guessHistory];
  }

  getFeedbackHistory() {
    return [...this.feedbackHistory];
  }

  // Lifecycle methods
  reset() {
    this.guessHistory = [];
    this.feedbackHistory = [];
    
    this.renderer.reset();
    this.scroller.reset();
    this.activeRowManager.reset();
  }

  destroy() {
    this.reset();
    this.scroller.destroy();
    this.activeRowManager.destroy();
  }
}
