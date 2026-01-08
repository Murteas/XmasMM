// ElementBar.js - Always-visible element selection bar

class ElementBar {
  constructor(scene, activeRowManager) {
    this.scene = scene;
    this.activeRowManager = activeRowManager;
    this.elementButtons = [];
    this.container = null;
  }

  // Create element bar at specified position (inline with active row)
  create(container, yPosition = -35) {
    const { width } = this.scene.cameras.main;
    this.createAtPosition(container, width / 2, yPosition);
  }

  // Create element bar at explicit X/Y position
  createAtPosition(container, centerX, yPosition) {
    const elements = this.scene.elements;
    const footer = LayoutConfig.FOOTER; // Use consolidated footer config
    
    // Element button sizing from config
    const elementSize = footer.ELEMENT_BUTTON_SIZE;
    const spacing = footer.ELEMENT_BUTTON_SPACING;
    const totalWidth = elements.length * elementSize + (elements.length - 1) * spacing;
    const startX = -totalWidth / 2 + elementSize / 2;
    
    // Create container at specified X position (not always screen center)
    this.container = this.scene.add.container(centerX, 0);
    container.add(this.container);
    
    // Create element buttons
    elements.forEach((element, index) => {
      const x = startX + index * (elementSize + spacing);
      const button = this.createElementButton(element, x, yPosition, elementSize);
      this.elementButtons.push(button);
    });
    
    // Subtle hint animation on first load
    this.addInitialHint();
  }

  addInitialHint() {
    // Gentle pulse animation to suggest interactivity
    this.scene.time.delayedCall(1000, () => {
      this.elementButtons.forEach((button, index) => {
        this.scene.time.delayedCall(index * 100, () => {
          this.scene.tweens.add({
            targets: button.bg,
            scale: 1.1,
            duration: 300,
            yoyo: true,
            ease: 'Sine.easeInOut'
          });
        });
      });
    });
  }

  createElementButton(element, x, y, size) {
    // Background with Christmas theme
    const bg = this.scene.add.rectangle(x, y, size, size, 0x0d3820)
      .setStrokeStyle(2, 0xffd700, 0.8)
      .setInteractive({ useHandCursor: true });
    
    // Element image
    const imageKey = this.scene.getElementImageKey(element);
    let elementDisplay;
    
    try {
      elementDisplay = this.scene.add.image(x, y, imageKey);
      const scale = Math.min((size - 8) / elementDisplay.width, (size - 8) / elementDisplay.height);
      elementDisplay.setScale(scale);
    } catch (error) {
      // Fallback to text
      elementDisplay = this.scene.add.text(x, y, element.charAt(0).toUpperCase(), {
        fontSize: '16px',
        fill: '#ffffff'
      }).setOrigin(0.5);
    }
    
    this.container.add([bg, elementDisplay]);
    
    // Interaction
    bg.on('pointerdown', () => this.selectElement(element));
    bg.on('pointerover', () => bg.setStrokeStyle(3, 0xffd700, 1.0));
    bg.on('pointerout', () => bg.setStrokeStyle(2, 0xffd700, 0.8));
    
    return { element, bg, display: elementDisplay };
  }

  selectElement(element) {
    this.activeRowManager.handleElementSelection(element);
    
    // Brief visual feedback
    const button = this.elementButtons.find(b => b.element === element);
    if (button) {
      button.bg.setScale(0.9);
      this.scene.tweens.add({
        targets: button.bg,
        scale: 1,
        duration: 150,
        ease: 'Back.easeOut'
      });
    }
  }

  updateUsedElements(currentGuess) {
    // Dim elements that are currently in use
    this.elementButtons.forEach(button => {
      const isUsed = currentGuess.includes(button.element);
      button.bg.setAlpha(isUsed ? 0.6 : 1.0);
      button.display.setAlpha(isUsed ? 0.7 : 1.0);
    });
  }

  updatePosition(yPosition) {
    if (this.container) {
      // Update the container's Y position to move the entire element bar
      this.container.setY(yPosition);
    }
  }

  destroy() {
    if (this.container) {
      this.container.destroy();
    }
    this.elementButtons = [];
  }
}
