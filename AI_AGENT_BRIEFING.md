# 🤖 AI Agent Onboarding - XmasMM Project

**CONTEXT**: Christmas Mastermind mobile-first game with expert Phaser.js architecture and automated testing.

## 🎯 Agent Role & Expertise
**YOU ARE**: ## 🔄 AI Agent Handoff Protocol
When passing work to the next AI agent:
1. Run full test suite verification
2. Update `PROJECT_STATUS.md` with current state
3. Document any blockers in `ISSUES.md`
4. Ensure all test files are properly organized in `tests/` directory
5. No temporary files in root directory
6. **NEVER** create backup files - use git for version history
7. Verify `test-results/` directory is git-ignored (.gitignore)mobile designer with advanced Phaser.js skills who ALWAYS follows best practices.
- **Mobile-First Design**: Every feature must work perfectly on mobile devices
- **Phaser.js Expert**: Use latest patterns, performance optimization, proper scene management
- **Test-Driven**: All changes must be verifiable through automated testing
- **AI-Agent Friendly**: Create systems that future AI agents can easily understand and extend

## 🚀 Quick Start (Do in Order)
1. **🚨 CRITICAL**: Read `ISSUES.md` for blocking problems
2. Check `PROJECT_STATUS.md` for current state
3. Run test verification: `cd tests && bash verify_tests.sh`
4. Start dev server: `python scripts/dev_server.py` (port 8000)
5. Run `python scripts/automation.py status` to validate system

## ⚠️ Key Rules for AI Agents
- **NEVER** assume tests pass without verification
- **ALWAYS** use `isBackground=false` (never true)
- **ALWAYS** run `cd tests && bash verify_tests.sh` after making changes
- **ALWAYS** run `bash scripts/cleanup_redundancy.sh` to maintain project organization
- **MOBILE-FIRST**: Check `docs/phaser-mobile-architecture.md` for mobile solutions
- **MOBILE-006 CRITICAL**: Use container-based UI patterns from docs/
- Use Git Bash terminal only
- Never update status manually - use automation scripts
- **Mobile-First**: Test on mobile viewport (375x667) minimum
- **Phaser Best Practices**: Use proper scene lifecycle, memory management, responsive scaling

## 🔍 Terminal Output Best Practices (CRITICAL)
**AI Agents must use file-based terminal output for reliability:**

### ❌ **AVOID**: Unreliable terminal tools
- `get_terminal_output` - Often returns "Invalid terminal ID" errors
- Relying on `run_in_terminal` truncated results

### ✅ **USE**: File-based output capture
```bash
# ALWAYS redirect complex command output to test-results/ directory:
command 2>&1 | tee test-results/command_output.log

# Then read the complete results:
read_file("test-results/command_output.log")

# Examples:
cd tests && bash verify_tests.sh 2>&1 | tee test-results/verification.log
python scripts/automation.py status 2>&1 | tee test-results/status.log  
bash scripts/cleanup_redundancy.sh 2>&1 | tee test-results/cleanup.log
```

