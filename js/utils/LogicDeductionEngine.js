// LogicDeductionEngine.js - Logic hint system core algorithm
// Analyzes guess/feedback history to deduce possible elements per position

class LogicDeductionEngine {
  /**
   * Create a new deduction engine
   * @param {number} codeLength - Length of the secret code (4, 5, or 6)
   * @param {Array<string>} allElements - All available game elements
   */
  constructor(codeLength, allElements) {
    this.codeLength = codeLength;
    this.allElements = allElements;  // All 6 game elements
    this.possibleByPosition = [];    // Array of Sets: possibleByPosition[i] = Set of possible elements
    this.eliminatedElements = new Set();  // Elements proven NOT in code
    this.confirmedElements = new Set();   // Elements proven IN code (but position may be unknown)

    this.reset();

    console.log(`🧠 LogicDeductionEngine initialized: ${codeLength} positions, ${allElements.length} elements`);
  }

  /**
   * Reset engine state (call when starting new round)
   * Initializes all positions with all elements as possible
   */
  reset() {
    // Each position starts with all elements as possible
    this.possibleByPosition = Array(this.codeLength)
      .fill(null)
      .map(() => new Set(this.allElements));

    this.eliminatedElements.clear();
    this.confirmedElements.clear();
    this.elementExactCounts = {};  // Track exact counts of elements in code

    console.log('🧠 LogicDeductionEngine reset');
  }

  /**
   * Main analysis method: call after each guess submission
   * @param {Array<string>} guess - The guess array (element names)
   * @param {Object} feedback - Feedback object {black, white}
   */
  analyzeGuess(guess, feedback) {
    const {black, white} = feedback;
    const totalFeedback = black + white;

    console.log(`🧠 Analyzing guess:`, guess, `Feedback: ${black} black, ${white} white`);

    // Count occurrences of each element in the guess
    const elementCounts = {};
    guess.forEach(element => {
      elementCounts[element] = (elementCounts[element] || 0) + 1;
    });

    const uniqueElements = Object.keys(elementCounts);

    // RULE 1: If an element appears N times and gets 0 feedback total, it's not in code
    uniqueElements.forEach(element => {
      const count = elementCounts[element];

      // If this is the ONLY element in the guess (all same), and feedback is 0, eliminate it
      if (uniqueElements.length === 1 && totalFeedback === 0) {
        console.log(`  ✗ Eliminated: ${element} (guessed ${count} times, 0 feedback)`);
        this.eliminatedElements.add(element);

        // Remove from ALL positions
        for (let i = 0; i < this.codeLength; i++) {
          this.possibleByPosition[i].delete(element);
        }
      }
    });

    // RULE 2: If we have multiple unique elements and can deduce which got no feedback
    // Example: If we know 2 Presents + 1 Candy are in code, and guess has those + Tree
    // with same total feedback, then Tree got 0 feedback
    if (uniqueElements.length > 1) {
      // For each element in the guess, check if we can deduce it got no feedback
      uniqueElements.forEach(element => {
        const countInGuess = elementCounts[element];

        // Calculate expected feedback from OTHER elements we know are in code
        let expectedFeedbackFromOthers = 0;
        uniqueElements.forEach(otherElement => {
          if (otherElement !== element && this.confirmedElements.has(otherElement)) {
            // This other element is confirmed - it should contribute to feedback
            expectedFeedbackFromOthers += Math.min(
              elementCounts[otherElement],
              this.getConfirmedCount(otherElement)
            );
          }
        });

        // If total feedback equals expected feedback from confirmed elements,
        // then this element got 0 feedback and should be eliminated
        if (expectedFeedbackFromOthers >= totalFeedback && !this.confirmedElements.has(element)) {
          console.log(`  ✗ Eliminated: ${element} (total feedback ${totalFeedback} accounted for by confirmed elements)`);
          this.eliminatedElements.add(element);

          // Remove from ALL positions
          for (let i = 0; i < this.codeLength; i++) {
            this.possibleByPosition[i].delete(element);
          }
        }
      });
    }

    // RULE 3: If an element appears N times and total feedback is less than N,
    // we know it appears fewer than N times in the code
    // For all-same guesses, we can track exact count
    if (uniqueElements.length === 1 && totalFeedback > 0) {
      const element = uniqueElements[0];
      const exactCount = totalFeedback;
      console.log(`  ✓ Confirmed: ${element} appears exactly ${exactCount} times in code`);
      this.confirmedElements.add(element);
      this.setElementCount(element, exactCount);
    }

    // Advanced deductions
    this.performAdvancedDeductions();

    // Log current state
    this.logState();
  }

  /**
   * Get the confirmed count of an element in the code
   * @param {string} element - Element name
   * @returns {number} Count of element in code (0 if unknown)
   */
  getConfirmedCount(element) {
    return this.elementExactCounts ? (this.elementExactCounts[element] || 0) : 0;
  }

  /**
   * Set the exact count of an element in the code
   * @param {string} element - Element name
   * @param {number} count - Exact count
   */
  setElementCount(element, count) {
    if (!this.elementExactCounts) {
      this.elementExactCounts = {};
    }
    this.elementExactCounts[element] = count;
  }

