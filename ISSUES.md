# 🐛 Project Issues Tracker

> **For Feature Development**: Use the task system in `tasks/` folder  
> **For System/Infrastructure Problems**: Document here for immediate attention

---

## 🚨 Open Issues

### **UI-002: Quality Indicator Border Visibility Still Poor** 🔧 NEEDS FIX

**Issue ID**: UI-002  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Open  
**Related Task**: Quality Indicators display

## Problem Description
Despite changing cyan color (#00E5FF), quality indicator borders are still too muted to see clearly against the blue Christmas background in the history view.

## Current State
- Cyan color improved visibility slightly
- Borders still blend into blue background
- Quality text labels are visible and working well

## Proposed Solution
Consider stronger contrast options:
- White borders with colored text
- Thicker border width (2px instead of 1px)
- Alternative bright colors (yellow, lime green)
- Dark borders with light text

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

### **TEST-001: Testing Infrastructure Not AI-Agent Friendly** 🔧 NEEDS IMPROVEMENT

**Issue ID**: TEST-001  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Open  
**Related Task**: Should be addressed before Testing task

## Problem Description
Current testing infrastructure requires manual gameplay to reach specific game states and doesn't provide AI agents with useful feedback or results. Tests exist but are not effectively usable for automated development workflow.

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