### 📁 **Output File Organization**
- **test-results/**: All command outputs and logs (git-ignored)
- **NEVER**: Create temp files in project root
- **NEVER**: Keep backup files (use git for version history)
- **ALWAYS**: Clean up temporary files after reading
- **Pattern**: `command_description.log` (descriptive names)
- **Auto-cleanup**: Use `bash scripts/cleanup_redundancy.sh` regularly

### 🎯 **Benefits**
- ✅ Complete output capture (stdout + stderr)
- ✅ Reliable file reading with `read_file` tool
- ✅ Persistent logs for debugging
- ✅ No terminal ID dependency issues
- ✅ Automatic cleanup prevents file accumulation

## 🔧 Essential Commands
### Project Management (with proper output capture)
```bash
# ALWAYS capture output to test-results/ directory:
python scripts/automation.py status 2>&1 | tee test-results/project_status.log
python scripts/automation.py help 2>&1 | tee test-results/task_help.log
python scripts/automation.py update-docs 2>&1 | tee test-results/docs_update.log
```

### Testing & Verification (CRITICAL - use file-based output)
```bash
# Enhanced Node.js testing (NEW - professional tools):
npm run verify-assets 2>&1 | tee test-results/asset_verification.log
npm run debug-interactions 2>&1 | tee test-results/interaction_debug.log
npm test 2>&1 | tee test-results/enhanced_testing.log

# Traditional HTML testing (capture complete output):
cd tests && bash verify_tests.sh 2>&1 | tee test-results/verification.log

# Project organization check:
bash scripts/cleanup_redundancy.sh 2>&1 | tee test-results/cleanup_check.log

# Deep verification (if Node.js available):
cd tests && node automated_test_verifier.js 2>&1 | tee test-results/deep_verification.log

# Development server with logging:
python scripts/dev_server.py 2>&1 | tee test-results/dev_server.log &
```

### Development Server
```bash
# Always use the proper dev server for testing
python scripts/dev_server.py
# Access tests at: http://localhost:8000/tests/

# Node.js tools now available:
node --version  # v22.17.0
npm --version   # v10.9.2
```

## 📁 Critical Files
### Core Documentation
- `ISSUES.md` - 🚨 Blocking problems (check first)
- `PROJECT_STATUS.md` - Real-time progress
- `tests/README.md` - **Complete testing documentation**
- `TECHNICAL_GUIDELINES.md` - Architecture patterns

### Mobile Architecture & Best Practices (ESSENTIAL)
- `docs/phaser-mobile-architecture.md` - **MOBILE-006 solution with Phaser containers**
- `docs/mobile-best-practices.md` - **Mobile UI patterns and implementation**

### Testing System (AI-Agent Optimized)
- `tests/verify_tests.sh` - **Primary verification tool**
- `scripts/cleanup_redundancy.sh` - **Project organization verification**
- `tests/automated_test_verifier.js` - Deep verification
- `tests/test_comprehensive.html` - Integration testing
- `tests/test_mobile_expert.html` - Mobile-specific testing

### Code Architecture
- `js/utils/ModuleLoader.js` - Centralized dependency management
- `js/managers/` - Game state management
- `js/scenes/` - Phaser scene implementations

## 🎮 Phaser.js Best Practices for AI Agents
### Mobile Architecture (CRITICAL for MOBILE-006)
```javascript
// Use container-based UI from docs/phaser-mobile-architecture.md
// Three-zone layout: Header + Scrollable Content + Footer
this.headerContainer = this.add.container(0, 0);
this.scrollableContainer = this.add.container(0, headerHeight);
this.footerContainer = this.add.container(0, height - footerHeight);

// Proper masking for scroll boundaries
const mask = this.make.graphics();
mask.fillRect(x, y, width, height);
scrollableContainer.setMask(mask.createGeometryMask());
```

### Scene Management
```javascript
// Always use proper scene lifecycle
class MyScene extends Phaser.Scene {
    create() {
        // Initialize responsive scaling
        this.scale.on('resize', this.handleResize, this);
    }
    
    handleResize() {
        // Mobile-responsive updates
    }
    
    destroy() {
        // Clean up resources
        this.scale.off('resize', this.handleResize, this);
    }
}
```

### Mobile Optimization
- Use `Phaser.Scale.FIT` with `CENTER_BOTH`
- Test on 375x667 minimum viewport
- Implement touch-friendly UI (44px minimum touch targets)
- Use proper event delegation for mobile performance

## 🧪 Test-First Development for AI Agents
### Before Making Changes
1. Run `cd tests && bash verify_tests.sh` to establish baseline
2. Document expected behavior in test cases
3. Make incremental changes
4. Verify each change with automated tests

### After Making Changes
1. **MANDATORY**: Run `cd tests && bash verify_tests.sh`
2. **RECOMMENDED**: Run `bash scripts/cleanup_redundancy.sh` to maintain organization
3. Update automation status: `python scripts/automation.py update-docs`
4. Document any new patterns or lessons learned
2. Check console for errors in browser tests
3. Test mobile responsiveness
4. Update documentation if architecture changed

## � URGENT HANDOFF ISSUE - MOBILE-006

**CRITICAL BUG DISCOVERED**: `ScrollableHistoryManager` not loading in ModuleLoader system

**Error**: `ScrollableHistoryManager not found after module loading` in `test_mobile_expert.html:190`

**Root Cause**: Missing ModuleLoader registration for:
- `ScrollableHistoryManager.js` 
- `MobileScrollService.js`

**IMMEDIATE FIX REQUIRED**:
1. Check `js/utils/ModuleLoader.js` - add missing managers to module registry
2. Verify dependency order (MobileScrollService before ScrollableHistoryManager)
3. Test `test_mobile_expert.html` loads without errors
4. Update MOBILE-006 status in `ISSUES.md` after fix

**Files to Check**:
- `js/utils/ModuleLoader.js` (add missing modules)
- `test_mobile_expert.html` (verify loading)
- `js/managers/ScrollableHistoryManager.js` (ensure proper class export)

**Priority**: CRITICAL - Mobile game is broken without this fix

---

## �🔄 AI Agent Handoff Protocol
When passing work to the next AI agent:
1. Run full test suite verification
2. Update `PROJECT_STATUS.md` with current state
3. Document any blockers in `ISSUES.md`
4. Ensure all test files are properly organized in `tests/` directory
5. No temporary files in root directory

**System designed for seamless AI agent handoffs - all context preserved in automation and testing.**

## 🔧 Enhanced Testing Tools (Node.js v22.17.0)

### **Professional Debugging System**
New Node.js-based testing tools provide comprehensive analysis:

```bash
# Asset verification with detailed reporting
npm run verify-assets

# Interaction debugging with JSON reports
npm run debug-interactions  

# Combined test suite
npm test

# Review detailed JSON reports
cat test-results/asset_verification_report.json
cat test-results/interaction_debug_report.json
```

### **Testing Workflow Integration**
1. **Traditional**: `cd tests && bash verify_tests.sh` (HTML-based)
2. **Enhanced**: `npm run debug-interactions` (Node.js analysis)
3. **Asset Check**: `npm run verify-assets` (Professional reporting)
4. **Combined**: `npm test` (Full verification suite)

### **Report Analysis** 
- **Status**: `PASSED` (0 issues) or `ISSUES_FOUND` (with details)
- **JSON Structure**: timestamp, summary, issues array, detailed checks
- **File Location**: `test-results/` directory (git-ignored)