  /**
   * Perform advanced cross-reference deductions
   * Examples:
   * - If element confirmed but only fits in one position → it's there
   * - If position only has one possibility → deduce it
   * - If N confirmed elements and only N possible positions → distribute them
   */
  performAdvancedDeductions() {
    // Deduction 1: If a position has only 1 possibility, mark element as confirmed
    for (let i = 0; i < this.codeLength; i++) {
      if (this.possibleByPosition[i].size === 1) {
        const element = Array.from(this.possibleByPosition[i])[0];
        if (!this.confirmedElements.has(element)) {
          console.log(`  🔍 Deduced: ${element} must be at position ${i} (only possibility)`);
          this.confirmedElements.add(element);

          // Remove this element from all other positions
          for (let j = 0; j < this.codeLength; j++) {
            if (j !== i) {
              this.possibleByPosition[j].delete(element);
            }
          }
        }
      }
    }

    // Deduction 2: If confirmed element only fits in one position, lock it there
    this.confirmedElements.forEach(element => {
      const possiblePositions = [];
      for (let i = 0; i < this.codeLength; i++) {
        if (this.possibleByPosition[i].has(element)) {
          possiblePositions.push(i);
        }
      }

      if (possiblePositions.length === 1) {
        const position = possiblePositions[0];
        console.log(`  🔍 Deduced: ${element} must be at position ${position} (only fits here)`);

        // This position can only be this element
        this.possibleByPosition[position].clear();
        this.possibleByPosition[position].add(element);

        // Remove other elements from this position
        // (already cleared above)
      }
    });

    // Deduction 3: If all but one position are deduced, last one is determined by elimination
    const deducedPositions = [];
    for (let i = 0; i < this.codeLength; i++) {
      if (this.possibleByPosition[i].size === 1) {
        deducedPositions.push(i);
      }
    }

    if (deducedPositions.length === this.codeLength - 1) {
      // Find the one undeduced position
      const undeducedPosition = this.possibleByPosition.findIndex(set => set.size > 1);
      if (undeducedPosition !== -1) {
        // Find which element is missing
        const deducedElements = new Set();
        deducedPositions.forEach(pos => {
          const element = Array.from(this.possibleByPosition[pos])[0];
          deducedElements.add(element);
        });

        // The missing element from confirmed set is what goes in the last position
        const missingElement = Array.from(this.possibleByPosition[undeducedPosition])
          .find(el => !deducedElements.has(el));

        if (missingElement) {
          console.log(`  🔍 Deduced: ${missingElement} must be at position ${undeducedPosition} (by elimination)`);
          this.possibleByPosition[undeducedPosition].clear();
          this.possibleByPosition[undeducedPosition].add(missingElement);
          this.confirmedElements.add(missingElement);
        }
      }
    }
  }

  /**
   * Get possible elements for a specific position
   * @param {number} position - Position index (0-based)
   * @returns {Array<string>} Array of possible element names
   */
  getPossibleElements(position) {
    if (position < 0 || position >= this.codeLength) {
      console.warn(`⚠️ Invalid position: ${position}`);
      return [];
    }
    return Array.from(this.possibleByPosition[position]);
  }

  /**
   * Check if a position has been deduced (only 1 possibility left)
   * @param {number} position - Position index (0-based)
   * @returns {boolean} True if position is deduced
   */
  isPositionDeduced(position) {
    if (position < 0 || position >= this.codeLength) {
      return false;
    }
    return this.possibleByPosition[position].size === 1;
  }

  /**
   * Get all deduced positions
   * @returns {Array<number>} Array of position indices that are deduced
   */
  getDeducedPositions() {
    const deduced = [];
    for (let i = 0; i < this.codeLength; i++) {
      if (this.possibleByPosition[i].size === 1) {
        deduced.push(i);
      }
    }
    return deduced;
  }

  /**
   * Get the deduced element for a position (if deduced)
   * @param {number} position - Position index (0-based)
   * @returns {string|null} Element name or null if not deduced
   */
  getDeducedElement(position) {
    if (this.isPositionDeduced(position)) {
      return Array.from(this.possibleByPosition[position])[0];
    }
    return null;
  }

  /**
   * Get possibility data for all positions (for ghost overlay)
   * @returns {Array<Array<string>>} Array of arrays of possible elements per position
   */
  getAllPossibilities() {
    return this.possibleByPosition.map(set => Array.from(set));
  }

  /**
   * Get count of possibilities for a position
   * @param {number} position - Position index (0-based)
   * @returns {number} Count of possible elements
   */
  getPossibilityCount(position) {
    if (position < 0 || position >= this.codeLength) {
      return 0;
    }
    return this.possibleByPosition[position].size;
  }

  /**
   * Check if an element has been eliminated from the code entirely
   * @param {string} element - Element name
   * @returns {boolean} True if element is not in code
   */
  isElementEliminated(element) {
    return this.eliminatedElements.has(element);
  }

  /**
   * Check if an element is confirmed to be in the code
   * @param {string} element - Element name
   * @returns {boolean} True if element is in code
   */
  isElementConfirmed(element) {
    return this.confirmedElements.has(element);
  }

  /**
   * Log current deduction state (for debugging)
   */
  logState() {
    console.log('🧠 Current deduction state:');

    // Log possibilities per position
    for (let i = 0; i < this.codeLength; i++) {
      const possible = Array.from(this.possibleByPosition[i]);
      const status = possible.length === 1 ? '✓ DEDUCED' : `${possible.length} possible`;
      console.log(`  Position ${i}: [${possible.join(', ')}] ${status}`);
    }

    // Log eliminated elements
    if (this.eliminatedElements.size > 0) {
      console.log(`  Eliminated: ${Array.from(this.eliminatedElements).join(', ')}`);
    }

    // Log confirmed elements
    if (this.confirmedElements.size > 0) {
      console.log(`  Confirmed: ${Array.from(this.confirmedElements).join(', ')}`);
    }
  }
}

// Expose globally (project uses dynamic script loader, not ES module imports)
window.LogicDeductionEngine = LogicDeductionEngine;
