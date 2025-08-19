# 🐛 Project Issues Tracker

## 📊 Current Status Summary

**Total Active Issues**: 8 (focused on UX improvements + accessibility + audio integration + deployment)

**Overall Project Health**: 🟢 **Excellent**
- Core functionality complete and mobile-optimized  
- Mobile PWA safe area implementation completed ✅
- Centralized layout constants system implemented ✅
- Button theming and typography enhancement completed ✅
- Score display logic fixed and working correctly ✅
- Technical debt cleaned up - focus on user experience
- Ready for final polish and family-ready deployment

**Last Updated**: August 18, 2025 (Added UI-022: Tablet and Large Screen Accessibility for discussion)

---

## 🚨 Open Issues

### UI-023: GameScene Architecture Simplification 🎯
**Priority**: Medium (Future Enhancement)  
**Category**: Technical Architecture  
**Status**: Analysis Needed

**Problem**: GameScene may be overly complex with multiple layout systems (footer container vs inline active row, scrolling vs fixed positioning)
**Impact**: Code complexity, potential maintenance challenges, harder to debug layout issues
**Context**: Originally had scrolling with inline active row, now uses footer container with fixed positioning

**OBSERVED ISSUE** (Screenshot Evidence):
- Browser testing shows 10th guess will overlap with history area and footer
- 9 completed guesses visible, active row in footer
- Question: Is this overlap behavior acceptable or does it indicate layout architecture problems?
- Suggests possible need for dynamic layout switching or better space management

**Analysis Required**:
- Evaluate current footer container vs original inline active row approach  
- Compare complexity of current vs previous architecture
- Identify opportunities for simplification without losing mobile UX benefits
- Consider unified layout approach vs current hybrid system
- **NEW**: Analyze overlap behavior for games with 10+ guesses

**Questions to Investigate**:
- Is footer container approach better than inline for mobile UX?
- Can we simplify the coordinate system management?
- Are there unused/redundant layout managers?
- Would a single layout approach be more maintainable?
- **NEW**: Should 10+ guess games auto-switch to different layout mode?

**Research Phase**: Expert architecture review needed before any changes

---

### AUDIO-001: Christmas Audio Integration 🎵
**Priority**: High (Next Phase)  
**Category**: Feature Enhancement  
**Status**: Implementation Complete - Awaiting Audio Files

**Problem**: Game lacks festive audio feedback that would enhance family gameplay experience
**Impact**: Missing opportunity for Christmas atmosphere and functional audio feedback
**Location**: Audio integration across all scenes

**IMPLEMENTATION COMPLETED** ✅:
- **AudioManager service**: Complete audio system with family-friendly design
- **Integration points**: MainMenu preload, GameScene gameplay triggers
- **User controls**: Audio toggle button (replaces music toggle)
- **Sound triggers**: All 4 planned sound effects integrated
- **Technical features**: iOS Safari compatibility, graceful fallback, user preference management

**REMAINING WORK** 🔄:
- **Audio files needed**: 
  - jingle_bells.mp3/ogg (guess submission)
  - ho_ho_ho.mp3/ogg (game win celebration)  
  - tada.mp3/ogg (hint usage - renamed from santa_chuckle for broader appeal)
  - ~~Element selection sound removed~~ (quieter family experience)
- **Testing required**: Audio playback verification with actual files

**Acceptance Criteria**:
- [x] Christmas-themed sound effects for key game events (no background music)
- [x] Proper iOS Safari audio handling with user interaction
- [x] Audio toggle integration with existing menu controls
- [x] Game fully playable with audio disabled
- [x] Family-appropriate volume levels and sound selection
- [x] Functional feedback improves gameplay without being intrusive
- [ ] **Audio files sourced and integrated** (final step)
- [ ] **Mobile device testing** with actual audio playback

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

### UI-022: Tablet and Large Screen Accessibility 🟡
**Priority**: Medium  
**Category**: Accessibility & Responsive Design  
**Status**: Open

**Problem**: Application is optimized for mobile (375x667) but doesn't scale well for larger devices like iPads
**Impact**: Poor user experience on tablets and larger screens - interface elements may be too small or poorly positioned
**Location**: All scenes - responsive layout system needs evaluation

**Current State**: 
- Works perfectly on intended smallest mobile device
- Mobile-first design approach implemented
- Fixed viewport approach may not be ideal for larger screens

**Discussion Points**:
- **Value Assessment**: Is tablet support worth the development effort for a family Christmas game?
- **Target Audience**: Do families typically play on tablets vs phones during Christmas gatherings?
- **Development Scope**: How much refactoring would responsive scaling require?
- **Alternative Solutions**: Could we add simple "zoom" scaling vs full responsive redesign?

**Technical Considerations**:
- Current LayoutConfig.js uses fixed constants optimized for mobile
- Three-zone container system (header/scrollable/footer) may need scaling logic
- Button touch targets (44px minimum) work on mobile but may be small on tablets
- Christmas theming and visual elements sized for mobile viewport

**Investigation Needed**:
- Test current experience on iPad/larger devices to document specific issues
- Research family gaming patterns - phone vs tablet usage during Christmas
- Evaluate effort vs benefit for tablet optimization
- Consider simple scaling solutions vs full responsive design

**Acceptance Criteria** (To be defined based on discussion):
- [ ] Document current large screen experience and specific issues
- [ ] Determine if tablet support aligns with family use cases
- [ ] Define scope: simple scaling vs responsive redesign vs no action
- [ ] If proceeding: implement solution that maintains mobile performance

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

### UI-019: Score Display Logic Review ✅
**Priority**: High  
**Category**: Game Logic  
**Status**: Resolved (August 15, 2025)

**Problem**: The score shown after each guess doesn't seem correct or logical to users
**Impact**: Confusing feedback undermines game experience and learning
**Location**: Score calculation and display after each guess

**RESOLUTION IMPLEMENTED**:
- Changed progress points to show only the most recent guess performance (not cumulative)
- Progress score now updates only after submit button is pressed (not during element placement)
- Clear feedback: 0 for no matches, higher scores for perfect/close element matches
- Fixed timing issue where score was calculated before guess was properly processed

**Technical Changes**:
- Modified `ScoreManager.updateProgressPoints()` to calculate from most recent guess only
- Fixed sequence: submit → process → add to history → calculate score → update display
- Progress display now clearly represents the value of the last guess made

**Acceptance Criteria**: ✅ ALL COMPLETE
- [x] Score calculation logic is documented and logical
- [x] Score display clearly communicates what it represents (most recent guess performance)
- [x] Users understand the scoring system without confusion
- [x] Score enhances rather than detracts from game experience

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

### UI-021: Element Picker Interaction Enhancement ✅
**Priority**: High  
**Category**: User Experience  
**Status**: Resolved

**Problem**: Element picker interaction was awkward - users had to click slot then modal for each element selection  
**Impact**: Poor UX with 12 interactions needed for first guess (6 slots × 2 clicks each)  
**Solution Implemented**: 
- Replaced modal with always-visible inline element bar
- Smart auto-fill: tap element → fills next empty slot (1 interaction vs 2)
- Explicit replacement: tap slot → tap element for replacements
- Compact grid feedback layout prevents overflow
- Centered layout with proper visual hierarchy
- Subtle animation hints for discoverability
**Result**: Dramatically improved UX flow, especially for initial guess filling
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
