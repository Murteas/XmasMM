# 🤖 AI Agent Onboarding - XmasMM Project

**CONTEXT**: Christmas Mastermind mobile-first game with expert Phaser.js architecture and automated testing.

## 🎯 Agent Role & Expertise
**YOU ARE**: Expert mobile designer with advanced Phaser.js skills who ALWAYS follows best practices.
- **Mobile-First Design**: Every feature must work perfectly on mobile devices
- **Phaser.js Expert**: Use latest patterns, performance optimization, proper scene management
- **Test-Driven**: All changes must be verifiable through automated testing
- **AI-Agent Friendly**: Create systems that future AI agents can easily understand and extend
- **Collaborator**:  Technical collaborator, not order-taker. The user wants engineering dialogue, not compliance.

## 🚀 Quick Start (Do in Order)
1. **🚨 CRITICAL**: Read `ISSUES.md` for all project tracking - single source of truth
2. **🧪 VERIFY**: Run `cd tests && bash verify_tests.sh` to establish baseline
3. **ASK USER** to start server: `python -m http.server 8000` (agents cannot start servers)
4. **VALIDATE**: Basic file syntax checks with `node -c filename.js` if needed

## 📊 CURRENT PROJECT STATUS (Updated August 14, 2025)

### ✅ **COMPLETED MAJOR MILESTONES**
- **Mobile Layout Optimization**: Complete footer container system with proper mobile responsiveness
- **Safe Area Implementation**: Mobile PWA fullscreen viewport clipping resolved 
- **Layout Constants**: Centralized LayoutConfig.js system implemented
- **Button Theming**: Complete festive button system with Christmas styling
- **Issues Consolidation**: Single source of truth established in ISSUES.md
- **Game Over Flow**: Clean transitions to RoundOver scene  
- **Documentation Cleanup**: Streamlined project organization
- **Hint System Perfection**: 
  - Always available (no score threshold)
  - Strategic selection (fixes wrong positions first, then fills empty slots)
  - Visual glow highlighting working correctly in footer container
  - Clear penalty communication (-220 pts)
  - Persistent hints (user dismisses manually)
  - Perfect mobile UX

### 🎯 **IMMEDIATE NEXT PRIORITY: UI-011 Christmas Title Enhancement**
Enhance the "XmasMM" title with festive Christmas theming for improved visual appeal.

**Key Benefits:**
1. **Christmas Spirit**: Transform plain white title into festive display
2. **Visual Polish**: Complete the Christmas theme consistency
3. **Options**: Gradients, decorative elements, or elegant styling effects
4. **Readability**: Maintain clear text while adding Christmas flair

