# Code Cleanup Plan - Post Spacing Fix

## Issues to Address

### 1. Element Bar Off-Screen (9+ Guesses)
- **Issue**: Element bar gets cut off when there are 9+ guesses visible
- **Plan**: Adjust element bar positioning or scroll logic to ensure it stays visible
- **Priority**: Medium (minor visual issue)

### 2. Mouse Drag Scroll Behavior
- **Issue**: Left mouse drag on history causes element bar to disappear and changes submit button
- **Plan**: Disable or fix the scroll simulation behavior
- **Priority**: High (confusing user experience)

### 3. Excessive Debug Logging
- **Files to Clean**: 
  - ActiveRowManager.js
  - HistoryRenderer.js  
  - HistoryManager.js
  - GameScene.js
  - HistoryScroller.js
- **Plan**: Remove debug console.log statements, keep only essential error logging

### 4. Legacy Code References
- **Remove**: References to footer containers, old coordinate systems
- **Clean**: Obsolete comments and unused code paths
- **Files**: GameScene.js, ActiveRowManager.js, HistoryRenderer.js

### 5. Hardcoded Values → Constants
- **Convert**: All hardcoded spacing, sizes, colors to LayoutConfig constants
- **Standardize**: Use consistent constant naming patterns
- **Centralize**: Move all layout constants to LayoutConfig.js

### 6. Coordinate System Consolidation
- **Current Issue**: Multiple coordinate systems (absolute, container-relative, scroll-adjusted)
- **Plan**: Standardize on container-relative coordinates throughout
- **Simplify**: Remove unnecessary coordinate transformations

### 7. Architecture Improvements
- **Consistent Patterns**: Use same approach for similar functionality across files
- **Clear Separation**: Current vs legacy code
- **Better Documentation**: Clear architectural decisions

## Implementation Order
1. Clean debug logs (quick wins)
2. Fix element bar positioning issue
3. Disable problematic scroll behavior  
4. Convert hardcoded values to constants
5. Remove legacy references
6. Consolidate coordinate systems
7. Final architecture cleanup
