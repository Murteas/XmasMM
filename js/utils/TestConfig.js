// TestConfig.js - Configuration utilities for test environments

class TestConfig {
  static isTestEnvironment() {
    return window.location.pathname.includes('/tests/');
  }
  
  static shouldShowDebugLogs() {
    return TestConfig.isTestEnvironment() || window.location.search.includes('debug=true');
  }
  
  static getAssetPath() {
    return TestConfig.isTestEnvironment() ? '../assets/' : 'assets/';
  }
  
  static enableTestMode() {
    if (TestConfig.isTestEnvironment()) {
      console.log('🧪 Test Mode Enabled - Enhanced debugging active');
      
      // Add test-specific styling
      document.body.classList.add('test-environment');
      
      // Add debug info to page
      const debugInfo = document.createElement('div');
      debugInfo.id = 'test-debug-info';
      debugInfo.style.cssText = `
        position: fixed;
        top: 5px;
        right: 5px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 5px;
        font-size: 10px;
        font-family: monospace;
        z-index: 10000;
        border-radius: 3px;
      `;
      debugInfo.innerHTML = `
        🧪 TEST MODE<br>
        Screen: ${screen.width}x${screen.height}<br>
        DPR: ${window.devicePixelRatio}<br>
        UA: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
      `;
      document.body.appendChild(debugInfo);
    }
  }
  
  static log(message, ...args) {
    if (TestConfig.shouldShowDebugLogs()) {
      console.log(`🧪 TEST: ${message}`, ...args);
    }
  }
  
  static warn(message, ...args) {
    if (TestConfig.shouldShowDebugLogs()) {
      console.warn(`🧪 TEST: ${message}`, ...args);
    }
  }
  
  static error(message, ...args) {
    if (TestConfig.shouldShowDebugLogs()) {
      console.error(`🧪 TEST: ${message}`, ...args);
    }
  }
}

// Auto-enable test mode if in test environment
if (TestConfig.isTestEnvironment()) {
  document.addEventListener('DOMContentLoaded', () => {
    TestConfig.enableTestMode();
  });
}
