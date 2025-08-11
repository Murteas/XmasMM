# 🐛 Project Issues Tracker

## 📊 Current Status Summary

**Total Active Issues**: 13 (UI enhancements + design research + share bug + technical debt reduction)

**Overall Project Health**: 🟢 **Excellent**
- Core functionality complete and mobile-optimized  
- Mobile PWA safe area implementation completed
- RoundOver consolidation completed
- UI-010 score display enhancement completed
- PERF-001 game transition performance optimized
- Focus on final visual polish

**Last Updated**: August 11, 2025 (Issues consolidation - mobile safe area fixes completed)

---

## 🚨 Open Issues

### TECH-002: Scene Lifecycle Listener Cleanup 🔴
**Priority**: High  
**Category**: Technical Stability  
**Status**: Open

**Problem**: Global keyboard + window event listeners (resize, error, unhandledrejection) lack explicit teardown. Risk is currently low because scenes aren't re-created repeatedly, but future replay / multi-session features could expose duplicate handlers.
**Impact**: Potential for duplicate handler accumulation in future architectures; currently minimal practical impact.
**Location**: `GameScene` (keyboard), `main.js` (window events)

**Current Mitigation (Aug 11 2025)**:
- Added idempotent guard (`_debugKeysRegistered`) around debug keyboard listener so it cannot double-bind if scene setup runs again.
- Decision: Defer full detach logic until replay / multi-session flow introduced to avoid unnecessary complexity now.

**Deferred Remediation Plan** (activate when replay/multi-session added):
- Add `shutdown` / `destroy` handlers to unregister keyboard listeners
- Centralize window listener registration & cleanup
- Lightweight ListenerRegistry utility (optional)

**Acceptance Criteria (Deferred)**:
- [ ] Keyboard listeners removed on scene shutdown (when replay added)
- [ ] Window listeners cleaned when game disposed / reinitialized
- [ ] No duplicate event firings after multiple restarts
- [ ] Documented lifecycle pattern established

### TECH-001: Centralized Layout & Constants Module 🟡
**Priority**: Medium  
**Category**: Maintainability  
**Status**: Open

**Problem**: Repeated magic numbers (header heights 120/140, footer 120, row height 60, spacing constants) scattered across managers (e.g., `ActiveRowManager`, `GameScene`, layout methods) increase risk of drift and complicate tuning.
**Impact**: Harder to adjust UI globally; increases inconsistency risk when polishing.

**Solution Direction**:
- Create `js/config/LayoutConfig.js` exporting shared sizing + timing constants
- Replace literals incrementally (non-breaking passes)
- Document rationale & mobile target ranges

**Acceptance Criteria**:
- [ ] Single source for header/footer heights, row height, spacing, delay values
- [ ] At least 3 high-traffic files refactored to use constants
- [ ] No behavior change (visual diff stable)
- [ ] README / AI briefing mentions constants module

### TECH-003: Lightweight Logger Abstraction 🟡
**Priority**: Medium  
**Category**: Developer Experience  
**Status**: Open

**Problem**: Direct `console.log` / `console.warn` calls throughout code (debug + runtime) lack centralized control, making production noise management harder.
**Impact**: Harder to silence logs for production profiling; ad‑hoc filtering required.

**Solution Direction**:
- Introduce `Logger` wrapper (levels: debug/info/warn/error)
- Gate debug output via `TestConfig.shouldShowDebugLogs()` or URL param
- Provide no-op stubs in production mode

**Acceptance Criteria**:
- [ ] Logger module created and documented
- [ ] At least 10 scattered direct logs replaced (non-critical only)
- [ ] Production mode silence verified
- [ ] Debug flag re-enables expected instrumentation

### TECH-004: ESLint + Prettier (Warn-Only Integration) 🟡
**Priority**: Medium  
**Category**: Code Quality  
**Status**: Open

**Problem**: No enforced lint/format baseline; future contributors (or AI agents) may introduce inconsistent patterns.
**Impact**: Gradual readability decline; higher review overhead.

**Solution Direction**:
- Add `devDependencies` + minimal `.eslintrc` (phaser globals, browser, ES2020)
- Prettier config for consistent spacing (defer auto-format of legacy files)
- Add npm script: `lint` (no autofix) & `format:check`

