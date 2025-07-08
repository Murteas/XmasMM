# Task 5C: Fix Mobile Layout Issues

**Status**: 📋 QUEUED  
**Objective**: Fix specific mobile layout bugs including modal picker spacing, history display positioning, and button placement conflicts.

## Current Issues to Address

### 1. Modal Picker Layout
- Cancel button overlaps with element grid on small screens
- Need better spacing calculation for different screen sizes

### 2. History Display Issues
- First elements are cut off on left side, especially with 6-element codes
- Row centering not working properly on mobile

### 3. Button Positioning Problems
- Santa's Hint button covered during scrolling
- Scroll buttons not working properly
- Touch targets too small or overlapping

## Implementation Steps

### 1. Fix Modal Picker in `GameScene.js`
- Adjust modal height calculation in `showElementPicker()` method
- Increase spacing between element grid and cancel button
- Test on iPhone SE (375px width) to ensure no overlap

### 2. Fix History Display in `HistoryManager.js`
- Update `renderGuessRow()` method to properly center rows on mobile
- Adjust starting X position calculation for different screen widths  
- Add responsive margins based on screen width and code length

### 3. Optimize Button Positioning
- Reposition Santa's Hint button to avoid scroll conflicts
- Fix scroll down button functionality
- Ensure all buttons remain accessible during gameplay

## Files to Modify
- `js/scenes/GameScene.js` - Modal picker improvements
- `js/managers/HistoryManager.js` - History display positioning

## Success Criteria
- [ ] Cancel button does not overlap with element grid on any iPhone model
- [ ] All elements in history rows are visible on iPhone SE (375px width)
- [ ] Santa's Hint button remains accessible during scrolling
- [ ] Modal picker and scroll functionality work reliably on mobile

## Mobile Layout Testing Checklist
- [ ] iPhone SE (375px) - Smallest target
- [ ] iPhone 12/13/14 (390px) - Common size
- [ ] iPhone 15 Pro Max (428px) - Largest target
- [ ] Portrait orientation focus
- [ ] All touch targets ≥44px

---
**Previous**: Task 5B (Family-Friendly UX)  
**Next**: Task 6 (Christmas Theme)
