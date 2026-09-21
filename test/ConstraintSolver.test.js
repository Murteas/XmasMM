// ConstraintSolver.test.js - Tests for js/utils/ConstraintSolver.js
//
// Run with: npm test   (set XMASMM_TEST_VERBOSE=1 to see the solver's own logging)
//
// ConstraintSolver is the only pure deterministic logic in XmasMM: it enumerates
// every possible code and filters by feedback history to drive ghost hints. These
// tests exist so hint strength can be retuned without playing the game to find out
// what broke.

const test = require('node:test');
const assert = require('node:assert/strict');

const { loadBrowserClass } = require('./helpers/load-browser-class');
const {
  referenceFeedback,
  referenceRemaining,
  referenceValidChoices,
  splitHistory,
  makeRng,
  randomCode
} = require('./helpers/mastermind-reference');

const ConstraintSolver = loadBrowserClass('js/utils/ConstraintSolver.js', 'ConstraintSolver');
const GameUtils = loadBrowserClass('js/utils/GameUtils.js', 'GameUtils');

// The real Christmas theme element names (ThemeConfig.getElements() returns display
// names). ConstraintSolver is element-agnostic, but using the real six keeps the
// documented examples readable.
const ELEMENTS = ['Santa', 'Present', 'Candy Cane', 'Star', 'Tree', 'Snowflake'];
const [SANTA, PRESENT, CANDY, STAR, TREE, SNOW] = ELEMENTS;

const EASY_LENGTH = 4; // 6^4 = 1,296 codes
const HARD_LENGTH = 5; // 6^5 = 7,776 codes

function newSolver(codeLength) {
  return new ConstraintSolver(ELEMENTS, codeLength);
}

function fill(element, length) {
  return new Array(length).fill(element);
}

function sortedChoices(choices) {
  return choices.map(options => [...options].sort());
}

// ---------------------------------------------------------------------------
// Feedback calculation
// ---------------------------------------------------------------------------

test('calculateFeedback: hand-computed cases including duplicates', () => {
  const solver = newSolver(HARD_LENGTH);

  const cases = [
    {
      why: 'perfect match',
      guess: [SANTA, PRESENT, CANDY, STAR, TREE],
      code: [SANTA, PRESENT, CANDY, STAR, TREE],
      expected: { black: 5, white: 0 }
    },
    {
      why: 'no element in common',
      guess: fill(SANTA, 5),
      code: fill(PRESENT, 5),
      expected: { black: 0, white: 0 }
    },
    {
      why: 'full permutation, nothing in place',
      guess: [PRESENT, SANTA, STAR, TREE, CANDY],
      code: [SANTA, PRESENT, CANDY, STAR, TREE],
      expected: { black: 0, white: 5 }
    },
    {
      why: 'five of one element, code holds one: extras must not score white',
      guess: fill(SANTA, 5),
      code: [SANTA, PRESENT, CANDY, STAR, TREE],
      expected: { black: 1, white: 0 }
    },
    {
      why: 'duplicates in the code, not the guess',
      guess: [PRESENT, SANTA, TREE, TREE, SANTA],
      code: [SANTA, SANTA, SANTA, PRESENT, PRESENT],
      expected: { black: 1, white: 2 }
    },
    {
      why: 'same multiset, shuffled: black + white must equal code length',
      guess: [SANTA, PRESENT, SANTA, CANDY, PRESENT],
      code: [SANTA, SANTA, PRESENT, PRESENT, CANDY],
      expected: { black: 1, white: 4 }
    },
    {
      why: 'guess has more duplicates than the code',
      guess: [SANTA, SANTA, CANDY, CANDY, TREE],
      code: [SANTA, PRESENT, CANDY, STAR, TREE],
      expected: { black: 3, white: 0 }
    },
    {
      why: 'three Presents in the guess, one in the code: only one may score white',
      guess: [PRESENT, CANDY, PRESENT, PRESENT, SANTA],
      code: [SANTA, PRESENT, CANDY, STAR, TREE],
      expected: { black: 0, white: 3 }
    },
    {
      why: 'code has more duplicates than the guess',
      guess: [SANTA, PRESENT, CANDY, SANTA, SANTA],
      code: [SANTA, SANTA, SANTA, PRESENT, CANDY],
      expected: { black: 1, white: 4 }
    }
  ];

  for (const { why, guess, code, expected } of cases) {
    assert.deepEqual(solver.calculateFeedback(guess, code), expected, why);
  }
});

