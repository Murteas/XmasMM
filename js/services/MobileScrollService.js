// MobileScrollService.js - Phaser-native mobile scrolling service
// Follows Phaser best practices: Container system, native input, transform hierarchy

class MobileScrollService extends Phaser.Events.EventEmitter {
  constructor(scene, config = {}) {
    super();
    
    this.scene = scene;
    this.config = {
      headerHeight: config.headerHeight || 140,
      footerHeight: config.footerHeight || 120,
      rowHeight: config.rowHeight || 60,
      scrollSensitivity: config.scrollSensitivity || 1.0,
      momentum: config.momentum || 0.95,
      ...config
    };
    
    // Phaser-native safe area management
    this.safeAreaManager = new SafeAreaManager(scene);
    
    // Containers (Phaser best practice)
    this.gameContainer = null;
    this.headerContainer = null;
    this.scrollableContainer = null;
    this.contentContainer = null;
    this.footerContainer = null;
    
    // Scroll state
    this.scrollY = 0;
    this.maxScrollY = 0;
    this.velocity = 0;
    this.isScrolling = false;
    this.isDragging = false;
    
    // Touch tracking
    this.lastPointerY = 0;
    this.startPointerY = 0;
    
    this.createContainers();
    this.setupScrolling();
    
    console.log('📱 MobileScrollService initialized with Phaser containers');
  }
  
  createContainers() {
    const { width, height } = this.scene.cameras.main;
    const safeArea = this.safeAreaManager.getInsets();
    
    // Enhanced footer height calculation using Phaser-native safe area manager
    const baseFooterHeight = this.config.footerHeight;
    const responsiveFooterHeight = baseFooterHeight + Math.max(0, safeArea.bottom - 10);
    
    console.log(`📱 Phaser-native responsive footer: base=${baseFooterHeight}px + safe=${safeArea.bottom}px = ${responsiveFooterHeight}px`);
    
    // === MAIN GAME CONTAINER ===
    this.gameContainer = this.scene.add.container(0, 0);
    this.gameContainer.setDepth(GameUtils.getDepthLayers().UI_BASE);
    
    // === FIXED HEADER CONTAINER (Phaser-native safe positioning) ===
    this.headerContainer = this.safeAreaManager.createSafeContainer(0, 0);
    this.headerContainer.setDepth(GameUtils.getDepthLayers().UI);
    
    // === SCROLLABLE AREA SETUP ===
    const scrollableY = safeArea.top + this.config.headerHeight;
    const scrollableHeight = height - this.config.headerHeight - responsiveFooterHeight - safeArea.top;
    
    // Scrollable container (moves with scroll)
    this.scrollableContainer = this.scene.add.container(0, scrollableY);
    this.scrollableContainer.setDepth(GameUtils.getDepthLayers().HISTORY);
    
    // Content container (holds all scrollable items)
    this.contentContainer = this.scene.add.container(0, 0);
    this.scrollableContainer.add(this.contentContainer);
    
    // === FIXED FOOTER CONTAINER (Phaser-native safe positioning) ===
    this.footerContainer = this.scene.add.container(0, height - responsiveFooterHeight);
    this.safeAreaManager.positionFooter(this.footerContainer, height - responsiveFooterHeight);
    this.footerContainer.setDepth(GameUtils.getDepthLayers().UI);
    
    // === SCROLLABLE AREA BOUNDARIES ===
    this.scrollBounds = {
      x: 0,
      y: scrollableY,
      width: width,
      height: scrollableHeight
    };
    
    // Create mask for clean content boundaries (Phaser best practice)
    this.createScrollMask();
    
    // Add containers to main game container
    this.gameContainer.add([
      this.headerContainer,
      this.scrollableContainer, 
      this.footerContainer
    ]);
    
    console.log('🎮 Phaser containers created:', {
      header: { y: safeArea.top, height: this.config.headerHeight },
      scrollable: { y: scrollableY, height: scrollableHeight },
      footer: { y: height - responsiveFooterHeight, height: responsiveFooterHeight }
    });
  }
  
  createScrollMask() {
    // Use Phaser's masking system for clean boundaries
    const maskShape = this.scene.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(
      this.scrollBounds.x,
      this.scrollBounds.y,
      this.scrollBounds.width,
      this.scrollBounds.height
    );
    
    // Apply mask to scrollable container
    const mask = maskShape.createGeometryMask();
    this.scrollableContainer.setMask(mask);
    
    console.log('✂️ Scroll mask applied to container');
  }
  
  setupScrolling() {
    // Create touch area using Phaser's input system
    this.touchArea = this.scene.add.rectangle(
      this.scrollBounds.x + this.scrollBounds.width / 2,
      this.scrollBounds.y + this.scrollBounds.height / 2,
      this.scrollBounds.width,
      this.scrollBounds.height,
      0x000000,
      0 // Transparent
    );
    
    // Make interactive using Phaser's input system
    this.touchArea.setInteractive();
    this.touchArea.setDepth(GameUtils.getDepthLayers().TOUCH_AREA);
    
    // Phaser native input events
    this.touchArea.on('pointerdown', this.handlePointerDown, this);
    this.touchArea.on('pointermove', this.handlePointerMove, this);
    this.touchArea.on('pointerup', this.handlePointerUp, this);
    this.touchArea.on('pointerout', this.handlePointerUp, this); // Handle edge case
    
    console.log('👆 Phaser input system configured for scrolling');
  }
  
