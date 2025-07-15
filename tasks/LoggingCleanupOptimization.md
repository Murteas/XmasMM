# Logging Cleanup & Optimization

## Task ID: LCO-001
**Priority**: Low  
**Assigned to**: Any Developer  
**Status**: 📋 READY  
**Estimated Effort**: 1-2 hours  
> 📊 **Note**: Status managed in [tasks.json](../tasks.json). Use `python scripts/automation.py status` for current state.

## Overview
Clean up verbose logging added during GAME-001 debugging and standardize logging practices across the codebase. Current logging is functional but overly verbose and inconsistent.

## Specific Issues to Address

### 1. Excessive Diagnostic Logging
**Current State**: Verbose diagnostic logs from GAME-001 debugging still present
**Target**: Clean, professional logging gated behind debug flags

**Files with Verbose Logging**:
- `js/main.js` - Lines 40, 47, 56, 100, 105, 109, 116-124 (diagnostic logs)
- `js/utils/ModuleLoader.js` - Lines 38, 74, 81, 84, 88 (module loading progress)

### 2. Inconsistent Log Levels
**Current State**: Mix of operational logs and debug logs
**Target**: Clear separation between always-shown vs debug-only logs

**Improvements Needed**:
- Gate verbose logs behind `TestConfig.shouldShowDebugLogs()`
- Keep essential operational logs (errors, critical status)
- Remove temporary diagnostic logs from GAME-001 debugging

### 3. Log Standardization
**Current State**: Mixed logging patterns and verbosity levels
**Target**: Consistent approach to logging levels

**Standards to Implement**:
- **Always Show**: Errors, critical status, user-facing messages
- **Debug Only**: Module loading details, diagnostic info, verbose progress
- **Test Only**: Test framework and evaluation logs

## Technical Requirements

### Files to Modify
- `js/main.js` - Clean up GAME-001 diagnostic logs
- `js/utils/ModuleLoader.js` - Gate verbose module loading behind debug flag
- Review other scenes/managers for consistency

### Implementation Pattern
```javascript
// BEFORE (always logs):
console.log('🔧 initializeGame() called - checking scene availability...');

// AFTER (debug-gated):
if (TestConfig && TestConfig.shouldShowDebugLogs()) {
  console.log('🔧 initializeGame() called - checking scene availability...');
}

// Keep essential logs:
console.error('🚨 Failed to create Phaser game instance!'); // Always show errors
```

### Testing Requirements
- Verify debug logs only show when `TestConfig.shouldShowDebugLogs()` returns true
- Ensure essential error messages still display
- Test that game initialization works silently in production mode

## Success Criteria
1. **Clean Production**: Minimal logging in normal operation
2. **Debug Available**: Verbose logs available when needed via TestConfig
3. **Essential Preserved**: Critical errors and status always shown
4. **Consistency**: Standard logging pattern across all files
5. **Performance**: No impact on game performance or initialization

## Dependencies
- Existing TestConfig system for debug flag management
- No breaking changes to game functionality

## Priority Justification
- **Low Priority**: Game is fully functional, this is polish
- **Quick Win**: Simple task for future development sessions
- **Maintenance**: Improves code quality and debugging experience
- **Professional**: Clean console output for production

## Notes
- This was identified during GAME-001 resolution
- Much of the verbose logging was added for debugging and can be cleaned up
- Keep useful operational logs, remove temporary diagnostic logs
- Consider this task when looking for quick polish improvements
