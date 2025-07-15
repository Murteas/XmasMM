# Final Product Requirements Document (PRD) for *XmasMM*

## 1. Overview
**Purpose:** *XmasMM* is a simple, web-based, single-player puzzle game for a family Christmas party. Players access the game via a URL on their iPhones, guessing a hidden Christmas-themed code to earn points. The game uses Christmas-themed elements, is hosted for free on GitHub Pages, and features adjustable difficulty. Players share scores verbally to determine a winner, fostering festive family fun.

**Target Audience:** A multigenerational family (parents, teenage/adult children, spouses, ~6-10 players) who enjoy puzzle games and Christmas theming.

**Platform:** Web-based game accessible via a URL on iPhone browsers (e.g., Safari), requiring no app store downloads or hosting costs.

**Key Features:**
- Single-player Mastermind-style code-breaking gameplay, with each player using their own iPhone.
- Adjustable difficulty (4-6 elements) and number of guesses (8-15).
- Christmas-themed elements (Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake).
- Randomized code per round based on difficulty.
- Verbal score sharing; final screen shows all guesses and solution.

---

## 2. Functional Requirements

### 2.1 Gameplay
- **Objective:** Players guess a hidden code of 4-6 Christmas-themed elements in the correct order, receiving feedback on correct elements and positions.
- **Round Structure:**
  - **Difficulty Selection:** Before starting, players choose:
    - Code length: 4, 5, or 6 elements.
    - Number of guesses: 8-15 (player selects exact number).
  - **Code:** Randomized per round based on chosen difficulty, using 6 unique elements (Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake).
  - **Feedback:** After each guess, show:
    - Black pegs for correct element and position.
    - White pegs for correct element, wrong position.
    - Example: If code is [Santa, Present, Star, Tree] and guess is [Santa, Mistletoe, Star, Snowflake], feedback is 2 black pegs (Santa, Star), 0 white pegs.
  - **Guesses:** Players have their chosen number of guesses (8-15) to crack the code. If unsolved, the code is revealed.
  - **Bonus:** A “Santa’s Hint” feature (unlocked after 500 points in a round) reveals one code element’s position, usable once in remaining guesses.
- **Scoring:**
  - Base score: (Max guesses - Used guesses + 1) × Difficulty multiplier.
    - Difficulty multiplier: 100 for 4 elements, 150 for 5 elements, 200 for 6 elements.
    - Example: Solve 5-element code in 6 guesses with max 10 guesses → (10 - 6 + 1) × 150 = 5 × 150 = 750 points.
  - Score displayed prominently at round’s end (e.g., “Your Score: 750 points!”).
- **Game Over:** After the last guess or a correct guess, a “Round Over” screen shows:
  - Player’s score.
  - All guesses with their feedback.
  - Correct code.
  - A “Play Again” button to restart with new difficulty selection.

### 2.2 Customization
- **Christmas-Themed Elements:**
  - 6 elements (Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake) used for the code.
  - No family photos or custom messages; elements are pre-designed sprites.
- **Santa’s Hint:**
  - Embedded as a Christmas-themed bonus (Santa icon) after reaching 500 points.
- **Customization Process:**
  - No runtime or pre-deployment customization; elements are hard-coded.

### 2.3 Score Sharing
- **Verbal Score Sharing:**
  - Players verbally report scores after each round (e.g., “I got 750 points!”).
  - “Round Over” screen displays score in large, clear text.
  - No leaderboard; organizer tracks scores informally (e.g., on paper).

### 2.4 Christmas Theming
- **Visuals:**
  - Background: Scandinavian Christmas scene (cozy cabin, snow, twinkling lights).
  - Code Elements: 6 icons (Santa, Present, Mistletoe, Star, Christmas Tree, Snowflake).
  - UI: Festive buttons, feedback pegs styled as mini ornaments.
- **Sound Effects:**
  - Jingle bells for guesses, “ho ho ho” for correct solutions, Santa laugh for hint use.
- **Background Music:** Optional lo-fi “Winter Wonderland” track.
- **Sound Controls:** Separate on/off toggles for sound effects and music, accessible from main menu or settings.

---

## 3. Non-Functional Requirements

