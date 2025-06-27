# Development Steps for *XmasMM*

This document outlines incremental tasks to develop *XmasMM*, a web-based, single-player puzzle game for a family Christmas party, as specified in the Product Requirements Document (PRD). Each task is designed for completion in a single attempt by an agentic AI or developer, ensuring steady progress toward a fully functional game hosted on GitHub Pages.

---

## ✅ Task 1: Set Up Project Structure in Existing Repository **[COMPLETED]**
**Objective:** Initialize the project with Phaser.js in the existing GitHub repository (`https://github.com/Murteas/XmasMM`) and deploy a blank page to GitHub Pages.

**Completed Deliverables:**
- ✅ Created `index.html` with Phaser.js CDN integration
- ✅ Created `styles.css` with responsive iPhone-optimized CSS
- ✅ Created initial `game.js` with basic Phaser setup
- ✅ Created `assets/` folder structure
- ✅ Set up 800x600 Phaser canvas
- ✅ Ensured responsive design for iPhone browsers
- ✅ Verified GitHub Pages deployment

**Success Criteria Met:**
- ✅ Page loads in <5 seconds on iPhone with 4G/Wi-Fi
- ✅ "XmasMM" text is visible and centered on iPhone screens
- ✅ GitHub Pages URL is accessible and responsive

---

## ✅ Task 2: Create Main Menu with Phaser.js **[COMPLETED]**
**Objective:** Implement a main menu scene in Phaser.js with a "Start Game" button and sound toggle buttons, ensuring touch-based input works.

**Completed Deliverables:**
- ✅ Created MainMenu scene with Christmas background (`assets/bg.jpg`)
- ✅ Implemented "Start Game" button with scene transition to DifficultySelection
- ✅ Added SFX and Music toggle buttons with state management
- ✅ Implemented touch input handling using Phaser's interactive system
- ✅ Ensured high contrast for accessibility
- ✅ Properly configured scene transitions

**Success Criteria Met:**
- ✅ Main menu loads with festive background and buttons
- ✅ "Start Game" button transitions to DifficultySelection scene on tap
- ✅ Sound toggles update visually (ON/OFF) and save state in Phaser registry
- ✅ UI is responsive and touch-friendly on iPhones

---

## ✅ Task 3: Implement Difficulty Selection and Core Game Logic **[COMPLETED]**
**Objective:** Create a difficulty selection screen and core Mastermind logic (random code, guess input, feedback) in the `Game` scene.

**Completed Deliverables:**
- ✅ Created DifficultySelection scene with:
  - Code length selection (4, 5, 6 elements)
  - Number of guesses selection (8-15)
  - Confirm button to start game with selected settings
- ✅ Implemented comprehensive Game scene with:
  - Random code generation based on difficulty settings
  - 6 Christmas elements: Santa, Present, Mistletoe, Star, Tree, Snowflake
  - Interactive guess input grid (tap slots to cycle through elements)
  - Submit button for guess confirmation
  - Accurate feedback calculation (black/white pegs)
  - Guess history display with scrolling functionality
  - Touch-scroll capability for viewing all previous guesses
  - Score calculation and tracking
  - Santa's Hint feature (unlocked at 500 points, reveals one position)
  - Win/lose conditions and game state management
- ✅ **Code Refactoring:** Split monolithic code into modular structure:
  - `js/utils/GameUtils.js` - Shared utility functions and constants
  - `js/managers/ScoreManager.js` - Score calculation and hint logic  
  - `js/managers/HistoryManager.js` - Guess history display and touch scrolling
  - `js/scenes/MainMenu.js` - Main menu scene
  - `js/scenes/DifficultySelection.js` - Difficulty selection scene
  - `js/scenes/GameScene.js` - Main game scene
  - `js/main.js` - Game configuration and initialization
- ✅ Enhanced UI with:
  - Dark overlay for improved contrast on feedback dots
  - Smart history scrolling with visual indicators
  - Row numbers and scroll position indicators
  - Proper depth layering for visual elements
  - Touch-friendly swipe scrolling with sensitivity controls

**Success Criteria Met:**
- ✅ Players can select difficulty and start game
- ✅ Random code generates correctly (4-6 elements)
- ✅ Guess input and feedback work accurately per PRD specifications
- ✅ Game tracks guesses and ends round appropriately
- ✅ "Santa's Hint" enables after 500 points and reveals one element
- ✅ Touch scrolling allows viewing entire guess history
- ✅ Modular code structure for easier maintenance and future development

---

## Task 4: Add Christmas-Themed Visuals and UI
**Objective:** Enhance the `Game` scene with Christmas-themed sprites and polished UI for elements, feedback, and score display.

**Steps:**
1. Source or create free sprite sheets (e.g., from OpenGameArt.org) for 6 elements (Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake) and feedback pegs (mini ornaments), saving in `assets/`.
2. In the `Game` scene:
   - Replace placeholder grid with sprite-based slots (e.g., tap a slot to cycle through element sprites).
   - Style feedback pegs as mini ornaments (black/white or red/green for contrast).
   - Add a Scandinavian Christmas background (reuse or new image).
   - Display guesses remaining, current score, and "Santa's Hint" status (e.g., "Hint: Locked").
3. Ensure 60 FPS animations for guess submission (e.g., pegs fade in) using Phaser's tween system.
4. Update `styles.css` for responsive layout on iPhone screens.
5. Commit and redeploy to `https://github.com/Murteas/XmasMM`.

**Deliverables:**
- Sprite sheets in `assets/` for elements and feedback pegs.
- Updated `Game` scene with festive visuals and UI.
- Responsive CSS in `styles.css`.

