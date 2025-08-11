// score_simulation.js - Analyze current scoring distribution
// Run with: node scripts/score_simulation.js
// Produces aggregated stats for diversity review (Option B)

function calculateScore(config) {
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

function runSimulation() {
  const codeLength = 5; // dominant current length
  const results = [];
  for (let guessesUsed = 3; guessesUsed <= 14; guessesUsed++) {
    for (let perfect = 0; perfect <= codeLength; perfect++) {
      for (let close = 0; close <= codeLength - perfect; close++) {
        const gameWon = perfect === codeLength; // treat only all perfect as solved
        for (const hintUsed of [false, true]) {
          const breakdown = calculateScore({ perfect, close, codeLength, guessesUsed, gameWon, hintUsed });
          results.push({ guessesUsed, perfect, close, hintUsed, ...breakdown });
        }
      }
    }
  }

  // Aggregate distribution by guessesUsed
  const byGuesses = {};
  for (const r of results) {
    const bucket = byGuesses[r.guessesUsed] || { scores: [], min: Infinity, max: -Infinity };
    bucket.scores.push(r.total);
    if (r.total < bucket.min) bucket.min = r.total;
    if (r.total > bucket.max) bucket.max = r.total;
    byGuesses[r.guessesUsed] = bucket;
  }

  const summary = Object.keys(byGuesses).sort((a,b)=>a-b).map(g => {
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

  console.log('Score Diversity by Guesses Used (current rules):');
  console.table(summary);

  // Identify clustering: count how many scores fall into 50-pt bins overall
  const binSize = 50;
  const bins = {};
  for (const r of results) {
    const bin = Math.floor(r.total / binSize) * binSize;
    bins[bin] = (bins[bin] || 0) + 1;
  }
  const binSummary = Object.keys(bins).sort((a,b)=>a-b).map(k => ({ bin: k+'-'+(Number(k)+binSize-1), count: bins[k] }));
  console.log('\nOverall Distribution (50-pt bins):');
  console.table(binSummary.slice(0,25));

  // Export light JSON for future comparative run (optional)
  return { summary, binSummary };
}

if (require.main === module) {
  runSimulation();
}

module.exports = { runSimulation };
