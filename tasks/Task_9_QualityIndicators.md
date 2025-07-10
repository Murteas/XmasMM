# Task 9: Add Basic Guess Quality Indicators

**Status**: 📋 PENDING (blocked by 8)  
**Objective**: Add simple visual indicators to help family members understand how well they're doing and learn strategy.
> 📊 **Note**: Status managed in [tasks.json](../tasks.json). Use `python scripts/automation.py status` for current state.


## Why This Matters
Family members learn at different rates. Visual feedback helps everyone understand what makes a good guess, making the game more educational and engaging.

## Implementation Steps

### 1. Create Simple Quality Categories
- **Excellent**: 75%+ correct positions (subtle gold highlight)
- **Good**: 50%+ total correct elements (subtle silver highlight)  
- **Fair**: 25-49% total correct elements (subtle bronze highlight)
- **Learning**: <25% total correct elements (encouraging blue highlight)

### 2. Add Family-Friendly Visual Indicators
- Update `RoundOver.js` to calculate guess quality
- Add very subtle background color or gentle border glow to guess rows
- Include encouraging quality labels: "Excellent!", "Good job!", "Getting warmer!", "Keep trying!"
- Use positive language that encourages rather than discourages

### 3. Mobile and Family Optimization
- Ensure colors are clearly distinguishable on iPhone screens
- Keep effects subtle to maintain readability for all ages
- Test accessibility with different lighting conditions
- Make sure indicators help rather than overwhelm new players

## Files to Modify
- `js/scenes/RoundOver.js` - Add quality calculation and display
- Optionally update `HistoryManager.js` if reusing display logic

## Success Criteria
- [ ] Family members can quickly see which guesses were most helpful
- [ ] Quality indicators are encouraging rather than discouraging
- [ ] Visual effects work well on all mobile devices
- [ ] Feature helps family members learn strategy over time
- [ ] Interface remains clean and not cluttered

## Educational Design Principles
- **Positive Reinforcement**: All feedback is encouraging
- **Learning Support**: Help players understand good strategies
- **Visual Clarity**: Effects enhance rather than distract
- **Age Appropriate**: Suitable for family members of all ages

---
**Previous**: Task 8 (Audio Integration)  
**Next**: Task 10 (Testing & Deployment)
