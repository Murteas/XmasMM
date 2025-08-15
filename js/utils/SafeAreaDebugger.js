// SafeAreaDebugger.js - Debug utility for testing safe area implementation

class SafeAreaDebugger {
  static addDebugOverlay() {
    // Remove existing debug overlay
    this.removeDebugOverlay();
    
    const overlay = document.createElement('div');
    overlay.id = 'safe-area-debug';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999;
      font-family: monospace;
      font-size: 12px;
      color: white;
    `;
    
    // Add safe area visualization
    const topInset = this.getInsetValue('--sat');
    const rightInset = this.getInsetValue('--sar');
    const bottomInset = this.getInsetValue('--sab');
    const leftInset = this.getInsetValue('--sal');
    
    overlay.innerHTML = `
      <!-- Top safe area -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: ${topInset}px; background: rgba(255,0,0,0.3); border-bottom: 1px dashed red;"></div>
      <div style="position: absolute; top: 2px; left: 5px; background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 3px;">TOP: ${topInset}px</div>
      
      <!-- Bottom safe area -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: ${bottomInset}px; background: rgba(255,0,0,0.3); border-top: 1px dashed red;"></div>
      <div style="position: absolute; bottom: ${bottomInset + 2}px; left: 5px; background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 3px;">BOTTOM: ${bottomInset}px</div>
      
      <!-- Left safe area -->
      <div style="position: absolute; top: 0; bottom: 0; left: 0; width: ${leftInset}px; background: rgba(0,255,0,0.3); border-right: 1px dashed green;"></div>
      
      <!-- Right safe area -->
      <div style="position: absolute; top: 0; bottom: 0; right: 0; width: ${rightInset}px; background: rgba(0,255,0,0.3); border-left: 1px dashed green;"></div>
      
      <!-- Info panel -->
      <div style="position: absolute; top: ${topInset + 10}px; right: 10px; background: rgba(0,0,0,0.8); padding: 8px; border-radius: 6px; border: 1px solid #333;">
        <div>Viewport: ${window.innerWidth}×${window.innerHeight}</div>
        <div>DPR: ${window.devicePixelRatio || 1}</div>
        <div>User Agent: ${navigator.userAgent.includes('iPhone') ? 'iPhone' : 'Other'}</div>
        <div>PWA Mode: ${window.navigator.standalone ? 'Yes' : 'No'}</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    console.log('🔍 Safe Area Debug Overlay Added:', {
      top: topInset,
      right: rightInset,
      bottom: bottomInset,
      left: leftInset,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      pwaMode: window.navigator.standalone
    });
  }
  
  static removeDebugOverlay() {
    const existing = document.getElementById('safe-area-debug');
    if (existing) {
      existing.remove();
    }
  }
  
  static getInsetValue(property) {
    const style = getComputedStyle(document.documentElement);
    const value = style.getPropertyValue(property).trim();
    
    if (value && value !== '0px') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  
  static logSafeAreaInfo() {
    const insets = {
      top: this.getInsetValue('--sat'),
      right: this.getInsetValue('--sar'),
      bottom: this.getInsetValue('--sab'),
      left: this.getInsetValue('--sal')
    };
    
    console.log('📱 Safe Area Debug Info:', {
      insets,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio || 1,
      userAgent: navigator.userAgent,
      standalone: window.navigator.standalone,
      gameContainer: {
        computed: getComputedStyle(document.getElementById('game-container') || {}),
        element: document.getElementById('game-container')
      }
    });
  }
}

// Global availability
window.SafeAreaDebugger = SafeAreaDebugger;

// DISABLED: Auto-add debug overlay (was obscuring hint button)
// Debug overlay can still be manually enabled in console with SafeAreaDebugger.addDebugOverlay()
/*
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    setTimeout(() => SafeAreaDebugger.addDebugOverlay(), 1000);
  });
}
*/
