// main.js - Game configuration and initialization

// Calculate optimal canvas size for mobile devices
function calculateCanvasSize() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Account for mobile browser UI (address bar, navigation)
  const availableHeight = viewportHeight * 0.9; // 90% to leave space for browser UI
  const availableWidth = viewportWidth * 0.95;  // 95% to avoid edge overflow
  
  // Maintain aspect ratio (4:3) while fitting within available space
  const aspectRatio = 4 / 3;
  let canvasWidth, canvasHeight;
  
  if (availableWidth / availableHeight > aspectRatio) {
    // Height is the limiting factor
    canvasHeight = Math.min(availableHeight, 600); // Max 600px height
    canvasWidth = canvasHeight * aspectRatio;
  } else {
    // Width is the limiting factor
    canvasWidth = Math.min(availableWidth, 800); // Max 800px width
    canvasHeight = canvasWidth / aspectRatio;
  }
  
  return {
    width: Math.floor(canvasWidth),
    height: Math.floor(canvasHeight),
    devicePixelRatio: devicePixelRatio
  };
}

// Get initial canvas dimensions
const canvasSize = calculateCanvasSize();

const config = {
  type: Phaser.AUTO,
  width: canvasSize.width,
  height: canvasSize.height,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  render: {
    antialias: true,
    pixelArt: false,
    transparent: false
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,  // Minimum width for very small screens
      height: 240
    },
    max: {
      width: 800,  // Maximum width to prevent oversized display
      height: 600
    }
  },
  scene: [MainMenu, DifficultySelection, GameScene]
};

let game;

window.onload = function() {
  game = new Phaser.Game(config);
  
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
};

// Handle window resize events (orientation changes, browser UI changes)
function handleResize() {
  if (game) {
    const newSize = calculateCanvasSize();
    game.scale.resize(newSize.width, newSize.height);
  }
}
