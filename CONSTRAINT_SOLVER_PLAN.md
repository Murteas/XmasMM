# Plan: Identify Valid Element Choices for Each Position

## Overview

Create an algorithm that uses all past guesses and their feedback to determine which elements are still valid choices for each position in the active guess. This will help players make informed decisions by eliminating impossible choices.

**Key Requirement:** The algorithm MUST support both 4-element and 5-element codes, as users can choose either option in the game settings. The implementation must read the code length dynamically from the game registry and adapt accordingly.

---

## Current Game Mechanics Understanding

Based on codebase exploration:

1. **Secret code:** **Variable-length array (4 or 5 elements)**, allows duplicates (e.g., `['Santa', 'Santa', 'Tree', 'Bell']`)
   - Code length is configurable via `scene.registry.get('codeLength')` in GameStateManager
   - User can choose 4-element or 5-element codes
2. **Feedback system:**
   - `black` (perfect): Correct element in correct position
   - `white` (close): Correct element in wrong position
   - Each element can only be matched once
3. **History storage:** Parallel arrays in `HistoryManager`
   - `guessHistory[]`: Array of variable-length guesses (4 or 5 elements)
   - `feedbackHistory[]`: Array of `{black, white}` feedback objects
4. **Element pool:** 6 themed elements (Santa, Present, Tree, Snowman, Stocking, Bell)

**Critical Files:**
- `js/managers/HistoryManager.js` - Stores guess/feedback history
- `js/utils/GameUtils.js` - Contains `calculateFeedback()` algorithm
- `js/managers/GameStateManager.js` - Manages secret code and game state

---

## Algorithm: Valid Element Determination

### Core Concept

For each position P (0 to codeLength-1) and each element E:
- **An element E is VALID for position P if and only if:**
  - Placing E at position P is consistent with ALL historical guess feedback

**Works for both 4-element and 5-element codes** - the algorithm is code-length agnostic.

### Constraint Satisfaction Approach

This is a constraint satisfaction problem. We test each possible placement and check if it violates any historical feedback.

---

## Decision Tree / Pseudo Code

### Method 1: Brute Force Validation (Recommended for Initial Implementation)