test('calculateFeedback: hand-computed 4-element cases', () => {
  const solver = newSolver(EASY_LENGTH);

  const cases = [
    {
      why: 'two pairs, half in place',
      guess: [SANTA, PRESENT, PRESENT, SANTA],
      code: [SANTA, SANTA, PRESENT, PRESENT],
      expected: { black: 2, white: 2 }
    },
    {
      why: 'uniform code: unmatched guess elements score nothing',
      guess: [SANTA, SANTA, PRESENT, PRESENT],
      code: fill(SANTA, 4),
      expected: { black: 2, white: 0 }
    },
    {
      why: 'three of one element in the code',
      guess: [PRESENT, PRESENT, SANTA, SANTA],
      code: [SANTA, PRESENT, PRESENT, PRESENT],
      expected: { black: 1, white: 2 }
    }
  ];

  for (const { why, guess, code, expected } of cases) {
    assert.deepEqual(solver.calculateFeedback(guess, code), expected, why);
  }
});

test('calculateFeedback: matches independent reference over every 3x3 pair', () => {
  // Exhaustive over a small alphabet: 27 codes x 27 guesses = 729 pairs.
  // calculateFeedback does not depend on this.codeLength, so a small solver is fine.
  const smallElements = [SANTA, PRESENT, CANDY];
  const solver = new ConstraintSolver(smallElements, 3);
  const codes = require('./helpers/mastermind-reference').referenceAllCodes(smallElements, 3);

  for (const guess of codes) {
    for (const code of codes) {
      assert.deepEqual(
        solver.calculateFeedback(guess, code),
        referenceFeedback(guess, code),
        `feedback mismatch for guess ${guess} vs code ${code}`
      );
    }
  }
});

test('calculateFeedback: matches independent reference on random 4- and 5-element pairs', () => {
  const rng = makeRng(20260920);

  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    const solver = newSolver(codeLength);
    for (let i = 0; i < 20000; i++) {
      const guess = randomCode(rng, ELEMENTS, codeLength);
      const code = randomCode(rng, ELEMENTS, codeLength);
      assert.deepEqual(
        solver.calculateFeedback(guess, code),
        referenceFeedback(guess, code),
        `feedback mismatch for guess ${guess} vs code ${code}`
      );
    }
  }
});

test('calculateFeedback: invariants hold (bounded, symmetric)', () => {
  const rng = makeRng(777);

  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    const solver = newSolver(codeLength);
    for (let i = 0; i < 5000; i++) {
      const guess = randomCode(rng, ELEMENTS, codeLength);
      const code = randomCode(rng, ELEMENTS, codeLength);
      const { black, white } = solver.calculateFeedback(guess, code);

      assert.ok(black >= 0 && white >= 0, 'peg counts are never negative');
      assert.ok(
        black + white <= codeLength,
        `pegs exceeded code length: ${black}+${white} > ${codeLength}`
      );
      assert.notEqual(
        `${black}/${white}`,
        `${codeLength - 1}/1`,
        'n-1 black with 1 white is impossible in Mastermind'
      );
      // Scoring is symmetric in guess and code.
      assert.deepEqual(
        solver.calculateFeedback(code, guess),
        { black, white },
        'feedback should be symmetric'
      );
    }
  }
});

