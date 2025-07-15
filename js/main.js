// main.js - Game configuration and initialization

// Calculate optimal canvas size for mobile devices
function calculateCanvasSize() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // MOBILE-FIRST APPROACH: Use full viewport for immersive experience
  let canvasWidth, canvasHeight;
  
  if (viewportWidth < 500) {
    // Mobile: Use full viewport dimensions
    canvasWidth = viewportWidth;
    canvasHeight = viewportHeight;
  } else {
    // Desktop: Use generous dimensions but maintain some margin
    canvasWidth = Math.min(viewportWidth * 0.95, 800);
    canvasHeight = Math.min(viewportHeight * 0.95, 600);
  }
  
  if (TestConfig && TestConfig.shouldShowDebugLogs()) {
    console.log(`Canvas Debug: Viewport ${viewportWidth}x${viewportHeight} -> Canvas ${canvasWidth}x${canvasHeight}`);
  }
  
  return {
    width: Math.floor(canvasWidth),
    height: Math.floor(canvasHeight),
    devicePixelRatio: devicePixelRatio
  };
}

// Get initial canvas dimensions
const canvasSize = calculateCanvasSize();

let game;

// Initialize game - called by ModuleLoader after all modules are loaded
function initializeGame() {
  console.log('🔧 initializeGame() called - checking scene availability...');
  
  // Verify all scene classes are available
  if (typeof MainMenu === 'undefined' || 
      typeof DifficultySelection === 'undefined' || 
      typeof GameScene === 'undefined' || 
      typeof RoundOver === 'undefined') {
    console.error('🚨 Scene classes not loaded:', {
      MainMenu: typeof MainMenu,
      DifficultySelection: typeof DifficultySelection, 
      GameScene: typeof GameScene,
      RoundOver: typeof RoundOver
    });
    return false;
  }
  
  console.log('✅ All scene classes available - creating Phaser config...');

  // Ensure the game container is ready and has proper dimensions
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    console.error('🚨 game-container element not found!');
    return false;
  }
  
  // Force a layout recalculation to ensure proper dimensions
  const containerRect = gameContainer.getBoundingClientRect();
  console.log('📐 Container dimensions:', containerRect.width, 'x', containerRect.height);
  
  if (containerRect.width === 0 || containerRect.height === 0) {
    console.error('🚨 Container has zero dimensions!', containerRect);
    return false;
  }

  // Create Phaser config with loaded scene classes
  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      parent: 'game-container',
      width: Math.max(containerRect.width, 320),
      height: Math.max(containerRect.height, 480),
      min: {
        width: 320,
        height: 480
      },
      // Add explicit autoCenter for better mobile handling
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#1a1a2e',
    render: {
      antialias: true,
      pixelArt: false,
      transparent: false
    },
    scene: [MainMenu, DifficultySelection, GameScene, RoundOver]
  };

  // Suppress common browser extension async listener errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('message channel closed before a response was received')) {
      // This is a browser extension error, not our code - suppress it
      event.preventDefault();
      return false;
    }
  });
  
  // Suppress unhandled promise rejections from browser extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('message channel closed before a response was received')) {
      // This is a browser extension error, not our code - suppress it
      event.preventDefault();
      return false;
    }
  });
  
  console.log('🎮 Creating Phaser game with all scenes loaded...');
  game = new Phaser.Game(config);
  
  // Verify game was created successfully
  if (!game) {
    console.error('🚨 Failed to create Phaser game instance!');
    return false;
  }
  
  console.log('✅ Phaser game instance created successfully');
  
  // Make game globally accessible for debugging
  window.game = game;
  
  // Monitor game initialization
  game.events.once('ready', () => {
    console.log('🎯 Phaser game is ready!');
    console.log('🎬 Available scenes:', game.scene.scenes.map(s => s.scene.key));
    
    // Check if any scenes are active
    const activeScenes = game.scene.getScenes(true);
    if (activeScenes.length > 0) {
      console.log('✅ Active scenes:', activeScenes.map(s => s.scene.key));
    } else {
      console.warn('⚠️ No active scenes found - this might be the problem!');
    }
  });
  
  // Add resize event listener for orientation changes
  window.addEventListener('resize', handleResize);
  
  // Set willReadFrequently on the canvas after it's created (for performance optimization)
  game.events.once('ready', () => {
    if (game.canvas) {
      const context = game.canvas.getContext('2d');
      if (context && typeof context.getImageData === 'function') {
        // Canvas is ready and supports getImageData
        try {
          // This helps with performance for frequent canvas reads
          game.canvas.style.willReadFrequently = 'true';
        } catch (e) {
          // Silently ignore if not supported
        }
      }
    }
  });
  
  return true;
}

// Make initializeGame available globally for ModuleLoader
window.initializeGame = initializeGame;

// Handle window resize events (orientation changes, browser UI changes)
function handleResize() {
  if (game) {
    const newSize = calculateCanvasSize();
    if (TestConfig && TestConfig.shouldShowDebugLogs()) {
      console.log(`🔄 Resize: New canvas size ${newSize.width}x${newSize.height}`);
    }
    game.scale.resize(newSize.width, newSize.height);
    
    // Refresh current scene layout
    const currentScene = game.scene.getScene(game.scene.getScenes(true)[0].scene.key);
    if (currentScene && currentScene.refreshLayout) {
      currentScene.refreshLayout();
    }
  }
}
