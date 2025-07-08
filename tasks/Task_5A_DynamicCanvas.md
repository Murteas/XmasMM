# Task 5A: Implement Dynamic Canvas Sizing

**Status**: 🎯 CURRENT PRIORITY  
**Objective**: Make the game canvas responsive to different mobile screen sizes and handle device pixel ratios for crisp graphics.

## Current Project State
- ✅ **Foundation Complete**: Working Phaser.js game with modular structure
- ✅ **Game Logic**: Full Mastermind functionality with Christmas theming
- ✅ **Mobile UX**: Modal element picker with Christmas images
- ⚠️ **Issue**: Fixed 800x600 canvas doesn't adapt to different iPhone models

## Why This Matters
Family members will use different iPhone models (SE to Pro Max). The canvas must adapt to provide consistent gameplay experience across all devices.

## Implementation Steps

### Prerequisites Check
- [ ] Verify current `js/main.js` has fixed canvas configuration
- [ ] Confirm game works on desktop browsers as baseline
- [ ] Identify current Phaser scale configuration

### 1. Add Responsive Canvas Logic in `js/main.js`
- Calculate optimal canvas size based on viewport dimensions
- Handle device pixel ratio (1x, 2x, 3x) for crisp graphics
- Account for browser UI space (address bar, navigation)
- Set maximum canvas size to prevent oversized displays

### 2. Update Phaser Configuration
- Modify game config to use calculated dimensions
- Enable scale mode for responsive behavior
- Add resize event listener for orientation changes

### 3. Test Responsive Behavior
- Test on iPhone SE (375px width) minimum
- Test on iPhone 15 Pro Max (428px width) maximum
- Verify canvas adjusts when browser UI appears/disappears

## Files to Modify
- `js/main.js` - Canvas sizing logic and Phaser config
- `styles.css` - Responsive container styles

## Success Criteria
- [ ] Game displays properly on all iPhone models (SE through Pro Max)
- [ ] Canvas adapts smoothly when browser UI changes
- [ ] Graphics remain crisp on high-DPI displays (Retina screens)
- [ ] Game area fills optimal screen space without overflow

## Validation Steps
1. **Desktop Testing**: Verify changes don't break existing functionality
2. **Mobile Simulation**: Test in Chrome DevTools with iPhone presets
3. **Responsive Testing**: Manually resize browser window to verify adaptation
4. **Device Testing**: If possible, test on actual iPhone models
5. **Performance Check**: Ensure no frame rate drops during resize events

## Rollback Plan
- **Backup**: Current `js/main.js` before changes
- **Minimal Change**: Start with simple scale mode adjustment
- **Incremental Testing**: Test each change individually
- **Git Commits**: Commit working states for easy rollback

## Technical Implementation Notes
```javascript
// Example approach for js/main.js
const calculateCanvasSize = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Calculate optimal dimensions accounting for mobile UI
  const maxWidth = Math.min(viewportWidth * 0.95, 800);
  const maxHeight = Math.min(viewportHeight * 0.85, 600);
  
  return { width: maxWidth, height: maxHeight, scale: devicePixelRatio };
};
```

## Mobile Compatibility Focus
- **iPhone SE**: 375px width (minimum target)
- **iPhone 15 Pro Max**: 428px width (maximum target)
- **Portrait orientation**: Primary focus
- **Touch targets**: Maintain 44px minimum for accessibility

---
**Next Task**: Task 5B (Family-Friendly UX Improvements)

## 💡 Java Developer Notes
- **Phaser Scale Modes**: Similar to Java Swing layout managers
- **Device Pixel Ratio**: Like Java's screen DPI scaling
- **Viewport Calculations**: Similar to component sizing in Java UI frameworks
- **Event Listeners**: Comparable to Java ActionListeners for window events