**Acceptance Criteria**:
- [ ] ESLint config present with Phaser globals suppressed
- [ ] Prettier config present
- [ ] Running lint produces only warnings (no blocking errors)
- [ ] Documented in AI briefing / README contribution section

### TECH-005: Asset Loading Manifest / DRY Preload 🟡
**Priority**: Low-Medium  
**Category**: Performance / Maintainability  
**Status**: Open

**Problem**: Repetitive manual image load calls for each density; harder to add/remove assets consistently.
**Impact**: Risk of omissions or mismatched keys; verbose preload.

**Solution Direction**:
- Create manifest array: `{ baseKey: 'santa', variants: ['1x','2x','3x'] }`
- Loop-driven registration in `preload()`; fallback strategy preserved
- Optional future conditional loading (only needed density)

**Acceptance Criteria**:
- [ ] Manifest module created (`js/config/AssetManifest.js`)
- [ ] Preload logic uses loops rather than repeated calls
- [ ] No missing textures vs prior implementation
- [ ] File count & load time unchanged or improved

### TECH-006: Debug Key Map Documentation Consistency 🟡
**Priority**: Low  
**Category**: Documentation Hygiene  
**Status**: Open

**Problem**: Debug mode documented in README & AI briefing, but no centralized authoritative reference; risk of divergence if keys evolve.
**Impact**: Minor confusion for future maintainers / agents.

**Solution Direction**:
- Add `docs/debug-mode.md` authoritative key mapping & usage guidelines
- Link from README + AI briefing; ensure in-code comment block references file

**Acceptance Criteria**:
- [ ] New doc file created and linked
- [ ] GameScene debug handler comment references doc
- [ ] README / AI briefing updated to point to single source
- [ ] Keys verified in documentation match implementation

### UI-011: Christmas Title Theming Enhancement 🎄
**Priority**: High (Next Phase)  
**Category**: Visual Polish  
**Status**: Open

**Problem**: The "XmasMM" title in the game header displays as plain white text, lacking the festive Christmas spirit and visual appeal that the rest of the game maintains.

**Current State**: Background contrast issues resolved - text protection in place, ready for implementation

