// HistoryManager.js - Core coordination for history management (refactored)

class HistoryManager {
  constructor(scene, deductionEngine = null, constraintSolver = null) {
    this.scene = scene;
    this.guessHistory = [];
    this.feedbackHistory = [];

    // Initialize specialized managers (SLIDING WINDOW: No scroller needed)
    this.renderer = new HistoryRenderer(scene, this);
    this.activeRowManager = new ActiveRowManager(scene, this, deductionEngine, constraintSolver);
  }

  // REMOVED: Scroll-related methods no longer needed with sliding window approach
  // scrollHistory, getScrollOffset, scrollToActiveRow, adjustScrollForVisibility

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

  // REMOVED: updateActiveRowPosition() - no longer needed with sliding window approach

  selectElement(slotIndex, element) {
    this.activeRowManager.selectElement(slotIndex, element);
  }

  // === DEBUG HELPER METHODS ===
  
  fillActiveRowWithElements(elements) {
    this.activeRowManager.fillAllElements(elements);
  }

  get hasActiveRow() {
    return this.activeRowManager.hasActiveRow;
  }

  // Core history management methods
  addGuess(guess, feedback) {
    this.guessHistory.push([...guess]);
    this.feedbackHistory.push(feedback);

    // Refresh display to show new guess
    this.refreshDisplay();

    // Recalculate content height for scroll bounds after new guess added
    if (this.scene.calculateTotalContentHeight) {
      this.scene.calculateTotalContentHeight();
    }

    // Auto-scroll to ensure active row is visible
    if (this.scene.scrollToActiveRow) {
      this.scene.scrollToActiveRow();
    }
  }

  refreshDisplay() {
    // SLIDING WINDOW: Simple display refresh - no scroll offset management
    this.renderer.displayGuessHistory(
      this.guessHistory, 
      this.feedbackHistory
    );
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

  getLastGuess() {
    return this.guessHistory.length > 0 ? [...this.guessHistory[this.guessHistory.length - 1]] : null;
  }

  // Lifecycle methods
  reset() {
    this.guessHistory = [];
    this.feedbackHistory = [];

    this.renderer.reset();
    this.activeRowManager.reset();
  }

  destroy() {
    this.reset();
    this.activeRowManager.destroy();
  }
}
