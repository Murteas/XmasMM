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
4. Check if dev server is running on port 8000, if not ask for it to be started, and pause while it is started and check again.
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

## 🔧 Essential Commands & Testing

### **Quick Status Check**
```bash
cd "/c/djs.projects/XmasMM"
cat PROJECT_STATUS.md                     # Live project status
python scripts/automation.py status       # Current task details
cd tests && bash verify_tests.sh          # Verify all systems working
```

### **Development Server** 
```bash
python scripts/dev_server.py              # Start dev server (recommended)
# OR python -m http.server 8000           # Manual server (blocks terminal)
# Access tests at: http://localhost:8000/tests/
```

### **File-Based Command Output** (CRITICAL)
Always capture command output to files for reliability:
```bash
# Capture output to test-results/ directory:
cd tests && bash verify_tests.sh 2>&1 | tee ../test-results/verification.log
python scripts/automation.py status 2>&1 | tee test-results/status.log
```

### **Testing System**
- **Primary**: `cd tests && bash verify_tests.sh` - HTML-based verification
- **Enhanced**: `npm test` - Node.js tools (if available)
- **Mobile**: `tests/test_mobile_expert.html` - Mobile-specific testing

## 📁 Critical Files

### **Core Documentation**
- `ISSUES.md` - 🚨 Active issues only (cleaned up)
- `PROJECT_STATUS.md` - Real-time progress (auto-updated)
- `README.md` - Project overview

### **Mobile Architecture** (ESSENTIAL)
- `docs/phaser-mobile-architecture.md` - **MOBILE-006 solution patterns**
- `docs/mobile-best-practices.md` - **Mobile UI implementation**

### **Testing & Code**
- `tests/verify_tests.sh` - **Primary verification tool**
- `tests/test_mobile_expert.html` - Mobile-specific testing
- `js/managers/` - Game state management
- `js/scenes/` - Phaser scene implementations

### **Task System**
- `tasks/` - Individual task documentation
- `tasks.json` - Machine-readable task registry

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

### **Before Making Changes**
1. Run `cd tests && bash verify_tests.sh` to establish baseline
2. Check `ISSUES.md` for any blocking problems
3. Review `PROJECT_STATUS.md` for current task context

### **After Making Changes**
1. **MANDATORY**: Run `cd tests && bash verify_tests.sh`
2. Check console for errors in browser tests
3. Test mobile responsiveness if mobile changes made
4. Update `ISSUES.md` if bugs resolved

## 🔄 AI Agent Handoff Protocol
When passing work to the next AI agent:
1. Run `cd tests && bash verify_tests.sh` for verification
2. Update `ISSUES.md` with current state 
3. Document any blockers or discoveries
4. Ensure no temporary files in root directory
5. Keep project clean and organized

**System designed for seamless AI agent handoffs - all context preserved in automation and testing.**

---

## � Quick Reference

### **Project Status**: Mobile game 100% functional ✅
- Footer layout working, element selection working, mobile optimized
- Current focus: Polish and architecture improvements

### **Next Priorities**:
1. `GameScreenMobileOptimization` - Visual polish (2-3 hours)
2. `UsabilityImprovements` - Family UX (3-4 hours)  
3. `CodeArchitectureRefactoring` - Technical foundation (16 hours)

### **Architecture**: Three-zone Phaser containers (Header + Scrollable + Footer)
### **Testing**: `cd tests && bash verify_tests.sh`
### **Documentation**: Cleaned and consolidated for AI efficiency