```javascript
/**
 * Determines which elements are valid choices for each position
 * @param {Array<Array<string>>} guessHistory - All past guesses
 * @param {Array<{black, white}>} feedbackHistory - All past feedback
 * @param {Array<string>} elements - Available element pool (typically 6 elements)
 * @param {number} codeLength - Length of code (4 or 5, user-configurable)
 * @returns {Array<Array<string>>} - validChoices[position] = array of valid elements
 */
function getValidChoices(guessHistory, feedbackHistory, elements, codeLength) {
  // Initialize: assume all elements are valid for all positions
  const validChoices = [];
  for (let pos = 0; pos < codeLength; pos++) {
    validChoices[pos] = [...elements]; // Start with all available elements
  }

  // If no history, all choices are valid
  if (guessHistory.length === 0) {
    return validChoices;
  }

  // For each position, test each element
  for (let position = 0; position < codeLength; position++) {
    const stillValid = [];

    for (const element of elements) {
      // Test if placing this element at this position is consistent
      if (isElementValidForPosition(element, position, guessHistory, feedbackHistory, codeLength)) {
        stillValid.push(element);
      }
    }

    validChoices[position] = stillValid;
  }

  return validChoices;
}

/**
 * Tests if placing a specific element at a specific position is consistent
 * with all historical feedback
 */
function isElementValidForPosition(element, position, guessHistory, feedbackHistory, codeLength) {
  // For this element at this position to be valid, we need to check:
  // Would placing it here be consistent with EVERY past guess?

  for (let i = 0; i < guessHistory.length; i++) {
    const guess = guessHistory[i];
    const actualFeedback = feedbackHistory[i];

    // Create a partial code with this element at this position
    const partialCode = new Array(codeLength).fill(null);
    partialCode[position] = element;

    // Check if this placement is consistent with the guess feedback
    if (!isConsistent(guess, actualFeedback, partialCode, position)) {
      return false; // This element violates a constraint
    }
  }

  return true; // Passed all consistency checks
}

/**
 * Checks if a partial code placement is consistent with a guess's feedback
 */
function isConsistent(guess, actualFeedback, partialCode, knownPosition) {
  // We know one position in the secret code (partialCode[knownPosition])
  // Check if this creates any impossible feedback scenarios

  const knownElement = partialCode[knownPosition];
  const guessedAtKnown = guess[knownPosition];

  // Rule 1: Exact Position Match Check
  if (guessedAtKnown === knownElement) {
    // This guess has a perfect match at this position
    // The actual feedback must have at least 1 black peg
    if (actualFeedback.black === 0) {
      return false; // Contradiction!
    }
  }

  // Rule 2: Element Present But Wrong Position Check
  if (guessedAtKnown !== knownElement) {
    // The guessed element at this position is NOT correct
    // If the guessed element appears elsewhere in the guess...
    const elementCount = guess.filter(e => e === guessedAtKnown).length;
    const knownElementCount = (knownElement === guessedAtKnown) ? 1 : 0;

    // This check is complex due to duplicate handling
    // We need more sophisticated validation for full correctness
  }

  // For more accurate validation, we need to consider ALL possible
  // secret codes that have this element at this position, and check
  // if ANY of them could produce the actual feedback
  return canPossiblyProduceFeedback(guess, actualFeedback, partialCode, knownPosition);
}

/**
 * Advanced consistency check: Can ANY complete code with this partial placement
 * produce the actual feedback for this guess?
 */
function canPossiblyProduceFeedback(guess, actualFeedback, partialCode, knownPosition) {
  // This is the MOST ACCURATE approach:
  // Calculate the MIN and MAX possible feedback if we place this element here

  let minBlack = 0;
  let maxBlack = 0;
  let minWhite = 0;
  let maxWhite = 0;

  // Count the known position contribution
  if (guess[knownPosition] === partialCode[knownPosition]) {
    minBlack = 1;
    maxBlack = 1;
  }

  // For unknown positions, calculate possible range
  const unknownPositions = [];
  for (let i = 0; i < partialCode.length; i++) {
    if (i !== knownPosition) {
      unknownPositions.push(i);
    }
  }

  // Count remaining elements in guess (excluding known position)
  const remainingGuessElements = guess.filter((e, i) => i !== knownPosition);
  const knownElement = partialCode[knownPosition];

  // Max possible additional matches
  for (let i = 0; i < unknownPositions.length; i++) {
    const pos = unknownPositions[i];
    const guessElement = guess[pos];

    // Could this position have a perfect match? (max scenario)
    maxBlack++;

    // Could this element appear elsewhere? (contributes to white)
    // This gets complex with duplicates...
  }

  // Check if actual feedback falls within possible range
  const canBeValid = (
    actualFeedback.black >= minBlack &&
    actualFeedback.black <= maxBlack &&
    actualFeedback.white >= minWhite &&
    actualFeedback.white <= maxWhite
  );

  return canBeValid;
}
```

---

## Method 2: Simplified Rule-Based Approach

A simpler approach using direct constraint rules:

```javascript
function getValidChoicesSimplified(guessHistory, feedbackHistory, elements, codeLength) {
  const validChoices = elements.map(() => new Set(elements));

  for (let i = 0; i < guessHistory.length; i++) {
    const guess = guessHistory[i];
    const feedback = feedbackHistory[i];

    // Apply constraint rules
    applyFeedbackConstraints(guess, feedback, validChoices, codeLength);
  }

  // Convert sets back to arrays
  return validChoices.map(set => Array.from(set));
}

function applyFeedbackConstraints(guess, feedback, validChoices, codeLength) {
  const totalMatches = feedback.black + feedback.white;

  // Rule 1: If feedback.black + feedback.white === 0
  // None of the guessed elements are in the secret code AT ALL
  if (totalMatches === 0) {
    for (let pos = 0; pos < codeLength; pos++) {
      for (const element of guess) {
        validChoices[pos].delete(element);
      }
    }
    return;
  }

  // Rule 2: If feedback.black === codeLength (winning guess)
  // The secret code IS this guess
  if (feedback.black === codeLength) {
    for (let pos = 0; pos < codeLength; pos++) {
      validChoices[pos].clear();
      validChoices[pos].add(guess[pos]);
    }
    return;
  }

  // Rule 3: Partial match scenarios
  // This requires more sophisticated logic...
  // (Complex due to duplicates and position ambiguity)
}
```

