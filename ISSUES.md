# 🐛 Project Issues Tracker

## 📊 Current Status Summary

**Total Active Issues**: 17 (UI enhancements + audio integration + deployment + technical debt + new UX improvements)

**Overall Project Health**: 🟢 **Excellent**
- Core functionality complete and mobile-optimized  
- Mobile PWA safe area implementation completed ✅
- Centralized layout constants system implemented ✅
- Button theming and typography enhancement completed ✅
- Ready for UI polish and family-ready deployment
- Focus on final polish and user experience optimization

**Last Updated**: August 14, 2025 (Added 6 new UI/UX improvement issues)

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

### TECH-001: Centralized Layout & Constants Module ✅
**Priority**: Medium  
**Category**: Maintainability  
**Status**: Resolved (August 11, 2025)

**Problem**: Repeated magic numbers (header heights 120/140, footer 120, row height 60, spacing constants) scattered across managers (e.g., `ActiveRowManager`, `GameScene`, layout methods) increase risk of drift and complicate tuning.
**Impact**: Harder to adjust UI globally; increases inconsistency risk when polishing.

**Solution Implemented**:
- ✅ Created `js/config/LayoutConfig.js` with comprehensive layout constants
- ✅ Centralized header heights (140/120), footer heights (160), row heights (60)  
- ✅ Added mobile-specific spacing and touch target constants
- ✅ Integrated across GameScene, ActiveRowManager, UILayoutManager, HistoryScroller

**Acceptance Criteria Completed**:
- ✅ Single source for header/footer heights, row height, spacing, delay values
- ✅ Multiple high-traffic files refactored to use constants
- ✅ No behavior change (visual diff stable)
- ✅ Layout constants documented with mobile baseline (375x667)

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

### UI-011: Christmas Title Theming Enhancement ✅
**Priority**: High (Next Phase)  
**Category**: Visual Polish  
**Status**: Resolved (August 14, 2025)

**Problem**: The "XmasMM" title in the game header displayed as plain white text, lacking the festive Christmas spirit and visual appeal that the rest of the game maintains.

