# 🧪 XmasMM Testing Documentation

**AI-Agent Optimized Testing System** - Complete testing infrastructure for mobile-first Pha### Before Making Changes
1. Establish baseline: `cd tests && bash run_tests.sh`
2. Note any existing failures
3. Ensure HTTP server is running on port 8000 (any HTTP server)js development.

## 📁 Directory Structure

### Core Test Files
- `test_comprehensive.html` - **PRIMARY**: Integration testing of modular architecture
- `test_mobile_expert.html` - **MOBILE**: MOBILE-006 ScrollableHistoryManager testing  
- `test_mobile_evaluation.html` - **MOBILE**: Mobile device evaluation and viewport testing
- `index.html` - Test suite navigation hub

### Specialized Test Files  
- `test_canvas_optimization.html` - Canvas performance and mobile optimization
- `test_asset_loading.html` - Christmas asset loading verification
- `test_debug_performance.html` - Performance debugging and FPS monitoring

### Automation & Verification Scripts
- `run_tests.sh` - **COMPREHENSIVE**: Full test suite with verification
- `verify_tests.sh` - **QUICK**: Primary verification script (run after every change)
- `automated_test_verifier.js` - Deep automated verification with HTTP testing
- `cleanup_redundancy.sh` - **REDUNDANCY CHECK**: Prevents duplicate files and documentation
- `package.json` - Node.js dependencies for automation

### Enhanced Node.js Testing (Root Level)
- **📦 Main `package.json`** - Professional debugging tools and scripts
- **🔧 `scripts/debug-interactions.js`** - Interaction debugging with JSON reports
- **🔍 `scripts/verify-assets.js`** - Asset verification and size analysis
- **📊 `test-results/`** - JSON reports from enhanced debugging tools

### Test Results & Data
- `automated_test_results.json` - Verification results
- `test_results.json` - Legacy test results

## 🚀 Quick Test Commands (Essential for AI Agents)

### Enhanced Node.js Testing (NEW - Requires Node.js v22.17.0+)
```bash
# From project root - professional debugging tools
npm run verify-assets        # Asset verification with size analysis
npm run debug-interactions   # Interaction debugging with JSON reports  
npm test                     # Combined verification suite
npm run start-dev            # Start Python dev server via npm

# Check JSON reports
cat test-results/asset_verification_report.json
cat test-results/interaction_debug_report.json
```

### Traditional HTML Testing (Legacy)
```bash
# MANDATORY after every change
cd tests && bash run_tests.sh

# Quick verification only  
cd tests && bash verify_tests.sh

# Deep verification (if Node.js available)
cd tests && node automated_test_verifier.js

# Check for redundant files (from project root)
bash scripts/cleanup_redundancy.sh
```

### Development Server
```bash
# From project root - Manual HTTP server setup required
# Use any HTTP server of your choice, such as:
# python -m http.server 8000  (Python 3)
# npx serve .                 (Node.js)
# php -S localhost:8000       (PHP)
```

## 🔍 **AI Agent Terminal Best Practices**
**For reliable command output capture:**

### ✅ **Recommended Pattern**
```bash
# ALWAYS capture output to test-results/ directory:
cd tests && bash verify_tests.sh 2>&1 | tee ../test-results/verification.log
bash run_tests.sh 2>&1 | tee ../test-results/full_test_run.log

# Then read the complete results reliably:
read_file("test-results/verification.log")
```

### ❌ **Avoid**
- Relying on `get_terminal_output` (often fails with "Invalid terminal ID")
- Creating temp files in project root (triggers cleanup warnings)
- Assuming truncated `run_in_terminal` results are complete

