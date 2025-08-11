// score_simulation.js - Analyze current scoring distribution
// Run with: node scripts/score_simulation.js
// Produces aggregated stats for diversity review (Option B)

function calculateScoreCurrent(config) {
  const { perfect, close, codeLength, guessesUsed, gameWon, hintUsed } = config;
  const scoring = {
    perfectElementPoints: 200,
    closeElementPoints: 100,
    completeBonus: 300,
    speedBonusPerGuess: 75,
    speedPenaltyPerGuess: 25,
    speedBonusThreshold: 10,
    hintPenalty: 200
  };

  // Element points (if solved but feedback not all perfect, assume forced correction like ScoreManager)
  let elementPoints = (perfect * scoring.perfectElementPoints) + (close * scoring.closeElementPoints);
  if (gameWon && perfect !== codeLength) {
    elementPoints = codeLength * scoring.perfectElementPoints;
  }

  let completeBonus = gameWon ? scoring.completeBonus : 0;

  let speedBonus = 0;
  if (guessesUsed < scoring.speedBonusThreshold) {
    speedBonus = (scoring.speedBonusThreshold - guessesUsed) * scoring.speedBonusPerGuess;
  } else if (guessesUsed > scoring.speedBonusThreshold) {
    speedBonus = (scoring.speedBonusThreshold - guessesUsed) * scoring.speedPenaltyPerGuess; // negative
  }

  const hintPenalty = hintUsed ? -scoring.hintPenalty : 0;
  let total = elementPoints + completeBonus + speedBonus + hintPenalty;
  if (total < 0) total = 0;
  return { elementPoints, completeBonus, speedBonus, hintPenalty, total };
}

// Proposed alternative model (Option A exploration):
// - perfect 180, close 80
// - solved bonus 250
// - tiered speed bonus (unused guesses before threshold = 10): first 3 @80, next 3 @50, remainder @30
// - speed penalties remain -25 per extra guess
// - hint penalty -220
function calculateScoreProposed(config) {
  const { perfect, close, codeLength, guessesUsed, gameWon, hintUsed } = config;
  const scoring = {
    perfectElementPoints: 180,
    closeElementPoints: 80,
    completeBonus: 250,
    speedBonusThreshold: 10,
    hintPenalty: 220,
    tier1Count: 3,
    tier1Value: 80,
    tier2Count: 3,
    tier2Value: 50,
    tier3Value: 30,
    speedPenaltyPerGuess: 25
  };

  let elementPoints = (perfect * scoring.perfectElementPoints) + (close * scoring.closeElementPoints);
  if (gameWon && perfect !== codeLength) {
    // NOTE: Keeping forced perfect behavior preserves comparability; may reconsider to increase diversity
    elementPoints = codeLength * scoring.perfectElementPoints;
  }
  const completeBonus = gameWon ? scoring.completeBonus : 0;

  let speedBonus = 0;
  if (guessesUsed < scoring.speedBonusThreshold) {
    const unused = scoring.speedBonusThreshold - guessesUsed;
    let remaining = unused;
    const tier1 = Math.min(remaining, scoring.tier1Count); remaining -= tier1;
    const tier2 = Math.min(remaining, scoring.tier2Count); remaining -= tier2;
    const tier3 = Math.max(remaining, 0);
    speedBonus = (tier1 * scoring.tier1Value) + (tier2 * scoring.tier2Value) + (tier3 * scoring.tier3Value);
  } else if (guessesUsed > scoring.speedBonusThreshold) {
    speedBonus = (scoring.speedBonusThreshold - guessesUsed) * scoring.speedPenaltyPerGuess; // negative
  }

  const hintPenalty = hintUsed ? -scoring.hintPenalty : 0;
  let total = elementPoints + completeBonus + speedBonus + hintPenalty;
  if (total < 0) total = 0;
  return { elementPoints, completeBonus, speedBonus, hintPenalty, total };
}