  handlePointerDown(pointer) {
    this.isScrolling = true;
    this.isDragging = true;
    this.lastPointerY = pointer.y;
    this.startPointerY = pointer.y;
    this.velocity = 0;
    
    // Stop any existing momentum animations
    if (this.momentumTween) {
      this.momentumTween.stop();
      this.momentumTween = null;
    }
    
    this.emit('scrollStart', { y: this.scrollY });
  }
  
  handlePointerMove(pointer) {
    if (!this.isDragging) return;
    
    const deltaY = pointer.y - this.lastPointerY;
    const scaledDelta = deltaY * this.config.scrollSensitivity;
    
    // Apply scroll immediately
    this.scrollBy(scaledDelta);
    
    // Track velocity for momentum (Phaser-style smooth calculation)
    this.velocity = scaledDelta * 0.1;
    this.lastPointerY = pointer.y;
    
    this.emit('scrollMove', { y: this.scrollY, delta: scaledDelta });
  }
  
  handlePointerUp(pointer) {
    this.isDragging = false;
    this.isScrolling = false;
    
    // Apply momentum if velocity is significant
    if (Math.abs(this.velocity) > 0.5) {
      this.applyMomentum();
    }
    
    this.emit('scrollEnd', { y: this.scrollY, velocity: this.velocity });
  }
  
  scrollBy(deltaY) {
    const newScrollY = this.scrollY + deltaY;
    this.scrollTo(newScrollY);
  }
  
  scrollTo(targetY) {
    // Clamp scroll position within bounds
    const clampedY = Math.max(0, Math.min(targetY, this.maxScrollY));
    
    if (clampedY !== this.scrollY) {
      this.scrollY = clampedY;
      
      // Use Phaser's transform system (best practice)
      this.contentContainer.y = -this.scrollY;
      
      this.emit('scroll', { y: this.scrollY, progress: this.getScrollProgress() });
    }
  }
  
  applyMomentum() {
    // Use Phaser's tween system for smooth momentum (best practice)
    let currentVelocity = this.velocity;
    
    const updateMomentum = () => {
      if (Math.abs(currentVelocity) < 0.1) {
        this.velocity = 0;
        return;
      }
      
      this.scrollBy(currentVelocity);
      currentVelocity *= this.config.momentum;
      
      // Continue momentum using Phaser's time system
      this.scene.time.delayedCall(16, updateMomentum);
    };
    
    updateMomentum();
  }
  
  // === CONTENT MANAGEMENT (Phaser Container System) ===
  
  addContent(gameObject, index = -1) {
    if (index >= 0) {
      // Insert at specific position
      this.contentContainer.addAt(gameObject, index);
    } else {
      // Add to end
      this.contentContainer.add(gameObject);
    }
    
    this.updateContentBounds();
    this.emit('contentAdded', { object: gameObject, index });
  }
  
  removeContent(gameObject) {
    this.contentContainer.remove(gameObject);
    this.updateContentBounds();
    this.emit('contentRemoved', { object: gameObject });
  }
  
  clearContent() {
    this.contentContainer.removeAll();
    this.updateContentBounds();
    this.emit('contentCleared');
  }
  
  updateContentBounds() {
    // Calculate total content height based on children
    const contentHeight = this.contentContainer.list.length * this.config.rowHeight;
    
    // Update max scroll (content height - visible area height)
    this.maxScrollY = Math.max(0, contentHeight - this.scrollBounds.height);
    
    console.log(`📏 Content updated: ${contentHeight}px total, max scroll: ${this.maxScrollY}px`);
  }
  
  // === UTILITY METHODS ===
  
  getScrollProgress() {
    return this.maxScrollY > 0 ? this.scrollY / this.maxScrollY : 0;
  }
  
  scrollToBottom(animated = true) {
    if (animated) {
      // Use Phaser tween for smooth animation
      this.scene.tweens.add({
        targets: this,
        scrollY: this.maxScrollY,
        duration: 300,
        ease: 'Power2.easeOut',
        onUpdate: () => {
          this.contentContainer.y = -this.scrollY;
          this.emit('scroll', { y: this.scrollY, progress: this.getScrollProgress() });
        }
      });
    } else {
      this.scrollTo(this.maxScrollY);
    }
  }
  
  scrollToTop(animated = true) {
    if (animated) {
      this.scene.tweens.add({
        targets: this,
        scrollY: 0,
        duration: 300,
        ease: 'Power2.easeOut',
        onUpdate: () => {
          this.contentContainer.y = -this.scrollY;
          this.emit('scroll', { y: this.scrollY, progress: this.getScrollProgress() });
        }
      });
    } else {
      this.scrollTo(0);
    }
  }
  
  // === CONTAINER ACCESS (For Integration) ===
  
  getHeaderContainer() {
    return this.headerContainer;
  }
  
  getContentContainer() {
    return this.contentContainer;
  }
  
  getFooterContainer() {
    return this.footerContainer;
  }
  
  getScrollableContainer() {
    return this.scrollableContainer;
  }
  
  // === CLEANUP ===
  
  destroy() {
    // Stop any running tweens
    if (this.momentumTween) {
      this.momentumTween.stop();
    }
    
    // Remove input listeners
    if (this.touchArea) {
      this.touchArea.removeAllListeners();
      this.touchArea.destroy();
    }
    
    // Destroy containers (Phaser handles children automatically)
    if (this.gameContainer) {
      this.gameContainer.destroy();
    }
    
    // Clean up event emitter
    this.removeAllListeners();
    
    console.log('🧹 MobileScrollService destroyed');
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileScrollService;
} else {
  // Ensure global availability in browser
  window.MobileScrollService = MobileScrollService;
}
