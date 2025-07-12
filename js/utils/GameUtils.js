// GameUtils.js - Common utility functions for XmasMM

class GameUtils {
  static generateRandomCode(elements, codeLength) {
    const code = [];
    for (let i = 0; i < codeLength; i++) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      code.push(randomElement);
    }
    return code;
  }

  static calculateFeedback(guess, code) {
    let black = 0; // Correct element and position
    let white = 0; // Correct element, wrong position
    
    const guessCopy = [...guess];
    const codeCopy = [...code];
    
    // First pass: count black pegs (exact matches)
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        guessCopy.splice(i, 1);
        codeCopy.splice(i, 1);
      }
    }
    
    // Second pass: count white pegs (element exists but wrong position)
    for (let i = 0; i < guessCopy.length; i++) {
      const index = codeCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        white++;
        codeCopy.splice(index, 1);
      }
    }
    
    return { black, white };
  }

  static getGameElements() {
    return ['Santa', 'Present', 'Mistletoe', 'Star', 'Tree', 'Snowflake'];
  }

  static getDepthLayers() {
    return {
      BACKGROUND: 0,
      OVERLAY: 0.5,
      UI: 1,
      CURRENT_GUESS: 2,
      HISTORY: 3,
      TOUCH_AREA: 5,
      GAME_OVER: 10,
      MODAL: 15
    };
  }
  // Expert Mobile Layout System
  static getMobileViewport() {
    // Use simulated viewport if set (for device simulation testing)
    if (this._simulatedViewport) {
      console.log('🎯 Using simulated viewport:', this._simulatedViewport);
      return this._simulatedViewport;
    }
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      aspectRatio: window.innerWidth / window.innerHeight,
      isSmallDevice: window.innerWidth <= 375, // iPhone SE and smaller
      isStandardDevice: window.innerWidth >= 414 && window.innerWidth <= 428, // iPhone XR to Pro Max
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    };

    // Add performance throttling for viewport changes
    if (!this._lastViewportCheck || Date.now() - this._lastViewportCheck > 100) {
      this._cachedViewport = viewport;
      this._lastViewportCheck = Date.now();
    }

    return this._cachedViewport || viewport;
  }

  static getResponsiveLayout(width, height) {
    const viewport = this.getMobileViewport();
    const safeArea = this.getSafeAreaInsets();
    
    // Constraint-based positioning system
    const layout = {
      // Header area (top 20% with safe area consideration)
      headerY: Math.max(height * 0.15, safeArea.top + 60),
      
      // Content areas with safe spacing
      contentStartY: Math.max(height * 0.25, safeArea.top + 120),
      contentMidY: height * 0.5,
      contentEndY: Math.min(height * 0.75, height - safeArea.bottom - 120),
      
      // Button positioning (safe from bottom areas)
      primaryButtonY: Math.min(height * 0.75, height - safeArea.bottom - 100),
      secondaryButtonY: Math.min(height * 0.85, height - safeArea.bottom - 60),
      
      // Safe margins
      marginX: Math.max(20, width * 0.05),
      marginBottom: Math.max(40, safeArea.bottom + 20),
      
      // Touch target optimization
      minTouchSize: 44,
      touchSpacing: 12,
      
      // Typography scaling
      fontScale: this.getMobileFontScale(width),
      
      // Performance optimized values
      animationDuration: viewport.isSmallDevice ? 200 : 300
    };
    
    return layout;
  }

  static getMobileFontScale(width) {
    // Dynamic font scaling based on device width
    if (width <= 375) return 0.9;  // iPhone SE
    if (width <= 414) return 1.0;  // iPhone XR
    return 1.1; // iPhone Pro Max
  }

  static getSafeAreaInsets() {
    // Hybrid approach: CSS env() with Phaser.js fallback
    const style = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(style.getPropertyValue('--sat') || '0', 10),
      right: parseInt(style.getPropertyValue('--sar') || '0', 10),
      bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
      left: parseInt(style.getPropertyValue('--sal') || '0', 10)
    };
  }

  static createResponsiveText(scene, x, y, text, baseStyle, layoutKey = null) {
    const viewport = this.getMobileViewport();
    const layout = this.getResponsiveLayout(viewport.width, viewport.height);
    
    // Apply responsive positioning if layout key provided
    if (layoutKey && layout[layoutKey]) {
      y = layout[layoutKey];
    }
    
    // Apply font scaling
    const scaledStyle = { ...baseStyle };
    if (scaledStyle.fontSize) {
      const baseSize = parseInt(scaledStyle.fontSize);
      scaledStyle.fontSize = `${Math.round(baseSize * layout.fontScale)}px`;
    }
    
    // Add word wrap for mobile if not specified
    if (!scaledStyle.wordWrap && text.length > 40) {
      scaledStyle.wordWrap = { 
        width: Math.min(viewport.width * 0.9, 400),
        useAdvancedWrap: true 
      };
    }
    
    return scene.add.text(x, y, text, scaledStyle);
  }
}
