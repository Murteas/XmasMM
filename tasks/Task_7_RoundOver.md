# Task 7: Create Round Over Screen

**Status**: 📋 QUEUED  
**Objective**: Create a simple end-game screen showing final score, guess history, and replay option.

## Why This Matters
Family members need clear closure to each game and easy way to play again without navigating through multiple screens.

## Implementation Steps

### 1. Create `RoundOver.js` Scene
- Display final score prominently with celebratory message
- Show complete guess history with feedback for review
- Display the correct code solution clearly
- Add large "Play Again" button returning to difficulty selection

### 2. Score Display and Validation
- Review scoring formula: (Max guesses - Used guesses + 1) × Difficulty multiplier
- Show scoring breakdown: base score + difficulty bonus
- Test scoring balance across different game scenarios
- Add encouraging messages based on performance

### 3. Family-Friendly Scene Design
- Use large, easy-to-read text suitable for all ages
- Include encouraging messages: "Great job!", "Try again!", etc.
- Make "Play Again" button prominent and easy to tap
- Consider adding score sharing encouragement for family competition

## Files to Create/Modify
- `js/scenes/RoundOver.js` - New scene file
- `js/scenes/GameScene.js` - Add scene transition on game end
- `js/main.js` - Register new scene

## Success Criteria
- [ ] Round over screen displays all relevant game information clearly
- [ ] Scoring calculation is accurate and encourages replay
- [ ] "Play Again" button works correctly and is easy to find
- [ ] Scene is optimized for family use across all iPhone sizes

## Family-Friendly Design Elements
- **Large Text**: Easy to read for all ages
- **Encouraging Messages**: Positive reinforcement regardless of performance
- **Clear Actions**: Obvious "Play Again" button
- **Score Context**: Help players understand their performance

---
**Previous**: Task 6 (Christmas Theme)  
**Next**: Task 8 (Audio Integration)
