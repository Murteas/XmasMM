// main.js - Game configuration and initialization

// Calculate optimal canvas size for mobile devices
function calculateCanvasSize() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // MOBILE-FIRST APPROACH: Use nearly full viewport
  // Account for mobile browser UI but maximize playable area
  const availableHeight = viewportHeight * 0.95; // Increased from 0.9 to 0.95
  const availableWidth = viewportWidth * 0.98;   // Increased from 0.95 to 0.98
  
  // CRITICAL FIX: Remove aspect ratio constraint for mobile portrait
  // Use available space more effectively for portrait devices
  let canvasWidth, canvasHeight;
  
  if (viewportWidth < 500) {
    // Mobile portrait: Use almost full available space
    canvasWidth = Math.min(availableWidth, viewportWidth);
    canvasHeight = Math.min(availableHeight, viewportHeight);
  } else {
    // Desktop/landscape: Maintain aspect ratio for traditional layout
    const aspectRatio = 4 / 3;
    if (availableWidth / availableHeight > aspectRatio) {
      canvasHeight = Math.min(availableHeight, 600);
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      canvasWidth = Math.min(availableWidth, 800);
      canvasHeight = canvasWidth / aspectRatio;
    }
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
