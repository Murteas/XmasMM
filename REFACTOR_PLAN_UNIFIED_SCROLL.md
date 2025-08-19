# 🔄 REFACTOR PLAN: Unified Scrollable Layout

## 🎯 Objective
Replace current footer-based layout with unified scrollable layout to solve:
- Guess/footer overlap issues  
- Mobile touch conflicts
- Architecture complexity

## 🏗️ Target Architecture

```
[Header Container - Fixed]
├── Title, Back Button, Hint Button, Progress
│
[Single Scrollable Container - Full Height]
├── Completed Guess History (grows downward)
├── Active Row (inline, after last guess)
├── Element Picker (below active row when open)
│
[Safe Area - No fixed footer]
```

## 📁 Files to Modify

### Core Changes Required
1. **GameScene.js** - Remove footer container, expand scrollable area
2. **ActiveRowManager.js** - Remove footer logic, implement inline positioning
3. **HistoryManager.js** - Simplify to single container approach
4. **HistoryScroller.js** - Simplify touch handling, full-screen scroll area

### Files to Remove/Simplify
- **ScrollableHistoryManager.js** - May no longer be needed
- **ElementPicker.js** - Update to work in scrollable context

## 🔄 Implementation Steps

### Phase 1: Preparation & Backup
- [ ] Create feature branch: `feature/unified-scrollable-layout`
- [ ] Document current working state
- [ ] Commit all current changes
- [ ] Create rollback plan

### Phase 2: Core Layout Changes
- [ ] **Step 2.1**: Modify GameScene.js layout containers
  - Remove footerContainer creation
  - Expand scrollableContainer to full available height
  - **Agent Provides**: Code changes, console error check
  - **Human Tests**: Scene loads correctly, layout looks reasonable

- [ ] **Step 2.2**: Update ActiveRowManager.js for inline positioning
  - Remove footer container logic
  - Implement inline positioning after last guess
  - **Agent Provides**: Code changes, reference validation
  - **Human Tests**: Active row appears in correct position, no visual glitches

### Phase 3: Touch & Scroll System
- [ ] **Step 3.1**: Simplify HistoryScroller.js
  - Remove footer boundary detection
  - Implement full-height scroll area
  - **Agent Provides**: Code changes, structure validation
  - **Human Tests**: Scrolling works smoothly, no conflicts

- [ ] **Step 3.2**: Test touch interactions
  - Verify no touch conflicts
  - Test on actual mobile device
  - **Agent Provides**: Code review, potential issue identification
  - **Human Tests**: Mobile swipe bug resolved, touch responsiveness

### Phase 4: Element Picker Integration
- [ ] **Step 4.1**: Update ElementPicker positioning
  - Position relative to active row in scroll context
  - **Agent Provides**: Code changes, positioning logic
  - **Human Tests**: Element picker opens/closes correctly, proper positioning

### Phase 5: Polish & Validation
- [ ] **Step 5.1**: Remove unused code
- [ ] **Step 5.2**: Update layout constants
- [ ] **Step 5.3**: Comprehensive testing
- [ ] **Step 5.4**: Mobile device validation

## 🚨 Rollback Plan
- Keep current implementation in `main` branch
- Work in `feature/unified-scrollable-layout` branch
- Can always `git checkout main` to revert
- Document any breaking changes

## ✅ Success Criteria
- [ ] No guess/footer overlap issues
- [ ] No mobile swipe conflicts
- [ ] Smooth scrolling behavior
- [ ] All game functionality preserved
- [ ] Simpler, more maintainable code

## 🧪 Testing Strategy

### Agent Responsibilities (Automated/Code Validation)
- [ ] **Syntax Validation**: Check for JavaScript syntax errors
- [ ] **Reference Validation**: Verify all file imports/references are correct
- [ ] **Console Error Check**: Look for obvious runtime errors in browser console
- [ ] **Code Structure**: Ensure clean code organization and removal of unused parts

### Human Testing Required (Manual Only)
- [ ] **Layout Validation**: Visual inspection of layout behavior
- [ ] **Mobile Device Testing**: Touch interactions, swipe behavior, real device performance
- [ ] **Cross-Platform**: Browser vs PWA mode differences
- [ ] **Gameplay Testing**: Full game flow with various guess counts
- [ ] **Edge Cases**: Long games (10+ guesses), element picker behavior
- [ ] **Performance**: Smooth scrolling, no lag or glitches

### Testing Checkpoints (After Each Phase)
**Agent Provides**: Code changes committed, console log check, "ready for testing"  
**Human Tests**: Specific functionality, reports "works/needs fixes"  
**Decision Point**: Continue to next phase or fix issues

### No Agent Testing Claims
- ❌ Agent will NOT claim to "test" by opening browser
- ❌ Agent will NOT simulate mobile device behavior  
- ❌ Agent will NOT validate actual user experience
- ✅ Agent will focus on code correctness and structure

---

**Next Step**: Review this plan, then start fresh chat with:
"Implement unified scrollable layout for XmasMM following REFACTOR_PLAN_UNIFIED_SCROLL.md"
