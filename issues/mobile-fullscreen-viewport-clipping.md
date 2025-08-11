# Mobile Fullscreen Viewport Clipping Issue

**Status**: 🔴 ACTIVE  
**Priority**: HIGH  
**Platform**: Mobile devices (real hardware)  
**Affects**: Guess screen, Game Over screen, How to Play screen  

## Problem Description

When the game is accessed via "Add to Home Screen" (PWA fullscreen mode) on real mobile devices, content is clipped at the top and bottom of the screen:

### **Top Clipping**
- Title areas are partially obscured
- Affects: Guess screen header, Game Over header, How to Play title
- **Root Cause**: Status bar area not properly accounted for in fullscreen mode

### **Bottom Clipping** 
- Small blue bar visible at bottom of screen
- **Root Cause**: Home indicator area (iPhone) or navigation bar area (Android) not properly handled

### **Testing Context**
- ✅ **Works Fine**: Desktop browser testing
- ❌ **Broken**: Real mobile device in PWA/fullscreen mode
- **Critical**: This is the primary usage mode for family members

## Technical Analysis

This is a **viewport safe area** issue common in PWA fullscreen mode. The current CSS uses:

```css
/* Current problematic approach */
html, body {
  height: 100vh; /* Uses full viewport height, ignoring safe areas */
  width: 100vw;  /* Uses full viewport width, ignoring safe areas */
}
```

### **Root Causes**
1. **No safe area handling** - `100vh`/`100vw` ignores device-specific safe areas
2. **Missing PWA viewport meta** - Viewport not optimized for fullscreen mode
3. **No CSS env() variables** - Not using safe-area-inset-* values

## Solution Strategy

### **Phase 1: CSS Safe Area Implementation**
```css
/* Fix for mobile safe areas */
html, body {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height (newer browsers) */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Alternative: Use calc() for precise control */
.game-container {
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
}
```

### **Phase 2: Viewport Meta Enhancement**
```html
<!-- Enhanced viewport meta for PWA -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### **Phase 3: Phaser.js Game Dimensions**
Update Phaser game config to respect safe areas:
```javascript
// In main.js - adjust game dimensions for safe areas
const safeHeight = window.innerHeight - (getSafeAreaTop() + getSafeAreaBottom());
const config = {
  width: window.innerWidth,
  height: safeHeight,
  // ...
};
```

## Files to Modify

### **Primary Files**
- `index.html` - Viewport meta tag update
- `styles.css` - Safe area CSS implementation  
- `js/main.js` - Phaser config adjustment for safe areas

### **Secondary Files** 
- `js/utils/GameUtils.js` - Safe area utility functions
- Scene files may need minor positioning adjustments

## Testing Strategy

### **Required Testing**
1. **iPhone Safari** - Add to Home Screen, test in fullscreen
2. **Android Chrome** - Add to Home Screen, test in fullscreen  
3. **Multiple screen sizes** - iPhone SE, iPhone Pro Max, Android variants
4. **Regression testing** - Ensure desktop browser still works

### **Success Criteria**
- ✅ All content visible in fullscreen mode on real devices
- ✅ No clipping at top (titles fully visible)
- ✅ No blue bar at bottom (proper safe area respect)
- ✅ Maintains responsive layout on all screen sizes
- ✅ Desktop browser functionality unchanged

## Priority Justification

**HIGH Priority** because:
- Affects primary usage mode (PWA on mobile devices)
- Impacts game usability for target audience (families)
- Common failure mode when families "install" the game
- Required for production release

---

**Related**: Mobile optimization, PWA functionality  
**Next**: Implement CSS safe area solution
