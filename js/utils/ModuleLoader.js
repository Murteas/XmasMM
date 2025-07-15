// ModuleLoader.js - Centralized script loading for XmasMM
// Ensures consistent module loading across all HTML files

class ModuleLoader {
  static async loadGameModules(basePath = '') {
    // Define module loading order (dependencies first)
    const modules = [
      // Core utilities (no dependencies)
      'js/utils/TestConfig.js',
      'js/utils/GameUtils.js',
      'js/utils/SafeAreaManager.js',
      
      // Services (depend on utilities)
      'js/services/MobileScrollService.js',
      
      // Managers (depend on utilities and services)
      'js/managers/ScoreManager.js',
      'js/managers/HistoryRenderer.js',
      'js/managers/HistoryScroller.js',
      'js/managers/ElementPicker.js',
      'js/managers/ActiveRowManager.js',
      'js/managers/ScrollableHistoryManager.js',
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
      'js/utils/SafeAreaManager.js'
    ];
    
    // Group 2: Services and independent managers (load in parallel)
    const serviceModules = [
      'js/services/MobileScrollService.js',
      'js/managers/ScoreManager.js',
      'js/managers/HistoryRenderer.js',
      'js/managers/HistoryScroller.js',
      'js/managers/ElementPicker.js'
    ];
    
    // Group 3: Dependent managers (sequential)
    const managerModules = [
      'js/managers/ActiveRowManager.js',
      'js/managers/ScrollableHistoryManager.js',
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
    
    console.log('🎬 Loading scene modules...');
    
    // Group 5: Main initialization
    const mainModules = ['js/main.js'];
    
    // Load groups sequentially, but modules within groups in parallel
    const loadGroup = async (modules, groupName) => {
      console.log(`🚀 Loading ${groupName} (${modules.length} modules in parallel)...`);
      const promises = modules.map(module => 
        this.loadScript(`${basePath}${module}`).then(() => 
          console.log(`✅ ${module}`)
        )
      );
      await Promise.all(promises);
      console.log(`✅ ${groupName} complete`);
    };
    
    try {
      await loadGroup(coreModules, 'Core Utilities');
      await loadGroup(serviceModules, 'Services & Independent Managers');
      await loadGroup(managerModules, 'Dependent Managers');
      await loadGroup(sceneModules, 'Scenes');
      await loadGroup(mainModules, 'Main Game');
    } catch (error) {
      console.error('❌ Module loading failed:', error);
      throw error;
    }
    
    console.log('🎮 All XmasMM modules loaded successfully!');
  }
  
  static loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        console.log(`⚠️ Module already loaded: ${src}`);
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
  
  // Load Phaser.js from CDN
  static async loadPhaser() {
    const phaserScript = 'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js';
    
    if (typeof Phaser !== 'undefined') {
      console.log('✅ Phaser already loaded');
      return;
    }
    
    console.log('🔄 Loading Phaser.js...');
    await this.loadScript(phaserScript);
    console.log('✅ Phaser.js loaded');
  }
  
  // Initialize complete game loading
  static async initializeGame(basePath = '') {
    try {
      // Load Phaser first
      await this.loadPhaser();
      
      // Then load all game modules
      await this.loadGameModules(basePath);
      
      // Finally, initialize the game after all modules are loaded
      if (typeof window.initializeGame === 'function') {
        console.log('🎮 Starting game initialization...');
        const success = window.initializeGame();
        if (success) {
          console.log('🎯 Game initialization complete!');
          return true;
        } else {
          console.error('🚨 Game initialization failed - scene classes not available');
          return false;
        }
      } else {
        console.error('🚨 initializeGame function not found - main.js may not be loaded');
        return false;
      }
    } catch (error) {
      console.error('🚨 Game initialization failed:', error);
      return false;
    }
  }
}

// Make available globally
window.ModuleLoader = ModuleLoader;
