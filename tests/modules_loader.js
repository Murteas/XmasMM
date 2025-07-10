// Standardized module loader for all test files
// This ensures consistent loading order across all tests

const MODULES_TO_LOAD = [
  // Load utility classes first
  '../js/utils/TestConfig.js',
  '../js/utils/GameUtils.js',
  
  // Load manager classes in dependency order
  '../js/managers/ScoreManager.js',
  '../js/managers/HistoryRenderer.js',
  '../js/managers/HistoryScroller.js',
  '../js/managers/ElementPicker.js',
  '../js/managers/ActiveRowManager.js',
  '../js/managers/HistoryManager.js',
  '../js/managers/GameStateManager.js',
  '../js/managers/UILayoutManager.js',
  '../js/managers/GameInputHandler.js',
  
  // Load scene classes
  '../js/scenes/MainMenu.js',
  '../js/scenes/DifficultySelection.js',
  '../js/scenes/GameScene.js',
  
  // Load main configuration last
  '../js/main.js'
];

// Function to dynamically load all modules
function loadAllModules() {
  return new Promise((resolve, reject) => {
    let loadedCount = 0;
    const totalCount = MODULES_TO_LOAD.length;
    
    function onScriptLoad() {
      loadedCount++;
      if (loadedCount === totalCount) {
        resolve();
      }
    }
    
    function onScriptError(src) {
      reject(new Error(`Failed to load module: ${src}`));
    }
    
    MODULES_TO_LOAD.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = onScriptLoad;
      script.onerror = () => onScriptError(src);
      document.head.appendChild(script);
    });
  });
}

// Export for use in tests
window.loadAllModules = loadAllModules;
window.MODULES_TO_LOAD = MODULES_TO_LOAD;