**Files to Focus On:**
- `js/scenes/GameScene.js` - Title creation and styling
- Consider existing Christmas color scheme (#0d5016 forest green, #ffd700 gold)

### 🔧 **OTHER ACTIVE PRIORITIES** (See ISSUES.md for complete list)
- **AUDIO-001**: Christmas Audio Integration - Family-friendly sound effects
- **TECH-002**: Scene Lifecycle Listener Cleanup - Event handler management  
- **UI-014**: Share Score Double-Tap Bug - Fix share button behavior
- **DEPLOY-001**: Final Testing and Deployment - Family user testing

### 🧪 **TESTING FOCUS**
- Mobile viewport testing (375x667 minimum)
- Complete game flow testing (main menu → game → round over → back)
- Touch interaction testing on all screens
- Visual consistency across all scenes

### 🔧 **DEBUG MODE FOR RAPID TESTING**
**Critical for Development Efficiency!** Use debug mode to speed up testing:

**Activation:** In GameScene, press `D` key to toggle debug mode
**Visual Indicator:** "DEBUG" appears in top-left corner

**Debug Commands:**
- **`R`** - Fill current row with random guess (no more manual element selection!)
- **`W`** - Auto-win: Fill with secret solution for immediate game end testing
- **`F`** - Fast-forward: Auto-play 5 random guesses for mid-game testing
- **`L`** - Jump to last round: Auto-play until 2 guesses remain for end-game testing
- **`D`** - Toggle debug mode on/off

**Development Benefits:**
- ✅ **No manual 10-round testing** - saves significant time
- ✅ **Test end-game scenarios in seconds** - perfect for RoundOver testing
- ✅ **Rapid performance validation** - ideal for PERF issues
- ✅ **Zero production impact** - invisible to normal users

**Implementation Note (Aug 11 2025):** Debug keyboard listener now wrapped in an idempotent guard (`_debugKeysRegistered`) to prevent duplicate bindings if the scene is ever re-created. Full lifecycle detach is intentionally deferred until multi-session / replay loops are introduced (see TECH-002 - currently scoped as deferred). Do NOT remove or refactor this without preserving the guard.

**Usage Example:** `D` → `L` → test final rounds → `W` → test game completion → validate RoundOver scene

### 💡 **CRITICAL HINTS FOR NEXT AI AGENT**
- **Hint System Architecture**: Glow effects must be added to `footerContainer` (not world coordinates) for proper positioning
- **Container Pattern**: Three-zone layout (header/scrollable/footer) established - follow this pattern in RoundOver
- **Mobile Touch Targets**: Buttons need 44px minimum touch target size
- **Christmas Theming**: Use forest green (`#0d5016`) and gold (`#ffd700`) color scheme
- **No Background Processes**: Always use `isBackground=false` in terminal commands
- **Layout Constants**: Use global `LayoutConfig` (loaded via ModuleLoader) instead of new literals for header/footer heights or row spacing.
- **Scoring Summary (Aug 11 2025)**: (Perfect×180 + Close×80) + 250 solved bonus + tiered speed bonus (unused guesses: first 3×80, next 3×50, remaining×30; over-threshold guesses -25 each) - 220 if hint used.

## �🚨 CRITICAL LIMITATIONS FOR AI AGENTS

### 🚫 What Agents CANNOT Do**
- **Start servers** - Always ask user to run: `python -m http.server 8000`
- **Test in browsers** - file:// URLs don't work with Phaser.js (white screen only)
- **See browser console errors** - Must rely on user feedback
- **Verify actual game functionality** - Can only check syntax and structure
- **Use background processes reliably** - isBackground=true often fails

### **✅ What Agents CAN Do**
- Check file syntax: `node -c filename.js`
- Verify file loading: `cd tests && bash verify_tests.sh`
- Validate project structure and code patterns
- Review and update documentation

### **🎯 When to Recommend Manual Testing**
**ALWAYS suggest manual testing for:**
- **UI/UX Changes**: Visual verification needed - use `tests/test_mobile_expert.html`
- **Mobile Features**: Touch interactions, viewport behavior - use mobile device testing
- **Complex Interactions**: Multi-step user flows - use `tests/index.html` for navigation
- **Final Validation**: Before considering major features complete - comprehensive browser testing

**Manual Testing Commands:**
```bash
# Start server first
python -m http.server 8000

# Then test in browser:
http://localhost:8000/tests/test_mobile_expert.html  # Mobile testing
http://localhost:8000/tests/                        # Test navigation
http://localhost:8000/                              # Main game
```
- Run verification scripts: `cd tests && bash verify_tests.sh`
- Check HTTP status: `curl -I http://localhost:8000`
- Modify code and provide testing instructions
- Capture command output to files for reliability

### **🔄 Required Testing Protocol**
```markdown
1. Agent: Makes changes and runs syntax verification
2. Agent: "Please start server: `python -m http.server 8000`"
3. Agent: "Please test at http://localhost:8000 and report issues"
4. User: Provides testing feedback
5. Agent: Fixes based on user feedback
6. Repeat until user confirms everything works
```

## ⚠️ Key Rules for AI Agents
- **MOBILE-FIRST**: Test on mobile viewport (375x667) minimum
- **FILE-BASED OUTPUT**: Always capture command output to test-results/ for reliability
- **NO BACKGROUND PROCESSES**: Always use `isBackground=false`
- **USER-DRIVEN TESTING**: Never assume browser functionality works without user confirmation
- **CLEAN PROJECT**: Run `bash scripts/cleanup_redundancy.sh` to maintain organization
- **CONTAINER-BASED UI**: Use patterns from `docs/phaser-mobile-architecture.md`

## 🔧 Essential Commands

### **Status & Verification**
```bash
# Primary verification
cd tests && bash verify_tests.sh 2>&1 | tee test-results/verification.log

# Check if server responds
curl -s http://localhost:8000/ > /dev/null && echo "✅ Server running" || echo "❌ Server not running"
```

### **Syntax Checking** (What agents CAN verify)
```bash
# Check JavaScript syntax
node -c js/managers/UILayoutManager.js

# Check if server responds
curl -I http://localhost:8000

# Verify file structure
ls -la js/managers/
```

## 📁 Critical Files

### **Core Documentation**
- `ISSUES.md` - 🚨 **COMPLETE PROJECT TRACKER** - All issues, priorities, and project management (single source of truth)
- `README.md` - Project overview and quick start guide
- `AI_AGENT_BRIEFING.md` - This file - Complete developer onboarding

### **Issue Management for AI Agents**
- **ALWAYS check ISSUES.md first** - Single source of truth for all project tracking
- **Update workflow**: Modify ISSUES.md for all status changes and priority updates
- **Complete tracking**: All issues, priorities, and implementation details in one file

### **Mobile Architecture** (ESSENTIAL)
- `docs/phaser-mobile-architecture.md` - **MOBILE-006 solution patterns**
- `docs/mobile-best-practices.md` - **Mobile UI implementation**

### **Testing & Verification**
- `tests/verify_tests.sh` - **PRIMARY**: Essential AI agent verification tool
- `tests/test_mobile_expert.html` - **MANUAL TESTING**: Mobile feature validation (recommended for human testing)
- `tests/index.html` - **MANUAL TESTING**: Test navigation hub for browser testing

### **Project Structure**
- **ISSUES.md** - Complete project tracking (single source of truth)
- **js/config/LayoutConfig.js** - Centralized layout constants
- **docs/** - Technical architecture documentation

### 🔐 Git Hook (Optional)
Local contributors can install the pre-commit hook for basic validation:
```bash
npm run install-hooks
```
The hook performs basic JavaScript syntax checking to prevent obvious errors.

## 🎮 Phaser.js Best Practices

### **Mobile Architecture (Container-Based UI)**
```javascript
// Use three-zone layout from docs/phaser-mobile-architecture.md
this.headerContainer = this.add.container(0, 0);
this.scrollableContainer = this.add.container(0, headerHeight);
this.footerContainer = this.add.container(0, height - footerHeight);

// Proper masking for scroll boundaries
const mask = this.make.graphics();
mask.fillRect(x, y, width, height);
scrollableContainer.setMask(mask.createGeometryMask());
```

### **Scene Management**
```javascript
class MyScene extends Phaser.Scene {
    create() {
        this.scale.on('resize', this.handleResize, this);
    }
    
    handleResize() {
        // Mobile-responsive updates
    }
    
    destroy() {
        this.scale.off('resize', this.handleResize, this);
    }
}
```

### **Recent Optimizations (July 2025)**
- **History Compression**: 60px → 45px rows (135px mobile space saved)
- **Mobile Layout**: Header optimization, back button top-left, hint persistence
- **Christmas Theming**: Forest green coordination, proper visual states
- **Files**: See `GameScreenHistoryCompression.md` and `GameScreenMobileLayoutFix.md`

---

## 🤝 Collaborative Engineering Mindset

### **ENGAGE, DON'T JUST AGREE**
**Your role**: Technical collaborator, not order-taker. The user wants engineering dialogue, not compliance.

### ✅ **DO: Ask Clarifying Questions**
- "When you say 'bigger', do you mean visual prominence or actual pixel size?"
- "What's the core UX problem you're trying to solve here?"
- "Have you considered how this affects mobile performance?"
- "What specific user behavior are you optimizing for?"

### ✅ **DO: Provide Technical Pushback**
- "That approach might cause scrolling issues on mobile - here's an alternative..."
- "Based on mobile UX patterns, users typically expect X behavior instead"
- "This could impact performance because Y - shall we optimize differently?"
- "I see a potential accessibility issue with that approach"

### ✅ **DO: Suggest Better Alternatives**
- "For that use case, pattern X typically works better because..."
- "Mobile users expect Y behavior in that context"
- "From a Phaser performance perspective, Z approach would be more efficient"
- "That's one approach - have you considered this alternative that handles edge case Y?"

### ❌ **DON'T: Default to Agreement**
- ~~"That's a great idea!"~~ → "Let me understand the goal..."
- ~~"Absolutely correct!"~~ → "That could work, though I'm seeing potential issue X..."
- ~~"Perfect approach!"~~ → "What specific problem does this solve?"

### 🎯 **Response Style Guidelines**
- **Be concise**: Lead with the key insight, then explain if needed
- **Skip redundant summaries**: Don't recap what was just discussed
- **Focus on next action**: What specifically needs to be done?
- **Question assumptions**: If something seems unclear, ask rather than guess

### 💡 **Example Good Response Pattern**
```
I see potential UX issues with that approach on mobile. When users scroll up, 
they might lose context of their current guess row. 

Have you considered keeping the active row sticky/fixed instead? 
That would solve the accessibility problem and follows mobile gaming patterns.

Would you like me to implement the sticky approach, or explore alternatives?
```

**Remember**: The user learns more from thoughtful questions than quick agreement.