**Solution Implemented**:
- ✅ Updated MainMenu title to playful "🎄 Christmas 🎄 / 🎁 MasterMind 🎁" format
- ✅ Implemented Comic Sans MS font for family-friendly, playful feel
- ✅ Used bright Christmas red (#CC0000) with white outline for excellent contrast
- ✅ Added Christmas green drop shadow for depth
- ✅ Removed candy cane button patterns in favor of clean, professional gradients
- ✅ Enhanced button interactivity with smooth Phaser.js animations
- ✅ Maintained two-line layout for mobile portrait compatibility
- ✅ Updated button fonts to match title for consistency

**Files Modified**:
- `js/scenes/MainMenu.js` - Title styling and button pattern removal
- `js/utils/ButtonFactory.js` - Professional gradient buttons, enhanced interactions
- `js/config/LayoutConfig.js` - Comic Sans font integration

**Acceptance Criteria Completed**:
- ✅ Title has festive Christmas-themed styling with emojis
- ✅ Maintains excellent readability across all screen sizes  
- ✅ Complements existing Christmas color scheme
- ✅ Professional button design without distracting patterns
- ✅ Enhanced user interaction feedback
- ✅ Consistent typography throughout interface

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

### UI-012: Button Graphics Enhancement ✅
**Priority**: Low  
**Category**: Visual Polish  
**Status**: Resolved (August 14, 2025)

**Problem**: Current buttons used text-only styling, could benefit from custom graphics or enhanced visual design
**Impact**: Opportunity for improved visual appeal and Christmas theming consistency
**Location**: All button elements across scenes (Submit, Play Again, Share Score, etc.)

**Solution Implemented**:
- ✅ Complete ButtonFactory implementation with elegant Christmas design
- ✅ Style tokens in LayoutConfig.BUTTON_STYLE with comprehensive theming
- ✅ Primary, accent, danger button variants with festive styling
- ✅ Interactive states: hover, pressed, disabled with proper feedback
- ✅ Mobile optimization with enhanced typography and stroke outlines
- ✅ Scene integration: MainMenu, RoundOver, DifficultySelection using ButtonFactory
- ✅ Sophisticated gradients with rich Christmas colors
- ✅ WCAG contrast compliance and 44x44 minimum hit targets

**Files Modified**: 
- ButtonFactory.js implementation
- LayoutConfig.js style tokens
- MainMenu.js, RoundOver.js, DifficultySelection.js integration

**Acceptance Criteria Completed**:
- ✅ Custom Christmas-themed button backgrounds implemented
- ✅ Enhanced visual effects (gradients, shadows, borders)
- ✅ Consistent button theming across all scenes
- ✅ Mobile accessibility maintained

### UI-013: Background Image Research & Enhancement ✅
**Priority**: Low  
**Category**: Visual Design Research  
**Status**: Resolved (August 14, 2025)

**Problem**: Current background image (bg_mobile2.png) was visually busy and competing with game elements for attention, causing poor contrast and readability issues.

**Expert Design Analysis**: Background was too busy for a puzzle game, violating figure-ground relationship principles and causing cognitive overload.

**Solution Implemented**:
- ✅ Replaced busy Christmas scene with professional Christmas gradient
- ✅ Created deep forest green to dark green vertical gradient (#0d3820 → #051610)
- ✅ Added subtle snowflake overlay at 8% opacity for Christmas atmosphere
- ✅ Improved contrast ratios for all game elements
- ✅ Enhanced readability while maintaining festive spirit
- ✅ Updated darker slot backgrounds (0x2a2a2a) with stronger white borders
- ✅ Applied across all scenes: MainMenu, GameScene, RoundOver, DifficultySelection

**Files Modified**:
- `js/managers/UILayoutManager.js` - Gradient background system
- `js/scenes/MainMenu.js` - Christmas gradient implementation
- `js/scenes/RoundOver.js` - Background consistency
- `js/scenes/DifficultySelection.js` - Background consistency
- `js/managers/HistoryRenderer.js` - Darker slot backgrounds for contrast
- `js/managers/ActiveRowManager.js` - Enhanced slot visibility

**Design Benefits**:
- ✅ Professional Christmas aesthetic without visual clutter
- ✅ Improved accessibility and contrast ratios
- ✅ Reduced eye fatigue during extended gameplay
- ✅ Better focus on game elements and puzzle solving
- ✅ Maintained Christmas spirit with elegant gradient and snowflakes

### AUDIO-001: Christmas Audio Integration 🔴
**Priority**: High (Next Phase)  
**Category**: Feature Enhancement  
**Status**: Open

**Problem**: Game lacks festive audio atmosphere that would enhance family gameplay experience
**Impact**: Missing opportunity for Christmas immersion and family engagement
**Location**: Audio integration across all scenes

**Design Requirements**:
- Family-friendly audio (gentle, not startling)
- Optional/toggleable (families may play in quiet environments)
- Small file sizes (< 1MB total for mobile performance)
- iOS Safari compatibility (requires user interaction)

**Implementation Plan**:
- **Audio Files Needed**: Gentle jingle bells (guess submission), "Ho ho ho" (correct solutions), Santa chuckle (hint usage), soft Christmas background music loop
- **Integration Points**: MainMenu.js (preload), GameScene.js (event triggers), existing sound toggle state
- **Technical Considerations**: User interaction requirement for iOS, volume level testing, graceful fallback when disabled

**Acceptance Criteria**:
- [ ] Christmas-themed sound effects for key game events
- [ ] Optional background music during gameplay
- [ ] Proper iOS Safari audio handling with user interaction
- [ ] Audio toggle integration with existing menu controls
- [ ] Game fully playable with audio disabled
- [ ] Family-appropriate volume levels and sound selection

### DEPLOY-001: Final Testing and Deployment 🟡
**Priority**: Low (Final Phase)  
**Category**: Quality Assurance  
**Status**: Open

**Problem**: Need comprehensive family testing before deployment
**Impact**: Ensures game works flawlessly for intended family audience
**Location**: Multi-device testing and documentation

**Testing Requirements**:
- **Multi-Device Testing**: iPhone models (SE through Pro Max), different screen sizes
- **Family User Testing**: Different ages and technical skill levels
- **Performance Validation**: <5 second load times, 60 FPS animations, battery usage
- **Edge Case Testing**: Incomplete guesses, network issues, graceful error handling

**Documentation Needed**:
- Player guide for family members (README.md update)
- Technical maintainer guide (MAINTAINER.md)
- Troubleshooting for common family tech issues
- Asset update guide for future Christmas seasons

**Acceptance Criteria**:
- [ ] Tested on multiple iPhone models with consistent experience
- [ ] Family members of varying tech skills can play without confusion
- [ ] Performance meets family-friendly standards (<5s load, 60 FPS)
- [ ] Complete documentation for players and maintainers
- [ ] Edge cases handled gracefully
- [ ] Deployment ready with family-tested experience

### UI-016: Inconsistent Font Usage Across Screens 🟡
**Priority**: Medium  
**Category**: Visual Consistency  
**Status**: Open

**Problem**: Font usage is inconsistent across game screens, with the game end (RoundOver) screen not using the same font family as other screens
**Impact**: Breaks visual consistency and professional appearance
**Location**: RoundOver scene vs other game screens
**Current State**: MainMenu and GameScene use consistent fonts, but RoundOver diverges

**Investigation Needed**:
- Audit all font declarations across scenes
- Identify which font should be the standard (likely Comic Sans MS based on Christmas theme)
- Update RoundOver and any other inconsistent screens

**Acceptance Criteria**:
- [ ] All screens use consistent font family
- [ ] Documentation of standard font choices
- [ ] Visual consistency verified across all scenes

### UI-017: Button Corner Visibility Issues 🟡
**Priority**: Medium  
**Category**: Visual Polish  
**Status**: Open

**Problem**: Buttons are not properly rounded and show corners extending past the border styling
**Impact**: Unprofessional appearance, breaks visual design integrity
**Location**: All button elements across scenes
**Current State**: Button corners are visible outside the intended border radius

**Investigation Needed**:
- Check ButtonFactory border radius implementation
- Verify proper clipping/masking of button backgrounds
- Test across different screen sizes and browsers

**Acceptance Criteria**:
- [ ] All buttons properly rounded without visible corners
- [ ] Consistent border radius across all button types
- [ ] Professional appearance maintained across devices

### UI-018: Theme Selector Usability Enhancement 🟡
**Priority**: Medium  
**Category**: User Experience  
**Status**: Open

**Problem**: The theme change button isn't intuitive - "Traditional" doesn't clearly communicate what that theme looks like to users
**Impact**: Users may not understand what themes are available or how they differ
**Location**: Main menu theme selector button
**Current State**: Cycles through themes with unclear labels

**Design Considerations**:
- Show preview thumbnails or color swatches
- Use more descriptive names (e.g., "Classic Red & Green" instead of "Traditional")
- Add visual indicators showing current theme
- Consider expandable selector showing all options at once

**Acceptance Criteria**:
- [ ] Theme names are clear and descriptive
- [ ] Users can preview theme appearance before selecting
- [ ] Current theme is clearly indicated
- [ ] Intuitive selection method implemented

### UI-019: Score Display Logic Review 🔴
**Priority**: High  
**Category**: Game Logic  
**Status**: Open

**Problem**: The score shown after each guess doesn't seem correct or logical to users
**Impact**: Confusing feedback undermines game experience and learning
**Location**: Score calculation and display after each guess
**Current State**: Score calculation exists but may not be intuitive to players

**Discussion Required**:
- Review current scoring algorithm for clarity
- Determine what score should represent (total game score vs guess-specific feedback)
- Consider if score should be cumulative or per-guess
- Evaluate whether current scoring system aids or confuses gameplay

**Investigation Needed**:
- Document current scoring logic
- Gather user feedback on score expectations
- Consider alternative scoring presentations

**Acceptance Criteria**:
- [ ] Score calculation logic is documented and logical
- [ ] Score display clearly communicates what it represents
- [ ] Users understand the scoring system without confusion
- [ ] Score enhances rather than detracts from game experience

### UI-020: Game Scene Header Simplification 🟡
**Priority**: Low  
**Category**: UI Simplification  
**Status**: Open

**Problem**: The "CM" title in the game scene header is unnecessary and takes up space
**Impact**: Minor visual clutter, could be removed for cleaner design
**Location**: GameScene header area
**Current State**: Shows abbreviated "CM" title during gameplay

**Consideration**: 
- Remove title entirely for cleaner header
- Use space for more useful information
- Maintain Christmas theme without redundant text

**Acceptance Criteria**:
- [ ] Header simplified by removing unnecessary "CM" title
- [ ] Clean, uncluttered header design
- [ ] No loss of important functionality or branding

### UI-021: Element Picker Interaction Enhancement 🔴
**Priority**: High  
**Category**: User Experience  
**Status**: Open

**Problem**: Element picker interaction is awkward - users must click a box then move finger/mouse up to screen center to choose an element
**Impact**: Poor user experience, especially on mobile devices where this gesture is unnatural
**Location**: Element selection interface during gameplay
**Current State**: Click slot → picker appears in center → select element

**Discussion Required**:
- Evaluate current picker positioning and interaction model
- Consider alternative approaches (inline picker, bottom sheet, adjacent popup)
- Balance mobile vs desktop usability
- Consider accessibility implications

**Design Alternatives to Evaluate**:
- Bottom sheet picker that slides up from element slot
- Inline picker that appears directly above/below selected slot
- Side panel picker for desktop
- Tap-and-hold vs click interaction models

**Acceptance Criteria**:
- [ ] Element selection interaction is intuitive and comfortable
- [ ] Works well on both mobile and desktop
- [ ] Reduced finger/mouse travel distance
- [ ] Maintains accessibility standards
- [ ] Expert UX evaluation confirms improvement

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

### MOBILE-001: Mobile PWA Safe Area Implementation ✅  
**Priority**: High  
**Category**: Mobile UX  
**Status**: Resolved (August 11, 2025)

**Problem**: Footer and active row positioned too close to bottom edge on mobile PWA fullscreen mode, causing:
- Active row disappearing when swiping on iOS/Android gesture areas
- Poor UX with elements too close to screen edge
- Overlap between active row and Christmas legend
- Touch conflicts between history scrolling and footer elements

**Solution Implemented**:
- ✅ Created SafeAreaManager.js for cross-platform safe area detection
- ✅ Implemented CSS env() API with intelligent fallbacks  
- ✅ Added 20px swipe gesture margin for iOS/Android bottom swipe prevention
- ✅ Increased FOOTER_HEIGHT_GAME from 120px to 160px for better spacing
- ✅ Fixed HistoryScroller touch area to respect footer positioning
- ✅ Adjusted active row Y position from 60 to 40 within footer container
- ✅ Updated legend positioning to calculate based on footer container position

**Technical Implementation**:
- Footer positioned at: `height - footerHeight - safeAreaBottom - gestureMargin`
- Legend positioned at: `footerTopY - legendHeight - 15px` for proper spacing
- Touch areas properly separated to prevent conflicts
- Real-device testing confirmed proper positioning and functionality

**Files Modified**: 
- `js/utils/SafeAreaManager.js` (new)
- `js/config/LayoutConfig.js` (updated constants)
- `js/scenes/GameScene.js` (footer positioning)
- `js/managers/ActiveRowManager.js` (active row positioning)
- `js/managers/UILayoutManager.js` (legend positioning)
- `js/managers/HistoryScroller.js` (touch area fixes)

**Acceptance Criteria Completed**:
- ✅ Mobile PWA footer properly positioned above safe areas
- ✅ No conflicts with iOS/Android bottom swipe gestures
- ✅ Active row and legend properly spaced without overlap
- ✅ Touch areas separated to prevent interaction conflicts
- ✅ Cross-platform compatibility verified

**Recent Major Completions**:
- ✅ UI-012: Button Graphics Enhancement (August 14, 2025)
- ✅ TECH-001: Centralized Layout & Constants Module (August 11, 2025)
- ✅ MOBILE-001: Mobile PWA safe area implementation (August 11, 2025)
- ✅ PERF-001: Game transition performance optimization (August 8, 2025)  
- ✅ UI-010: Real-time score display implementation (August 8, 2025)

**Archived History Note**: Previous session archives available in git history (commits prior to August 14, 2025)

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
- **Single Source of Truth**: ISSUES.md contains ALL project tracking
- **Update Pattern**: Modify ISSUES.md for all status changes
- **Implementation Details**: Can be added directly to issue descriptions when needed

---

## 📈 Project Health Indicators

- **Critical Issues**: 0 ✅
- **Game Breaking**: 0 ✅  
- **Mobile Optimization**: Complete ✅
- **Layout System**: Centralized ✅
- **Core Functionality**: Working ✅
- **User Experience**: Polished ✅

**Next Focus**: UI-011 Christmas Title Enhancement, then AUDIO-001 Christmas Audio Integration, then TECH-002 ListenerCleanup, then DEPLOY-001 Final Testing