**Success Criteria:**
- Elements display as Christmas-themed sprites (e.g., Santa, Present).
- Feedback pegs are styled as ornaments with high contrast.
- UI shows guesses, score, and hint status clearly.
- Animations run smoothly at 60 FPS on iPhones.

---

## Task 5: Integrate Sound Effects and Music with Toggles
**Objective:** Add Christmas-themed audio (jingle bells, "ho ho ho", Santa laugh, lo-fi music) with functional sound toggles.

**Steps:**
1. Source free audio files (<1MB total, e.g., from FreeSound.org):
   - Jingle bells for guesses.
   - "Ho ho ho" for correct solutions.
   - Santa laugh for hint use.
   - Lo-fi "Winter Wonderland" track for background music.
2. In the modular structure:
   - Preload audio in the `MainMenu` scene.
   - Play sounds on events (e.g., jingle bells on guess submission).
   - Loop music in `Game` scene, starting after difficulty selection.
   - Use registry state from `MainMenu` toggles to enable/disable sounds and music.
3. Ensure sound-independent play (visual cues like peg animations remain clear).
4. Commit and redeploy to `https://github.com/Murteas/XmasMM`.

**Deliverables:**
- Audio files in `assets/`.
- Updated scenes with sound integration and toggle logic.

**Success Criteria:**
- Sounds play correctly (e.g., jingle bells on guess, Santa laugh on hint).
- Music loops in `Game` scene and respects toggle state.
- Toggles in `MainMenu` enable/disable sounds and music.
- Game is playable without audio (visual feedback intact).

---

## Task 6: Develop "Round Over" Screen with Guess History
**Objective:** Create a `RoundOver` scene showing score, all guesses, correct code, and a "Play Again" button.

**Steps:**
1. Create a `RoundOver` scene in the modular structure:
   - Display final score (e.g., "Your Score: 750 points!") in large, clear text.
   - Show all guesses with feedback pegs (e.g., grid of guess rows).
   - Display correct code as sprites (e.g., [Santa, Present, Star, Tree]).
   - Add a "Play Again" button to return to `DifficultySelection`.
2. Calculate score: (Max guesses - Used guesses + 1) × Difficulty multiplier (100 for 4 elements, 150 for 5, 200 for 6).
3. Use festive background and high-contrast text.
4. Ensure touch input works for "Play Again" button.
5. Commit and redeploy to `https://github.com/Murteas/XmasMM`.

**Deliverables:**
- `RoundOver` scene in the modular structure.
- Updated logic for score calculation and guess history display.

**Success Criteria:**
- "Round Over" screen shows score, all guesses, feedback, and correct code.
- Score calculates correctly per PRD formula.
- "Play Again" button restarts at difficulty selection.
- UI is responsive and festive on iPhones.

---

## Task 7: Finalize Testing and Deployment
**Objective:** Test the game for functionality, performance, and usability, then finalize deployment with documentation.

**Steps:**
1. Test on iPhone browsers (Safari, Chrome):
   - Verify load time <5 seconds on 4G/Wi-Fi.
   - Confirm 60 FPS animations and touch input responsiveness.
   - Check all features: difficulty selection, game logic, visuals, audio, "Round Over" screen.
   - Ensure high contrast and sound-independent play.
   - Test edge cases (e.g., incomplete guesses, hint usage, max/min difficulty).
2. Fix any bugs (e.g., robust asset loading, prompt for incomplete guesses).
3. Create documentation in `https://github.com/Murteas/XmasMM`:
   - `README.md`: Player guide (access URL, play game, share scores verbally).
   - `organizer.md`: Instructions for managing verbal score sharing.
4. Commit final code and redeploy to GitHub Pages.
5. Verify final URL (e.g., `https://Murteas.github.io/XmasMM`) works on multiple iPhones.

**Deliverables:**
- Fully tested game deployed on GitHub Pages via `https://github.com/Murteas/XmasMM`.
- `README.md` and `organizer.md` in repository.

**Success Criteria:**
- Game meets all PRD requirements (difficulty, scoring, theming, etc.).
- No crashes or major bugs on iPhones.
- Load time <5 seconds, animations at 60 FPS.
- Documentation is clear for players and organizer.
- GitHub Pages URL is stable and accessible.

---

## Progress Summary

**Completed (Tasks 1-3):**
- ✅ Basic project structure with Phaser.js and GitHub Pages deployment
- ✅ Main menu with Christmas background and sound toggles
- ✅ Difficulty selection scene
- ✅ Complete Mastermind game logic with Christmas theming
- ✅ Touch-based guess input and feedback system
- ✅ Scrollable guess history with touch controls
- ✅ Santa's Hint feature unlocked at 500 points
- ✅ Modular code architecture for maintainability
- ✅ Enhanced UI with proper contrast and visual indicators

**Remaining (Tasks 4-7):**
- Christmas-themed sprites and visual polish
- Sound effects and music integration
- Round Over screen with final scoring
- Testing, documentation, and final deployment

---

## Notes
- **Phaser.js Preference:** Use Phaser.js unless a simpler alternative (e.g., p5.js, vanilla JavaScript) significantly reduces complexity while meeting requirements. Justify any deviation in commit messages.
- **Asset Sourcing:** Use free, licensed assets (e.g., OpenGameArt.org, FreeSound.org) to ensure zero cost.
- **Incremental Commits:** Commit after each task to track progress and enable rollback if needed.
- **Testing:** Test on iPhone emulators or devices to ensure touch input and responsiveness.
- **Modular Structure:** The codebase has been refactored into a modular structure for easier maintenance and future development.
