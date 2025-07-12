# 🐛 Project Issues Tracker

> **For Feature Development**: Use the task system in `tasks/` folder  
> **For System/Infrastructure Problems**: Document here for immediate attention

---

## 🚨 Open Issues

### **TMS-001: Task Management System Sync Issue**

**Issue ID**: TMS-001  
**Date Reported**: July 12, 2025  
**Severity**: Medium  
**Status**: Open  

## Problem Description
The task management automation system has a synchronization issue where completing a task via `python scripts/automation.py complete <task>` does not properly update the task status in real-time queries.

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
