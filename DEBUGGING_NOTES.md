# Debugging Notes - Step 2 Scrolling Implementation

**Date:** January 8-9, 2026
**Status:** ⚠️ IN PROGRESS - Auto-scroll issue on iPhone 17

---

## Current Issue (January 9, 2026 - Evening)

**Problem:** Element bar overlaps active row on 9th and 10th guesses on iPhone 17
- **With browser bar visible:** 9th and 10th guesses affected
- **Fullscreen mode:** Only 10th guess affected
- **Desktop simulation:** Works fine (no issue)

**Root Cause:** Suspected viewport/safe area calculation issue. Auto-scroll calculation appears correct on desktop but over-scrolls on actual iPhone device.

**Current Status:** Debug overlay deployed (shows on-screen for guesses 8-10) to gather data from iPhone testing.

---

## Previous Resolution Summary (January 9, 2026 - Morning)

**Root Cause Found:** The deprecated `HISTORY_SLIDING_WINDOW_SIZE` constant was removed but code still referenced it, causing `NaN` position calculations.

**Issues Fixed:**
1. ✅ Active row positioning (NaN → proper coordinates)
2. ✅ Header overlap (increased top padding)
3. ✅ Modal z-index (depth 3 → 2000)
4. ✅ Auto-scroll re-enabled
5. ✅ Footer minimized (104px → 34px safe area only)

---

## Original Issues (RESOLVED)

---

## What Was Implemented

### Files Changed:
1. **js/managers/HistoryRenderer.js**
   - Lines 21-33: Removed sliding window, now renders all guesses
   - Uses `renderAllRows()` instead of `renderSlidingWindow()`

2. **js/scenes/GameScene.js**
   - Lines 96-101: Added scroll state properties in `create()`
   - Lines 188-191: Added geometry masking for content clipping
   - Lines 220-329: Added four new methods:
     - `enableScrollableInteraction()` - Touch/mouse scrolling
     - `clampScrollPosition()` - Scroll bounds
     - `calculateTotalContentHeight()` - Content height tracking
     - `scrollToActiveRow()` - Auto-scroll feature
   - Lines 214-216: Wired up scroll in `setupGameComponents()`

3. **js/managers/HistoryManager.js**
   - Lines 57-62: Added auto-scroll calls (CURRENTLY DISABLED)
   - Lines 88-99: Removed obsolete scroller references

4. **js/config/LayoutConfig.js**
   - Lines 34-35: Deprecated `HISTORY_SLIDING_WINDOW_SIZE`

---

## Debugging Steps to Try

### 1. Check Browser Console
Open DevTools (F12) and look for:
- JavaScript errors (red text)
- Console logs with `🔍 SCROLL:` prefix
- Timeline of when things initialize
- Any warnings about undefined properties

### 2. Add Debug Logging
In `GameScene.js`, add console logs to track initialization:

```javascript
setupGameComponents() {
  console.log('📐 DEBUG: setupGameComponents START');
  this.uiLayoutManager.setupBackground();
  console.log('📐 DEBUG: Background done');
  this.uiLayoutManager.setupUI();
  console.log('📐 DEBUG: UI done');
  this.uiLayoutManager.setupButtons();
  console.log('📐 DEBUG: Buttons done');
  this.setupInlineGuessing();
  console.log('📐 DEBUG: Inline guessing done');

  // Enable scrolling after all content is set up
  console.log('📐 DEBUG: About to calculate height');
  this.calculateTotalContentHeight();
  console.log('📐 DEBUG: About to enable scroll');
  this.enableScrollableInteraction(this.contentBounds.height);
  console.log('📐 DEBUG: setupGameComponents END');
}
```

### 3. Check Initialization Order
Verify managers exist before using them:

In `setupGameComponents()`, add checks:
```javascript
console.log('Managers ready?', {
  historyManager: !!this.historyManager,
  activeRowManager: !!this.historyManager?.activeRowManager,
  uiLayoutManager: !!this.uiLayoutManager
});
```

