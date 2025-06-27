# Development Steps for *XmasMM*

This document outlines incremental tasks to develop *XmasMM*, a web-based, single-player puzzle game for a family Christmas party, as specified in the Product Requirements Document (PRD). Each task is designed for completion in a single attempt by an agentic AI or developer, ensuring steady progress toward a fully functional game hosted on GitHub Pages.

---

## ✅ Task 1: Set Up Project Structure in Existing Repository **[COMPLETED]**
**Objective:** Initialize the project with Phaser.js in the existing GitHub repository (`https://github.com/Murteas/XmasMM`) and deploy a blank page to GitHub Pages.

**Steps:**
1. In the `https://github.com/Murteas/XmasMM` repository, create:
   - `index.html`: Basic HTML file including Phaser.js (via CDN, e.g., `https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js`).
   - `styles.css`: Empty CSS file for future styling.
   - `game.js`: Empty JavaScript file for Phaser game logic.
   - `assets/`: Empty folder for sprites and audio.
2. In `index.html`, set up a minimal Phaser canvas (e.g., 800x600 pixels) with a blank scene displaying “XmasMM” text.
3. Commit files to the `main` branch.
4. Enable GitHub Pages in the repository settings (use `main` branch, root directory) if not already enabled.
5. Push changes and verify the blank page loads at the GitHub Pages URL (e.g., `https://Murteas.github.io/XmasMM`).
6. Ensure the page is responsive on iPhone browsers (Safari/Chrome) using media queries in `styles.css`.

**Deliverables:**
- Updated `https://github.com/Murteas/XmasMM` with `index.html`, `styles.css`, `game.js`, and `assets/` folder.
- Deployed GitHub Pages URL showing a blank Phaser canvas with “XmasMM” text.

**Success Criteria:**
- Page loads in <5 seconds on iPhone with 4G/Wi-Fi.
- “XmasMM” text is visible and centered on iPhone screens (e.g., iPhone 12, 14, 16).
- GitHub Pages URL is accessible and responsive.

---

## Task 2: Create Main Menu with Phaser.js
**Objective:** Implement a main menu scene in Phaser.js with a “Start Game” button and sound toggle buttons, ensuring touch-based input works.

**Steps:**
1. In `game.js`, create a Phaser game with two scenes: `MainMenu` and `Game` (placeholder for now).
2. In `MainMenu`:
   - Add a Scandinavian Christmas background (e.g., use a free 800x600 PNG from a site like OpenGameArt.org, saved in `assets/`).
   - Add a “Start Game” button (text or sprite) centered on-screen, transitioning to the `Game` scene on tap.
   - Add two toggle buttons for sound effects and music (e.g., “SFX: ON/OFF”, “Music: ON/OFF”), storing state in Phaser’s registry.
3. Test touch input on buttons using Phaser’s input system (e.g., `setInteractive()`).
4. Ensure high color contrast for text/buttons (e.g., white text on dark background).
5. Commit changes to `https://github.com/Murteas/XmasMM` and redeploy to GitHub Pages.

**Deliverables:**
- Updated `game.js` with `MainMenu` and `Game` scenes.
- Background image in `assets/`.
- Main menu with “Start Game” and sound toggle buttons.

**Success Criteria:**
- Main menu loads with festive background and buttons.
- “Start Game” button transitions to blank `Game` scene on tap.
- Sound toggles update visually (ON/OFF) and save state.
- UI is responsive and touch-friendly on iPhones.

---

## Task 3: Implement Difficulty Selection and Core Game Logic
**Objective:** Create a difficulty selection screen and core Mastermind logic (random code, guess input, feedback) in the `Game` scene.

**Steps:**
1. Create a `DifficultySelection` scene in `game.js`, shown after “Start Game”:
   - Display two dropdowns or buttons: code length (4, 5, 6 elements) and guesses (8-15).
   - Add a “Confirm” button to start the `Game` scene with selected settings.
2. In the `Game` scene:
   - Generate a random code based on difficulty (e.g., 4-6 elements from [Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake]).
   - Create a grid UI:
     - Row for current guess (4-6 slots, tap to cycle through elements).
     - “Submit” button to confirm guess.
     - History area for past guesses and feedback (black/white pegs as mini ornaments).
   - Implement logic:
     - Validate guess (ensure all slots filled).
     - Calculate feedback (black pegs for correct element/position, white for correct element/wrong position).
     - Track guesses remaining and end round if solved or guesses exhausted.
   - Add “Santa’s Hint” button (disabled until 500 points, reveals one code element’s position once per round).
3. Store game state (code, guesses, feedback, points) in Phaser’s registry.
4. Commit and redeploy to `https://github.com/Murteas/XmasMM`.

