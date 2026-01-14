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
    this.guessHistory = [];          // Store all guesses and feedback for comparison-based deduction

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
    this.guessHistory = [];        // Clear guess history

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

    console.log(`🧠 Analyzing guess #${this.guessHistory.length + 1}:`, guess, `Feedback: ${black} black, ${white} white`);

    // Store this guess in history for comparison-based deduction
    this.guessHistory.push({
      guess: [...guess],  // Copy array
      feedback: {black, white}
    });

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

    // Position-specific deductions (compare across guesses)
    this.performPositionSpecificDeduction();

    // Advanced deductions (constraint propagation)
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
   * Perform position-specific deduction by comparing guesses
   * This is the sophisticated MasterMind logic that eliminates elements from specific positions
   */
  performPositionSpecificDeduction() {
    // Need at least 2 guesses to compare
    if (this.guessHistory.length < 2) {
      return;
    }

    console.log('🔍 Performing position-specific deduction...');

    // RULE 1: Compare guesses where the same element appears at different positions
    // Example: [Santa, X, X, X] → 1 black, [X, Santa, X, X] → 0 black
    // Deduction: Santa is at position 0, NOT at position 1
    this.compareElementPositions();

    // RULE 2: If we know an element's exact count and have tried it at certain positions
    // we can eliminate it from positions where it couldn't contribute to feedback
    this.eliminateByCountConstraints();
  }

  /**
   * Compare guesses to eliminate elements from specific positions
   */
  compareElementPositions() {
    // For each pair of guesses, look for elements that moved positions
    for (let i = 0; i < this.guessHistory.length - 1; i++) {
      for (let j = i + 1; j < this.guessHistory.length; j++) {
        const guess1 = this.guessHistory[i];
        const guess2 = this.guessHistory[j];

        // Compare each element in the code length
        for (const element of this.allElements) {
          this.compareElementInTwoGuesses(element, guess1, guess2);
        }
      }
    }
  }

  /**
   * Compare how a specific element performed in two different guesses
   * @param {string} element - The element to analyze
   * @param {Object} guess1 - First guess {guess: Array, feedback: {black, white}}
   * @param {Object} guess2 - Second guess
   */
  compareElementInTwoGuesses(element, guess1, guess2) {
    // Find positions where this element appears in each guess
    const pos1 = [];
    const pos2 = [];

    guess1.guess.forEach((el, idx) => {
      if (el === element) pos1.push(idx);
    });

    guess2.guess.forEach((el, idx) => {
      if (el === element) pos2.push(idx);
    });

    // Skip if element doesn't appear in both guesses
    if (pos1.length === 0 || pos2.length === 0) {
      return;
    }

    // CASE 1: Element appears at ONE position in each guess, different positions
    // If black count changes, we can deduce something
    if (pos1.length === 1 && pos2.length === 1 && pos1[0] !== pos2[0]) {
      const position1 = pos1[0];
      const position2 = pos2[0];

      // If guess1 has MORE blacks than guess2, element is more likely at position1
      // But we need to be careful - other elements might have changed too

      // SIMPLE CASE: If both guesses have ONLY this element (all same)
      const allSame1 = guess1.guess.every(el => el === element);
      const allSame2 = guess2.guess.every(el => el === element);

      if (allSame1 && allSame2) {
        // This is the clearest case!
        const blacks1 = guess1.feedback.black;
        const blacks2 = guess2.feedback.black;

        if (blacks1 > blacks2) {
          // Element is at one or more positions from guess1
          console.log(`  🎯 ${element} at position ${position1} got more blacks than position ${position2}`);
          // We can't definitively eliminate yet without more info
        } else if (blacks2 > blacks1) {
          console.log(`  🎯 ${element} at position ${position2} got more blacks than position ${position1}`);
        } else if (blacks1 === 0 && blacks2 === 0) {
          // Element not in code at all - already handled by global elimination
        }
      }
    }

    // CASE 2: Single element moved between guesses (CRITICAL for Test 3!)
    // If all other positions are the same, we can deduce from black count change
    this.detectSingleElementMove(element, guess1, guess2, pos1, pos2);
  }

  /**
   * Detect when a single element moved between two guesses
   * This is a powerful deduction: if only one thing changed and blacks changed, we know something!
   * @param {string} element - The element that moved
   * @param {Object} guess1 - First guess
   * @param {Object} guess2 - Second guess
   * @param {Array<number>} pos1 - Positions of element in guess1
   * @param {Array<number>} pos2 - Positions of element in guess2
   */
  detectSingleElementMove(element, guess1, guess2, pos1, pos2) {
    // Only handle simple case: element at one position in each guess
    if (pos1.length !== 1 || pos2.length !== 1) {
      return;
    }

    const position1 = pos1[0];
    const position2 = pos2[0];

    // Count how many positions are different between the two guesses
    let differentPositions = 0;
    for (let i = 0; i < this.codeLength; i++) {
      if (guess1.guess[i] !== guess2.guess[i]) {
        differentPositions++;
      }
    }

    // If only 2 positions differ (the element moved), we can make strong deductions!
    if (differentPositions === 2) {
      const blacks1 = guess1.feedback.black;
      const blacks2 = guess2.feedback.black;

      console.log(`  🔍 Comparing: ${element} at pos ${position1} (${blacks1} blacks) vs pos ${position2} (${blacks2} blacks)`);

      // If blacks decreased when element moved from pos1 to pos2
      if (blacks1 > blacks2) {
        // Element WAS contributing a black at position1, but NOT at position2
        // Therefore: element IS at position1, NOT at position2
        console.log(`  🎯 DEDUCED: ${element} IS at position ${position1}, NOT at position ${position2}`);

        // Lock position1 to this element
        this.possibleByPosition[position1].clear();
        this.possibleByPosition[position1].add(element);

        // Eliminate from position2 and all others
        for (let pos = 0; pos < this.codeLength; pos++) {
          if (pos !== position1) {
            this.possibleByPosition[pos].delete(element);
            if (pos === position2) {
              console.log(`    ✗ Eliminated ${element} from position ${pos}`);
            }
          }
        }
      }
      // If blacks increased when element moved from pos1 to pos2
      else if (blacks2 > blacks1) {
        // Element WAS NOT contributing a black at position1, but IS at position2
        // Therefore: element is NOT at position1, IS at position2
        console.log(`  🎯 DEDUCED: ${element} IS at position ${position2}, NOT at position ${position1}`);

        // Lock position2 to this element
        this.possibleByPosition[position2].clear();
        this.possibleByPosition[position2].add(element);

        // Eliminate from position1 and all others
        for (let pos = 0; pos < this.codeLength; pos++) {
          if (pos !== position2) {
            this.possibleByPosition[pos].delete(element);
            if (pos === position1) {
              console.log(`    ✗ Eliminated ${element} from position ${pos}`);
            }
          }
        }
      }
      // If blacks stayed the same
      else if (blacks1 === blacks2) {
        // Either both positions have it (impossible if only 1 in code)
        // Or neither position has it
        if (blacks1 === 0 && blacks2 === 0) {
          // Element not at either position - can eliminate from both
          console.log(`  ✗ ${element} NOT at positions ${position1} or ${position2}`);
          this.possibleByPosition[position1].delete(element);
          this.possibleByPosition[position2].delete(element);
        }
      }
    }
  }

  /**
   * Use known element counts to eliminate from positions
   * Example: If we know there are 2 Santas, and we've found them at positions 0 and 2,
   * then eliminate Santa from all other positions
   */
  eliminateByCountConstraints() {
    // For each element with a known exact count
    for (const [element, count] of Object.entries(this.elementExactCounts || {})) {
      // Find positions where this element is confirmed (only 1 possibility and it's this element)
      const confirmedPositions = [];

      for (let pos = 0; pos < this.codeLength; pos++) {
        const possible = this.possibleByPosition[pos];
        if (possible.size === 1 && possible.has(element)) {
          confirmedPositions.push(pos);
        }
      }

      // If we've confirmed all instances of this element
      if (confirmedPositions.length === count) {
        console.log(`  ✓ Found all ${count} instances of ${element} at positions [${confirmedPositions.join(', ')}]`);

        // Eliminate this element from all other positions
        for (let pos = 0; pos < this.codeLength; pos++) {
          if (!confirmedPositions.includes(pos)) {
            if (this.possibleByPosition[pos].has(element)) {
              this.possibleByPosition[pos].delete(element);
              console.log(`  ✗ Eliminated ${element} from position ${pos} (all ${count} instances found)`);
            }
          }
        }
      }
    }
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
