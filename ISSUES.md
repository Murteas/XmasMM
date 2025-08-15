# 🐛 Project Issues Tracker

## 📊 Current Status Summary

**Total Active Issues**: 8 (focused on UX improvements + audio integration + deployment)

**Overall Project Health**: 🟢 **Excellent**
- Core functionality complete and mobile-optimized  
- Mobile PWA safe area implementation completed ✅
- Centralized layout constants system implemented ✅
- Button theming and typography enhancement completed ✅
- Technical debt cleaned up - focus on user experience
- Ready for final polish and family-ready deployment

**Last Updated**: August 14, 2025 (Major cleanup: removed 9 over-engineering issues, focused on user value)

---

## 🚨 Open Issues

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

---

## 📋 Resolved Issues Archive

### UI-014: Share Score Button Requires Double-Tap ✅
**Priority**: Medium  
**Category**: User Interface Bug  
**Status**: Resolved (August 14, 2025)

**Problem**: Share Score button showed "Share Canceled" on first press, required second press to actually share
**Impact**: Poor user experience, confusing behavior that frustrated users trying to share scores
**Location**: RoundOver scene - Share Score button functionality

**Resolution**: Issue was resolved during recent testing and no longer reproduces
**Verification**: Share button now works correctly on first press across tested browsers and devices

### TECH-001: Centralized Layout & Constants Module ✅
**Priority**: Medium  
**Category**: Maintainability  
**Status**: Resolved (August 11, 2025)

**Problem**: Repeated magic numbers (header heights 120/140, footer 120, row height 60, spacing constants) scattered across managers increased risk of drift and complicated tuning.

**Solution Implemented**:
- ✅ Created `js/config/LayoutConfig.js` with comprehensive layout constants
- ✅ Centralized header heights (140/120), footer heights (160), row heights (60)  
- ✅ Added mobile-specific spacing and touch target constants
- ✅ Integrated across GameScene, ActiveRowManager, UILayoutManager, HistoryScroller

### UI-011: Christmas Title Theming Enhancement ✅
**Priority**: High  
**Category**: Visual Polish  
**Status**: Resolved (August 14, 2025)

**Problem**: The "XmasMM" title in game header displayed as plain white text, lacking festive Christmas spirit.

**Solution Implemented**:
- ✅ Updated MainMenu title to playful "🎄 Christmas 🎄 / 🎁 MasterMind 🎁" format
- ✅ Implemented Comic Sans MS font for family-friendly feel
- ✅ Used Christmas red (#CC0000) with white outline for excellent contrast
- ✅ Enhanced button interactivity with smooth Phaser.js animations

### UI-012: Button Graphics Enhancement ✅
**Priority**: Low  
**Category**: Visual Polish  
**Status**: Resolved (August 14, 2025)

**Problem**: Buttons used text-only styling, needed enhanced visual design and Christmas theming.

**Solution Implemented**:
- ✅ Complete ButtonFactory implementation with elegant Christmas design
- ✅ Primary, accent, danger button variants with festive styling
- ✅ Interactive states with proper feedback and mobile optimization
- ✅ WCAG contrast compliance and 44x44 minimum hit targets

### UI-013: Background Image Research & Enhancement ✅
**Priority**: Low  
**Category**: Visual Design Research  
**Status**: Resolved (August 14, 2025)

**Problem**: Background image was visually busy and competed with game elements for attention.

**Solution Implemented**:
- ✅ Replaced busy Christmas scene with professional Christmas gradient
- ✅ Created deep forest green vertical gradient (#0d3820 → #051610)
- ✅ Added subtle snowflake overlay at 8% opacity for Christmas atmosphere
- ✅ Improved contrast ratios and readability while maintaining festive spirit

### MOBILE-001: Mobile PWA Safe Area Implementation ✅  
**Priority**: High  
**Category**: Mobile UX  
**Status**: Resolved (August 11, 2025)

**Problem**: Footer and active row positioned too close to bottom edge on mobile PWA fullscreen mode.

**Solution Implemented**:
- ✅ Created SafeAreaManager.js for cross-platform safe area detection
- ✅ Implemented CSS env() API with intelligent fallbacks  
- ✅ Added swipe gesture margin for iOS/Android bottom swipe prevention
- ✅ Fixed HistoryScroller touch area to respect footer positioning
- ✅ Cross-platform compatibility verified

---

## 🗂️ Closed/Deprioritized Issues

### TECH-002: Scene Lifecycle Listener Cleanup 🚫
**Status**: Closed - Not Needed for Current Scope  
**Reason**: Deferred until replay/multi-session features added. Simple family game doesn't require this complexity. Current `_debugKeysRegistered` guard is sufficient mitigation.

### TECH-003: Lightweight Logger Abstraction 🚫
**Status**: Closed - Sufficient Solution Implemented  
**Reason**: Console log cleanup completed with TestConfig guards. Current solution sufficient for family game scope.

### TECH-004: ESLint + Prettier Integration 🚫
**Status**: Closed - Over-Engineering  
**Reason**: Overkill for small family Christmas game. Code already well-structured and consistent.

### TECH-005: Asset Loading Manifest 🚫
**Status**: Closed - Premature Optimization  
**Reason**: Current asset count manageable without manifest. Loading performance already acceptable.

### TECH-006: Debug Key Map Documentation 🚫
**Status**: Closed - Low Value  
**Reason**: Debug keys simple and self-explanatory. README covers basics sufficiently.

### UI-015: Random Guess Feature 🚫
**Status**: Closed - Could Undermine Game Experience  
**Reason**: Feature request that might reduce strategic thinking aspect. Hint system already provides assistance.

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
- **User Experience**: Focused on high-impact improvements ✅
- **Technical Debt**: Cleaned up ✅

**Next Focus**: UI-019 (Score Logic) and UI-021 (Element Picker) for maximum UX impact, then AUDIO-001 (Christmas Audio), then DEPLOY-001 (Final Testing)

**Project Status**: Ready for final UX polish and family deployment! 🎄🎮
