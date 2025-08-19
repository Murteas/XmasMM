// SafeAreaManager.js - Phaser-native safe area handling
// Bridges browser safe area APIs with Phaser's coordinate system

class SafeAreaManager {
  constructor(scene) {
    this.scene = scene;
    this.insets = { top: 0, right: 0, bottom: 0, left: 0 };
    this.callbacks = new Set();
    
    this.detectSafeAreas();
    this.setupResizeHandler();
    
    console.log('📱 SafeAreaManager initialized');
  }
  
  detectSafeAreas() {
    // Use modern CSS env() API with intelligent fallbacks
    const getInsetValue = (property) => {
      const style = getComputedStyle(document.documentElement);
      const value = style.getPropertyValue(property).trim();
      
      if (value && value !== '0px') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };
    
    const newInsets = {
      top: getInsetValue('--sat'),
      right: getInsetValue('--sar'), 
      bottom: getInsetValue('--sab'),
      left: getInsetValue('--sal')
    };
    
    // Apply device-specific fallbacks for better compatibility
    this.applyDeviceFallbacks(newInsets);
    
    // Only update if values changed (performance optimization)
    if (this.insetsChanged(newInsets)) {
      this.insets = newInsets;
      this.notifyCallbacks();
    }
    
    return this.insets;
  }
  
  applyDeviceFallbacks(insets) {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS/.test(userAgent);
    
    // iPhone X+ home indicator fallback
    if (isIOS && isSafari && insets.bottom === 0) {
      // Conservative fallback based on device detection
      const screenHeight = window.screen.height;
      const hasHomeIndicator = screenHeight >= 812; // iPhone X and newer
      
      if (hasHomeIndicator) {
        insets.bottom = 34; // Standard home indicator height
        console.log('📱 Applied iOS home indicator fallback: 34px');
      }
    }
    
    // Notch area fallback for landscape
    if (isIOS && window.orientation !== undefined) {
      const isLandscape = Math.abs(window.orientation) === 90;
      if (isLandscape && insets.left === 0 && insets.right === 0) {
        insets.left = insets.right = 44; // Standard notch avoidance
        console.log('📱 Applied iOS landscape notch fallback');
      }
    }
  }
  
  insetsChanged(newInsets) {
    return Object.keys(newInsets).some(key => this.insets[key] !== newInsets[key]);
  }
  
  setupResizeHandler() {
    // Use Phaser's scale manager for consistent event handling
    this.scene.scale.on('resize', () => {
      // Delay to allow CSS env() values to update
      this.scene.time.delayedCall(100, () => this.detectSafeAreas());
    });
    
    // Also listen for orientation changes
    if (window.orientation !== undefined) {
      window.addEventListener('orientationchange', () => {
        this.scene.time.delayedCall(300, () => this.detectSafeAreas());
      });
    }
  }
  
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.insets);
      } catch (error) {
        console.error('Safe area callback error:', error);
      }
    });
    
    console.log('📱 Safe area insets updated:', this.insets);
  }
  
  // === PUBLIC API ===
  
  getInsets() {
    return { ...this.insets }; // Return copy to prevent mutation
  }
  
  getAdjustedBounds(x, y, width, height) {
    // Return bounds adjusted for safe areas
    return {
      x: x + this.insets.left,
      y: y + this.insets.top,
      width: width - this.insets.left - this.insets.right,
      height: height - this.insets.top - this.insets.bottom
    };
  }
  
  getSafeViewport() {
    const { width, height } = this.scene.cameras.main;
    return this.getAdjustedBounds(0, 0, width, height);
  }
  
  onInsetsChanged(callback) {
    this.callbacks.add(callback);
    // Call immediately with current values
    callback(this.insets);
    
    return () => this.callbacks.delete(callback); // Return unsubscribe function
  }
  
  // === PHASER INTEGRATION HELPERS ===
  
  createSafeContainer(x = 0, y = 0) {
    // Create a container that automatically respects safe areas
    const container = this.scene.add.container(x + this.insets.left, y + this.insets.top);
    
    // Auto-update container position when safe areas change
    const unsubscribe = this.onInsetsChanged((insets) => {
      container.x = x + insets.left;
      container.y = y + insets.top;
    });
    
    // Clean up when container is destroyed
    container.on('destroy', unsubscribe);
    
    return container;
  }
  
  // Note: positionFooter method removed - no longer needed in unified layout
}

// Global availability for module loading system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SafeAreaManager;
} else {
  window.SafeAreaManager = SafeAreaManager;
}