**Limitation:** This simplified approach doesn't handle all edge cases correctly, especially with duplicates.

---

## Method 3: Exhaustive Search (Most Accurate) ⭐ RECOMMENDED

The most accurate approach is to enumerate all possible secret codes and eliminate those inconsistent with history:

```javascript
function getValidChoicesExhaustive(guessHistory, feedbackHistory, elements, codeLength) {
  // Generate all possible secret codes
  let possibleCodes = generateAllCodes(elements, codeLength);

  // Filter out codes that don't match the feedback history
  for (let i = 0; i < guessHistory.length; i++) {
    const guess = guessHistory[i];
    const actualFeedback = feedbackHistory[i];

    possibleCodes = possibleCodes.filter(code => {
      const testFeedback = GameUtils.calculateFeedback(guess, code);
      return (
        testFeedback.black === actualFeedback.black &&
        testFeedback.white === actualFeedback.white
      );
    });
  }

  // Extract valid elements for each position from remaining possible codes
  const validChoices = [];
  for (let pos = 0; pos < codeLength; pos++) {
    const validElements = new Set();
    for (const code of possibleCodes) {
      validElements.add(code[pos]);
    }
    validChoices[pos] = Array.from(validElements);
  }

  return validChoices;
}

function generateAllCodes(elements, codeLength) {
  // Generate all permutations with replacement
  // For 6 elements and length 4: 6^4 = 1,296 possible codes
  // For 6 elements and length 5: 6^5 = 7,776 possible codes
  const codes = [];

  function generate(current) {
    if (current.length === codeLength) {
      codes.push([...current]);
      return;
    }

    for (const element of elements) {
      current.push(element);
      generate(current);
      current.pop();
    }
  }

  generate([]);
  return codes;
}
```

**Performance:**
- Initial (4-element code): 6^4 = 1,296 possible codes
- Initial (5-element code): 6^5 = 7,776 possible codes
- Each guess typically eliminates 90%+ of remaining possibilities
- After 2-3 guesses: ~10-50 possible codes remain (for 4-element) or ~20-100 (for 5-element)
- Negligible performance impact for both code lengths

---

---

## 🎯 Quick Reference: Supporting Both Code Lengths

| Aspect | Implementation Approach |
|--------|------------------------|
| **Code Length Source** | Read from `scene.registry.get('codeLength')` - NEVER hardcode |
| **Solver Initialization** | Create NEW instance in `GameStateManager.initializeGameState()` each game |
| **Total Possible Codes** | 4-element: 1,296 codes / 5-element: 7,776 codes |
| **Performance** | 4-element: < 5ms / 5-element: < 10ms (both negligible) |
| **Algorithm** | Exhaustive search (Method 3) - works identically for both lengths |
| **Loop Structures** | Always use `this.codeLength`, never literal `4` or `5` |
| **Testing** | Test with BOTH code lengths, verify solver reinitializes correctly |

---

## Recommended Implementation Strategy

### Phase 1: Implement Exhaustive Search (Method 3)
- **Pros:**
  - 100% accurate
  - Simple logic
  - Handles all edge cases (duplicates, complex patterns)
  - **Works seamlessly with both 4-element and 5-element codes**
  - Reasonable performance (1,296 codes for 4-element, 7,776 for 5-element)
- **Cons:**
  - Slightly higher initial computation
  - Generates all codes upfront

