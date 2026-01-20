// ConstraintSolver.js - Exhaustive constraint satisfaction for MasterMind hints
// Guarantees 100% accuracy by testing all possible codes against history

class ConstraintSolver {
  /**
   * Create a constraint solver for determining valid element choices
   * @param {Array<string>} elements - Available elements (typically 6)
   * @param {number} codeLength - Length of secret code (4 or 5)
   */
  constructor(elements, codeLength) {
    this.elements = elements;
    this.codeLength = codeLength;
    this.possibleCodes = null; // Lazy-loaded
    this.lastGuessCount = 0;

    console.log(`🧩 ConstraintSolver initialized: ${elements.length} elements, code length ${codeLength}`);
  }

  /**
   * Generate all possible secret codes
   * 6 elements, length 4: 6^4 = 1,296 codes
   * 6 elements, length 5: 6^5 = 7,776 codes
   */
  generateAllCodes() {
    const codes = [];
    const generate = (current) => {
      if (current.length === this.codeLength) {
        codes.push([...current]);
        return;
      }
      for (const element of this.elements) {
        current.push(element);
        generate(current);
        current.pop();
      }
    };
    generate([]);
    console.log(`🧩 Generated ${codes.length} possible codes`);
    return codes;
  }

  /**
   * Ensure codes are generated (lazy initialization)
   */
  ensureCodesGenerated() {
    if (!this.possibleCodes) {
      this.possibleCodes = this.generateAllCodes();
    }
  }

  /**
   * Get valid element choices for each position based on guess history
   * @param {Array<Array<string>>} guessHistory - All past guesses
   * @param {Array<{black, white}>} feedbackHistory - All past feedback
   * @returns {Array<Array<string>>} - validChoices[position] = array of valid elements
   */
  getValidChoices(guessHistory, feedbackHistory) {
    // Ensure codes are generated
    this.ensureCodesGenerated();

    // If no history, all choices are valid
    if (guessHistory.length === 0) {
      const allValid = [];
      for (let pos = 0; pos < this.codeLength; pos++) {
        allValid.push([...this.elements]);
      }
      return allValid;
    }

    // Filter codes that match all historical feedback
    let remainingCodes = [...this.possibleCodes];

    for (let i = 0; i < guessHistory.length; i++) {
      const guess = guessHistory[i];
      const expectedFeedback = feedbackHistory[i];

      remainingCodes = remainingCodes.filter(code => {
        const actualFeedback = this.calculateFeedback(guess, code);
        return (
          actualFeedback.black === expectedFeedback.black &&
          actualFeedback.white === expectedFeedback.white
        );
      });
    }

    // Log progress (concise for gameplay)
    if (guessHistory.length !== this.lastGuessCount) {
      console.log(`🧩 After ${guessHistory.length} guesses: ${remainingCodes.length} possible codes remaining`);
      this.lastGuessCount = guessHistory.length;
    }

    // Extract valid elements for each position from remaining codes
    const validChoices = [];
    for (let pos = 0; pos < this.codeLength; pos++) {
      const validElements = new Set();
      for (const code of remainingCodes) {
        validElements.add(code[pos]);
      }
      validChoices.push(Array.from(validElements));
    }

    return validChoices;
  }

  /**
   * Calculate feedback for a guess against a secret code
   * Same algorithm as GameUtils.calculateFeedback for consistency
   * @param {Array<string>} guess - The guessed code
   * @param {Array<string>} code - The secret code
   * @returns {{black: number, white: number}} - Feedback counts
   */
  calculateFeedback(guess, code) {
    let black = 0;
    let white = 0;

    const guessCopy = [...guess];
    const codeCopy = [...code];

    // First pass: count black pegs (exact matches)
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        guessCopy.splice(i, 1);
        codeCopy.splice(i, 1);
      }
    }

    // Second pass: count white pegs (element exists but wrong position)
    for (let i = 0; i < guessCopy.length; i++) {
      const index = codeCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        white++;
        codeCopy.splice(index, 1);
      }
    }

    return { black, white };
  }

  /**
   * Get count of remaining possible codes (for debugging/testing)
   * @param {Array<Array<string>>} guessHistory
   * @param {Array<{black, white}>} feedbackHistory
   * @returns {number}
   */
  getPossibleCodesCount(guessHistory, feedbackHistory) {
    this.ensureCodesGenerated();

    if (guessHistory.length === 0) {
      return this.possibleCodes.length;
    }

    let remainingCodes = [...this.possibleCodes];

    for (let i = 0; i < guessHistory.length; i++) {
      const guess = guessHistory[i];
      const expectedFeedback = feedbackHistory[i];

      remainingCodes = remainingCodes.filter(code => {
        const actualFeedback = this.calculateFeedback(guess, code);
        return (
          actualFeedback.black === expectedFeedback.black &&
          actualFeedback.white === expectedFeedback.white
        );
      });
    }

    return remainingCodes.length;
  }

  /**
   * Get all remaining possible codes (for debugging/validation)
   * @param {Array<Array<string>>} guessHistory
   * @param {Array<{black, white}>} feedbackHistory
   * @returns {Array<Array<string>>}
   */
  getRemainingCodes(guessHistory, feedbackHistory) {
    this.ensureCodesGenerated();

    if (guessHistory.length === 0) {
      return [...this.possibleCodes];
    }

    let remainingCodes = [...this.possibleCodes];

    for (let i = 0; i < guessHistory.length; i++) {
      const guess = guessHistory[i];
      const expectedFeedback = feedbackHistory[i];

      remainingCodes = remainingCodes.filter(code => {
        const actualFeedback = this.calculateFeedback(guess, code);
        return (
          actualFeedback.black === expectedFeedback.black &&
          actualFeedback.white === expectedFeedback.white
        );
      });
    }

    return remainingCodes;
  }

  /**
   * Reset solver state (call when starting new round)
   */
  reset() {
    // Keep possibleCodes cached, just reset guess counter
    this.lastGuessCount = 0;
    console.log('🧩 ConstraintSolver reset');
  }
}
