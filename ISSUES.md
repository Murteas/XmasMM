# 🐛 Project Issues Tracker

> **For Feature Development**: Use the task system in `tasks/` folder  
> **For System/Infrastructure Problems**: Document here for immediate attention

---

## 🚨 Open Issues

### **UI-001: Score Breakdown Not Displaying on Game Over Screen** 🔧 NEEDS FIX

**Issue ID**: UI-001  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: 🔧 Open  
**Related Task**: RoundOverScene (marked COMPLETED but incomplete)

## Problem Description
The Game Over screen only shows the final score (e.g., "Score: 300 points") but does not display the detailed score breakdown that shows how the score was calculated, despite the breakdown logic being implemented in the code.

## Expected Behavior (from RoundOverScene task requirements)
Should display: "**Scoring breakdown shows formula: Elements + Complete + Speed - Hint = Total**"
Example: `Elements: 200  Complete: +500  Speed Bonus: +50  Hint: -250`

## Current Behavior  
Only shows: `Score: 300 points` (no breakdown visible)

## Root Cause Analysis Needed
- ✅ Code exists in `RoundOver.js` createScoreDisplay() method
- ❓ Score breakdown logic has conditional checks that may be filtering out zero values
- ❓ ScoreManager.getScoreBreakdown() may be returning unexpected data structure
- ❓ Breakdown text may be positioned off-screen or styled invisibly

## Priority Justification
- **Family-friendly transparency**: Players should understand how scores are calculated
- **Educational value**: Helps players learn the scoring system
- **Task completion**: RoundOverScene marked as COMPLETED but key requirement missing

---

## 📋 Closed Issues

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