function aggregate(results) {
  const byGuesses = {};
  for (const r of results) {
    const bucket = byGuesses[r.guessesUsed] || { scores: [], min: Infinity, max: -Infinity };
    bucket.scores.push(r.total);
    if (r.total < bucket.min) bucket.min = r.total;
    if (r.total > bucket.max) bucket.max = r.total;
    byGuesses[r.guessesUsed] = bucket;
  }
  return Object.keys(byGuesses).sort((a,b)=>a-b).map(g => {
    const b = byGuesses[g];
    b.scores.sort((a,b)=>a-b);
    const mid = Math.floor(b.scores.length/2);
    return {
      guessesUsed: Number(g),
      range: b.min + ' - ' + b.max,
      median: b.scores[mid],
      uniqueScores: new Set(b.scores).size
    };
  });
}

function runSimulation() {
  const codeLength = 5; // dominant current length
  const resultsCurrent = [];
  const resultsProposed = [];
  for (let guessesUsed = 3; guessesUsed <= 14; guessesUsed++) {
    for (let perfect = 0; perfect <= codeLength; perfect++) {
      for (let close = 0; close <= codeLength - perfect; close++) {
        const gameWon = perfect === codeLength; // treat only all perfect as solved
        for (const hintUsed of [false, true]) {
          const curr = calculateScoreCurrent({ perfect, close, codeLength, guessesUsed, gameWon, hintUsed });
            resultsCurrent.push({ guessesUsed, perfect, close, hintUsed, ...curr });
          const prop = calculateScoreProposed({ perfect, close, codeLength, guessesUsed, gameWon, hintUsed });
            resultsProposed.push({ guessesUsed, perfect, close, hintUsed, ...prop });
        }
      }
    }
  }

  const summaryCurrent = aggregate(resultsCurrent);
  const summaryProposed = aggregate(resultsProposed);

  console.log('Score Diversity by Guesses Used (Current Rules):');
  console.table(summaryCurrent);
  console.log('Score Diversity by Guesses Used (Proposed Rules):');
  console.table(summaryProposed);

  // Combine for delta view
  const delta = summaryCurrent.map((row, idx) => {
    const p = summaryProposed[idx];
    return {
      guessesUsed: row.guessesUsed,
      medianCurrent: row.median,
      medianProposed: p.median,
      medianDelta: p.median - row.median,
      uniqCurrent: row.uniqueScores,
      uniqProposed: p.uniqueScores,
      uniqDelta: p.uniqueScores - row.uniqueScores
    };
  });
  console.log('Delta (Proposed - Current):');
  console.table(delta);

  // Identify clustering: count how many scores fall into 50-pt bins overall
  const binSize = 50;
  const binsCurrent = {};
  for (const r of resultsCurrent) {
    const bin = Math.floor(r.total / binSize) * binSize;
    binsCurrent[bin] = (binsCurrent[bin] || 0) + 1;
  }
  const binsProposed = {};
  for (const r of resultsProposed) {
    const bin = Math.floor(r.total / binSize) * binSize;
    binsProposed[bin] = (binsProposed[bin] || 0) + 1;
  }
  const binSummaryCurrent = Object.keys(binsCurrent).sort((a,b)=>a-b).map(k => ({ bin: k+'-'+(Number(k)+binSize-1), count: binsCurrent[k] }));
  const binSummaryProposed = Object.keys(binsProposed).sort((a,b)=>a-b).map(k => ({ bin: k+'-'+(Number(k)+binSize-1), count: binsProposed[k] }));
  console.log('\nOverall Distribution (50-pt bins) - Current:');
  console.table(binSummaryCurrent.slice(0,25));
  console.log('\nOverall Distribution (50-pt bins) - Proposed:');
  console.table(binSummaryProposed.slice(0,25));

  // Export light JSON for future comparative run (optional)
  return { summaryCurrent, summaryProposed, delta };
}

if (require.main === module) {
  runSimulation();
}

module.exports = { runSimulation };
