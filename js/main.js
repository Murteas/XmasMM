// main.js - Game configuration and initialization

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  scene: [MainMenu, DifficultySelection, GameScene]
};

window.onload = function() {
  new Phaser.Game(config);
};
