# Task 6: Implement Christmas-Themed Feedback System

**Status**: 🚀 READY (depends on 5E)  
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

## Files to Modify
- `js/managers/HistoryManager.js` - Update feedback display
- `js/scenes/GameScene.js` - Add feedback legend

## Success Criteria
- [ ] New players can understand feedback without prior Mastermind experience
- [ ] Feedback symbols are clearly visible on iPhone displays  
- [ ] Legend explains what each symbol means
- [ ] Symbols maintain game's Christmas theme

## Christmas Theme Guidelines
- **Gold Stars**: Excellence and celebration
- **Silver Bells**: Close but not quite right
- **Red X**: Clear indication to try again
- **Encouraging Language**: Positive, family-friendly messaging

---
**Previous**: Task 5C (Mobile Layout Fixes)  
**Next**: Task 7 (Round Over Screen)
