// XmasMM - Phaser.js Blank Scene
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  scene: {
    preload: function() {},
    create: function() {
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      this.add.text(centerX, centerY, 'XmasMM', {
        font: '48px Arial',
        fill: '#fff',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    },
    update: function() {}
  }
};

window.onload = function() {
  new Phaser.Game(config);
};
