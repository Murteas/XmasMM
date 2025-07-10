# 🎄 XmasMM - Christmas Mastermind

**A mobile-optimized Christmas puzzle game for family fun!**

## ✨ Current Status
🎉 **Mobile foundation complete!** Christmas feature development in progress.

**📊 Live Status**: See [PROJECT_STATUS.md](PROJECT_STATUS.md) for real-time project state and current tasks.

### **Key Achievements**
- ✅ **Mobile Excellence**: Complete viewport utilization (100vw x 100vh) 
- ✅ **Graphics Ready**: All Christmas assets prepared (6 elements + 3 feedback symbols)
- ✅ **Code Architecture**: Modular structure with 9 manager classes
- ✅ **Testing Suite**: Comprehensive validation including integration tests
- ✅ **Family UX**: Intuitive touch controls with Santa's hint system

## 📋 Quick Navigation

### **Project Management**
- **📊 Current Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md) - Real-time project state (auto-updated)
- **🤖 Task Management**: [TASK_MANAGEMENT.md](TASK_MANAGEMENT.md) - AI agent workflow guide
- **� Task Registry**: [tasks.json](tasks.json) - Machine-readable task definitions
- **� Task Details**: [tasks/](tasks/) folder - Individual task documentation

### **Development Resources**  
- **� Testing Suite**: [TESTING.md](TESTING.md) - Test validation and integration
- **🎨 Graphics Assets**: [Graphics_Asset_Requirements.md](Graphics_Asset_Requirements.md) - Asset specifications
- **📋 Original Requirements**: [XmasMM_PRD.md](XmasMM_PRD.md) - Historical project definition

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
**Status**: ✅ **All assets ready for implementation**

See [Graphics_Asset_Requirements.md](Graphics_Asset_Requirements.md) for detailed asset specifications and status.

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
- **Architecture:** Modular code structure with 9 specialized manager classes (refactored for maintainability).
- **Task Management:** Machine-readable task registry ([tasks.json](tasks.json)) for agentic AI systems.
- **Testing:** Comprehensive test suite with 8 specialized modules including integration testing.
- **Hosting:** Deployed on GitHub Pages.
- **Assets:** Retina-ready sprite sheets (1x/2x/3x) and audio files for Christmas-themed visuals and sounds.
- **Performance:** Mobile-first approach with 60 FPS animations and <5 seconds load time.
- **Compatibility:** iPhone SE (375px) to Pro Max (428px) and beyond.

## Success Criteria
- ✅ Runs smoothly on iPhones via GitHub Pages across all device sizes
- ✅ Mobile-optimized with complete viewport utilization (100vw x 100vh)
- ✅ Players can adjust difficulty and scores calculate correctly
- ✅ Touch interactions work seamlessly with proper modal sizing
- ✅ Comprehensive testing infrastructure for quality assurance
- ✅ Clean modular code structure for maintainable development
- 🎯 Festive Christmas feedback symbols enhance user experience  
- 🎯 Family enjoys the game and shares scores verbally

**Current Progress**: See [PROJECT_STATUS.md](PROJECT_STATUS.md) for real-time completion status.

## Testing & Quality Assurance
The project includes a comprehensive test suite accessible at `/tests/`:
- **Comprehensive Integration Test:** Validates refactored modular architecture and manager classes
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
- **Complete Task**: `python scripts/automation.py complete <task_id>` (auto-updates documentation)
- **Start Next Task**: `python scripts/automation.py next`
- **Update Documentation**: `python scripts/automation.py update-docs` (manual refresh)

See [TASK_MANAGEMENT.md](TASK_MANAGEMENT.md) for complete documentation.

## Repository
Visit the repository at [https://github.com/Murteas/XmasMM](https://github.com/Murteas/XmasMM) for source code and deployment details.
