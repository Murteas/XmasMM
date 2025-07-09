# XmasMM

## Overview
XmasMM is a web-based, single-player puzzle game designed for festive family fun during Christmas parties. Players access the game via a URL on their iPhones, guessing a hidden Christmas-themed code to earn points. The game is hosted for free on GitHub Pages and features adjustable difficulty levels.

## Key Features
- **Mastermind-style Gameplay:** Players guess a hidden code of 4-6 Christmas-themed elements in the correct order, receiving feedback on correct elements and positions.
- **Mobile-Optimized:** Dynamic canvas sizing providing 95% screen utilization on mobile devices (iPhone SE to Pro Max).
- **Adjustable Difficulty:** Choose code length (4-6 elements) and number of guesses (8-15).
- **Christmas-Themed Elements:** Includes Santa, Present, Mistletoe, Star, Christmas Tree, and Snowflake.
- **Scoring System:** Points are calculated based on unused guesses and difficulty level.
- **Santa's Hint:** Unlock a one-time hint after reaching 500 points.
- **Responsive Design:** Mobile-first approach with unified responsive calculations.
- **Touch-Optimized:** Enhanced modal interactions and button positioning for mobile devices.
- **Zero Hosting Costs:** Hosted on GitHub Pages.
- **Comprehensive Testing:** Full test suite for validation and quality assurance.

## How to Play
1. Access the game via the provided GitHub Pages URL.
2. Select difficulty settings (code length and number of guesses).
3. Guess the code by selecting elements and submitting guesses.
4. Receive feedback (black pegs for correct element and position, white pegs for correct element but wrong position).
5. Share your score verbally with other players.
6. Play again to compete for the highest score!

## Technical Details
- **Frontend:** Built with Phaser.js, HTML5, CSS3, and JavaScript.
- **Mobile Optimization:** Dynamic canvas sizing, responsive layout calculations, touch-optimized interactions.
- **Architecture:** Modular code structure with managers for scoring, history, and utilities.
- **Testing:** Comprehensive test suite with 6 specialized modules for validation.
- **Hosting:** Deployed on GitHub Pages.
- **Assets:** Retina-ready sprite sheets (1x/2x/3x) and audio files for Christmas-themed visuals and sounds.
- **Performance:** Mobile-first approach with 60 FPS animations and <5 seconds load time.
- **Compatibility:** iPhone SE (375px) to Pro Max (428px) and beyond.

## Success Criteria
- ✅ Runs smoothly on iPhones via GitHub Pages across all device sizes.
- ✅ Mobile-optimized with 95% screen utilization (improved from 43%).
- ✅ Players can adjust difficulty and scores calculate correctly.
- ✅ Touch interactions work seamlessly with proper modal sizing.
- ✅ Comprehensive testing infrastructure for quality assurance.
- 🔄 Festive visuals and sound effects enhance the experience (in progress).
- 🎯 Family enjoys the game and shares scores verbally.

## Testing & Quality Assurance
The project includes a comprehensive test suite accessible at `/tests/`:
- **Canvas Optimization Test:** Validates mobile screen utilization improvements
- **Responsive Layout Test:** Tests adaptation across different device sizes
- **Touch Interaction Test:** Monitors touch events and modal behavior
- **Debug & Performance Test:** Real-time metrics and console monitoring
- **Device Comparison Test:** Cross-device optimization analysis
- **Asset Loading Test:** Image loading validation with retina display support

## Repository
Visit the repository at [https://github.com/Murteas/XmasMM](https://github.com/Murteas/XmasMM) for source code and deployment details.