### 📁 **Output Organization**
- **test-results/**: All command outputs and logs
- **Descriptive names**: `verification.log`, `full_test_run.log`, `status_check.log`
- **Clean up**: Remove temporary files after reading

### Access Test Suite
- Test hub: http://localhost:8000/tests/
- Comprehensive: http://localhost:8000/tests/test_comprehensive.html
- Mobile expert: http://localhost:8000/tests/test_mobile_expert.html

## 📱 Test Modules Detailed

### 1. **Comprehensive Integration Test** (`test_comprehensive.html`) ⭐ **PRIMARY**
**Complete modular architecture validation** for AI agents:
- **ModuleLoader Verification**: Tests centralized dependency loading
- **Module Loading Tests**: Validates all managers and scenes load correctly  
- **Integration Tests**: Verifies component interaction
- **Functional Tests**: Phaser.js game initialization and scene management
- **Error Reporting**: Clear pass/fail indicators for automated verification
- **AI-Agent Friendly**: Designed for programmatic result checking

### 2. **Expert Mobile Layout Test** (`test_mobile_expert.html`) ⭐ **MOBILE**
**Professional mobile optimization validation** with advanced device simulation:
- **Advanced Device Simulation**: Accurate viewport override with GameUtils integration
- **Enhanced Scene Refresh**: Automatic scene restart for proper UI repositioning
- **Detailed Debug Logging**: Console monitoring of viewport changes and scene updates
- **Gameplay Simulation**: Auto-navigate to game screen with multiple guesses for MOBILE-006 testing
- **MOBILE-006 Specific Testing**: Browser UI overlap prevention validation in real game state
- **Performance Monitoring**: Real-time FPS monitoring and performance validation
- **Device Compatibility**: iPhone SE, XR, Pro Max with pixel-perfect accuracy
- **Accessibility**: Touch target testing (44px compliance), safe area detection
- **Responsive Design**: Typography, layout constraints, CSS env() validation

### 3. **Test Navigation Hub** (`index.html`)
Central testing interface with device detection and comprehensive metrics.

## 🎯 AI Agent Testing Protocol

### Before Making Changes
1. Establish baseline: `cd tests && bash run_tests.sh`
2. Note any existing failures
3. Ensure HTTP server running on port 8000 (any HTTP server)

### After Making Changes  
1. **MANDATORY**: `cd tests && bash run_tests.sh`
2. Check for new failures
3. Verify mobile responsiveness in browser
4. Update tests if new functionality added

### Test Verification Checklist
- [ ] All HTTP requests return 200
- [ ] ModuleLoader loads without errors
- [ ] Comprehensive test shows green results
- [ ] Mobile test functions on 375x667 viewport
- [ ] No console errors in browser dev tools

## 📋 Manual vs Automated Testing

### 🤖 **Automated Testing** (Available in framework)
- **HTTP Verification**: All resources accessible (verify_tests.sh)
- **Module Loading**: Dependency resolution testing
- **Device Simulation**: Button-click device switching (SE/XR/Pro Max)  
- **Performance Monitoring**: Real-time FPS and memory tracking
- **Layout Validation**: Responsive viewport and element positioning
- **Touch Target Testing**: 44px minimum size compliance
- **Safe Area Detection**: CSS env() support validation

### 👆 **Manual Testing Required** (Cannot be automated)
- **Physical Device Testing**: Real mobile browser behavior (iOS Safari, Android Chrome)
- **Address Bar Interaction**: Manually scroll to show/hide browser UI
- **Touch Accuracy**: Actual finger tapping with browser UI visible
- **Orientation Changes**: Portrait/landscape switching
- **Real Network Conditions**: Loading performance on mobile data
- **Accessibility**: Screen reader compatibility and voice control

## 🔧 Test File Maintenance

### Adding New Tests
1. Create test file in `tests/` directory
2. Use ModuleLoader pattern: `await window.ModuleLoader.initializeGame('../');`
3. Add verification to `verify_tests.sh` and `run_tests.sh`
4. Update this README

### Removing Old Tests
1. Move to `tests/legacy/` if historical value
2. Remove from verification scripts
3. Update documentation

## 📱 Mobile Testing Requirements (Phaser.js Best Practices)

All tests must verify:
- **Responsive Scaling**: 375x667 minimum viewport with `Phaser.Scale.FIT`
- **Touch Events**: Proper touch handling and UI interaction
- **Performance**: 60 FPS target on mobile devices
- **UI Standards**: 44px minimum touch targets
- **Scene Management**: Proper Phaser scene lifecycle
- **Memory Management**: No memory leaks in game loops

## 🤖 AI Agent Notes

- **Never assume tests pass** - always run verification scripts
- **All test files belong in tests/ directory** - keep project root clean
- **Use relative paths correctly** - `../` from tests to project files
- **Mobile-first approach** - test mobile viewport before desktop
- **Verify changes work** - false positives harm project quality
- **Follow Phaser.js patterns** - proper scene management, scaling, performance
- Mobile expert test: http://localhost:8000/tests/test_mobile_expert.html

## 🎯 AI Agent Testing Protocol

### Before Making Changes
1. Establish baseline: `cd tests && bash verify_tests.sh`
2. Note any existing failures
3. Ensure HTTP server is running on port 8000 (any HTTP server)

### After Making Changes
1. **MANDATORY**: `cd tests && bash verify_tests.sh`
2. Check for new failures
3. Verify mobile responsiveness in browser
4. Update tests if new functionality added

### Test Verification Checklist
- [ ] All HTTP requests return 200
- [ ] ModuleLoader loads without errors
- [ ] Comprehensive test shows green results
- [ ] Mobile test functions on 375x667 viewport
- [ ] No console errors in browser dev tools

## 🔧 Test File Maintenance

### Adding New Tests
1. Create test file in `tests/` directory
2. Use ModuleLoader pattern: `await window.ModuleLoader.initializeGame('../');`
3. Add verification to `verify_tests.sh`
4. Update this README

### Removing Old Tests
1. Move to `tests/legacy/` if historical value
2. Remove from verification scripts
3. Update documentation

## 📱 Mobile Testing Requirements

All tests must verify:
- Responsive scaling (375x667 minimum)
- Touch event handling
- Performance on mobile devices
- UI element sizing (44px minimum touch targets)

## 🤖 AI Agent Notes

- **Never assume tests pass** - always run verification
- **All test files belong in tests/ directory** - keep root clean
- **Use relative paths correctly** - `../` from tests to project files
- **Mobile-first approach** - test mobile viewport first
- **Verify changes work** - false positives harm project quality