### 4. Delay Scroll Setup
Try moving scroll initialization to AFTER first active row is created:

```javascript
setupInlineGuessing() {
  // Create the first active row for inline editing
  this.createNewActiveRow();

  // NOW enable scrolling (after active row exists)
  this.calculateTotalContentHeight();
  this.enableScrollableInteraction(this.contentBounds.height);
}
```

And remove these lines from `setupGameComponents()`.

### 5. Test Without Masking
Temporarily comment out the masking code to see if that's the issue:

In `GameScene.js` lines 188-191:
```javascript
// TEMPORARILY DISABLED FOR TESTING
// const mask = this.make.graphics();
// mask.fillRect(0, headerHeight, width, contentHeight);
// this.scrollableContainer.setMask(mask.createGeometryMask());
```

### 6. Check Active Row Creation
In `ActiveRowManager.js`, verify `createActiveRow()` is being called and completing.

---

## Likely Root Causes

### Theory 1: Scroll Setup Too Early
The scroll system is initialized in `setupGameComponents()` but the active row manager might not be ready yet. The active row is created inside `setupInlineGuessing()`, which is called from `setupGameComponents()`.

**Fix:** Move scroll initialization to AFTER active row creation.

### Theory 2: Geometry Mask Breaks Rendering
The geometry mask might be clipping content incorrectly on initial load.

**Fix:** Test without masking first.

### Theory 3: Content Height Calculation Error
`calculateTotalContentHeight()` is called when `guessCount = 0`, which might return unexpected values.

**Fix:** Check the calculated height value in console logs.

### Theory 4: Event Listener Conflicts
The pointer event listeners in `enableScrollableInteraction()` might be interfering with button clicks.

**Fix:** Add more specific hit area checks or use `event.stopPropagation()`.

---

## Quick Test Plan

1. **Verify basic game still works:**
   - Comment out lines 214-216 in `GameScene.js` (scroll initialization)
   - Reload game - does active row appear now?

2. **Re-enable scrolling gradually:**
   - First enable just masking
   - Then add scroll listeners
   - Then add height calculation
   - Then add auto-scroll

3. **Check each component:**
   - Does `HistoryRenderer` show history correctly?
   - Does `ActiveRowManager` create the row?
   - Does `ElementBar` appear?
   - Does Submit button appear?

---

## Rollback Plan (If Needed)

If scrolling can't be fixed quickly, revert to sliding window:

```bash
git revert HEAD
```

Or manually restore:
1. `HistoryRenderer.js` - restore sliding window logic
2. `GameScene.js` - remove scroll methods and masking
3. `HistoryManager.js` - remove scroll calls
4. `LayoutConfig.js` - restore `HISTORY_SLIDING_WINDOW_SIZE: 6`

---

## Working Configuration (Pre-Scrolling)

Before these changes, the game worked with:
- 6-guess sliding window
- No scrolling
- Active row and element bar visible inline
- Fast load time

The Step 1 (partial revert) commit `ec1f873` is the last known good state.

---

## Final Resolution (January 9, 2026)

### The Fix Process

**Step 1: Added Debug Logging**
Added comprehensive console logging to track initialization order through:
- `GameScene.setupGameComponents()`
- `HistoryManager.createActiveRow()`
- `ActiveRowManager.createActiveRow()`

**Step 2: Identified Root Cause**
Console output revealed: `🔍 ACTIVE ROW: Positioned at Y=NaN after NaN visible history rows`

The problem: `LayoutConfig.HISTORY_SLIDING_WINDOW_SIZE` was deprecated (commented out) but `ActiveRowManager.js` line 80 still referenced it:
```javascript
const maxVisibleGuesses = LayoutConfig.HISTORY_SLIDING_WINDOW_SIZE; // undefined!
```

This caused all position calculations to become `NaN`, making UI elements invisible.