test('calculateFeedback: agrees with GameUtils.calculateFeedback', () => {
  // The solver filters codes using its own copy of the scoring algorithm. If it
  // ever drifts from the one the game scores guesses with, hints go subtly wrong.
  const rng = makeRng(31337);

  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    const solver = newSolver(codeLength);
    for (let i = 0; i < 10000; i++) {
      const guess = randomCode(rng, ELEMENTS, codeLength);
      const code = randomCode(rng, ELEMENTS, codeLength);
      assert.deepEqual(
        solver.calculateFeedback(guess, code),
        GameUtils.calculateFeedback(guess, code),
        `solver and GameUtils disagree on guess ${guess} vs code ${code}`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

test('generateAllCodes: produces 6^n distinct codes for both game sizes', () => {
  for (const [codeLength, expectedCount] of [[EASY_LENGTH, 1296], [HARD_LENGTH, 7776]]) {
    const codes = newSolver(codeLength).generateAllCodes();

    assert.equal(codes.length, expectedCount);
    assert.ok(codes.every(code => code.length === codeLength), 'every code has the right length');
    assert.equal(new Set(codes.map(code => code.join('|'))).size, expectedCount, 'no duplicates');
    assert.ok(
      codes.every(code => code.every(element => ELEMENTS.includes(element))),
      'codes only use the supplied elements'
    );
  }
});

test('possibleCodes are generated once and survive reset()', () => {
  const solver = newSolver(HARD_LENGTH);

  solver.getValidChoices([], []);
  const firstGeneration = solver.possibleCodes;
  assert.equal(firstGeneration.length, 7776);

  solver.getValidChoices([], []);
  assert.equal(solver.possibleCodes, firstGeneration, 'codes are cached, not regenerated');

  solver.lastGuessCount = 4;
  solver.reset();
  assert.equal(solver.lastGuessCount, 0, 'reset clears the guess counter');
  assert.equal(solver.possibleCodes, firstGeneration, 'reset keeps the cached codes');
});

// ---------------------------------------------------------------------------
// Elimination logic
// ---------------------------------------------------------------------------

test('no history: every element is valid everywhere, nothing eliminated', () => {
  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    const solver = newSolver(codeLength);
    const choices = solver.getValidChoices([], []);

    assert.equal(choices.length, codeLength);
    for (const options of choices) {
      assert.deepEqual([...options].sort(), [...ELEMENTS].sort());
    }
    assert.equal(solver.getPossibleCodesCount([], []), codeLength === 4 ? 1296 : 7776);
  }
});

test('no history: returned arrays are copies, safe for callers to mutate', () => {
  const solver = newSolver(HARD_LENGTH);
  const choices = solver.getValidChoices([], []);

  choices[0].pop();
  assert.equal(solver.elements.length, ELEMENTS.length, 'solver elements untouched');
  assert.deepEqual(solver.getValidChoices([], [])[0].sort(), [...ELEMENTS].sort());
});

test('documented case: four of one element scoring 3 black / 0 white rules out a fourth', () => {
  // From docs/session-history.md: guess [Star, Star, Star, Star, Tree] -> 3 black,
  // 0 white. Two branches produce that score, and 214 codes survive in total:
  //
  //   A. Three Stars among positions 0-3, position 4 is not Tree. The leftover
  //      guess pegs are Star and Tree, so neither may appear in the two leftover
  //      code slots: 4 positions for the non-Star x 4 elements x 4 for position 4
  //      = 64 codes, each with exactly 3 Stars and no Tree at all.
  //   B. Two Stars among positions 0-3 plus a black from Tree at position 4. The
  //      leftover guess pegs are both Stars, so the two remaining slots need only
  //      avoid Star: C(4,2) = 6 placements x 5 x 5 = 150 codes, each with 2 Stars.
  //
  // So the real deduction is narrower than the doc's phrasing suggests: a 4th Star
  // is impossible anywhere, and Star is impossible at position 4, but Star still
  // survives as an option at positions 0-3.
  const solver = newSolver(HARD_LENGTH);
  const guessHistory = [[STAR, STAR, STAR, STAR, TREE]];
  const feedbackHistory = [{ black: 3, white: 0 }];

  const remaining = solver.getRemainingCodes(guessHistory, feedbackHistory);
  assert.equal(remaining.length, 214, 'exactly 214 codes survive');
  assert.equal(solver.getPossibleCodesCount(guessHistory, feedbackHistory), 214);

  const starCounts = { 2: 0, 3: 0 };
  for (const code of remaining) {
    const stars = code.filter(element => element === STAR).length;
    assert.ok(stars === 2 || stars === 3, `a 4th Star is impossible, got ${stars} in ${code}`);
    assert.notEqual(code[4], STAR, `position 4 cannot be a Star, got ${code}`);
    starCounts[stars]++;

    // Branch invariant: a Tree in the code only survives via branch B.
    if (code.includes(TREE)) {
      assert.equal(stars, 2, `Tree is only possible alongside 2 Stars, got ${code}`);
      assert.equal(code[4], TREE, `Tree can only sit at position 4, got ${code}`);
    }
  }
  assert.deepEqual(starCounts, { 2: 150, 3: 64 }, 'branch B yields 150 codes, branch A 64');

  const choices = sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory));
  for (let pos = 0; pos < 4; pos++) {
    assert.deepEqual(choices[pos], [...ELEMENTS].sort(), `position ${pos} keeps every option`);
  }
  assert.deepEqual(
    choices[4],
    [SANTA, PRESENT, CANDY, TREE, SNOW].sort(),
    'position 4 loses exactly one option: Star'
  );
});

test('four of one element scoring 3 black / 0 white proves a 4th is impossible (4-element game)', () => {
  // The claim in its unqualified form: a whole-code guess of one element scores
  // black = the count of that element and never scores white, so [Star x4] -> 3/0
  // means exactly three Stars, and a fourth is impossible. 4 placements for the
  // odd position out x 5 non-Star elements = 20 surviving codes.
  const solver = newSolver(EASY_LENGTH);
  const guessHistory = [fill(STAR, EASY_LENGTH)];
  const feedbackHistory = [{ black: 3, white: 0 }];

  const remaining = solver.getRemainingCodes(guessHistory, feedbackHistory);
  assert.equal(remaining.length, 20);

  for (const code of remaining) {
    const stars = code.filter(element => element === STAR).length;
    assert.equal(stars, 3, `a 4th Star is impossible, got ${stars} in ${code}`);
  }

  // Star is still reachable at every position, so this narrows the code without
  // eliminating anything from the per-position hints.
  const choices = sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory));
  for (let pos = 0; pos < EASY_LENGTH; pos++) {
    assert.deepEqual(choices[pos], [...ELEMENTS].sort(), `position ${pos} keeps every option`);
  }

  // Cross-checked against the independent brute force.
  const history = [{ guess: guessHistory[0], feedback: feedbackHistory[0] }];
  assert.equal(remaining.length, referenceRemaining(ELEMENTS, EASY_LENGTH, history).length);
  assert.deepEqual(sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory)),
    referenceValidChoices(ELEMENTS, EASY_LENGTH, history));
});

