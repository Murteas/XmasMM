// XmasMM - Phaser.js MainMenu and Game scenes

class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }
  preload() {
    this.load.image('bg', 'assets/bg.jpg');
  }
  create() {
    const { width, height } = this.cameras.main;
    // Add background image, scaled to cover
    const bg = this.add.image(width / 2, height / 2, 'bg');
    bg.setDisplaySize(width, height);
    bg.setDepth(0);

    // Title
    this.add.text(width / 2, height * 0.18, 'XmasMM', {
      font: '48px Arial',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1);

    // Start Game button
    const startBtn = this.add.text(width / 2, height * 0.45, 'Start Game', {
      font: '32px Arial',
      fill: '#fff',
      backgroundColor: '#c0392b',
      padding: { left: 24, right: 24, top: 12, bottom: 12 },
      borderRadius: 8
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    startBtn.on('pointerdown', () => {
      this.scene.start('Game');
    });

    // SFX Toggle
    this.registry.set('sfxOn', true);
    this.registry.set('musicOn', true);
    this.sfxBtn = this.add.text(width / 2, height * 0.65, 'SFX: ON', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#222',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    this.sfxBtn.on('pointerdown', () => {
      const current = this.registry.get('sfxOn');
      this.registry.set('sfxOn', !current);
      this.sfxBtn.setText('SFX: ' + (this.registry.get('sfxOn') ? 'ON' : 'OFF'));
    });

    // Music Toggle
    this.musicBtn = this.add.text(width / 2, height * 0.75, 'Music: ON', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#222',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
      borderRadius: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    this.musicBtn.on('pointerdown', () => {
      const current = this.registry.get('musicOn');
      this.registry.set('musicOn', !current);
      this.musicBtn.setText('Music: ' + (this.registry.get('musicOn') ? 'ON' : 'OFF'));
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');
    this.add.text(width / 2, height / 2, 'Game Scene', {
      font: '36px Arial',
      fill: '#fff'
    }).setOrigin(0.5);
    // Add a back button for dev/testing
    const backBtn = this.add.text(width / 2, height * 0.8, 'Back to Menu', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  scene: [MainMenu, GameScene]
};

window.onload = function() {
  new Phaser.Game(config);
};
