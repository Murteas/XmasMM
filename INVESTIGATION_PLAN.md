# 🎄 XmasMM Layout & UX Investigation Plan

**Created:** December 26, 2025  
**Status:** Ready for Investigation  
**Context:** Based on family party feedback - players want larger UI elements and ability to review all guesses

---

## 📋 Summary of User Feedback

1. **Rows too small** - Hard to see on phones, especially with enlarged text settings
2. **Can't scroll to see past guesses** - Near end of game, early guesses are hidden
3. **Scoring questions** - Is current scoring fair? (Highest score: 1370 on 6-guess hard mode)

---

## 🚨 Architectural Concern: Over-Engineering (Added Dec 30, 2025)

**Observation:** The application may have been over-engineered from the start, and this complexity could be contributing to the current difficulties with small device layouts.

**Core issue:** The layout system has many interdependent managers and calculated constraints that make simple changes (like "just scroll the screen") more difficult than they should be.

**Simplified vision for game screen:**
1. **Show all guesses** - Display every guess made, not a sliding window
2. **Native scroll when needed** - If content exceeds viewport, let the browser handle scrolling naturally
3. **Symbol picker in footer** - With the recent change to single-symbol selection mode, move the picker to a fixed footer position
4. **Let content breathe** - Stop fighting to fit everything in one viewport; scrolling is natural on phones

**Questions to answer:**
- [ ] How much of the current layout complexity is necessary vs legacy constraints?
- [ ] Can we simplify to: Header + Scrollable Guess Area + Fixed Footer (symbol picker)?
- [ ] What breaks if we remove the sliding window and just render all rows?
- [ ] Is `HistoryScroller.js` solving a problem we created ourselves?

**Proposed simpler architecture:**
```
┌─────────────────────────┐
│  Header (score, menu)   │  ← Fixed
├─────────────────────────┤
│                         │
│  Active Row (current)   │
│                         │
│  History Row 1          │
│  History Row 2          │  ← Scrollable container
│  History Row 3          │     (native browser scroll)
│  ...all guesses...      │
│                         │
├─────────────────────────┤
│  Symbol Picker (6 btns) │  ← Fixed footer
│  [Submit] [Clear]       │
└─────────────────────────┘
```

### Phase 0 Audit Findings (Dec 30, 2025)

**Current Manager Architecture (GameScene):**
| Manager | Responsibility | Complexity |
|---------|---------------|------------|
| `GameScene.js` | Orchestrates all managers, creates layout containers | High - 478 lines |
| `UILayoutManager.js` | Header, buttons, UI elements | High - 515 lines |
| `HistoryRenderer.js` | Renders guess history with sliding window | Medium - 368 lines |
| `ActiveRowManager.js` | Current guess row + element bar creation | High - 503 lines |
| `ElementBar.js` | 6-button element selection | Low - 124 lines |
| `HistoryManager.js` | Stores guess/feedback history | Low |
| `GameStateManager.js` | Game state (secret code, etc.) | Low |
| `SafeAreaManager.js` | Mobile safe area insets | Low |

**Current Layout Flow:**
1. `GameScene.createSimplePhaserLayout()` creates:
   - `headerContainer` (fixed, depth 1000)
   - `scrollableContainer` (positioned below header, depth 500)
   - `footerContainer` is set to `null` (not used!)

2. `HistoryRenderer.displayGuessHistory()`:
   - Implements sliding window (last 6 guesses only via `HISTORY_SLIDING_WINDOW_SIZE`)
   - Calculates absolute Y positions within `scrollableContainer`
   
3. `ActiveRowManager.createActiveRow()`:
   - Positions after visible history rows
   - Creates `ElementBar` below the active row (inline, not in footer)
   
**Key Findings:**
- ❌ `footerContainer` exists in code but is set to `null` - never used in GameScene
- ❌ ElementBar is created inline below active row, not in a fixed footer
- ❌ Sliding window (`HISTORY_SLIDING_WINDOW_SIZE: 6`) artificially limits visible guesses
- ❌ Everything is positioned with absolute Y calculations instead of letting CSS/browser handle layout
- ❌ No native scroll - Phaser handles all rendering in canvas