test('a 4th of an element becomes impossible once a later guess pins it down', () => {
  // [Star x4, Tree] -> 3/0 leaves both a 2-Star and a 3-Star branch. Adding
  // [Star x5] -> 3/0 kills the 2-Star branch, so the surviving codes are exactly
  // the 64 from branch A: three Stars, no Tree anywhere.
  const solver = newSolver(HARD_LENGTH);
  const history = [
    { guess: [STAR, STAR, STAR, STAR, TREE], feedback: { black: 3, white: 0 } },
    { guess: fill(STAR, HARD_LENGTH), feedback: { black: 3, white: 0 } }
  ];
  const { guessHistory, feedbackHistory } = splitHistory(history);

  const remaining = solver.getRemainingCodes(guessHistory, feedbackHistory);
  assert.equal(remaining.length, 64);

  for (const code of remaining) {
    assert.equal(code.filter(element => element === STAR).length, 3, `expected 3 Stars in ${code}`);
    assert.ok(!code.includes(TREE), `Tree is now impossible anywhere, found in ${code}`);
    assert.notEqual(code[4], STAR, 'position 4 still cannot be a Star');
  }

  const choices = sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory));
  const nonStarNonTree = [SANTA, PRESENT, CANDY, SNOW].sort();
  for (let pos = 0; pos < 4; pos++) {
    assert.deepEqual(choices[pos], [...nonStarNonTree, STAR].sort(), `position ${pos} loses Tree`);
  }
  assert.deepEqual(choices[4], nonStarNonTree, 'position 4 loses both Star and Tree');

  assert.deepEqual(sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory)),
    referenceValidChoices(ELEMENTS, HARD_LENGTH, history));
});

