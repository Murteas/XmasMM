// ModuleLoader.js - Centralized script loading for XmasMM
// Ensures consistent module loading across all HTML files

class ModuleLoader {
  static async loadGameModules(basePath = '') {
    // Define module loading order (dependencies first)
    const modules = [
      // Core utilities (no dependencies)
      'js/utils/TestConfig.js',
      'js/utils/GameUtils.js',
      
      // Managers (depend on utilities)
      'js/managers/ScoreManager.js',
      'js/managers/HistoryRenderer.js',
      'js/managers/HistoryScroller.js',
      'js/managers/ElementBar.js',
      'js/managers/ActiveRowManager.js',
      'js/managers/HistoryManager.js',
      'js/managers/GameStateManager.js',
      'js/managers/UILayoutManager.js',
      'js/managers/GameInputHandler.js',
      
      // Scenes (depend on managers)
      'js/scenes/MainMenu.js',
      'js/scenes/DifficultySelection.js',
      'js/scenes/GameScene.js',
      'js/scenes/RoundOver.js',
      
      // Main game initialization (depends on everything)
      'js/main.js'
    ];
    
    console.log('🔄 Loading XmasMM modules in optimized groups...');
    
    // Group 1: Core utilities (load in parallel - no dependencies)
    const coreModules = [
      'js/utils/TestConfig.js',
      'js/utils/GameUtils.js',
      'js/utils/SafeAreaManager.js',
      'js/utils/BackgroundManager.js',
      'js/config/LayoutConfig.js',
      'js/utils/ButtonFactory.js',
      'js/services/AudioManager.js'
    ];
    
    // Group 2: Managers (load in parallel)
    const managerModules = [
      'js/managers/ScoreManager.js',
      'js/managers/HistoryRenderer.js',
      'js/managers/HistoryScroller.js',
      'js/managers/ElementBar.js'
    ];
    
    // Group 3: Dependent managers (sequential)
    const dependentManagerModules = [
      'js/managers/ActiveRowManager.js',
      'js/managers/HistoryManager.js',
      'js/managers/GameStateManager.js',
      'js/managers/UILayoutManager.js',
      'js/managers/GameInputHandler.js'
    ];
    
    // Group 4: Scenes (load in parallel)
    const sceneModules = [
      'js/scenes/MainMenu.js',
      'js/scenes/DifficultySelection.js',
      'js/scenes/GameScene.js',
      'js/scenes/RoundOver.js'
    ];
    
    // Group 5: Main initialization (must be last)
    const mainModule = ['js/main.js'];
    
    try {
      // Load core utilities first
      console.log('📦 Loading core utilities...');
      await ModuleLoader.loadScriptGroup(coreModules, basePath);
      console.log('✅ Core utilities loaded');
      
      // Load managers in two groups
      console.log('📦 Loading basic managers...');
      await ModuleLoader.loadScriptGroup(managerModules, basePath);
      console.log('✅ Basic managers loaded');
      
      console.log('📦 Loading dependent managers...');
      await ModuleLoader.loadScriptSequence(dependentManagerModules, basePath);
      console.log('✅ Dependent managers loaded');
      
      // Load scenes
      console.log('📦 Loading scenes...');
      await ModuleLoader.loadScriptGroup(sceneModules, basePath);
      console.log('✅ Scenes loaded');
      
      // Finally load main.js
      console.log('📦 Loading main game...');
      await ModuleLoader.loadScriptGroup(mainModule, basePath);
      console.log('✅ Main game loaded');
      
      console.log('🎉 All XmasMM modules loaded successfully!');
      return true;
      
    } catch (error) {
      console.error('🚨 Failed to load XmasMM modules:', error);
      return false;
    }
  }
  
  static async loadScriptGroup(scriptPaths, basePath = '') {
    const promises = scriptPaths.map(path => 
      ModuleLoader.loadScript(basePath + path)
    );
    await Promise.all(promises);
  }
  
  static async loadScriptSequence(scriptPaths, basePath = '') {
    for (const path of scriptPaths) {
      await ModuleLoader.loadScript(basePath + path);
    }
  }
  
  static loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`✅ Loaded: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.warn(`⚠️ Could not load optional module: ${src}`);
        // Don't reject - some modules might be optional
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  
  // Initialize game after all modules are loaded
  static async initializeGame() {
    console.log('🚀 ModuleLoader.initializeGame() starting...');
    
    try {
      const success = await ModuleLoader.loadGameModules();
      
      if (!success) {
        console.error('🚨 Module loading failed');
        return false;
      }
      
      // Wait a moment for all modules to fully initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if initializeGame function exists (from main.js)
      if (typeof window.initializeGame === 'function') {
        console.log('🎮 Calling window.initializeGame()...');
        const gameInitialized = window.initializeGame();
        
        if (gameInitialized === false) {
          console.error('🚨 Game initialization returned false');
          return false;
        }
        
        console.log('✅ Game initialization completed');
        return true;
      } else {
        console.error('🚨 window.initializeGame function not found - main.js may not have loaded properly');
        return false;
      }
      
    } catch (error) {
      console.error('🚨 ModuleLoader.initializeGame() failed:', error);
      return false;
    }
  }
}

// Make ModuleLoader globally available
window.ModuleLoader = ModuleLoader;