**Root Cause of Complexity:**
Phaser.js (game framework) renders to `<canvas>`, not HTML. This means:
- No native browser scrolling available
- All layout must be calculated manually
- Touch/scroll handling must be custom implemented
- Can't use CSS flexbox, grid, or overflow for layout

**Options to Consider:**
1. **Stay in Phaser** - Implement scroll within canvas (complex but keeps architecture)
2. **Hybrid approach** - Use HTML overlay for scrollable guess list, Phaser for game elements
3. **Simplify within Phaser** - Remove sliding window, let content extend, add manual scroll
4. **Full rewrite** - Move to pure HTML/CSS/JS for simpler scroll (major effort)

---

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

### Bonus: Theme System (Future Feature)
**Goal:** Allow the game to be played with different visual themes beyond Christmas

**Theme options to support:**
1. **Christmas Theme** (current) - Snowflake, ornament, candy cane, gingerbread, star, tree
2. **Custom Themes** - User-selectable themed element sets (Halloween, Easter, Birthday, etc.)
3. **Generic Color/Symbol Theme** - Simple colored shapes for year-round play

**Concept ideas:**
- Theme selector in settings or main menu
- Each theme = set of 6 distinct element images + matching background
- Generic mode uses colored circles/squares/shapes (no seasonal graphics)
- Store theme preference in localStorage
- Consider: themed audio/sound effects per theme?

**Architecture considerations:**
- Create `ThemeConfig.js` with element sets and asset paths
- Modify element rendering to pull from active theme
- Background images per theme (or generic gradient options)
- Ensure consistent sizing across all themes
- May need asset loader to preload theme graphics

**Investigation tasks:**
1. [ ] Document current element asset references and where they're used
2. [ ] Design theme configuration structure (JSON format)
3. [ ] Sketch generic color/shape element set
4. [ ] Plan asset organization (folder per theme?)
5. [ ] Evaluate: theme switch mid-game or menu only?
6. [ ] Consider accessibility: colorblind-friendly shape distinctions

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

### Phase 0: Understand Current Complexity (NEW - START HERE)
1. **Audit layout managers** - List all managers involved in game screen layout
2. **Map dependencies** - Which managers call which? What's the chain of layout decisions?
3. **Identify simplification opportunities** - What can be removed or consolidated?
4. **Prototype simple scroll** - Quick test: remove sliding window, add CSS overflow-y: auto

### Phase 1: Original Investigation Tasks
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

**Phase 0 Complete!** Architecture audit done. Key insight: Phaser canvas rendering is the root cause of scroll complexity.

### Previous Attempt (Failed)

**Tested:** Removing sliding window limit to show all guesses.
**Result:** Breaks on iPhone X after ~8 guesses. The active row and element bar get pushed off the bottom of the screen, especially problematic when browser footer is visible.

**Why it failed:** Without scroll handling, content simply extends beyond viewport with no way to see or interact with it.

### Recommended Next Step: Implement Fixed Footer + Scroll

The approach needs to be:
1. **Move ElementBar to a true fixed footer** - Always visible at bottom of viewport
2. **Create scrollable content area** - Between header and footer, with proper scroll handling
3. **Active row at top of scroll area** - User fills current guess at top, history scrolls below

**Key constraint:** Must work within Phaser canvas (no native browser scroll available).

**Implementation approach options:**
1. **Phaser Camera/Viewport** - Use a separate camera for the scrollable area with bounds
2. **Container masking + drag** - Mask the content area, implement touch drag to scroll
3. **Hybrid HTML overlay** - Use HTML div for scrollable guess list, Phaser for active row/footer

**Files to modify:**
- `GameScene.js` - Create proper three-zone layout (header, scroll area, footer)
- `ActiveRowManager.js` - Position active row in scroll area, move ElementBar creation to footer
- `HistoryRenderer.js` - Remove sliding window, render all rows in scroll container
- `LayoutConfig.js` - Add footer height for element bar

**Testing checklist:**
- [ ] iPhone X (375x812) with browser chrome visible
- [ ] iPhone SE (375x667) - smallest supported viewport
- [ ] Test with 10+ guesses to ensure scroll works
- [ ] Ensure active row and submit button always accessible
