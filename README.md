# 🎄 XmasMM - Christmas Mastermind

**A mobile-optimized Christmas puzzle game for family fun!**

> **🤖 AI Agents**: Read [AI_AGENT_BRIEFING.md](AI_AGENT_BRIEFING.md) before starting work - this project uses specialized agentic task management.

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

## 🧪 Testing & Development

### **🚨 CRITICAL: Server Requirements**
This Phaser.js game **REQUIRES** a proper HTTP server to function. File:// URLs will only show a white screen.

**Start Development Server:**
```bash
# Navigate to project directory
cd /c/djs.projects/XmasMM

# Start server (choose one):
python -m http.server 8000        # Simple Python server
python scripts/dev_server.py      # Enhanced dev server (if available)
```

**Access Game:**
- 🌐 **Game**: http://localhost:8000
- 🧪 **Tests**: http://localhost:8000/tests/
- 📱 **Mobile Test**: http://localhost:8000/tests/test_mobile_expert.html

### **For AI Agents**
❌ **Agents CANNOT start servers reliably** - always ask the user to start the server  
❌ **Never use file:// URLs** - they don't work with Phaser.js games  
✅ **Always coordinate testing with user** - provide clear instructions and wait for feedback

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

## 🔧 Testing & Debugging

### **Enhanced Testing Tools** (Node.js v22.17.0)
Professional debugging system with JSON reporting:

```bash
npm run verify-assets        # Asset verification and size analysis
npm run debug-interactions   # Interaction debugging with detailed reports
npm test                     # Combined verification suite
npm run start-dev            # Starts Python HTTP server via npm
```

### **Traditional Testing** (HTML-based)
```bash
cd tests && bash verify_tests.sh    # Quick HTML test verification
cd tests && bash run_tests.sh       # Full HTML test suite
```

### **Test Reports**
- **📊 JSON Reports**: `test-results/` directory (detailed analysis)
- **📋 HTML Results**: `tests/` directory (visual testing)
- **🔍 Debug Guides**: `DEBUG_INTERACTION_GUIDE.md` (troubleshooting)

## Task Management System
This project uses a machine-readable task management system optimized for agentic AI development:
- **Live Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md) - Real-time project state
- **Task Registry**: [tasks.json](tasks.json) - Machine-readable task definitions  
- **AI Agent Guide**: [AI_AGENT_BRIEFING.md](AI_AGENT_BRIEFING.md) - New agent onboarding
- **Complete Documentation**: [TASK_MANAGEMENT.md](TASK_MANAGEMENT.md) - Full system guide

## 🖥️ Development Server Setup

**HTTP Server Required** (Use any HTTP server):
```bash
# Python 3 (Recommended)
python -m http.server 8000

# Node.js alternative
npx serve . --port 8000

# PHP alternative  
php -S localhost:8000
```

**Access Points**:
- Game: http://localhost:8000/
- Tests: http://localhost:8000/tests/
```bash
# Traditional approach
python -m http.server 8000

# Stop with Ctrl+C, or if needed:
taskkill //IM python.exe //F
```

**Access**: Navigate to `http://localhost:8000` for the game or `http://localhost:8000/tests/` for testing.

## Repository
Visit the repository at [https://github.com/Murteas/XmasMM](https://github.com/Murteas/XmasMM) for source code and deployment details.
