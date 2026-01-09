# Debugging Notes - Step 2 Scrolling Implementation

**Date:** January 8, 2026
**Status:** Work in Progress - Needs Debugging

---

## Current Issue

After implementing Step 2 (scrollable content), the game exhibits these problems:
1. **Long load time** - Game takes significantly longer to load after pressing "Start Game"
2. **Missing UI elements** - Active row and element bar do not appear on initial load
3. **Root cause** - Likely initialization timing/order issue

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

## Next Session Checklist

- [ ] Add console logging to track initialization order
- [ ] Test without masking
- [ ] Move scroll setup to after active row creation
- [ ] Re-enable auto-scroll with proper guards
- [ ] Test with 0 guesses, 1 guess, 6 guesses, 10 guesses
- [ ] Test on actual mobile device
- [ ] Performance test with 20+ guesses

---

## Contact / Questions

When continuing work:
1. Check browser console first (F12 → Console)
2. Look for any red errors
3. Check the initialization order logs
4. Test one component at a time

Good luck debugging! The core scrolling logic is sound - it's just a timing issue with when things initialize.
