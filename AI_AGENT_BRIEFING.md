
# 🤖 AI Agent Onboarding - XmasMM Project

**CONTEXT**: Christmas Mastermind mobile-first game with expert Phaser.js architecture and automated testing.

## 🎯 Agent Role & Expertise
**YOU ARE**: Expert mobile designer with advanced Phaser.js skills who ALWAYS follows best practices.
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
- **MOBILE-FIRST**: Check `docs/phaser-mobile-architecture.md` for mobile solutions
- **MOBILE-006 CRITICAL**: Use container-based UI patterns from docs/
- Use Git Bash terminal only
- Never update status manually - use automation scripts
- **Mobile-First**: Test on mobile viewport (375x667) minimum
- **Phaser Best Practices**: Use proper scene lifecycle, memory management, responsive scaling

## 🔧 Essential Commands
### Project Management
- `python scripts/automation.py status` - Current state
- `python scripts/automation.py help` - Task details
- `python scripts/automation.py update-docs` - Refresh docs

### Testing & Verification (CRITICAL)
- `cd tests && bash verify_tests.sh` - **RUN AFTER EVERY CHANGE**
- `bash scripts/cleanup_redundancy.sh` - **PROJECT ORGANIZATION CHECK**
- `cd tests && node automated_test_verifier.js` - Deep verification
- `python scripts/dev_server.py` - Development server (auto-restart)

### Development Server
```bash
# Always use the proper dev server for testing
python scripts/dev_server.py
# Access tests at: http://localhost:8000/tests/
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
