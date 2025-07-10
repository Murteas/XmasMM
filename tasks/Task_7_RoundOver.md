# Task 7: Create Round Over Screen

**Status**: 📋 PENDING (blocked by 6)  
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
- **Review and implement Santa's Hint penalty system**
- Review scoring formula: (Max guesses - Used guesses + 1) × Difficulty multiplier
- **Add progressive hint penalties**: First hint -20%, Second hint -35%, Third+ hint -50%
- Show detailed scoring breakdown: base score, hint penalties, difficulty bonus
- Test scoring balance across different game scenarios
- Add encouraging messages based on performance
- **Add bonus points for no hints used (+25%) and perfect games (+50%)**

### 4. Family-Friendly Scene Design
- Use large, easy-to-read text suitable for all ages
- Include encouraging messages: "Great job!", "Try again!", etc.
- Make "Play Again" button prominent and easy to tap
- **Ensure all scores feel positive and encouraging, regardless of performance**
- **Make scoring transparent and educational rather than punitive**
- Consider adding score sharing encouragement for family competition

## Files to Create/Modify
- `js/scenes/RoundOver.js` - New scene file
- `js/scenes/GameScene.js` - Add scene transition on game end, implement hint penalty tracking
- `js/managers/ScoreManager.js` - Update scoring logic with hint penalties and bonuses
- `js/main.js` - Register new scene

## Success Criteria
- [ ] Round over screen displays all relevant game information clearly
- [ ] **Solution displays actual element images instead of hard-to-read white text**
- [ ] **Santa's Hint penalties are properly implemented and balanced**
- [ ] Scoring calculation is accurate and encourages strategic play
- [ ] **Scoring breakdown is transparent and educational**
- [ ] "Play Again" button works correctly and is easy to find
- [ ] Scene is optimized for family use across all iPhone sizes
- [ ] **All family members can achieve satisfying scores regardless of skill level**

## Family-Friendly Design Elements
- **Large Text**: Easy to read for all ages
- **Encouraging Messages**: Positive reinforcement regardless of performance
- **Clear Actions**: Obvious "Play Again" button
- **Score Context**: Help players understand their performance

---
**Previous**: Task 6 (Christmas Theme)  
**Next**: Task 8 (Audio Integration)