test('elimination across multiple guesses narrows to a single possibility (4 elements)', () => {
  // Five all-one-element guesses scoring 0/0 each remove that element entirely,
  // leaving only the sixth. An all-same guess never scores white pegs, so 0/0
  // means "absent".
  const solver = newSolver(EASY_LENGTH);
  const history = [SANTA, PRESENT, CANDY, STAR, TREE].map(element => ({
    guess: fill(element, EASY_LENGTH),
    feedback: { black: 0, white: 0 }
  }));
  const { guessHistory, feedbackHistory } = splitHistory(history);

  const remaining = solver.getRemainingCodes(guessHistory, feedbackHistory);
  assert.equal(remaining.length, 1);
  assert.deepEqual(remaining[0], fill(SNOW, EASY_LENGTH));

  const choices = solver.getValidChoices(guessHistory, feedbackHistory);
  assert.equal(choices.length, EASY_LENGTH);
  for (const options of choices) {
    assert.deepEqual(options, [SNOW], 'every position is fully deduced');
  }
});

test('elimination across multiple guesses narrows to a single possibility (5 elements)', () => {
  const solver = newSolver(HARD_LENGTH);
  const history = [SANTA, PRESENT, CANDY, STAR, TREE].map(element => ({
    guess: fill(element, HARD_LENGTH),
    feedback: { black: 0, white: 0 }
  }));
  const { guessHistory, feedbackHistory } = splitHistory(history);

  assert.deepEqual(solver.getRemainingCodes(guessHistory, feedbackHistory), [fill(SNOW, HARD_LENGTH)]);
  for (const options of solver.getValidChoices(guessHistory, feedbackHistory)) {
    assert.deepEqual(options, [SNOW]);
  }
});

test('one position can be fully deduced while others remain open', () => {
  // Four absent elements leave only Tree and Snowflake. [Tree x4] -> 1 black means
  // exactly one Tree. [Tree, Snow, Snow, Snow] -> 2 black / 2 white rules out the
  // Tree being at position 0 (that would have been 4 black), so position 0 is
  // pinned to Snowflake while positions 1-3 are still either element.
  const solver = newSolver(EASY_LENGTH);
  const history = [
    { guess: fill(SANTA, 4), feedback: { black: 0, white: 0 } },
    { guess: fill(PRESENT, 4), feedback: { black: 0, white: 0 } },
    { guess: fill(CANDY, 4), feedback: { black: 0, white: 0 } },
    { guess: fill(STAR, 4), feedback: { black: 0, white: 0 } },
    { guess: fill(TREE, 4), feedback: { black: 1, white: 0 } },
    { guess: [TREE, SNOW, SNOW, SNOW], feedback: { black: 2, white: 2 } }
  ];
  const { guessHistory, feedbackHistory } = splitHistory(history);

  const remaining = solver.getRemainingCodes(guessHistory, feedbackHistory);
  assert.equal(remaining.length, 3);
  assert.deepEqual(
    remaining.map(code => code.join(',')).sort(),
    [
      [SNOW, TREE, SNOW, SNOW].join(','),
      [SNOW, SNOW, TREE, SNOW].join(','),
      [SNOW, SNOW, SNOW, TREE].join(',')
    ].sort()
  );

  const choices = sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory));
  assert.deepEqual(choices[0], [SNOW], 'position 0 is fully deduced');
  for (let pos = 1; pos < 4; pos++) {
    assert.deepEqual(choices[pos], [SNOW, TREE].sort(), `position ${pos} still has two options`);
  }
});

test('elimination matches independent brute force across random multi-guess histories', () => {
  const rng = makeRng(424242);

  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    for (let round = 0; round < 12; round++) {
      const secret = randomCode(rng, ELEMENTS, codeLength);
      const history = [];

      for (let turn = 0; turn < 4; turn++) {
        const guess = randomCode(rng, ELEMENTS, codeLength);
        // Feedback comes from the reference implementation, so the comparison
        // below is not circular.
        history.push({ guess, feedback: referenceFeedback(guess, secret) });

        const solver = newSolver(codeLength);
        const { guessHistory, feedbackHistory } = splitHistory(history);
        const context = `length ${codeLength}, secret ${secret}, ${history.length} guesses`;

        assert.equal(
          solver.getPossibleCodesCount(guessHistory, feedbackHistory),
          referenceRemaining(ELEMENTS, codeLength, history).length,
          `remaining count mismatch (${context})`
        );
        assert.deepEqual(
          sortedChoices(solver.getValidChoices(guessHistory, feedbackHistory)),
          referenceValidChoices(ELEMENTS, codeLength, history),
          `valid choices mismatch (${context})`
        );
      }
    }
  }
});

