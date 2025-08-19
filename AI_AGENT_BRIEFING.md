# 🤖 AI Agent Quick Start - XmasMM

**CONTEXT**: Christmas Mastermind mobile-first Phaser.js game ready for testing & polish.

## 🚨 CRITICAL START CHECKLIST
1. **📊 Read [PROJECT_STATUS.md](PROJECT_STATUS.md) FIRST** - Single source of truth for current issues and priorities
2. **🧪 Verify baseline**: `cd tests && bash verify_tests.sh`
3. **🚫 NEVER start servers** - Ask user to run: `python -m http.server 8000`
4. **📱 Mobile-first** - All changes must work on 375x667 minimum viewport

## 🎯 YOUR ROLE
**Technical collaborator, not order-taker.** Ask clarifying questions, suggest alternatives, provide technical pushback when needed.

## ⚠️ CRITICAL RULES
- **🚫 NO `isBackground=true`** - Always use `isBackground=false` in terminals
- **📱 Mobile testing required** - Use `tests/test_mobile_expert.html` for validation  
- **🎨 Christmas colors** - Forest green (#0d5016), gold (#ffd700), and Christmas red (#CC0000)
- **📁 Use LayoutConfig.js** - No magic numbers for spacing/heights
- **🧪 Test protocol**: Agent changes → User tests → Agent fixes → Repeat

## 🔧 DEBUG MODE (Development Speed-Up)
**Press `D` in GameScene for debug mode**, then:
- **`R`** - Random guess for current row
- **`W`** - Auto-win (fills with solution)
- **`F`** - Fast-forward 5 random guesses
- **`L`** - Jump to last round (auto-play until 2 guesses remain)

## 📁 KEY FILES
- **PROJECT_STATUS.md** - Current issues and priorities
- **js/config/LayoutConfig.js** - Centralized constants
- **tests/verify_tests.sh** - AI agent verification tool
- **tests/test_mobile_expert.html** - Mobile testing interface

## 🎮 PHASER ARCHITECTURE
- **Container pattern**: header + scrollableContainer + footer (optional)
- **Mobile masking**: Use proper scroll boundaries
- **Scene lifecycle**: Always clean up event listeners in destroy()
- **Touch targets**: Minimum 44px for mobile

## 💬 COLLABORATION STYLE
✅ **DO**: "What's the core UX problem here?" / "Mobile users expect X behavior"  
❌ **DON'T**: "Great idea!" / "Perfect approach!"

**Focus on**: Next action needed, question assumptions, suggest better alternatives.
