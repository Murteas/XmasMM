# XmasMM Quick Reference

## 🎯 Current Status
- **Active Task**: Task 5A - Dynamic Canvas Sizing
- **Next Priority**: Task 5B - Family UX Improvements  
- **Phase**: Mobile Foundation (Tasks 5A-5C)

## 📱 Target Specifications
- **Devices**: iPhone SE (375px) to Pro Max (428px)
- **Performance**: <5s load, 60fps animations
- **Framework**: Phaser.js with modular architecture
- **Audience**: Family Christmas party (all ages)

## 🏗️ Code Architecture
```
js/
├── main.js              ← Game config & initialization
├── scenes/
│   ├── MainMenu.js      ← Entry point with sound toggles
│   ├── DifficultySelection.js ← Game setup
│   └── GameScene.js     ← Main game logic
├── managers/
│   ├── HistoryManager.js ← Guess display & scrolling
│   └── ScoreManager.js   ← Scoring & hints
└── utils/
    └── GameUtils.js     ← Shared constants & helpers
```

## ✅ Completed Features
- Phaser.js setup with GitHub Pages deployment
- Main menu with Christmas background & sound toggles
- Difficulty selection (4-6 elements, 8-15 guesses)
- Complete Mastermind game logic with feedback
- Modal element picker with Christmas images (Santa, Present, etc.)
- Touch-based scrolling guess history
- Santa's Hint feature (unlocked at 500 points)
- Modular code structure for maintainability

## 🎯 Current Issues to Address
- **Canvas Sizing**: Fixed 800x600 doesn't adapt to different iPhone models
- **Mobile Layout**: Button positioning conflicts, scroll issues
- **Family UX**: Need loading states, input validation, help system

## 🎄 Design Principles
- **Mobile-First**: iPhone compatibility across all models
- **Family-Friendly**: Intuitive for ages 8-80
- **Christmas Theme**: Festive but not overwhelming
- **Zero Cost**: Free hosting, free assets, minimal maintenance

---
**Maintainer Note**: Java developer managing JavaScript - see individual task files for implementation guidance.
