# 🎄 Christmas MasterMind

**A mobile-optimized, themeable puzzle game for family fun!**

Play the classic code-breaking game with festive Christmas elements, or switch to other seasonal themes!

---

## ✨ Features

- **🎮 Classic Mastermind Gameplay** - Guess the hidden code using logic and deduction
- **👻 Ghost Hints** - See possible elements per position based on previous guesses
- **🎨 Multiple Themes** - Christmas (active), Halloween (template ready)
- **📱 Mobile-First Design** - Optimized for iPhone SE to Pro Max (375px - 428px)
- **🎯 Two Difficulty Modes** - Easy (4 elements) or Standard (5 elements), 10 guesses
- **👨‍👩‍👧‍👦 Family-Friendly** - Intuitive touch controls, one-click game start
- **🌐 Zero Cost Hosting** - GitHub Pages compatible
- **🎪 Smooth Performance** - 60 FPS target, optimized asset loading

---

## 🎮 Quick Start

### Play the Game
```bash
# Start HTTP server (required for Phaser.js)
python -m http.server 8000

# Open in browser
http://localhost:8000
```

⚠️ **Important**: Phaser.js requires an HTTP server. Opening `index.html` directly (file://) will show a white screen.

### Controls
1. **Select Difficulty** - Choose Easy (4 elements) or Standard (5 elements) from main menu
2. **Make Guesses** - Tap empty slots, select elements from the bar at bottom
3. **Ghost Hints** - See faded icons in empty slots showing possible elements
4. **Get Feedback**:
   - ⭐ **Perfect** - Right element in correct position
   - 🔔 **Close** - Right element in wrong position
   - _(blank)_ - Element not in code
5. **Use Santa's Hint** - Tap hint button for a clue (-220 points)
6. **Share Score** - Share your results via native share API

---

## 🎨 Theme System

The game features an **extensible theme system** that makes it easy to add new seasonal themes.

### Current Themes
- ✅ **Christmas** (Active) - Santa, Present, Candy Cane, Star, Tree, Snowflake
- 🎃 **Halloween** (Template) - Pumpkin, Ghost, Bat, Witch Hat, Spider, Skull

### How to Add New Themes
See [`CLAUDE.md`](CLAUDE.md) for complete documentation on:
- Theme configuration structure
- Asset requirements
- Step-by-step theme creation guide
- Architecture details

**Quick Summary**: Add ~60 lines to `ThemeConfig.js` + create assets → new theme ready!

---

## 🔧 Debug Mode (Development)

Press **`D`** in the game screen to enable debug mode:

| Key | Action |
|-----|--------|
| `R` | Fill row with random guess |
| `W` | Auto-win (use secret code) |
| `F` | Fast-forward 5 random guesses |
| `L` | Jump to last round (2 guesses left) |
| `D` | Toggle debug mode on/off |

**Benefits**: No more manual testing of 10+ rounds! Test end-game scenarios instantly.

---

## 📁 Project Structure

```
C:\djs.projects\XmasMM/
├── index.html              # Game entry point
├── styles.css              # Mobile-optimized styling
├── js/
│   ├── main.js             # Phaser game initialization
│   ├── config/
│   │   ├── LayoutConfig.js      # Layout constants (single source of truth)
│   │   └── ThemeConfig.js       # Theme definitions (NEW!)
│   ├── managers/           # Game logic managers (9 classes)
│   │   ├── GameStateManager.js  # Core game state
│   │   ├── ScoreManager.js      # Scoring system
│   │   ├── HistoryManager.js    # Guess history
│   │   └── ...
│   ├── scenes/             # Phaser scenes
│   │   ├── MainMenu.js
│   │   ├── DifficultySelection.js
│   │   ├── GameScene.js
│   │   └── RoundOver.js
│   ├── utils/
│   │   ├── ThemeManager.js      # Theme switching (NEW!)
│   │   ├── BackgroundManager.js
│   │   ├── ButtonFactory.js
│   │   └── ...
│   └── services/
│       └── AudioManager.js
├── assets/                 # Christmas theme assets (root level)
│   ├── santa_*.png
│   ├── present_*.png
│   ├── ...
│   ├── audio/
│   └── themes/            # Future theme assets
│       └── halloween/     # (assets not created yet)
└── tests/                 # Test suite

Key Files:
- README.md         - This file
- CLAUDE.md         - Theme system refactoring documentation
```

---

## 🧮 Scoring System

**Formula**: Element Points + Solved Bonus + Speed Bonus/Penalty + Hint Penalty

### Components

| Component | Points | Description |
|-----------|--------|-------------|
| **Perfect Match** | +180 each | Correct element in correct position (final guess) |
| **Close Match** | +80 each | Correct element in wrong position (final guess) |
| **Solved Bonus** | +250 | Awarded if code is solved |
| **Speed Bonus** | Tiered | Unused guesses below 10: <br>• 1st-3rd: +80 each<br>• 4th-6th: +50 each<br>• 7th+: +30 each |
| **Extra Guess Penalty** | -25 each | Guesses beyond 10 |
| **Hint Penalty** | -220 | If Santa's hint used |

### Example
5-element code solved in 7 guesses:
- Element points: 5 × 180 = **900**
- Solved bonus: **+250**
- Speed bonus: 3 unused × 80 = **+240**
- **Total: 1,390 points**

---

## 🔧 Technology Stack

- **Game Engine**: Phaser.js 3.80.1
- **Language**: ES6 JavaScript (modular classes)
- **Styling**: CSS3 with safe area insets
- **Asset Management**: Multi-resolution (1x, 2x, 3x) for device scaling
- **Audio**: MP3 sound effects
- **Architecture**: Manager pattern with clear separation of concerns
- **Module Loading**: Custom dependency-aware loader
- **Hosting**: GitHub Pages compatible (static files only)

---

## 🎯 Game Elements (Christmas Theme)

| Element | Symbol | Asset |
|---------|--------|-------|
| Santa | 🎅 | `santa_*.png` |
| Present | 🎁 | `present_*.png` |
| Candy Cane | 🍬 | `candycane_*.png` |
| Star | ⭐ | `star_*.png` |
| Tree | 🎄 | `tree_*.png` |
| Snowflake | ❄️ | `snowflake_*.png` |

**Feedback Symbols**:
- ⭐ Perfect (gold star) - `feedback_perfect_star_*.png`
- 🔔 Close (silver bell) - `feedback_close_bell_*.png`

---

## 📱 Mobile Optimization

### Supported Devices
- iPhone SE (375×667) ✅
- iPhone XR/11 (414×896) ✅
- iPhone 12/13 Pro (390×844) ✅
- iPhone Pro Max (428×926) ✅
- Desktop browsers ✅

### Features
- **Full Viewport**: Complete screen utilization (100vw × 100vh)
- **Safe Area Support**: Notch and home indicator awareness
- **Touch Optimized**: 44px minimum touch targets
- **Dynamic Viewport**: Handles iOS Safari's dynamic viewport height
- **Portrait Lock**: Small screens locked to portrait for optimal UX
- **Responsive Scaling**: Phaser.Scale.RESIZE for adaptive layouts

---

## 🎨 Color Palette (Christmas Theme)

| Usage | Color | Hex |
|-------|-------|-----|
| Primary Button | Emerald Green | `#0F4C36` |
| Accent Button | Sophisticated Gold | `#DAA520` |
| Danger Button | Christmas Red | `#A0342B` |
| Background Gradient | Deep Forest Green | `#0d3820` → `#051610` |

*All colors dynamically loaded from theme configuration*

---

## 👥 Development

### Recent Changes
See [`CLAUDE.md`](CLAUDE.md) for complete theme system refactoring documentation (Jan 13, 2026).

### Key Architectural Decisions
- **Centralized Theme Config**: All theme data in `ThemeConfig.js`
- **Dynamic Asset Loading**: Themes load assets at runtime
- **Color Getters**: Button colors pulled dynamically from active theme
- **Backward Compatible**: Original Christmas theme preserved exactly
- **Validation & Fallback**: Invalid themes auto-clear with safe defaults

### Contributing Guidelines
1. **No Magic Numbers** - Use `LayoutConfig.js` for all dimensions/spacing
2. **Theme-Agnostic Logic** - Keep game mechanics separate from themes
3. **Mobile-First** - Test on 375×667 viewport minimum
4. **Asset Conventions** - Provide 1x, 2x, 3x resolutions for all images
5. **Commit Messages** - Use conventional commits format

---

## 🐛 Known Issues

None at this time. Game is stable and ready for play!

To report issues:
- GitHub: [Create an issue](https://github.com/Murteas/XmasMM/issues)

---

## 📄 License

MIT License - Feel free to use, modify, and distribute!

---

## 🎄 Happy Holidays!

Enjoy playing Christmas MasterMind with family and friends! 🎅🎁⭐
