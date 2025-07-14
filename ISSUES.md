# 🐛 Project Issues Tracker

> **For Feature Development**: Use the task system in `tasks/` folder  
> **For System/Infrastructure Problems**: Document here for immediate attention

---

## 🚨 Open Issues

### **MOBILE-001: Round Over Scene Space Utilization** 🔧 NEEDS IMPROVEMENT

**Issue ID**: MOBILE-001  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Open  
**Related Task**: GameScreenMobileOptimization

## Problem Description
Round over scene doesn't utilize available vertical space effectively, especially on larger mobile screens like iPhone XR. Score display appears to use only ~60% of available screen height.

## Current State
- Score breakdown displays correctly but with minimal spacing
- Large amount of unused vertical space below score elements
- Font sizes appropriate but could be larger for better readability
- Visual hierarchy could be improved with better spacing ratios

## Expected Behavior
- Better utilization of available vertical space for improved readability
- Larger spacing between score elements for cleaner visual hierarchy
- Optimized font sizes and element positioning for mobile screens
- Enhanced visual presentation while maintaining functionality

## Impact
- Suboptimal mobile user experience
- Missed opportunity for better readability and visual appeal
- Screen real estate not effectively utilized for family gaming

## Evidence
- Screenshot feedback showing significant unused vertical space
- Mobile evaluation framework identifies poor space utilization
- Current implementation focuses on functionality over mobile UX optimization

### **MOBILE-002: Score Messaging Clarity** 🔧 NEEDS IMPROVEMENT

**Issue ID**: MOBILE-002  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Open  
**Related Task**: GameScreenMobileOptimization

## Problem Description
Score breakdown uses unclear messaging ("Complete: +300") and provides minimal explanation for speed bonus calculation, making it difficult for users to understand scoring components.

## Current State
- "Complete: +300" message unclear about what was completed
- Speed bonus shows value but lacks context about time-based scoring
- Users may not understand how scoring components are calculated
- Minimal explanation of time limits and speed bonus mechanics

## Expected Behavior
- Clear, descriptive messaging explaining each score component
- Enhanced speed bonus explanation with time context
- User-friendly labels that help family members understand scoring
- Contextual information about time taken vs. time limits

## Proposed Solutions
- Replace "Complete: +300" with clearer options:
  - "Puzzle Solved: +300"
  - "Correct Pattern: +300" 
  - "Solution Found: +300"
- Enhance speed bonus with time context:
  - Show time taken vs. time limit
  - Explain how speed affects bonus calculation
  - Provide encouraging context for time-based scoring

## Impact
- Users may not understand scoring system
- Reduced educational value of the feedback
- Missed opportunity to teach strategy and time management

### **UI-002: Quality Indicator Border Visibility Still Poor** 🔧 NEEDS FIX

**Issue ID**: UI-002  
**Date Reported**: July 12, 2025  
**Updated**: July 14, 2025 - **CONFIRMED in Screenshot 2**  
**Severity**: Medium → **HIGH** (accessibility impact)  
**Status**: 🔧 Open  
**Related Task**: Quality Indicators display  
**Related Issues**: MOBILE-005 (quality indicators in history view)

