# 🎄 XmasMM - Christmas Mastermind

**A mobile-optimized Christmas puzzle game for family fun!**

## ✨ Current Status
🎉 **Mobile foundation complete!** Ready for Christmas feature implementation.
- ✅ **Complete viewport utilization** (100vw x 100vh) for maximum screen usage
- ✅ All Christmas graphics assets ready (6 game elements + 3 feedback symbols)
- ✅ Family-friendly UX with Santa's hints
- ✅ **Complete**: All mobile polish tasks (5A-5D) finished!
- 🔄 **Current**: Task 5E Code Refactoring (prepare codebase for new features)
- 🚀 **Next**: Task 6 Christmas feedback symbols (assets ready!)

**Overall Progress**: 36% complete (4/11 tasks) | **Current Phase**: Code Preparation

## 📋 Quick Navigation
- **✅ Complete**: All mobile foundation tasks (5A-5D) ✅
- **🔄 Current**: [Task_5E_CodeRefactoring.md](tasks/Task_5E_CodeRefactoring.md) (refactor before features)
- **🚀 Next**: [Task_6_ChristmasTheme.md](tasks/Task_6_ChristmasTheme.md) (depends on 5E completion)
- **📊 Task Status**: [tasks.json](tasks.json) (machine-readable registry)
- **🤖 Task Management**: [TASK_MANAGEMENT.md](TASK_MANAGEMENT.md) (AI agent guide)
- **📁 All Tasks**: [tasks/](tasks/) folder
- **🎨 Graphics Assets**: [Graphics_Asset_Requirements.md](Graphics_Asset_Requirements.md) (detailed status)
- **🧪 Testing**: [TESTING.md](TESTING.md) (mobile validation)
- **📋 Original PRD**: [XmasMM_PRD.md](XmasMM_PRD.md) (historical reference)

## 🎮 Game Features
- **Christmas Mastermind:** Guess hidden codes using 6 festive elements (Santa, Present, Star, etc.)
- **Mobile Excellence:** Optimized for iPhone SE to Pro Max (375px - 428px)
- **Adjustable Difficulty:** 4-6 elements, 8-15 guesses
- **Family-Friendly:** Intuitive touch controls, Santa's hint system
- **Zero Cost:** Hosted on GitHub Pages

## 📱 Technical Highlights  
- **Full Viewport Canvas:** Complete screen utilization (100vw x 100vh) with Phaser Scale.RESIZE
- **Touch-Optimized:** Modal interactions, proper button sizing
- **Performance:** 60 FPS target, optimized asset loading
- **Testing Suite:** Comprehensive validation across iPhone models

## 🎨 Graphics Asset Status
**Status**: ✅ **All critical assets complete!** Ready for Task 6.

### Completed Assets:
- **Game Elements (6/6)**: Santa, Present, Mistletoe, Star, Tree, Snowflake ✅
- **Feedback Symbols (3/3)**: Perfect Star, Close Bell, Wrong X ✅
- **Mobile Background**: Optimized 430x932px background ✅

**Next**: Complete code refactoring (Task 5E), then implement Christmas feedback symbols (Task 6)!

## 🎮 How to Play
1. Access the game via the provided GitHub Pages URL.
2. Select difficulty settings (code length and number of guesses).
3. Guess the code by selecting elements and submitting guesses.
4. Receive feedback (black pegs for correct element and position, white pegs for correct element but wrong position).
5. Share your score verbally with other players.
6. Play again to compete for the highest score!

## Technical Details
- **Frontend:** Built with Phaser.js, HTML5, CSS3, and JavaScript.
- **Mobile Optimization:** Full viewport canvas, responsive layout calculations, touch-optimized interactions.
- **Architecture:** Modular code structure with managers for scoring, history, and utilities.
- **Task Management:** Machine-readable task registry ([tasks.json](tasks.json)) for agentic AI systems.
- **Testing:** Comprehensive test suite with 6 specialized modules for validation.
- **Hosting:** Deployed on GitHub Pages.
- **Assets:** Retina-ready sprite sheets (1x/2x/3x) and audio files for Christmas-themed visuals and sounds.
- **Performance:** Mobile-first approach with 60 FPS animations and <5 seconds load time.
- **Compatibility:** iPhone SE (375px) to Pro Max (428px) and beyond.

## Success Criteria
- ✅ Runs smoothly on iPhones via GitHub Pages across all device sizes.
- ✅ Mobile-optimized with complete viewport utilization (100vw x 100vh).
- ✅ Players can adjust difficulty and scores calculate correctly.
- ✅ Touch interactions work seamlessly with proper modal sizing.
- ✅ Comprehensive testing infrastructure for quality assurance.
- 🔄 **Current**: Clean code structure for maintainable feature development (Task 5E).
- 🚀 **Next**: Festive Christmas feedback symbols to replace traditional pegs (Task 6).
- 🎯 Family enjoys the game and shares scores verbally.

## Testing & Quality Assurance
The project includes a comprehensive test suite accessible at `/tests/`:
- **Canvas Optimization Test:** Validates mobile viewport improvements
- **Responsive Layout Test:** Tests adaptation across different device sizes
- **Touch Interaction Test:** Monitors touch events and modal behavior
- **Debug & Performance Test:** Real-time metrics and console monitoring
- **Device Comparison Test:** Cross-device optimization analysis
- **Asset Loading Test:** Image loading validation with retina display support

## Task Management for AI Agents
This project uses a machine-readable task management system optimized for agentic AI:
- **Status Check**: `python scripts/automation.py status`
- **Current Task Details**: `python scripts/automation.py help`
- **Complete Task**: `python scripts/automation.py complete <task_id>`
- **Start Next Task**: `python scripts/automation.py next`

See [TASK_MANAGEMENT.md](TASK_MANAGEMENT.md) for complete documentation.

## Repository
Visit the repository at [https://github.com/Murteas/XmasMM](https://github.com/Murteas/XmasMM) for source code and deployment details.
