# 🐛 Project Issues Tracker

## 📊 Current Status Summary

**Total Active Issues**: 11 (UI enhancements + design research + share bug + technical debt reduction)

**Overall Project Health**: 🟢 **Excellent**
- Core functionality complete and mobile-optimized  
- RoundOver consolidation completed
- UI-010 score display enhancement completed
- PERF-001 game transition performance optimized
- Focus on final visual polish

**Last Updated**: August 11, 2025

---

## 🚨 Open Issues

### TECH-002: Scene Lifecycle Listener Cleanup 🔴
**Priority**: High  
**Category**: Technical Stability  
**Status**: Open

**Problem**: Global keyboard + window event listeners (resize, error, unhandledrejection) are added but never explicitly removed on scene shutdown. Potential for duplicate handlers, memory growth, and unpredictable behavior if scenes are re-entered in future features (e.g., replay loops, multi-session testing).
**Impact**: Hidden stability / performance risk; harder future debugging; could surface subtle input lag or duplicated logs.
**Location**: `GameScene` (keyboard), `main.js` (window events)

**Planned Remediation**:
- Add `shutdown` / `destroy` handlers in scenes to unregister keyboard listeners
- Centralize window listener registration & cleanup in a lightweight LifecycleUtility or in initialize/destroy flow
- Guard against multiple registrations (idempotent attach)

**Acceptance Criteria**:
- [ ] All keyboard listeners removed on scene shutdown
- [ ] Window listeners cleaned when game disposed / reinitialized
- [ ] No duplicate event firings after multiple game restarts
- [ ] Lightweight utility or documented pattern established

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

### UI-011: Christmas Title Theming Enhancement 🟡
**Priority**: Low-Medium  
**Category**: Visual Polish  
**Status**: Open

**Problem**: "XmasMM" title appears as plain white text, lacks festive Christmas theming
**Impact**: Misses opportunity for brand personality and Christmas atmosphere  
**Location**: Game header across scenes
**Solution**: Add Christmas-themed styling (colors, effects, or decorative elements)

**Design Options**:
- Green-to-gold gradient text matching Christmas colors (#0d5016, #ffd700)
- Decorative Christmas elements (🎄 ❄️ ★)
- Text effects (shadow, outline, subtle glow)

**Acceptance Criteria**:
- [ ] Title has festive Christmas-themed styling
- [ ] Maintains readability across all screen sizes  
- [ ] Complements existing Christmas color scheme
- [ ] No performance impact

---

## ✅ Recently Resolved Issues

### PERF-001: Game End Transition Delay ✅
**Status**: RESOLVED (August 8, 2025)  
**Solution**: Reduced game end transition delay from 2000ms to 100ms (~95% improvement), achieving <300ms total transition time on mobile devices

### UI-010: Current Score Display in Game Header ✅
**Status**: RESOLVED (August 8, 2025)  
**Solution**: Replaced "Turn X of Y" counter with live "Score: XXX" display that updates in real-time after each guess submission

### UI-009: Game Screen History Space Optimization ✅ 
**Status**: COMPLETED - ARCHIVED  
**Solution**: Row height reduced 60px→40px, visual hierarchy improved, 180px mobile space saved

### UI-007: Santa's Hint System Reliability ✅
**Status**: RESOLVED  
**Solution**: Complete hint system rewrite - always available, strategic selection, persistent display

### UI-006: Active Guess Row Scroll Accessibility ✅
**Status**: RESOLVED  
**Solution**: Difficulty simplification (removed 6-element option, max 10 guesses) eliminated scroll issues

### UI-004: History Solution Display 🔄
**Status**: MERGED into RoundOverScenePolish task  
**Action**: Solution display requirement added to RoundOver scene optimization

### UI-005: Main Menu Real Game Images ✅
**Status**: COMPLETED  
**Solution**: Replaced emoji with actual game assets, consistent visual branding

### ASSET-001: Asset Cleanup & Optimization ✅
**Status**: COMPLETED  
**Solution**: Mistletoe→Candy Cane replacement, removed unused assets, 405KB saved

---

## 🛠️ Issue Management Guidelines

### **Status Definitions**
- 🔧 **Open**: Active issue requiring attention
- ✅ **Resolved**: Issue completely fixed and verified  
- 🔄 **Merged**: Merged into active task
- 📋 **Archived**: Historical reference only

### **Creating Issues**
1. Use format: `CATEGORY-###` (UI-001, MOBILE-001, etc.)
2. Include problem description and expected behavior
3. Link to related tasks when applicable
4. Update status as work progresses

### **Resolving Issues**  
1. Update status with resolution date
2. Document solution briefly
3. Link to related task if applicable
4. Archive if historical reference needed

---

## 📈 Project Health Indicators

- **Critical Issues**: 0 ✅
- **Game Breaking**: 0 ✅  
- **Mobile Optimization**: Complete ✅
- **Core Functionality**: Working ✅
- **User Experience**: Polished ✅

**Next Focus**: RoundOverScenePolish, AudioImplementation, FinalTesting
