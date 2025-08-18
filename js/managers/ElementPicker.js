// ElementPicker.js - Handles element selection modal for mobile-friendly UX

class ElementPicker {
  constructor(scene, activeRowManager) {
    this.scene = scene;
    this.activeRowManager = activeRowManager;
    this.elementPicker = null;
    this.pickerBackdrop = null;
  }

  showElementPicker(slotIndex, currentGuess) {
    if (this.elementPicker) {
      return; // Picker already open
    }

    const elements = this.scene.elements;
    const gameWidth = this.scene.cameras.main.width;
    const gameHeight = this.scene.cameras.main.height;

    this.createPickerBackdrop(gameWidth, gameHeight);
    this.createPickerContainer(gameWidth, gameHeight);
    this.createPickerTitle();
    this.createElementGrid(elements, slotIndex, currentGuess);
    this.createCancelButton();
    this.animatePickerEntrance();
  }

  createPickerBackdrop(gameWidth, gameHeight) {
    this.pickerBackdrop = this.scene.add.rectangle(
      gameWidth / 2, 
      gameHeight / 2, 
      gameWidth, 
      gameHeight, 
      0x000000, 
      0.7
    ).setDepth(GameUtils.getDepthLayers().MODAL).setInteractive();

    // Close picker when clicking backdrop
    this.pickerBackdrop.on('pointerdown', () => {
      this.closeElementPicker();
    });
  }

  createPickerContainer(gameWidth, gameHeight) {
    // Create picker container with mobile-optimized sizing
    const pickerWidth = Math.min(320, gameWidth - 20);
    const baseHeight = gameHeight < 500 ? 300 : 280;
    const minMargin = gameHeight < 500 ? 40 : 100;
    const pickerHeight = Math.min(baseHeight, gameHeight - minMargin);
    
    this.elementPicker = this.scene.add.container(gameWidth / 2, gameHeight / 2);
    this.elementPicker.setDepth(GameUtils.getDepthLayers().MODAL + 1);

    // Picker background with rounded corners effect
    const pickerBg = this.scene.add.rectangle(0, 0, pickerWidth, pickerHeight, 0x2c3e50);
    pickerBg.setStrokeStyle(2, 0x34495e);
    this.elementPicker.add(pickerBg);

    // Store dimensions for later use
    this.pickerWidth = pickerWidth;
    this.pickerHeight = pickerHeight;
  }