**Expected Behavior**:
- Title should have Christmas-themed visual styling
- Should maintain readability while adding festive flair  
- Should complement existing Christmas color scheme (#0d5016 forest green, #ffd700 gold)

**Design Options**:
- **Option 1**: Green-to-gold gradient text matching existing palette
- **Option 2**: Decorative elements (★ snowflakes, 🎄 trees) around title
- **Option 3**: Text shadow/outline styling with Christmas colors
- **Option 4**: Gentle sparkle animation or subtle glow effect

**Location**: `js/scenes/GameScene.js` (header/title creation section)

**Acceptance Criteria**:
- [ ] Title has festive Christmas-themed styling
- [ ] Maintains readability across all screen sizes  
- [ ] Complements existing Christmas color scheme
- [ ] No performance impact

### UI-014: Share Score Button Requires Double-Tap 🔴
**Priority**: Medium  
**Category**: User Interface Bug  
**Status**: Open

**Problem**: Share Score button shows "Share Canceled" on first press, requires second press to actually share
**Impact**: Poor user experience, confusing behavior that may frustrate users trying to share scores
**Location**: RoundOver scene - Share Score button functionality
**Behavior**: 
- First button press: Shows "Share Canceled" message
- Second button press: Actually performs the share action
- Expected: Should share immediately on first press

**Investigation Needed**:
- Check share button event handlers for timing issues
- Verify Web Share API implementation and permissions
- Look for race conditions or async handling problems
- Test across different browsers and devices

**Acceptance Criteria**:
- [ ] Share button works correctly on first press
- [ ] No "Share Canceled" message on valid share attempts
- [ ] Consistent behavior across browsers and devices
- [ ] Proper error handling for unsupported share scenarios

### UI-012: Button Graphics Enhancement 🟡
**Priority**: Low  
**Category**: Visual Polish  
**Status**: Open

**Problem**: Current buttons use text-only styling, could benefit from custom graphics or enhanced visual design
**Impact**: Opportunity for improved visual appeal and Christmas theming consistency
**Location**: All button elements across scenes (Submit, Play Again, Share Score, etc.)
**Decision Needed**: Evaluate if custom button graphics add value or if current styling is sufficient

**Design Options**:
- Custom Christmas-themed button backgrounds
- Icon integration (🎄 for Play Again, 📤 for Share, etc.)
- Enhanced CSS-style effects (gradients, shadows, borders)
- Keep current minimalist approach

**Acceptance Criteria**:
- [ ] Evaluate current button design effectiveness
- [ ] Decide on enhancement approach or keep as-is
- [ ] If enhancing: implement consistent button theming

### UI-013: Background Image Research & Enhancement 🟡
**Priority**: Low  
**Category**: Visual Design Research  
**Status**: Open

**Problem**: Current background image (bg_mobile2.png) may be visually unengaging or too plain for Christmas theme
**Impact**: Missed opportunity for enhanced atmosphere and visual appeal
**Location**: Background across all scenes
**Research Needed**: 
- Evaluate current background effectiveness
- Research Christmas-themed background options
- Consider mobile performance implications
- Assess user experience impact

**Design Research Options**:
- Subtle Christmas patterns (snowflakes, stars, pine trees)
- Gradient backgrounds with Christmas colors
- Textured backgrounds (wood, fabric, winter scenes)
- Keep current minimalist approach for better readability
- Dynamic/animated backgrounds (with performance considerations)

**Acceptance Criteria**:
- [ ] Research and document background design options
- [ ] Evaluate visual impact vs game readability
- [ ] Consider mobile performance and file size
- [ ] Decide on enhancement approach or keep current
- [ ] If changing: implement new background with A/B comparison

### UI-015: Random Guess Feature for Players 🟡
**Priority**: Low  
**Category**: Feature Enhancement  
**Status**: Open

**Problem**: Players may get stuck and need inspiration when unable to think of next guess
**Impact**: Opportunity to improve accessibility and reduce player frustration
**Location**: Game screen - additional button next to Submit and Hint
**Consideration**: Needs careful balance to maintain game integrity

**Design Options**:
- "Need Inspiration?" button with point penalty (-50 points)
- Cooldown system (once per game or once per 3 guesses)
- Progressive cost (first free, subsequent guesses cost more)
- Educational framing to maintain learning value

**Acceptance Criteria**:
- [ ] Research player feedback on random guess utility
- [ ] Design penalty system that maintains game balance
- [ ] Implement with clear educational messaging
- [ ] Ensure doesn't undermine strategic thinking aspect
- [ ] Test with family users for appropriateness

---

## 📋 Resolved Issues Archive

Recent issues have been moved to preserve readability. For complete resolution history, see:
- **Latest**: `issues/archived/session-august-11-2025.md` (8 resolved issues including mobile safe area fixes)
- **Historical**: `issues/archived/` folder contains all previous sessions

**Recent Major Completions**:
- ✅ MOBILE-001: Mobile PWA safe area implementation (August 11, 2025)
- ✅ PERF-001: Game transition performance optimization (August 8, 2025)  
- ✅ UI-010: Real-time score display implementation (August 8, 2025)

---

---

## 🛠️ Issue Management Guidelines

### **Single Source of Truth**
- **ISSUES.md**: All open issues + recent resolved issues
- **issues/archived/**: Detailed archives organized by session
- **issues/detailed/**: Complex investigations requiring extensive documentation

### **Status Definitions**
- 🔧 **Open**: Active issue requiring attention
- ✅ **Resolved**: Issue completely fixed and verified  
- 🔄 **Merged**: Merged into active task
- 📋 **Archived**: Historical reference only

### **Issue Workflow**
1. **Create**: Always start in ISSUES.md with format `CATEGORY-###`
2. **Complex Issues**: May create detailed file but MUST have summary in ISSUES.md  
3. **Resolution**: Update status in ISSUES.md immediately
4. **Archive**: Move to `issues/archived/` when file >200 lines

### **AI Agent Guidelines**
- **Primary Reference**: Always check ISSUES.md first for current state
- **Detailed Context**: Refer to issues/archived/ for historical context
- **Update Pattern**: Modify ISSUES.md for all status changes

---

## 📈 Project Health Indicators

- **Critical Issues**: 0 ✅
- **Game Breaking**: 0 ✅  
- **Mobile Optimization**: Complete ✅
- **Core Functionality**: Working ✅
- **User Experience**: Polished ✅

**Next Focus**: UI-011 Christmas Title Enhancement, then TECH-002 ListenerCleanup, then AudioImplementation