## Problem Description
Despite changing cyan color (#00E5FF), quality indicator borders are still too muted to see clearly against the blue Christmas background in the history view. **Screenshot 2 confirms this is a critical accessibility issue.**

## Current State
- Cyan color improved visibility slightly
- Borders still blend into blue background making Perfect/Close matches hard to distinguish
- Quality text labels are visible and working well
- **CONFIRMED**: Issue affects entire game history readability

## Proposed Solution
**Updated Priority Solutions** (based on Screenshot 2 analysis):
- **PRIMARY**: White borders (#FFFFFF) with 2px minimum width
- **SECONDARY**: Bright yellow borders (#FFD700) for maximum contrast
- **ACCESSIBILITY**: Add background colors to quality indicators
- **WCAG COMPLIANCE**: Ensure 4.5:1 contrast ratio minimum

## Files to Fix
- `js/managers/HistoryRenderer.js` - Border styling and contrast
- `styles.css` - Color definitions and accessibility standards

### **ASSET-001: Asset Cleanup and Optimization Needed** 🔧 NEEDS CLEANUP

**Issue ID**: ASSET-001  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Open  
**Related Task**: Affects mobile performance and testing efficiency

## Problem Description
Current asset folder contains unnecessary large images that slow down browser loading during development and testing. Some assets may be unused or could be replaced with smaller alternatives. Asset loading affects mobile performance and localhost testing speed.

## Current Asset Issues Identified
- **Large File Sizes**: Some images may be unnecessarily large for web delivery
- **Unused Assets**: Potential duplicate or unused image files taking up space
- **Loading Performance**: Slow asset transfer affects testing iteration speed
- **Mobile Impact**: Large assets negatively affect mobile device performance
- **Potential Element Changes**: May want to replace mistletoe with candy canes using existing images

## Expected Improvements
- **Faster Loading**: Optimized assets for quicker browser transfer
- **Reduced Bundle Size**: Remove unused assets to minimize download
- **Better Mobile Performance**: Right-sized images for mobile devices
- **Efficient Testing**: Faster localhost loading during development
- **Asset Flexibility**: Clean asset structure for easy element swapping

## Proposed Actions
1. **Asset Audit**: Review all files in `assets/` folder for usage and necessity
2. **Size Optimization**: Compress large images while maintaining quality
3. **Unused File Removal**: Identify and remove assets not referenced in code
4. **Resolution Analysis**: Verify 1x/2x/3x images are appropriately sized
5. **Element Alternatives**: Evaluate candy cane replacement for mistletoe
6. **Loading Strategy**: Consider asset loading optimization techniques

## Impact Areas
- **Development Speed**: Faster testing and iteration cycles
- **Mobile Performance**: Better game experience on mobile devices
- **Bandwidth Usage**: Reduced data usage for players
- **Code Maintenance**: Cleaner asset structure for future development

## Investigation Needed
```bash
# Check current asset usage
find assets/ -name "*.png" -exec ls -lh {} \; | sort -k5 -hr
grep -r "assets/" js/ --include="*.js" | sort | uniq
```

## Files to Review
- `assets/*.png` - All image files for size and usage analysis
- `js/scenes/GameScene.js` - Asset loading logic
- `js/scenes/RoundOver.js` - Asset reference patterns
- `js/managers/*.js` - Asset usage in managers

### **TEST-001: Testing Infrastructure Not AI-Agent Friendly** 🔧 PARTIALLY RESOLVED

**Issue ID**: TEST-001  
**Date Reported**: July 12, 2025  
**Last Updated**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Partially Resolved  
**Related Task**: Should be addressed before Testing task

## Problem Description
Current testing infrastructure requires manual gameplay to reach specific game states and doesn't provide AI agents with useful feedback or results. Tests exist but are not effectively usable for automated development workflow.

## Recent Progress ✅
- **Mobile Evaluation Framework**: Created `tests/test_mobile_evaluation.html` with AI-readable console output
- **Automated Analysis**: `scripts/mobile_evaluation.py` provides status analysis and debug output
- **Debug Infrastructure**: Console-based reporting system for layout validation
- **Issue Detection**: Automated identification of mobile UX problems with severity classification

## Remaining Limitations ⚠️
- **Game State Setup**: Still requires manual gameplay for specific scenarios
- **Cross-Scene Testing**: Limited automated flow between different game screens
- **Score Scenario Testing**: Manual setup needed for different score combinations
- **Complete AI Integration**: Framework exists but needs integration into main workflow

## Expected Behavior
Tests should provide:
- **Automated State Setup**: Create specific game scenarios programmatically ✅ PARTIAL
- **AI-Readable Output**: Generate test reports in files/console that AI can analyze ✅ COMPLETE
- **Comprehensive Coverage**: Test all major game states without manual intervention ⚠️ PARTIAL
- **Debug Information**: Detailed logging and state snapshots for issue identification ✅ COMPLETE

## Next Steps
1. **Integrate Mobile Framework**: Add mobile evaluation to main testing workflow
2. **Expand Coverage**: Create frameworks for game state testing beyond mobile layout
3. **Automated Scenarios**: Build programmatic setup for different game outcomes
4. **Documentation**: Update testing procedures with new AI-friendly frameworks

## Files Created
- `tests/test_mobile_evaluation.html` - Mobile-specific evaluation with console output
- `scripts/mobile_evaluation.py` - Analysis runner with AI-readable results
- `mobile-issues-consolidation.md` - Comprehensive mobile status analysis

## Current Testing Limitations
- **Manual Testing Required**: Developer must manually play through games to test specific scenarios
- **No AI-Readable Results**: Tests don't output results that AI agents can analyze
- **Limited State Setup**: Can't easily create specific game states for testing
- **No Automated Feedback**: Test results not captured for review and debugging

## Expected Behavior
Tests should provide:
- **Automated State Setup**: Create specific game scenarios programmatically
- **AI-Readable Output**: Generate test reports in files/console that AI can analyze
- **Comprehensive Coverage**: Test all major game states without manual intervention
- **Debug Information**: Detailed logging and state snapshots for issue identification

## Impact on Development
- **Inefficient Workflow**: Manual testing slows down development cycles
- **Limited AI Assistance**: AI agents can't effectively use current test infrastructure
- **Reduced Quality Assurance**: Difficult to verify fixes across all scenarios
- **Developer Burden**: Testing becomes time-consuming manual process

## Proposed Solutions
1. **Automated Test Runners**: Scripts that set up game states and run tests
2. **AI-Friendly Output**: JSON/text reports that AI agents can read and analyze
3. **State Management**: Programmatic setup of specific game scenarios
4. **Console Integration**: Better debug logging and error reporting
5. **Test Documentation**: Clear descriptions of what each test verifies

## Implementation Ideas
```javascript
// Example: AI-readable test output
TestRunner.runTest('score-breakdown', {
  setup: () => createGameState({ score: 300, won: false }),
  verify: () => checkScoreBreakdownVisible(),
  output: 'test-results/score-breakdown.json'
});
```

## Priority Justification
- **Development Efficiency**: Faster iteration cycles with automated testing
- **AI Integration**: Enables AI agents to effectively contribute to quality assurance
- **Code Quality**: Better test coverage leads to more reliable game experience
- **Workflow Improvement**: Reduces manual testing burden on developers

### **MOBILE-003: Round Over Scene Space Utilization & Layout Critical Issues**

**Date**: July 14, 2025  
**Source**: Mobile developer expert screenshot analysis  
**Severity**: 🔴 HIGH - Multiple critical mobile UX problems  
**Status**: 🆕 NEW  

**Critical Issues Identified:**

1. **Massive Wasted Space** (75% of screen unused)
   - Huge empty blue area below active game row
   - Poor vertical space utilization on mobile viewport  
   - Content concentrated in top third of screen

2. **Touch Target & Layout Problems**
   - "TAP" labels on input slots unclear and potentially too small
   - Input slots appear cramped horizontally
   - Submit button placement not optimized for thumb reach

3. **Content Hierarchy Issues**
   - "Christmas Feedback" modal obscures critical game information
   - "Perfect Match!" feedback takes prime screen real estate
   - Game state info (Guesses: 15, 0/15) positioning suboptimal

4. **Modal Design Problems**
   - Feedback modal blocks interaction with game
   - No clear dismissal affordance visible
   - Modal positioning doesn't follow mobile best practices

5. **Navigation & Flow Issues**
   - "Back" button in hard-to-reach bottom-left corner
   - No clear indication of next action
   - Potential dead-end state after round completion

**Impact**: Poor mobile user experience, accessibility issues, inefficient space usage

**Recommended Solutions**:
- Compact layout redesign with portrait-first approach
- Touch target optimization (minimum 44px)
- Bottom sheet modal design with clear dismiss gestures
- Mobile-first responsive breakpoints implementation

**Specific Implementation Steps**:

1. **Space Utilization Fix** - Priority: HIGH
   - Move game history display above active input row
   - Reduce vertical padding/margins by 60-70%
   - Implement CSS Grid with `grid-template-rows: auto 1fr auto`
   - Add `max-height: 80vh` to prevent excessive spacing

2. **Touch Target Optimization** - Priority: HIGH
   - Increase input slot minimum size to 44px × 44px
   - Replace "TAP" text with intuitive icons or visual cues
   - Add 8px minimum spacing between touch targets
   - Move Submit button to right thumb zone (bottom-right)

3. **Modal Redesign** - Priority: MEDIUM
   - Convert feedback modal to bottom sheet design
   - Add swipe-down dismiss gesture
   - Position modal to preserve game state visibility
   - Implement backdrop blur instead of full overlay

4. **Files to Modify**:
   - `js/scenes/GameScene.js` - Layout restructuring
   - `js/managers/UILayoutManager.js` - Touch target sizing
   - `styles.css` - Mobile-first responsive rules
   - `js/scenes/RoundOver.js` - Modal positioning

---

## MOBILE-004: Performance & Rendering Optimization Needs

**Date**: July 14, 2025  
**Source**: Mobile developer expert screenshot analysis  
**Severity**: 🟡 MEDIUM - Performance optimization opportunities  
**Status**: 🆕 NEW  

**Performance Concerns Observed:**

1. **Rendering Inefficiencies**
   - Complex background effects rendering in unused screen space
   - Potential GPU overdraw from layered visual effects
   - Christmas tree decoration rendering may impact frame rate

2. **Resource Usage**
   - Background particle systems consuming resources unnecessarily
   - Multiple visual layers without clear performance optimization

**Impact**: Potential frame rate drops, battery drain, slower performance on older devices

**Recommended Technical Fixes**:
- Implement texture atlasing for UI elements
- Add object pooling for repeated visual elements  
- Optimize background rendering layers and effects
- Viewport culling for off-screen elements

**Specific Implementation Steps**:

1. **Background Optimization** - Priority: MEDIUM
   - Implement viewport culling for particle effects
   - Reduce background complexity in unused screen areas
   - Add performance monitoring with `Phaser.Display.FPS`
   - Use `Phaser.GameObjects.RenderTexture` for static backgrounds

2. **Texture Management** - Priority: MEDIUM
   - Create texture atlas for UI elements using `Phaser.Textures.TextureManager`
   - Implement sprite batching for repeated elements
   - Add texture compression for mobile devices
   - Use `Phaser.Cache.BaseCache.removeByKey()` for unused assets

3. **Performance Monitoring** - Priority: LOW
   - Add frame rate monitoring in debug mode
   - Implement memory usage tracking
   - Create performance budget warnings
   - Add device capability detection

4. **Files to Modify**:
   - `js/scenes/GameScene.js` - Background optimization
   - `js/managers/UILayoutManager.js` - Texture atlas implementation
   - `js/utils/GameUtils.js` - Performance monitoring utilities

---

## MOBILE-006: Browser UI Overlap & Horizontal Layout Critical Issues

**Date**: July 14, 2025  
**Source**: Mobile developer expert screenshot analysis (Screenshot 3 - Browser Overlap)  
**Severity**: 🔴 CRITICAL - Blocks game interaction  
**Status**: 🆕 NEW  

**Critical Issues Identified:**

1. **Mobile Browser Address Bar Overlap** - BLOCKING ISSUE
   - Safari address bar overlaps bottom game row (active input area)
   - Submit button potentially inaccessible when address bar is visible
   - Game becomes unplayable when browser UI is active
   - No viewport compensation for mobile browser chrome

2. **Horizontal Layout Inefficiency** - HIGH IMPACT
   - Game elements clustered too far left, wasting right side space
   - Quality feedback panel cramped on right edge
   - Poor horizontal balance creates asymmetric, unprofessional appearance
   - Feedback stars/bells have insufficient space for clear display

3. **Responsive Viewport Issues** - CRITICAL
   - Game not accounting for dynamic viewport height changes
   - Missing `viewport-fit=cover` and safe area handling
   - No compensation for mobile browser UI transitions
   - Fixed positioning issues with browser chrome behavior

4. **Touch Target Accessibility** - HIGH
   - Bottom row elements potentially unreachable due to browser overlap
   - Critical interaction zone blocked by mobile UI elements
   - No fallback positioning for browser UI conflicts

**Impact**: **GAME-BREAKING** on mobile Safari, poor professional appearance, accessibility violations

**Expert Mobile Developer Recommendations**:

1. **IMMEDIATE: Viewport Safe Area Implementation** - Priority: CRITICAL
   - Add `viewport-fit=cover` meta tag for full screen support
   - Implement CSS `env(safe-area-inset-bottom)` for browser chrome
   - Add dynamic viewport height detection (`100dvh` instead of `100vh`)
   - Create bottom padding buffer zone (60px minimum) for browser UI

2. **Horizontal Rebalancing** - Priority: HIGH
   - Shift entire game grid 10-15% left to center content
   - Expand feedback panel width by 30-40% for better readability
   - Implement responsive grid with `justify-content: space-between`
   - Add horizontal margins for better visual balance

3. **Mobile Browser Integration** - Priority: CRITICAL
   - Detect iOS Safari and add specific bottom padding
   - Implement viewport change listeners for browser UI transitions
   - Add `minimal-ui` viewport setting for reduced browser chrome
   - Test with both address bar visible/hidden states

4. **Files to Modify** - URGENT:
   - `index.html` - Meta viewport tags and safe area CSS
   - `styles.css` - Responsive grid and safe area implementation
   - `js/managers/UILayoutManager.js` - Dynamic viewport handling
   - `js/scenes/GameScene.js` - Bottom padding and positioning

**Technical Implementation Details**:

```css
/* CRITICAL: Add to styles.css */
:root {
  --safe-area-bottom: env(safe-area-inset-bottom, 60px);
}

.game-container {
  padding-bottom: calc(var(--safe-area-bottom) + 20px);
  min-height: 100dvh; /* Dynamic viewport height */
}

.active-row {
  bottom: calc(var(--safe-area-bottom) + 40px);
}
```

```html
<!-- CRITICAL: Update index.html viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
```

**Priority**: This issue should be fixed BEFORE any other mobile work as it makes the game unplayable on iOS Safari.

---

## MOBILE-005: Quality Indicator Visibility & History Display Issues

**Date**: July 14, 2025  
**Source**: Mobile developer expert screenshot analysis (Screenshot 2 - Game History)  
**Severity**: 🟡 MEDIUM - Usability and visual clarity problems  
**Status**: 🆕 NEW  

**Critical Issues Identified:**

1. **Quality Indicator Border Problems** (Confirms UI-002)
   - Cyan borders barely visible against blue Christmas background
   - Quality indicators difficult to distinguish between Perfect/Close matches
   - Poor contrast ratio fails accessibility standards

2. **History Row Spacing Issues**
   - Rows appear cramped with minimal vertical spacing
   - Touch targets for history rows may be too small for easy interaction
   - Difficult to scan through multiple guess attempts

3. **Element Size Consistency**
   - Game elements appear smaller in history than in active row
   - Size inconsistency creates visual hierarchy confusion
   - May impact readability of Christmas element details

4. **Modal Overlay Design Problems** (Confirms MOBILE-003)
   - "Christmas Feedback" modal still blocks critical game information
   - Modal positioned over game history disrupts user flow
   - No clear visual indication of how to dismiss modal

**Impact**: Reduced accessibility, difficult history review, poor visual hierarchy

**Specific Implementation Steps**:

1. **Quality Indicator Enhancement** - Priority: HIGH
   - Change border color to white or bright yellow (#FFD700)
   - Increase border width from 1px to 2px minimum
   - Add background color to quality indicators for better contrast
   - Implement proper WCAG 2.1 contrast ratios (4.5:1 minimum)

2. **History Layout Optimization** - Priority: MEDIUM
   - Increase vertical padding between history rows (8-12px minimum)
   - Ensure history row touch targets meet 44px minimum
   - Add subtle hover/tap states for interactive elements
   - Optimize element sizing consistency across all views

3. **Modal UX Improvements** - Priority: MEDIUM
   - Reposition modal to bottom 30% of screen
   - Add semi-transparent backdrop instead of full overlay
   - Implement tap-outside-to-dismiss functionality
   - Add visual dismiss affordance (X button or swipe indicator)

4. **Files to Modify**:
   - `js/managers/HistoryRenderer.js` - Quality indicator styling
   - `js/managers/HistoryScroller.js` - Row spacing optimization
   - `styles.css` - Contrast and accessibility improvements
   - `js/scenes/GameScene.js` - Modal positioning logic

---

*No open issues currently*

---

## 📋 Closed Issues

### **UI-003: Misleading Live Score During Gameplay** ✅ RESOLVED

**Issue ID**: UI-003  
**Date Reported**: July 12, 2025  
**Date Resolved**: July 12, 2025  
**Severity**: Medium  
**Status**: ✅ Closed  
**Related Task**: Scoring system consistency

## Problem Description (RESOLVED)
During gameplay, the score display showed legacy scoring (1000 - guesses*100) but at game end it switched to element-based scoring with completely different logic, creating a confusing user experience.

## Solution Implemented
Replaced misleading live score with clear progress indicator:
- Changed `Score: 700` to `Guesses: 3/10`
- Reserved actual scoring for the educational breakdown at game end
- Now focuses on strategic thinking rather than score optimization during play

## Files Modified
- `js/managers/UILayoutManager.js` - Updated display text to show guess progress
- `js/managers/ScoreManager.js` - Modified updateScoreDisplay method

### **SCORE-001: Score Calculation and Display Issues** ✅ RESOLVED

**Issue ID**: SCORE-001  
**Date Reported**: July 12, 2025  
**Date Resolved**: July 12, 2025  
**Severity**: High  
**Status**: ✅ Closed  
**Related Task**: RoundOverScene, ScoreManager logic

## Problem Description (RESOLVED)
Score calculation was fundamentally broken due to legacy scoring system being used instead of proper element-based scoring.

## Root Cause Identified
`GameInputHandler.js` was calling `ScoreManager.calculateScore()` (legacy 1000-based scoring) instead of `ScoreManager.calculateFinalScore()` (proper element-based scoring with complete bonus, hint penalties, etc.)

## Solution Implemented
- Modified `GameInputHandler.transitionToRoundOver()` to call `calculateFinalScore()` instead of legacy scoring
- Added safety check in ScoreManager for winning games to ensure proper element points
- This enables proper display of element points, complete bonus, speed bonus, and hint penalties

## Files Modified
- `js/managers/GameInputHandler.js` - Fixed scoring method call
- `js/managers/ScoreManager.js` - Added safety checks for winning games

### **UI-001: Score Breakdown Not Displaying on Game Over Screen** ✅ RESOLVED

**Issue ID**: UI-001  
**Date Reported**: July 12, 2025  
**Date Resolved**: July 12, 2025  
**Severity**: Medium  
**Status**: ✅ Closed  
**Related Task**: RoundOverScene (marked COMPLETED but incomplete)

## Problem Description
The Game Over screen only shows the final score (e.g., "Score: 300 points") but does not display the detailed score breakdown that shows how the score was calculated, despite the breakdown logic being implemented in the code.

## Root Cause Found
The score breakdown logic in `RoundOver.js` had conditional checks that filtered out zero values:
```javascript
if (breakdown.elementPoints > 0) breakdownParts.push(`Elements: ${breakdown.elementPoints}`);
```
This meant if a player scored 0 element points, the breakdown would be empty or nearly empty.

## Resolution Applied
**Fixed Code Logic:**
- Always display element points (even if 0) for transparency
- Show bonuses/penalties only when non-zero to avoid clutter
- Added fallback for edge cases where all values are 0
- Added debug logging to verify data structure

**Verification:**
- ✅ Score breakdown now always shows: `Elements: X  Complete: +Y  Speed: +Z`
- ✅ Educational transparency restored for family-friendly gameplay
- ✅ RoundOverScene task requirements now fully implemented

## Files Modified
- `js/scenes/RoundOver.js` - Fixed conditional logic in `createScoreDisplay()`

### **TMS-001: Task Management System Sync Issue** ✅ RESOLVED

**Issue ID**: TMS-001 → **Archived**: See `issues/archived/session-001-july-12-2025.md`  
**Date**: July 12, 2025 | **Status**: ✅ Closed  
**Quick Summary**: Task automation sync issue resolved with manual fix

---

## 📁 Issue Archive
- **Older Issues**: See `issues/archived/` for complete historical record
- **Archive Policy**: Closed issues moved after 2-3 sessions to keep this file scannable
- **Full Context**: All archived issues retain complete details and solutions

---

## 📝 Issue Guidelines

### When to Create an Issue (vs Task):
- ✅ **System/Infrastructure problems** (automation, build, deployment)
- ✅ **Blocking bugs** that prevent current development
- ✅ **Critical fixes** that can't wait for task prioritization
- ✅ **Technical debt** that affects multiple features

### When to Create a Task Instead:
- 📋 **Feature development** (new game functionality)
- 📋 **Planned improvements** (can be prioritized and scheduled)
- 📋 **Enhancement requests** (non-critical additions)
- 📋 **Refactoring work** (planned code improvements)

### Issue Format:
- **Issue ID**: Unique identifier (TMS-001, etc.)
- **Date Reported**: When discovered
- **Severity**: Critical/High/Medium/Low
- **Status**: Open/In Progress/Closed
- **Clear Description**: Problem, symptoms, impact
- **Next Steps**: Actionable investigation/fix steps

---

## 🚀 Priority Recommendations for Next Work Session

**Based on Screenshot Analysis (July 14, 2025) - UPDATED with Screenshot 3**

### **🚨 CRITICAL - GAME-BREAKING ISSUE**
1. **MOBILE-006**: Browser UI Overlap (CRITICAL)
   - **BLOCKS GAME ON iOS SAFARI** - Submit button inaccessible
   - Must be fixed FIRST before any other work
   - Requires viewport safe area implementation

### **IMMEDIATE PRIORITY** - Critical Mobile UX Issues  
2. **UI-002** + **MOBILE-005**: Quality Indicator Visibility (HIGH)
   - Confirmed accessibility failure across multiple screenshots
   - Affects entire game history readability
   - Quick fix with high user impact

3. **MOBILE-006**: Horizontal Layout Rebalancing (HIGH)
   - Poor visual balance confirmed in Screenshot 3
   - Professional appearance impact
   - Feedback panel space optimization needed

### **HIGH PRIORITY** - Core Mobile Experience
4. **MOBILE-003**: Space Utilization in Round Over Scene (HIGH)  
   - 75% screen waste confirmed in Screenshot 1
   - Critical mobile experience issue
   - Blocks effective mobile optimization

### **MEDIUM PRIORITY** - Polish and Performance
5. **MOBILE-005**: History Display Improvements (MEDIUM)
   - Row spacing and touch targets
   - Element size consistency
   - Modal positioning improvements

6. **MOBILE-004**: Performance Optimization (MEDIUM)
   - Background rendering efficiency after layout fixes
   - Texture management
   - Mobile performance monitoring

### **🎯 UPDATED TASK SEQUENCE RECOMMENDATION**
1. **EMERGENCY FIX**: MOBILE-006 browser overlap (CRITICAL - game breaking)
2. **Complete Current**: MobileLayoutOptimization task (44% done) 
3. **Visual Polish**: UI-002 + MOBILE-005 quality indicators
4. **Layout Optimization**: MOBILE-003 space utilization  
5. **Continue Sequence**: GameScreenMobileOptimization task
6. **Performance Pass**: MOBILE-004 optimizations

**⚠️ Why This Order**: Browser overlap makes the game unplayable on iOS Safari (most family mobile usage). This MUST be fixed first. Then visual quality improvements, followed by layout optimization and performance.