**Deliverables:**
- `DifficultySelection` scene with code length and guess selection.
- `Game` scene with grid UI, guess input, feedback logic, and “Santa’s Hint”.
- Updated `game.js` with core logic.

**Success Criteria:**
- Players can select difficulty and start game.
- Random code generates correctly (4-6 elements, no duplicates).
- Guess input and feedback work accurately (e.g., black/white pegs match PRD example).
- Game tracks guesses and ends round appropriately.
- “Santa’s Hint” enables after 500 points and reveals one element.

---

## Task 4: Add Christmas-Themed Visuals and UI
**Objective:** Enhance the `Game` scene with Christmas-themed sprites and polished UI for elements, feedback, and score display.

**Steps:**
1. Source or create free sprite sheets (e.g., from OpenGameArt.org) for 6 elements (Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake) and feedback pegs (mini ornaments), saving in `assets/`.
2. In the `Game` scene:
   - Replace placeholder grid with sprite-based slots (e.g., tap a slot to cycle through element sprites).
   - Style feedback pegs as mini ornaments (black/white or red/green for contrast).
   - Add a Scandinavian Christmas background (reuse or new image).
   - Display guesses remaining, current score, and “Santa’s Hint” status (e.g., “Hint: Locked”).
3. Ensure 60 FPS animations for guess submission (e.g., pegs fade in) using Phaser’s tween system.
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
**Objective:** Add Christmas-themed audio (jingle bells, “ho ho ho”, Santa laugh, lo-fi music) with functional sound toggles.

**Steps:**
1. Source free audio files (<1MB total, e.g., from FreeSound.org):
   - Jingle bells for guesses.
   - “Ho ho ho” for correct solutions.
   - Santa laugh for hint use.
   - Lo-fi “Winter Wonderland” track for background music.
2. In `game.js`:
   - Preload audio in the `MainMenu` scene.
   - Play sounds on events (e.g., jingle bells on guess submission).
   - Loop music in `Game` scene, starting after difficulty selection.
   - Use registry state from `MainMenu` toggles to enable/disable sounds and music.
3. Ensure sound-independent play (visual cues like peg animations remain clear).
4. Commit and redeploy to `https://github.com/Murteas/XmasMM`.

**Deliverables:**
- Audio files in `assets/`.
- Updated `game.js` with sound integration and toggle logic.

**Success Criteria:**
- Sounds play correctly (e.g., jingle bells on guess, Santa laugh on hint).
- Music loops in `Game` scene and respects toggle state.
- Toggles in `MainMenu` enable/disable sounds and music.
- Game is playable without audio (visual feedback intact).

---

## Task 6: Develop “Round Over” Screen with Guess History
**Objective:** Create a `RoundOver` scene showing score, all guesses, correct code, and a “Play Again” button.

**Steps:**
1. Create a `RoundOver` scene in `game.js`:
   - Display final score (e.g., “Your Score: 750 points!”) in large, clear text.
   - Show all guesses with feedback pegs (e.g., grid of guess rows).
   - Display correct code as sprites (e.g., [Santa, Present, Star, Tree]).
   - Add a “Play Again” button to return to `DifficultySelection`.
2. Calculate score: (Max guesses - Used guesses + 1) × Difficulty multiplier (100 for 4 elements, 150 for 5, 200 for 6).
3. Use festive background and high-contrast text.
4. Ensure touch input works for “Play Again” button.
5. Commit and redeploy to `https://github.com/Murteas/XmasMM`.

**Deliverables:**
- `RoundOver` scene in `game.js`.
- Updated logic for score calculation and guess history display.

**Success Criteria:**
- “Round Over” screen shows score, all guesses, feedback, and correct code.
- Score calculates correctly per PRD formula.
- “Play Again” button restarts at difficulty selection.
- UI is responsive and festive on iPhones.

---

## Task 7: Finalize Testing and Deployment
**Objective:** Test the game for functionality, performance, and usability, then finalize deployment with documentation.

**Steps:**
1. Test on iPhone browsers (Safari, Chrome):
   - Verify load time <5 seconds on 4G/Wi-Fi.
   - Confirm 60 FPS animations and touch input responsiveness.
   - Check all features: difficulty selection, game logic, visuals, audio, “Round Over” screen.
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

## Notes
- **Phaser.js Preference:** Use Phaser.js unless a simpler alternative (e.g., p5.js, vanilla JavaScript) significantly reduces complexity while meeting requirements. Justify any deviation in commit messages.
- **Asset Sourcing:** Use free, licensed assets (e.g., OpenGameArt.org, FreeSound.org) to ensure zero cost.
- **Incremental Commits:** Commit after each task to track progress and enable rollback if needed.
- **Testing:** Test on iPhone emulators or devices to ensure touch input and responsiveness.