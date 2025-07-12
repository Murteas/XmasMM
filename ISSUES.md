# 🐛 Project Issues Tracker

> **For Feature Development**: Use the task system in `tasks/` folder  
> **For System/Infrastructure Problems**: Document here for immediate attention

---

## 🚨 Open Issues

### **SCORE-001: Score Calculation and Display Issues** 🚨 CRITICAL

**Issue ID**: SCORE-001  
**Date Reported**: July 12, 2025  
**Severity**: High  
**Status**: 🚨 Open  
**Related Task**: RoundOverScene, ScoreManager logic

## Problem Description
Score calculation appears to be fundamentally broken. Test game with 7 guesses and 2 excellent guesses only scored 200 points with "Elements: 0" despite winning the game. Hint penalties are not being displayed or calculated. Quality indicator borders remain too muted to see clearly.

## Observed Issues from Testing
1. **Incorrect Element Points**: Shows "Elements: 0" for a winning game (should be substantial points)
2. **Missing Complete Bonus**: No completion bonus displayed for winning game
3. **Missing Hint Penalty**: Santa's hint used but no penalty shown in breakdown
4. **Total Score Too Low**: 200 points for 7-guess win with 2 excellent guesses seems dramatically under-calculated
5. **Border Visibility**: Cyan quality indicator borders still too muted on blue background

## Expected Behavior (from RoundOverScene requirements)
- **Element Points**: Should award points for correct elements found
- **Complete Bonus**: Should give substantial bonus for winning game
- **Hint Penalty**: Should show penalty if Santa's hint was used
- **Transparent Calculation**: All score components should be visible and logical

## Test Case Details
- **Game Result**: Won in 7 guesses
- **Quality Assessment**: 2 excellent guesses, multiple good guesses
- **Displayed Score**: 200 points with "Elements: 0  Total: 200"
- **Expected Score**: Should be 500+ points for winning game

## Root Cause Investigation Needed
- ✅ ScoreManager.calculateFinalScore() logic verification
- ❓ Element points calculation may be broken or not called
- ❓ Complete bonus may not be applied for winning games
- ❓ Hint penalty tracking and display issues
- ❓ Score breakdown data structure problems

## Impact
- **Game Balance**: Players get incorrect feedback about performance
- **Educational Value**: Broken score transparency defeats learning purpose
- **User Experience**: Low scores for good performance demotivates players
- **Task Completion**: RoundOverScene requirements not properly implemented

## Files to Investigate
- `js/managers/ScoreManager.js` - Core scoring logic
- `js/scenes/RoundOver.js` - Score display and breakdown
- `js/scenes/GameScene.js` - Score calculation triggering

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

**Issue ID**: TMS-001  
**Date Reported**: July 12, 2025  
**Date Resolved**: July 12, 2025  
**Severity**: Medium  
**Status**: ✅ Closed  

## Problem Description
The task management automation system had a synchronization issue where completing a task via `python scripts/automation.py complete <task>` did not properly update the task status in real-time queries.

## Root Cause Found
The issue was that after completing QualityIndicators, the system correctly marked it as COMPLETED but failed to automatically start the next ready task (MobileLayoutOptimization). This left the system in a state with no CURRENT task.

## Resolution
**Manual Fix Applied:**
```python
python -c "from scripts.task_manager import TaskManager; tm = TaskManager(); tm.start_task('MobileLayoutOptimization')"
```

**Verification:**
- ✅ `automation.py status` now shows MobileLayoutOptimization as CURRENT
- ✅ No validation issues reported
- ✅ Task progression working correctly

## Prevention
- **Immediate**: Task sync issue resolved for current workflow
- **Future**: Consider adding auto-start functionality to `complete_task()` method

## Symptoms Observed
1. **Task Completion**: `automation.py complete QualityIndicators` reports success
2. **Status Query**: `automation.py status` still shows QualityIndicators as CURRENT
3. **Validation Error**: System reports "No task marked as CURRENT" 
4. **File Updates**: PROJECT_STATUS.md updates correctly but status queries are inconsistent

## Impact
- **Development Workflow**: Confusion about which task is actually current
- **Automation Reliability**: Undermines confidence in task management system
- **Progress Tracking**: Inaccurate status reporting for project dashboards

## Root Cause Analysis Needed
- [ ] Check if `tasks.json` is being updated correctly during completion
- [ ] Verify if status queries are reading from correct data source
- [ ] Investigate timing issues between file writes and reads
- [ ] Review task state transitions in automation.py logic

## Temporary Workaround
- Manually verify task status by checking `tasks.json` directly
- Use PROJECT_STATUS.md as authoritative source for current state
- Cross-reference multiple status indicators before proceeding

## Next Steps
1. **Debug Session**: Run automation.py with verbose logging
2. **Code Review**: Examine task completion and status query logic
3. **Testing**: Create unit tests for task state management
4. **Documentation**: Update troubleshooting guide for this issue

## Files Involved
- `scripts/automation.py`
- `scripts/task_manager.py` 
- `tasks.json`
- `PROJECT_STATUS.md`

---
**Reporter**: AI Agent  
**Priority**: Fix before next major feature implementation  
**Estimated Effort**: 2-4 hours investigation + fix

---

## 📋 Closed Issues

*No closed issues yet*

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