### Phase 2: Optimize if Needed
- Cache generated codes (only generate once per game)
- Early termination if only one possible code remains
- Incremental filtering (don't regenerate list each time)

---

## Integration Points

### New Utility Class: `ConstraintSolver.js`

**CRITICAL: The solver must read `codeLength` dynamically from game state, not hardcode it!**

```javascript
class ConstraintSolver {
  constructor(elements, codeLength) {
    this.elements = elements;        // Array of available elements (typically 6)
    this.codeLength = codeLength;    // MUST be passed from GameStateManager (4 or 5)
    this.allPossibleCodes = null;    // Lazy-loaded
  }

  // Generate codes on first use (lazy initialization)
  ensureCodesGenerated() {
    if (!this.allPossibleCodes) {
      this.allPossibleCodes = this.generateAllCodes();
    }
  }

  generateAllCodes() { /* ... */ }

  getValidChoices(guessHistory, feedbackHistory) { /* ... */ }

  getPossibleCodesCount(guessHistory, feedbackHistory) { /* ... */ }

  getSuggestedGuess(guessHistory, feedbackHistory) { /* ... */ }
}
```

**Integration Example in GameStateManager:**

```javascript
initializeGameState() {
  this.codeLength = this.scene.registry.get('codeLength') || 4; // Read from registry
  this.maxGuesses = this.scene.registry.get('maxGuesses') || 10;
  this.guessesRemaining = this.maxGuesses;

  // Generate random code
  this.secretCode = GameUtils.generateRandomCode(this.elements, this.codeLength);

  // Initialize constraint solver with current code length
  this.constraintSolver = new ConstraintSolver(this.elements, this.codeLength);
}
```

### Integration with Existing Managers

1. **GameStateManager:**
   - Create new ConstraintSolver instance in `initializeGameState()`
   - Pass current `codeLength` from game registry
   - **Important:** Must create new instance each game (code length may change between games)

2. **GameInputHandler:** Query valid choices before allowing element placement

3. **UI Indication:** Visually show which elements are still valid (gray out invalid choices)

---

## Visual Feedback Options

Once valid choices are determined, show them to the player:

1. **Option A:** Disable/gray out invalid element buttons
2. **Option B:** Show remaining possibility count (e.g., "Santa: 3 positions")
3. **Option C:** Highlight valid positions when element is selected
4. **Option D:** Add "hint" button that shows one valid placement

---

## Testing Strategy

### Test Cases

**For 4-element codes:**
1. **No history:** All 6 elements valid for all 4 positions
2. **One guess, no matches:** Eliminate all guessed elements from all positions
3. **One guess, all 4 black:** Lock in the exact solution
4. **Duplicate elements:** Ensure feedback calculation handles correctly
5. **Ambiguous scenarios:** Multiple valid solutions exist

**For 5-element codes:**
1. **No history:** All 6 elements valid for all 5 positions
2. **One guess, no matches:** Eliminate all guessed elements from all positions
3. **One guess, all 5 black:** Lock in the exact solution
4. **Complex duplicates:** Test with codes like `['Santa', 'Santa', 'Santa', 'Tree', 'Bell']`
5. **Cross-position constraints:** Verify constraints propagate correctly across 5 positions

**Code length switching:**
1. Play game with 4-element code, then new game with 5-element code
2. Verify solver initializes correctly for each code length

### Verification Method

For each test case:
1. Set up known secret code
2. Provide specific guesses and feedback
3. Calculate valid choices
4. Verify that the actual secret code's elements are in the valid sets
5. Verify that impossible elements are correctly excluded

---

## Files to Create

1. **`js/utils/ConstraintSolver.js`** - Core algorithm implementation

## Files to Modify

1. **`js/managers/GameStateManager.js`** - Integrate ConstraintSolver
2. **`js/utils/ModuleLoader.js`** - Load ConstraintSolver module
3. **`js/managers/GameInputHandler.js`** - Query valid choices (optional, for UI hints)

## Files to Read for Context

- `js/managers/HistoryManager.js` - Access guess/feedback history
- `js/utils/GameUtils.js` - Reuse `calculateFeedback()` method

---

## Complexity Analysis

- **Time Complexity:** O(C × G × L) where:
  - C = possible codes (1,296 for 4-element or 7,776 for 5-element, decreases with each guess)
  - G = number of guesses (max 10)
  - L = code length (4 or 5, user-configurable)
- **Space Complexity:** O(C × L) for storing possible codes
- **Expected Performance:**
  - 4-element codes: < 5ms per validation
  - 5-element codes: < 10ms per validation
  - Both are negligible for user experience

### Scalability with Different Parameters

| Configuration | Total Codes | Initial Generation | After 3 Guesses (Est.) | Verdict |
|---------------|-------------|-------------------|------------------------|---------|
| **6 elements, 4 positions** (current) | 1,296 | ~1-2ms | ~10-50 codes | ✅ Excellent |
| **5 elements, 4 positions** | 625 | < 1ms | ~5-30 codes | ✅ Even better |
| **6 elements, 5 positions** | 7,776 | ~5-10ms | ~20-100 codes | ✅ Very good |
| **5 elements, 5 positions** | 3,125 | ~2-5ms | ~10-60 codes | ✅ Excellent |
| **8 elements, 4 positions** | 4,096 | ~3-5ms | ~15-70 codes | ✅ Good |
| **6 elements, 6 positions** | 46,656 | ~30-50ms | ~50-200 codes | ⚠️ Acceptable* |

*Even with 46,656 codes, modern browsers handle this well. Could add lazy evaluation if needed.

**Key Insight:** The algorithm scales efficiently because each guess dramatically reduces the search space. The exhaustive approach is practical for any reasonable Mastermind configuration.

---

## Implementation Configuration

### Critical: Dynamic Code Length Handling

The `ConstraintSolver` **MUST** work with user-configurable code lengths (4 or 5 elements):

```javascript
class ConstraintSolver {
  constructor(elements, codeLength) {
    this.elements = elements;        // Array of available elements (typically 6)
    this.codeLength = codeLength;    // MUST read from game registry: 4 or 5
    this.allPossibleCodes = null;    // Lazy-loaded (cached per game instance)
  }

  // Generate codes on first use (lazy initialization)
  ensureCodesGenerated() {
    if (!this.allPossibleCodes) {
      this.allPossibleCodes = this.generateAllCodes();
      console.log(`ConstraintSolver: Generated ${this.allPossibleCodes.length} possible codes for length ${this.codeLength}`);
    }
  }

  // All methods must use this.codeLength, NEVER hardcode 4 or 5
  generateAllCodes() {
    const codes = [];
    const generate = (current) => {
      if (current.length === this.codeLength) { // Use dynamic length
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
    return codes;
  }
}
```

### Key Implementation Requirements

1. **Read code length from registry:** `this.scene.registry.get('codeLength')`
2. **Create new solver instance per game:** Don't reuse solver if code length changes
3. **No hardcoded values:** All loops and arrays must use `this.codeLength`
4. **Lazy initialization:** Generate codes only when first needed (saves memory if feature unused)

### Example: Proper Initialization

```javascript
// In GameStateManager.initializeGameState()
this.codeLength = this.scene.registry.get('codeLength') || 4;
this.elements = GameUtils.getGameElements();
this.constraintSolver = new ConstraintSolver(this.elements, this.codeLength);

// Later, when needed:
const validChoices = this.constraintSolver.getValidChoices(
  historyManager.getGuessHistory(),
  historyManager.getFeedbackHistory()
);
```

This ensures the solver adapts automatically to user-selected code length and any future game parameter changes (different themes might have different numbers of elements).

---

## Edge Cases to Handle

1. **No possible codes remain:** Bug in implementation or invalid game state
2. **Only one possible code remains:** Should match exactly one solution
3. **All elements valid:** Happens when no useful information from history
4. **Duplicate elements in secret code:** Must handle correctly per Mastermind rules

---

## Next Steps After Implementation

1. Add visual indicators in UI to show valid/invalid choices
2. Add "Show Hint" feature using constraint solver
3. Add "Possible Solutions" counter for advanced players
4. Consider adding AI opponent that uses optimal guessing strategy
5. Consider "solver mode" that shows optimal next guess to minimize possibilities
