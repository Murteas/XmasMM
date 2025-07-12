# Task 7: Create Round Over Screen

**Status**: ✅ COMPLETED  
**Objective**: Create a simple end-game screen showing final score, guess history, and replay option.
> 📊 **Note**: Status managed in [tasks.json](../tasks.json). Use `python scripts/automation.py status` for current state.


## Why This Matters
Family members need clear closure to each game and easy way to play again without navigating through multiple screens.

## Implementation Steps

### 1. Create `RoundOver.js` Scene
- Display final score prominently with celebratory message
- Show complete guess history with feedback for review
- **Display the correct code solution using actual element images** (not hard-to-read white text)
- Add large "Play Again" button returning to difficulty selection

### 2. Enhanced Solution Display
- **Use actual element images** instead of text names ("Santa", "Tree", etc.)
- Match the visual styling of game elements for consistency
- Add clear "The answer was:" label with good contrast background
- Ensure solution is clearly visible against background for all family members
- Position solution prominently but not overwhelming other content

### 3. Score Display and Validation  
- **Implement element-based scoring system**
- **Scoring formula**: 
  - Correct element in correct position: 200pts each
  - Correct element in wrong position: 100pts each  
  - Complete solution bonus: 300pts
  - Speed bonus: 75pts per guess under 10
  - Speed penalty: -25pts per guess over 10
  - Hint penalty: -200pts (single hint allowed per game)
- Show detailed scoring breakdown with transparent calculation
- Test scoring balance across different game scenarios

### 4. Family-Friendly Scene Design and Share Feature
- Use large, easy-to-read text suitable for all ages
- **Visual hierarchy**: Game Over status → Score breakdown → Solution → View History button → Play Again button → Share button
- Make "Play Again" button prominent and easy to tap
- **Add share feature**: Generate text message with score breakdown for family party planner
- **Share format**: "XmasMM Score: 1200pts 🎄\n4 elements solved, 6 guesses, hint used\n(800 + 300 + 300 - 200 = 1200pts)"
- **History view**: Compact scrollable list within RoundOver scene showing all guesses with feedback symbols

## Files to Create/Modify
- `js/scenes/RoundOver.js` - New scene file with score display, solution display, history view, and share functionality
- `js/scenes/GameScene.js` - Add scene transition on game end, track hint usage
- `js/managers/ScoreManager.js` - Replace old scoring with element-based scoring system
- `js/main.js` - Register new scene

## Success Criteria
- [ ] Round over screen displays all relevant game information clearly
- [ ] **Solution displays actual element images instead of hard-to-read white text**
- [ ] **Element-based scoring system implemented with transparent calculation**
- [ ] Scoring calculation is accurate and encourages strategic play
- [ ] **Scoring breakdown shows formula: Elements + Complete + Speed - Hint = Total**
- [ ] "Play Again" button works correctly and is easy to find
- [ ] **Share feature generates family-friendly score text for party planner**
- [ ] **Compact history view shows all guesses with Christmas feedback symbols**
- [ ] Scene is optimized for family use across all iPhone sizes

## Family-Friendly Design Elements
- **Large Text**: Easy to read for all ages
- **Visual Hierarchy**: Clear flow from game status to score to actions
- **Transparent Scoring**: Formula shown clearly for educational value
- **Share Integration**: Easy score sharing for family competition tracking

---
**Previous**: Task 6 (Christmas Theme)  
**Next**: Task 8 (Audio Integration)
