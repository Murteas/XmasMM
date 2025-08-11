# Issue: Game Header Shows Guesses Instead of Current Score

## Priority: Medium
## Category: UI/UX Enhancement
## Status: Open

### Problem Description
The game header currently displays "Guesses: 1/10" in the top-right corner, but this information is not as valuable to players as seeing their current score progression.

### Current Behavior
- Header shows guess count (e.g., "Guesses: 1/10")
- Score is only visible in RoundOver scene
- Players have no real-time feedback on their scoring performance

### Expected Behavior
- Header should display current running score (e.g., "Score: 450")
- Score should update in real-time as players make guesses
- Provides immediate feedback on scoring performance

### Technical Details
**File to Modify:** `js/scenes/GameScene.js`
**Location:** Header creation area (likely around game status display)

**Implementation Notes:**
- Access current score from `scoreManager.getScoreBreakdown().total`
- Update header text when score changes (after each guess feedback)
- Maintain score visibility throughout gameplay
- Consider responsive text sizing for mobile

### User Benefits
1. **Real-time Feedback**: Players see immediate scoring impact of their guesses
2. **Motivation**: Running score provides engagement and progress feeling
3. **Strategic Play**: Players can optimize their approach based on score feedback
4. **Consistency**: Aligns with RoundOver scene's score prominence

### Acceptance Criteria
- [ ] Header displays "Score: XXX" instead of guess count
- [ ] Score updates after each guess is submitted
- [ ] Text remains readable on mobile devices
- [ ] Score formatting is consistent with RoundOver scene
- [ ] No performance impact from real-time updates

### Related Files
- `js/scenes/GameScene.js` (primary modification)
- `js/managers/ScoreManager.js` (score calculation reference)
- `js/scenes/RoundOver.js` (consistency reference)

### Notes
This change will make the game feel more rewarding and provide better feedback loops for players during active gameplay.