### 3.1 Platform
- Runs on iPhone browsers (Safari, Chrome) via a GitHub Pages URL.
- Responsive design for iPhone screen sizes (e.g., iPhone 12, 14, 16).
- No app store or server hosting to ensure zero cost.
- Each player uses their own iPhone.

### 3.2 Performance
- Load time: <5 seconds on iPhone with 4G/Wi-Fi.
- Smooth gameplay: 60 FPS for animations (e.g., feedback pegs, transitions).
- Local storage: <10MB for assets (no runtime storage).

### 3.3 Usability
- **Customization:** None; players select difficulty and guesses.
- **Player Experience:** Access URL, select difficulty/guesses, play round, share score verbally.
- Intuitive controls: Tap to select elements, tap to submit guess.
- Clear UI: Current guess, feedback history, guesses remaining, and score visible.
- No tutorial required.

### 3.4 Accessibility
- High color contrast for icons, text, and feedback to aid visual impairments.
- Playable without sound (visual feedback for all actions).
- No screen reader support required.

### 3.5 Security
- No user data stored or uploaded; all assets hard-coded.
- No runtime data collection for privacy.

---

## 4. Technical Requirements
- **Frontend:**
  - HTML5, CSS3, JavaScript.
  - **Recommended Framework:** Phaser.js for 2D game framework, mobile support, and ease of handling sprites, animations, and touch input. Alternatives (e.g., p5.js, vanilla JavaScript with HTML/CSS) are acceptable if justified for simplicity or reduced bundle size, provided they meet performance and usability requirements.
  - Canvas/WebGL for rendering icons and animations.
  - Responsive framework (e.g., Bootstrap) for iPhone compatibility.
- **Input:**
  - Touch-based input (tap to select elements, tap to submit).
- **Storage:**
  - No runtime storage; assets hard-coded.
- **Assets:**
  - Hard-coded sprite sheets for 6 elements and UI.
  - Audio files for jingle bells, Santa laugh, music (<1MB total).
- **Hosting:**
  - Hosted on GitHub Pages via the repository `https://github.com/Murteas/XmasMM` for zero-cost static site deployment.
- **Error Handling:**
  - If a guess is incomplete, prompt to complete and don’t deduct.
  - Ensure robust asset loading to prevent crashes.

---

## 5. Constraints
- **Cost:** Zero hosting/deployment costs via GitHub Pages.
- **Timeline:** One-time Christmas party, prioritizing simplicity.
- **Scope:** Single-player; no multiplayer.
- **Usage:** ~6-10 players, likely used once.

---

## 6. Assumptions
- Players have iPhones with modern browsers (Safari/Chrome, iOS 17+).
- Wi-Fi or mobile data available to load URL.
- Players share scores verbally.
- Players are familiar with Mastermind or can learn via play.

---

## 7. Deliverables
- **Web-Based Game:**
  - Hosted on GitHub Pages via `https://github.com/Murteas/XmasMM` with a URL for gameplay.
  - Includes Christmas-themed elements and adjustable difficulty.
- **Documentation:**
  - Player guide for accessing URL.
  - Organizer instructions for managing verbal score sharing.

---

## 8. Success Criteria
- Game runs smoothly on iPhones via GitHub Pages URL.
- Players can adjust difficulty (4-6 elements, 8-15 guesses) and scores calculate correctly.
- Final screen shows all guesses and correct code.
- Family enjoys festive theming and competition.

---

## 9. Responses to Developer Questions
- **Device Usage:** Single-player on individual iPhones; scores shared verbally.
- **Leaderboard:** Not needed; verbal sharing.
- **Customization:** None; Christmas-themed elements only.
- **Scoring:** Based on unused guesses and difficulty multiplier.
- **Santa’s Hint:** Unlocked at 500 points; one-time use per round.
- **Sound Controls:** Separate on/off toggles for sound effects and music.
- **Accessibility:** High contrast, sound-independent; no screen reader.
- **Error Handling:** Prompt for incomplete guesses; robust asset loading.
- **Game Over:** “Round Over” shows score, all guesses, correct code, and “Play Again” button.
- **Multiplayer:** Single-player; verbal score sharing.
- **Code Randomization:** Randomized per round based on difficulty.