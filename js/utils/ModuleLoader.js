// ModuleLoader.js - Centralized script loading for XmasMM
// Ensures consistent module loading across all HTML files

class ModuleLoader {
  static async loadGameModules(basePath = '') {
    // Define module loading order (dependencies first)
    const modules = [
      // Core utilities (no dependencies)
      'js/utils/TestConfig.js',
      'js/utils/GameUtils.js',
      
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
    
    console.log('🔄 Loading XmasMM modules...');
    
    // Load modules sequentially to respect dependencies
    for (const module of modules) {
      try {
        await this.loadScript(`${basePath}${module}`);
        console.log(`✅ Loaded: ${module}`);
      } catch (error) {
        console.error(`❌ Failed to load ${module}:`, error);
        throw new Error(`Module loading failed: ${module}`);
      }
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
      
      console.log('🎯 Game initialization complete!');
      return true;
    } catch (error) {
      console.error('🚨 Game initialization failed:', error);
      return false;
    }
  }
}

// Make available globally
window.ModuleLoader = ModuleLoader;
