// mastermind-reference.js - Independent Mastermind reference implementation
//
// Deliberately written a different way than ConstraintSolver: frequency counting
// instead of array splicing. Tests that compare the two are then meaningful —
// a shared bug would have to be reproduced twice, by two different algorithms.

/**
 * Standard Mastermind scoring via frequency counts.
 * black = exact position matches
 * white = sum over elements of min(unmatched in guess, unmatched in code)
 */
function referenceFeedback(guess, code) {
  if (guess.length !== code.length) {
    throw new Error('guess and code must be the same length');
  }

  let black = 0;
  const guessCounts = new Map();
  const codeCounts = new Map();

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === code[i]) {
      black++;
      continue;
    }
    guessCounts.set(guess[i], (guessCounts.get(guess[i]) || 0) + 1);
    codeCounts.set(code[i], (codeCounts.get(code[i]) || 0) + 1);
  }

  let white = 0;
  for (const [element, count] of guessCounts) {
    white += Math.min(count, codeCounts.get(element) || 0);
  }

  return { black, white };
}

/** Every code of the given length over the given elements. */
function referenceAllCodes(elements, codeLength) {
  let codes = [[]];
  for (let i = 0; i < codeLength; i++) {
    const next = [];
    for (const code of codes) {
      for (const element of elements) {
        next.push([...code, element]);
      }
    }
    codes = next;
  }
  return codes;
}

/**
 * Brute-force filter using referenceFeedback.
 * @param {Array<{guess: string[], feedback: {black: number, white: number}}>} history
 */
function referenceRemaining(elements, codeLength, history) {
  return referenceAllCodes(elements, codeLength).filter(code =>
    history.every(({ guess, feedback }) => {
      const actual = referenceFeedback(guess, code);
      return actual.black === feedback.black && actual.white === feedback.white;
    })
  );
}

/** Per-position set of elements appearing in the surviving codes, sorted. */
function referenceValidChoices(elements, codeLength, history) {
  const remaining = referenceRemaining(elements, codeLength, history);
  const choices = [];
  for (let pos = 0; pos < codeLength; pos++) {
    const set = new Set(remaining.map(code => code[pos]));
    choices.push([...set].sort());
  }
  return choices;
}

/** Split a history into the parallel arrays ConstraintSolver expects. */
function splitHistory(history) {
  return {
    guessHistory: history.map(entry => entry.guess),
    feedbackHistory: history.map(entry => entry.feedback)
  };
}

/** Deterministic PRNG (mulberry32) so property tests are reproducible. */
function makeRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomCode(rng, elements, codeLength) {
  const code = [];
  for (let i = 0; i < codeLength; i++) {
    code.push(elements[Math.floor(rng() * elements.length)]);
  }
  return code;
}

module.exports = {
  referenceFeedback,
  referenceAllCodes,
  referenceRemaining,
  referenceValidChoices,
  splitHistory,
  makeRng,
  randomCode
};