test('the true secret is never eliminated, and the candidate set never grows', () => {
  const rng = makeRng(98765);

  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    const solver = newSolver(codeLength);

    for (let round = 0; round < 40; round++) {
      const secret = randomCode(rng, ELEMENTS, codeLength);
      const history = [];
      let previousCount = codeLength === 4 ? 1296 : 7776;

      for (let turn = 0; turn < 5; turn++) {
        const guess = randomCode(rng, ELEMENTS, codeLength);
        history.push({ guess, feedback: referenceFeedback(guess, secret) });
        const { guessHistory, feedbackHistory } = splitHistory(history);

        const remaining = solver.getRemainingCodes(guessHistory, feedbackHistory);
        assert.ok(
          remaining.some(code => code.join('|') === secret.join('|')),
          `secret ${secret} was wrongly eliminated after ${history.length} guesses`
        );
        assert.ok(
          remaining.length <= previousCount,
          `candidate set grew from ${previousCount} to ${remaining.length}`
        );
        previousCount = remaining.length;

        // The secret's element must survive at every position.
        const choices = solver.getValidChoices(guessHistory, feedbackHistory);
        for (let pos = 0; pos < codeLength; pos++) {
          assert.ok(
            choices[pos].includes(secret[pos]),
            `position ${pos} lost the true element ${secret[pos]} (secret ${secret})`
          );
        }
      }
    }
  }
});

test('a solved code leaves exactly one candidate', () => {
  for (const codeLength of [EASY_LENGTH, HARD_LENGTH]) {
    const solver = newSolver(codeLength);
    const secret = codeLength === 4
      ? [SANTA, SNOW, CANDY, SNOW]
      : [TREE, SANTA, SANTA, SNOW, CANDY];

    const remaining = solver.getRemainingCodes([secret], [{ black: codeLength, white: 0 }]);
    assert.deepEqual(remaining, [secret]);
    assert.deepEqual(
      solver.getValidChoices([secret], [{ black: codeLength, white: 0 }]),
      secret.map(element => [element])
    );
  }
});

test('contradictory history yields no candidates and empty per-position choices', () => {
  // Current behavior, locked in because the ghost overlay renders whatever it gets.
  const solver = newSolver(EASY_LENGTH);
  const guessHistory = [fill(SANTA, 4), fill(SANTA, 4)];
  const feedbackHistory = [{ black: 0, white: 0 }, { black: 4, white: 0 }];

  assert.equal(solver.getPossibleCodesCount(guessHistory, feedbackHistory), 0);

  const choices = solver.getValidChoices(guessHistory, feedbackHistory);
  assert.equal(choices.length, EASY_LENGTH);
  for (const options of choices) {
    assert.deepEqual(options, []);
  }
});

test('getValidChoices stays fast enough for per-keystroke hint updates', () => {
  // Docs claim <10ms for 7,776 codes. Budget is deliberately loose; this only
  // catches an order-of-magnitude regression.
  const solver = newSolver(HARD_LENGTH);
  const guessHistory = [
    [SANTA, PRESENT, CANDY, STAR, TREE],
    [TREE, STAR, CANDY, PRESENT, SANTA],
    [SNOW, SNOW, SANTA, SANTA, PRESENT]
  ];
  const feedbackHistory = guessHistory.map(guess =>
    referenceFeedback(guess, [SNOW, PRESENT, SANTA, STAR, TREE])
  );

  solver.getValidChoices(guessHistory, feedbackHistory); // warm the code cache

  const started = process.hrtime.bigint();
  solver.getValidChoices(guessHistory, feedbackHistory);
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

  assert.ok(elapsedMs < 250, `getValidChoices took ${elapsedMs.toFixed(1)}ms`);
});
