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

## 🧪 Quick Start

### **🎮 Play the Game**
```bash
# Start any HTTP server on port 8000
python -m http.server 8000

# Then visit: http://localhost:8000
```

### **🤖 For Developers & AI Agents**
See [AI_AGENT_BRIEFING.md](AI_AGENT_BRIEFING.md) for complete development setup, testing procedures, and technical guidelines.

**Key Points:**
- ⚠️ **Phaser.js games require HTTP server** (file:// URLs show white screen)
- 🧪 **Testing suite**: See AI briefing for detailed testing procedures
- 📋 **Task management**: Machine-readable system for AI agents

### **🔧 Debug Mode (Development)**
For rapid testing and development, the game includes a debug mode:

**Activation:** Press `D` key in the game screen to toggle debug mode

**Debug Commands:**
- **`R`** - Fill current row with random guess
- **`W`** - Auto-win (fill with secret solution)
- **`F`** - Fast-forward (auto-play 5 random guesses)
- **`L`** - Jump to last round (leaves 2 guesses remaining)
- **`D`** - Toggle debug mode on/off

**Benefits:**
- ✅ No more manual 10-round testing
- ✅ Test end-game scenarios in seconds  
- ✅ Rapid performance and bug testing
- ✅ Zero impact on normal gameplay

## 🎮 How to Play
1. Access the game via the provided GitHub Pages URL.
2. Select difficulty settings (code length and number of guesses).
3. Guess the code by selecting elements and submitting guesses.
4. Receive feedback (black pegs for correct element and position, white pegs for correct element but wrong position).
5. Share your score verbally with other players.
6. Play again to compete for the highest score!

## 📁 Project Structure
- **🎮 Game Code**: `js/` - Phaser.js game implementation
- **🎨 Assets**: `assets/` - Christmas-themed graphics and audio
- **🧪 Testing**: `tests/` - Comprehensive test suite
- **📋 Tasks**: `tasks/` - Individual task documentation
- **🤖 AI System**: [AI_AGENT_BRIEFING.md](AI_AGENT_BRIEFING.md) - Developer onboarding

## 🔧 Technology Stack
- **Frontend**: Phaser.js 3, HTML5 Canvas, ES6 JavaScript
- **Mobile**: Responsive design, touch-optimized interactions
- **Architecture**: Modular manager classes for maintainability
- **Testing**: HTML + Node.js validation suite
- **Hosting**: GitHub Pages compatible
- **AI-Friendly**: Machine-readable task management system
