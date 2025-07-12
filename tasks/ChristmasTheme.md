# Task 6: Implement Christmas-Themed Feedback System

**Status**: ✅ COMPLETED  
**Objective**: Replace traditional black/white pegs with intuitive Christmas-themed feedback symbols that are easier for new players to understand.

> 📊 **Note**: Status managed in [tasks.json](../tasks.json). Use `python scripts/automation.py status` for current state.

## Current State
Game uses basic black/white peg feedback that requires Mastermind knowledge.

## Implementation Steps

### 1. Create Feedback Symbols in `HistoryManager.js`
- **Perfect Match**: Gold Star ⭐ (element and position correct)
- **Partial Match**: Silver Bell 🔔 (element correct, wrong position)  
- **No Match**: Red X ❌ (element not in code)

### 2. Update Feedback Display Logic
- Modify `renderGuessRow()` method to show symbols instead of colored dots
- Add small text labels: "Perfect!", "Close!", "Try Again!"
- Use consistent color coding: Gold/Green for perfect, Silver for partial, Red for wrong

### 3. Add Feedback Legend
- Create small legend in `GameScene.js` explaining symbols
- Position legend where it doesn't interfere with gameplay
- Make legend toggle-able or collapsible for experienced players

## Known Issues to Fix

### Layout Conflict Issue
- **Problem**: Active guess row overlaps with Christmas legend
- **Symptom**: "TAP" placeholders cover legend text, blocking readability
- **Root Cause**: Active row positioning doesn't account for legend space
- **Solution**: Adjust active row Y positioning to be below legend
- **Files**: `js/managers/ActiveRowManager.js` or `js/scenes/GameScene.js`

### Help Screen Issues 
- **Problem**: Incorrect feedback example in MainMenu.js instructions
- **Example Error**: Star element gets wrong feedback when it should be perfect match
- **Element Confusion**: Using Star (⭐) as both game element and feedback symbol confuses users
- **Solution**: Use different element in example (avoid Star to prevent confusion)
- **Corrected Example**: If secret is [🎅🎁🎄🪴] and you guess [🎅🪴🎄🌟]: 🎅⭐ 🪴🔔 🎄🔔 🌟❌

### Unused "Wrong" Feedback Investigation
- **Question**: Game loads 'wrong' feedback assets (Red X) but only uses 'perfect' and 'close'
- **Current Logic**: GameUtils.calculateFeedback() only returns black/white counts (no 'wrong' indicator)
- **Feedback Types**: Only renders perfect (★) and close (🔔) symbols
- **Assets Loaded**: feedback_wrong_x_1x/2x/3x.png exist but appear unused
- **Decision Needed**: Remove unused wrong assets or implement wrong feedback display?

### Image vs Icon Usage
- **Current**: Help screen uses emoji icons (⭐🔔❌) instead of actual game assets
- **Issue**: Real feedback symbols are gold bell images, not silver emoji bells
- **Asset Availability**: feedback_perfect_star, feedback_close_bell, feedback_wrong_x images exist
- **Enhancement**: Replace emoji with actual game images in help screen for consistency

## Files to Modify
- `js/managers/HistoryManager.js` - Update feedback display
- `js/scenes/GameScene.js` - Add feedback legend

## Success Criteria
- [x] Help screen shows correct feedback example (fixed: no longer uses star element, removed unused red X)
- [x] Help screen describes correct feedback behavior (no symbol for elements not in code)
- [ ] New players can understand feedback without prior Mastermind experience
- [ ] Feedback symbols are clearly visible on iPhone displays  
- [ ] Legend explains what each symbol means
- [ ] Symbols maintain game's Christmas theme
- [ ] Active row positioning fixed to not overlap legend
- [ ] Consider using actual game images instead of emoji in help screen

## Christmas Theme Guidelines
- **Gold Stars**: Excellence and celebration
- **Silver Bells**: Close but not quite right
- **Red X**: Clear indication to try again
- **Encouraging Language**: Positive, family-friendly messaging

---
**Previous**: Task 5C (Mobile Layout Fixes)  
**Next**: Task 7 (Round Over Screen)