  createPickerTitle() {
    const title = this.scene.add.text(0, -this.pickerHeight/2 + 30, 'Choose Element', {
      font: 'bold 18px Arial',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    this.elementPicker.add(title);
  }

  createElementGrid(elements, slotIndex, currentGuess) {
    const cols = 3;
    const rows = 2;
    const minTouchTarget = 48; // iOS/Android recommended minimum
    const elementSize = Math.max(minTouchTarget, Math.min(80, this.pickerWidth / 5));
    const spacing = Math.max(10, elementSize * 0.2);
    const startX = -(cols - 1) * (elementSize + spacing) / 2;
    const startY = -40; // Move elements up to make room for cancel button

    elements.forEach((element, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (elementSize + spacing);
      const y = startY + row * (elementSize + spacing);

      this.createElementButton(element, x, y, elementSize, slotIndex, currentGuess);
    });
  }

  createElementButton(element, x, y, elementSize, slotIndex, currentGuess) {
    // Element button background
    const elementBg = this.scene.add.rectangle(x, y, elementSize, elementSize, 0x3498db);
    elementBg.setStrokeStyle(2, 0x2980b9);
    elementBg.setInteractive({ useHandCursor: true });
    
    // Element image or fallback
    const elementDisplay = this.createElementDisplay(element, x, y, elementSize);
    
    // Highlight if currently selected
    const currentElement = currentGuess[slotIndex];
    if (element === currentElement) {
      elementBg.setFillStyle(0xe74c3c);
      elementBg.setStrokeStyle(3, 0xc0392b);
    }

    this.setupElementButtonEvents(elementBg, element, slotIndex, currentElement);
    
    // Add to picker container
    const elementsToAdd = [elementBg];
    if (Array.isArray(elementDisplay)) {
      elementsToAdd.push(...elementDisplay);
    } else {
      elementsToAdd.push(elementDisplay);
    }
    this.elementPicker.add(elementsToAdd);
  }

  createElementDisplay(element, x, y, elementSize) {
    const imageKey = this.scene.getElementImageKey(element);
    
    try {
      const elementImage = this.scene.add.image(x, y, imageKey);
      
      if (!elementImage.texture || elementImage.texture.key === '__MISSING') {
        console.warn(`ElementPicker: Failed to load image for ${element}, using fallback`);
        elementImage.destroy();
        return this.createFallbackDisplay(element, x, y, elementSize);
      }
      
      // Scale image to fit within button while maintaining aspect ratio
      const imageScale = Math.min((elementSize - 8) / elementImage.width, (elementSize - 8) / elementImage.height);
      elementImage.setScale(imageScale);
      elementImage.setOrigin(0.5);
      
      return elementImage;
    } catch (error) {
      console.error(`ElementPicker: Error creating image for ${element}:`, error);
      return this.createFallbackDisplay(element, x, y, elementSize);
    }
  }

  createFallbackDisplay(element, x, y, elementSize) {
    const fallbackRect = this.scene.add.rectangle(x, y, elementSize - 8, elementSize - 8, 0xff6b6b);
    const fallbackText = this.scene.add.text(x, y, element.charAt(0), {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    return [fallbackRect, fallbackText];
  }

  setupElementButtonEvents(elementBg, element, slotIndex, currentElement) {
    // Click handler with selection feedback
    elementBg.on('pointerdown', () => {
      // Brief visual feedback
      elementBg.setScale(0.95);
      this.scene.tweens.add({
        targets: elementBg,
        scale: 1,
        duration: 100,
        ease: 'Power2'
      });
      
      // Select element and close picker
      this.selectElement(slotIndex, element);
      this.scene.time.delayedCall(150, () => {
        this.closeElementPicker();
      });
    });

    // Touch feedback
    elementBg.on('pointerover', () => {
      if (element !== currentElement) {
        elementBg.setFillStyle(0x5dade2);
      }
    });

    elementBg.on('pointerout', () => {
      if (element !== currentElement) {
        elementBg.setFillStyle(0x3498db);
      }
    });
  }

  createCancelButton() {
    const closeBtnHeight = Math.max(36, 44); // Ensure minimum touch target
    const cancelButtonY = this.pickerHeight/2 - 25;
    
    // Add subtle divider line before cancel button
    const dividerY = cancelButtonY - 35;
    const divider = this.scene.add.rectangle(0, dividerY, this.pickerWidth - 40, 1, 0x7f8c8d);
    this.elementPicker.add(divider);
    
    const closeBtn = this.scene.add.text(0, cancelButtonY, 'Cancel', {
      font: 'bold 14px Arial',
      fill: '#fff',
      backgroundColor: '#95a5a6',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      this.closeElementPicker();
    });

    this.elementPicker.add(closeBtn);
  }

  animatePickerEntrance() {
    // Smooth entrance animation
    this.elementPicker.setScale(0.8);
    this.elementPicker.setAlpha(0);
    this.scene.tweens.add({
      targets: this.elementPicker,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  selectElement(slotIndex, element) {
    // Element selection sound removed for quieter family-friendly experience
    // Audio feedback limited to essential game events only
    
    this.activeRowManager.selectElement(slotIndex, element);
  }

  closeElementPicker() {
    if (!this.elementPicker) {
      return;
    }

    // Store reference to avoid race conditions
    const pickerToDestroy = this.elementPicker;
    const backdropToDestroy = this.pickerBackdrop;
    
    // Clear references immediately to prevent multiple calls
    this.elementPicker = null;
    this.pickerBackdrop = null;

    // Smooth exit animation
    this.scene.tweens.add({
      targets: pickerToDestroy,
      scale: 0.8,
      alpha: 0,
      duration: 150,
      ease: 'Back.easeIn',
      onComplete: () => {
        if (pickerToDestroy) {
          pickerToDestroy.destroy();
        }
        if (backdropToDestroy) {
          backdropToDestroy.destroy();
        }
      }
    });
  }

  isPickerOpen() {
    return this.elementPicker !== null;
  }

  destroy() {
    this.closeElementPicker();
  }
}