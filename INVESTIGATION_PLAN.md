# 🎄 XmasMM Layout & UX Investigation Plan

**Created:** December 26, 2025  
**Status:** Ready for Investigation  
**Context:** Based on family party feedback - players want larger UI elements and ability to review all guesses

---

## 📋 Summary of User Feedback

1. **Rows too small** - Hard to see on phones, especially with enlarged text settings
2. **Can't scroll to see past guesses** - Near end of game, early guesses are hidden
3. **Scoring questions** - Is current scoring fair? (Highest score: 1370 on 6-guess hard mode)

## 🎯 Investigation Goals

### Priority 1: Larger Game Elements
**Problem:** Current row height and element sizes are too small for comfortable phone use

**Current values to examine:**
- `LayoutConfig.js` - `HISTORY_ROW_HEIGHT_STANDARD: 75`
- Element sizes in `HistoryRenderer.js` and `ActiveRowManager.js`
- Element bar button sizes in `ElementBar.js`

**User suggestion:** Consider a single symbol selection box in footer instead of 6 small buttons, making room for larger guess rows.

**Investigation tasks:**
1. [ ] Document current element/row sizes across all screen sizes
2. [ ] Test with iOS/Android accessibility settings (larger text)
3. [ ] Prototype larger row heights (suggest 90-100px)
4. [ ] Evaluate single-symbol-picker vs current element bar
5. [ ] Calculate maximum row height that still fits 6 visible guesses

---

### Priority 2: Scroll/Review System for Past Guesses
**Problem:** Current "sliding window" shows only last 6 guesses - players can't review earlier guesses

**Current implementation:**
- `LayoutConfig.HISTORY_SLIDING_WINDOW_SIZE: 6` controls visible rows
- `HistoryRenderer.js` handles display logic
- `HistoryScroller.js` exists but may be partially disabled

**Options to evaluate:**

#### Option A: Full Scroll Implementation
- Enable scrolling through all history rows
- Add scroll indicators (up/down arrows or scroll bar)
- Pros: Players see everything
- Cons: Complex touch handling, potential performance issues

#### Option B: Expandable History Panel
- Tap a "Show All Guesses" button to expand/overlay full history
- Pros: Clean main UI, full access when needed
- Cons: Extra tap required

#### Option C: Hybrid - Larger Window + Scroll
- Increase visible window to 8 rows with smaller but readable elements
- Add simple scroll for games that go beyond 8 guesses
- Pros: Most games visible without scrolling
- Cons: Still need scroll for long games

**Investigation tasks:**
1. [ ] Review current `HistoryScroller.js` - what's disabled and why?
2. [ ] Test scroll performance with 10 history rows
3. [ ] Prototype each option (A, B, C) as simple mockups
4. [ ] Get viewport calculations for different phone sizes

---

### Priority 3: Scoring System Review
**Problem:** Is scoring fair and understandable?

**Current scoring (from `ScoreManager.js`):**
```javascript
scoringConfig = {
  perfectElementPoints: 180,    // Per correct position
  closeElementPoints: 80,       // Per correct element, wrong position
  completeBonus: 250,           // Bonus for winning
  speedBonusThreshold: 10,      // Guesses threshold for speed bonus
  speedTier1Count: 3,           // First 3 guesses
  speedTier1Value: 80,          // Points per guess saved
  speedTier2Count: 3,           // Next 3 guesses
  speedTier2Value: 50,
  speedTier3Value: 30,          // Remaining guesses
  speedPenaltyPerGuess: 25,     // Penalty per guess used
  hintPenalty: 220              // Cost of using hint
}
```

**Analysis needed:**
1. [ ] Calculate theoretical max/min scores for each difficulty
2. [ ] Review speed bonus tiers - are they balanced?
3. [ ] Compare 4-element vs 6-element scoring fairness
4. [ ] Document: What score = "good", "great", "excellent"?

---

### Bonus: Logic Tracking System (Future Feature)
**User suggestion:** Help players track what they've learned from each guess

**Concept ideas:**
- Visual indicators showing eliminated possibilities
- "Notepad" feature for player notes
- Auto-highlight elements that are confirmed/eliminated
- Tutorial hints like "You know X is in position 2"

**Investigation tasks:**
1. [ ] Research similar features in Wordle, Mastermind apps
2. [ ] Sketch UI concepts for logic tracking
3. [ ] Evaluate complexity vs value for casual family players

---

## 📁 Key Files to Examine

| File | Purpose | Relevant To |
|------|---------|-------------|
| `js/config/LayoutConfig.js` | Central sizing constants | Priority 1, 2 |
| `js/managers/HistoryRenderer.js` | Displays guess history rows | Priority 1, 2 |
| `js/managers/ActiveRowManager.js` | Active guess row sizing | Priority 1 |
| `js/managers/ElementBar.js` | Symbol selection buttons | Priority 1 |
| `js/managers/HistoryScroller.js` | Scroll handling | Priority 2 |
| `js/managers/ScoreManager.js` | Scoring calculations | Priority 3 |
| `js/scenes/GameScene.js` | Main game layout coordination | All |

---

## 🔧 Recommended Investigation Order

1. **Start with LayoutConfig.js** - Understand all current sizing constants
2. **Test current game on actual phone** - Note specific pain points
3. **Prototype larger rows** - Quick test with increased HISTORY_ROW_HEIGHT_STANDARD
4. **Review HistoryScroller.js** - Understand what scroll code exists
5. **Document scoring math** - Create spreadsheet of score scenarios

---

## ⚠️ Constraints to Remember

- **Mobile-first** - All changes must work on 375x667 minimum viewport
- **Accessibility** - Consider users with larger system text settings
- **Performance** - Smooth 60fps scrolling if implemented
- **Simplicity** - Family-friendly, not overwhelming UI
- **Incremental changes** - Game must remain functional after each change

---

## 📝 Notes for Next Agent

- Server command: `python -m http.server 8000` from project root
- Test URL: `http://localhost:8000`
- Debug mode: Press `D` in game, then `R` for random guess, `W` for auto-win
- Recent changes: Guess slots now start empty each turn, slot selection priority fixed
- Git is up to date - all changes pushed to main branch

---

## ✅ Ready to Start

Begin with Priority 1 investigation - document current sizes and prototype larger rows. Make small, testable changes.
