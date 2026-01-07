# 🎄 XmasMM Layout & UX Investigation Plan

**Created:** December 26, 2025  
**Last Updated:** January 7, 2026  
**Status:** Step 1 Complete - Ready for Step 2  
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

**Current Layout Flow (UPDATED Jan 7, 2026):**
1. `GameScene.createSimplePhaserLayout()` creates:
   - `headerContainer` (fixed at top, depth 1000)
   - `scrollableContainer` (content area below header, depth 500)
   - `footerContainer` (fixed at bottom, depth 1000) ✅ NOW USED

2. `HistoryRenderer.displayGuessHistory()`:
   - Still uses sliding window (last 6 guesses via `HISTORY_SLIDING_WINDOW_SIZE`)
   - ⚠️ Step 2 will remove this limitation
   
3. `ActiveRowManager.createActiveRow()`:
   - Active row positioned in content area
   - `ElementBar` + Submit button now in fixed footer ✅ DONE
   
**Key Findings (UPDATED):**
- ✅ `footerContainer` now created and used for ElementBar + Submit
- ✅ ElementBar is in fixed footer - always visible
- ✅ Submit button ("GO") next to ElementBar in footer
- ✅ Active row slots centered and larger (~15% increase)
- ✅ All footer values consolidated in `LayoutConfig.FOOTER` section
- ❌ Sliding window still limits visible guesses (Step 2 will fix)
- ❌ No scroll implemented yet (Step 2)

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

### Bonus: Streamlined Game Start (Future Feature)
**Goal:** Simplify difficulty selection - one tap to start

**Current behavior:**
- User selects difficulty (Easy/Standard), then clicks "Start Game" button
- Two-step process is unnecessary

**Proposed changes:**
1. **Combine selection + start** - Clicking a difficulty button starts the game immediately
2. **Rename difficulty levels:**
   - "Easy" → "Standard" (4 elements, fewer combinations)
   - "Standard" → "Hard" (6 elements, more combinations)
3. **Files to modify:**
   - `js/scenes/DifficultySelection.js` - Button handlers, text labels

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
- **Step 1 complete** - Footer with ElementBar + Submit button is working
- Awaiting phone testing before Step 2

---

## ✅ Implementation Progress

### Step 1: Fixed Footer ✅ COMPLETE (Jan 7, 2026)

**What was done:**
1. Created three-zone layout in `GameScene.js`: Header + Content + Footer
2. Moved ElementBar to fixed footer container
3. Moved Submit button to footer (compact "GO" button next to symbols)
4. Centered active row slots (no longer offset for inline submit)
5. Increased active row element sizes ~15% for better visibility
6. Consolidated all footer config into `LayoutConfig.FOOTER` section

**Files modified:**
- `js/config/LayoutConfig.js` - Added `FOOTER` section with all footer values
- `js/scenes/GameScene.js` - Three-zone layout with real footerContainer
- `js/managers/ActiveRowManager.js` - Footer positioning, uses LayoutConfig.FOOTER
- `js/managers/ElementBar.js` - Uses LayoutConfig.FOOTER values

**Testing status:** Works in browser dev tools. Awaiting real phone test.

---

### Step 2: Scrollable Content Area ⏳ NEXT

**Goal:** Show all guesses with scroll capability

**What needs to be done:**
1. Remove sliding window limit in `HistoryRenderer.js`
2. Implement Phaser-based scroll for content area (mask + touch drag)
3. Ensure active row stays visible/accessible
4. Test with 10+ guesses on phone

**Key constraint:** Must work within Phaser canvas (no native browser scroll).

**Implementation approach:**
- Use Phaser container masking to clip content area
- Implement touch drag to scroll content
- Consider scroll indicators (arrows or bar)

**Files to modify:**
- `HistoryRenderer.js` - Remove sliding window, render all rows
- `GameScene.js` - Add scroll mask and touch handling
- `LayoutConfig.js` - Remove or adjust `HISTORY_SLIDING_WINDOW_SIZE`

---

### Previous Attempt (Failed - Dec 30, 2025)

**Tested:** Removing sliding window limit to show all guesses.
**Result:** Breaks on iPhone X after ~8 guesses. The active row and element bar get pushed off the bottom of the screen, especially problematic when browser footer is visible.

**Why it failed:** Without scroll handling, content simply extends beyond viewport with no way to see or interact with it.

**Solution:** Step 1 (fixed footer) addresses this. Step 2 will add scroll.

---

**Testing checklist for Step 2:**
- [ ] iPhone X (375x812) with browser chrome visible
- [ ] iPhone SE (375x667) - smallest supported viewport
- [ ] Test with 10+ guesses to ensure scroll works
- [ ] Ensure active row and submit button always accessible
