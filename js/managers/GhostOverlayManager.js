// GhostOverlayManager.js - Visual logic hint system
// Renders mini-grids of possible elements inside active row slots

class GhostOverlayManager {
  /**
   * Create a new ghost overlay manager
   * @param {Phaser.Scene} scene - The game scene
   * @param {ActiveRowManager} activeRowManager - Reference to active row manager
   * @param {ConstraintSolver} constraintSolver - Reference to constraint solver (100% accurate)
   */
  constructor(scene, activeRowManager, constraintSolver) {
    this.scene = scene;
    this.activeRowManager = activeRowManager;
    this.constraintSolver = constraintSolver;
    this.ghostContainers = [];  // One container per slot
    this.isActive = false;

    console.log('👻 GhostOverlayManager initialized (using ConstraintSolver)');
  }

  /**
   * Create ghost overlays for all slots in the active row
   * @param {number} codeLength - Number of positions in the code
   * @param {Array<Object>} slotPositions - Array of {x, y} positions for each slot
   */
  createGhostOverlays(codeLength, slotPositions) {
    // Clean up any existing ghosts first
    this.destroy();

    this.ghostContainers = [];

    for (let i = 0; i < codeLength; i++) {
      const slotX = slotPositions[i].x;
      const slotY = slotPositions[i].y;

      // Create container for this slot's ghosts
      const ghostContainer = this.scene.add.container(slotX, slotY);
      ghostContainer.setDepth(3.5);  // Below slots (5.0) but above row background (3.1)

      // Add to scrollable container so ghosts scroll with the game
      this.scene.scrollableContainer.add(ghostContainer);

      this.ghostContainers.push(ghostContainer);
    }

    this.isActive = true;

    // Initial render of all ghosts
    this.updateAllGhosts();
  }

  /**
   * Update ghosts for a specific slot based on current deductions
   * @param {number} slotIndex - Index of the slot to update
   */
  updateSlotGhosts(slotIndex) {
    if (!this.isActive || slotIndex < 0 || slotIndex >= this.ghostContainers.length) {
      return;
    }

    const container = this.ghostContainers[slotIndex];

    // Clear existing ghosts from this slot
    container.removeAll(true);

    // Get guess and feedback history from scene's history manager
    const guessHistory = this.scene.historyManager.getGuessHistory();
    const feedbackHistory = this.scene.historyManager.getFeedbackHistory();

    // Get valid choices for all positions from ConstraintSolver
    const validChoices = this.constraintSolver.getValidChoices(guessHistory, feedbackHistory);

    // Extract valid elements for this specific slot
    const possibleElements = validChoices[slotIndex] || [];

    // Check if slot is filled by user
    const currentGuess = this.activeRowManager.activeRowGuess || [];
    const slotValue = currentGuess[slotIndex];

    if (slotValue !== null && slotValue !== undefined) {
      // Slot is filled with an actual element, don't show ghosts
      return;
    }

    // If position is fully deduced (only 1 possibility), show that ghost more prominently
    if (possibleElements.length === 1) {
      this.renderSingleGhost(container, possibleElements[0]);
      return;
    }

    // Render 2×3 grid of ghost icons
    this.renderGhostGrid(container, possibleElements);
  }

  /**
   * Render a single ghost when position is deduced (more prominent display)
   * @param {Phaser.GameObjects.Container} container - The ghost container
   * @param {string} element - The single deduced element
   */
  renderSingleGhost(container, element) {
    try {
      // Responsive sizing based on screen width
      const { width } = this.scene.cameras.main;
      const isSmallScreen = width < 500;

      const ghostImage = this.scene.add.image(0, 0,
        this.scene.getElementImageKey(element));

      // Larger for deduced element, responsive to screen size
      const iconSize = isSmallScreen ? 28 : 30;
      const imageWidth = ghostImage.width || 50; // Fallback if width not available
      ghostImage.setScale(iconSize / imageWidth);
      ghostImage.setAlpha(0.9);  // Very visible for deduced element

      container.add(ghostImage);
    } catch (error) {
      console.warn(`👻 Could not render single ghost for element: ${element}`, error);
    }
  }

  /**
   * Render mini-grid of ghost icons (2×3 layout)
   * @param {Phaser.GameObjects.Container} container - The ghost container
   * @param {Array<string>} possibleElements - Array of possible element names
   */
  renderGhostGrid(container, possibleElements) {
    if (possibleElements.length === 0) {
      return; // No possibilities (shouldn't happen, but be safe)
    }

    // Responsive sizing based on screen width
    const { width } = this.scene.cameras.main;
    const isSmallScreen = width < 500;

    const gridSize = 2; // 2 columns
    const iconSize = isSmallScreen ? 16 : 18; // Larger for mobile visibility
    const spacing = isSmallScreen ? 18 : 20;  // Balanced spacing

    // Calculate grid starting position (centered in slot)
    const numRows = Math.ceil(possibleElements.length / gridSize);
    const startX = -(gridSize * spacing) / 2 + spacing / 2;
    const startY = -(numRows * spacing) / 2 + spacing / 2;

    possibleElements.forEach((element, idx) => {
      const col = idx % gridSize;
      const row = Math.floor(idx / gridSize);
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      try {
        const imageKey = this.scene.getElementImageKey(element);

        // Create tiny semi-transparent element image
        const ghostImage = this.scene.add.image(x, y, imageKey);

        // Scale to appropriate size
        const imageWidth = ghostImage.width || 50; // Fallback if width not available
        ghostImage.setScale(iconSize / imageWidth);
        ghostImage.setAlpha(isSmallScreen ? 0.8 : 0.75);  // Higher alpha on mobile for better visibility

        container.add(ghostImage);
      } catch (error) {
        console.warn(`👻 Could not render ghost for element: ${element}`, error);
      }
    });
  }

  /**
   * Update all ghost slots after element selection or guess submission
   */
  updateAllGhosts() {
    if (!this.isActive) {
      return;
    }

    for (let i = 0; i < this.ghostContainers.length; i++) {
      this.updateSlotGhosts(i);
    }
  }

  /**
   * Hide ghosts temporarily (e.g., during animations)
   */
  hide() {
    this.ghostContainers.forEach(container => {
      container.setVisible(false);
    });
  }

  /**
   * Show ghosts again
   */
  show() {
    this.ghostContainers.forEach(container => {
      container.setVisible(true);
    });
  }

  /**
   * Clean up when active row is destroyed
   */
  destroy() {
    if (!this.isActive) {
      return;
    }

    this.ghostContainers.forEach(container => {
      if (container && container.destroy) {
        container.destroy(true); // Destroy container and all children
      }
    });

    this.ghostContainers = [];
    this.isActive = false;
  }

  /**
   * Check if ghost system is currently active
   * @returns {boolean} True if ghosts are active
   */
  isSystemActive() {
    return this.isActive;
  }

  /**
   * Get debug info about current ghost state
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    return {
      isActive: this.isActive,
      containerCount: this.ghostContainers.length,
      deducedPositions: this.deductionEngine ? this.deductionEngine.getDeducedPositions() : []
    };
  }
}

// Expose globally (project uses dynamic script loader, not ES module imports)
window.GhostOverlayManager = GhostOverlayManager;