**Step 3: Applied Fixes**

1. **Fixed NaN positioning** ([ActiveRowManager.js:50-67](js/managers/ActiveRowManager.js))
   - Removed reference to deprecated `HISTORY_SLIDING_WINDOW_SIZE`
   - Now uses `guessHistory.length` directly for scrollable content

2. **Fixed header overlap** ([ActiveRowManager.js:55](js/managers/ActiveRowManager.js), [HistoryRenderer.js:27](js/managers/HistoryRenderer.js))
   - Increased top padding from 20px → 30px (small screens)
   - Increased top padding from 15px → 25px (large screens)

3. **Fixed modal z-index** ([UILayoutManager.js:303](js/managers/UILayoutManager.js))
   - Changed modal depth from `UI + 2` (3) → 2000
   - Now appears above all containers (header/footer at depth 1000)

4. **Re-enabled auto-scroll** ([HistoryManager.js:60-68](js/managers/HistoryManager.js))
   - Uncommented `calculateTotalContentHeight()` call
   - Uncommented `scrollToActiveRow()` call
   - Added safety checks to prevent errors

5. **Minimized empty footer** ([GameScene.js:163](js/scenes/GameScene.js))
   - Reduced from 104px (70px + 34px safe area) → 34px (safe area only)
   - Removed footer background visual
   - Reclaimed 70px of usable gameplay space

**Step 4: Cleaned Up Debug Code**
Removed all temporary debug console.log statements from production code.

### Testing Results

✅ All tests passed:
- Active row and element bar appear correctly
- No header overlap
- Modals appear in front of all content
- Mouse wheel scrolling works
- All 10 guesses visible with scrolling
- Footer minimized appropriately

### Key Learnings

1. **Deprecated constants must be fully removed** - Check all references before commenting out config values
2. **NaN propagates silently** - Position calculations with `NaN` don't throw errors, elements just don't render
3. **Z-index in Phaser** - Container depths must be higher than all child content depths
4. **Safe area handling** - Empty footers waste valuable mobile screen space

---

## Files Modified (Final)

1. **js/managers/ActiveRowManager.js** - Fixed NaN calculation, increased top padding
2. **js/managers/HistoryRenderer.js** - Increased top padding to match ActiveRowManager
3. **js/managers/HistoryManager.js** - Re-enabled auto-scroll with safety checks
4. **js/managers/UILayoutManager.js** - Fixed modal depth
5. **js/scenes/GameScene.js** - Minimized footer to safe area only

---

---

## Current Debugging Approach (January 9, 2026 - Evening)

### Debug Overlay Implementation

Added on-screen debug display in `GameScene.js` (commit ca3fa18):
- **Trigger:** Automatically shows for guesses 8, 9, and 10
- **Location:** Top-left corner with semi-transparent black background
- **Depth:** 9999 (appears above all game content)

**Debug Data Shown:**
- Guess number
- Viewport height
- Content height
- Active row Y position
- Total height needed (active row + gap + element bar)
- Screen Y position (where active row appears on screen)
- Bottom Y position (where content ends)
- Visible bottom boundary
- Overflow amount (negative = fits, positive = needs scroll)
- Scroll container Y position

**Testing Instructions:**
1. Play game on iPhone 17 to guesses 8, 9, 10
2. Take screenshots of debug overlay at each guess
3. Test both: with browser bar visible AND in fullscreen mode
4. Share screenshots to identify viewport/scroll calculation issues

### Files with Debug Code (TO BE REMOVED AFTER FIX):
- `GameScene.js` lines 320-353: Debug logging and overlay trigger
- `GameScene.js` lines 666-703: `showScrollDebugOverlay()` method

---

## Status: ⚠️ DEBUGGING IN PROGRESS

Step 2 (Scrollable Content) works on desktop but has auto-scroll issues on iPhone 17 real device. Debug overlay deployed to gather diagnostic data.
