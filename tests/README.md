# 🧪 XmasMM Testing Documentation

**AI-Agent Optimized Testing System** - Simplified testing infrastructure for mobile-first Phaser.js development.

## 📁 Directory Structure

### Essential Test Files
- `verify_tests.sh` - **AI AGENT PRIMARY**: Quick verification script (run after every change)
- `test_mobile_expert.html` - **MANUAL TESTING RECOMMENDED**: Mobile device evaluation and ScrollableHistoryManager testing  
- `index.html` - **MANUAL TESTING**: Test suite navigation hub with device info
- `package.json` - Node.js dependencies for testing scripts

### Test Results & Data
- `../test-results/verification.log` - Latest verification results
- `../test-results/asset_verification_report.json` - Asset verification reports
- `../test-results/debug-mode-guide.md` - Debug mode documentation

## 🚀 Quick Test Commands (Essential for AI Agents)

### Primary AI Agent Verification
```bash
# From tests directory - essential for AI agents
cd tests && bash verify_tests.sh

# View results
cat ../test-results/verification.log
```

### Manual Testing (Recommended for Human Validation)
```bash
# Start development server first
python -m http.server 8000

# Then visit in browser:
http://localhost:8000/tests/              # Test suite navigation
http://localhost:8000/tests/test_mobile_expert.html  # Mobile-specific testing
```

### Node.js Testing (Optional)
```bash
# From tests directory
npm run verify    # Runs verify_tests.sh via npm
```

## 🎯 AI Agent Testing Workflow

### Before Making Changes
1. Establish baseline: `cd tests && bash verify_tests.sh`
2. Note any existing failures
3. Ensure HTTP server is running on port 8000

### After Making Changes  
1. **ALWAYS RUN**: `cd tests && bash verify_tests.sh`
2. Verify all core files load correctly
3. Check for HTTP errors in verification output
4. Review `../test-results/verification.log` for details

### For Complex Changes
1. **Manual verification recommended**: Use `test_mobile_expert.html` 
2. Test mobile viewport and interactions
3. Verify ScrollableHistoryManager functionality
4. Check touch interactions and responsive behavior

## 📱 Manual Testing Guidelines

### When to Use Manual Testing
- **UI/UX Changes**: Visual verification needed
- **Mobile Features**: Touch interactions, viewport behavior  
- **Complex Interactions**: Multi-step user flows
- **Final Validation**: Before considering work complete

### Recommended Manual Tests
1. **test_mobile_expert.html**: 
   - Mobile-specific functionality testing
   - ScrollableHistoryManager behavior
   - Touch interaction validation
   - Viewport and safe area testing

2. **index.html**:
   - Test suite navigation
   - Device information display
   - Quick access to all test files
   - Browser compatibility testing

## � File Descriptions

### verify_tests.sh
- **Purpose**: Primary AI agent verification tool
- **Checks**: HTTP server status, core file loading, basic functionality
- **Output**: Pass/fail status with detailed logging
- **Usage**: Run after every code change

### test_mobile_expert.html  
- **Purpose**: Mobile-specific testing and validation
- **Features**: ScrollableHistoryManager testing, mobile viewport simulation
- **Usage**: Manual testing recommended for mobile changes
- **Benefits**: Real mobile behavior testing, touch interaction validation

### index.html
- **Purpose**: Test suite navigation and browser testing
- **Features**: Device info display, test file navigation, compatibility testing
- **Usage**: Manual testing entry point
- **Benefits**: Organized access to all testing resources

## 📊 Test Results

All test results are stored in `../test-results/`:
- `verification.log` - Latest automated verification results  
- `asset_verification_report.json` - Asset validation data
- `debug-mode-guide.md` - Debug mode usage instructions

## 🚨 Common Issues

### HTTP Server Not Running
```bash
# Error: Development server not running on port 8000
# Solution:
python -m http.server 8000
```

### File Loading Errors
```bash
# Check verify_tests.sh output for specific files
# Common causes: typos in file paths, missing files, syntax errors
```

### Mobile Testing Issues  
```bash
# Use test_mobile_expert.html for mobile-specific debugging
# Check browser developer tools for viewport and touch issues
```

---

**Note**: This testing system is optimized for AI agent development workflows while maintaining manual testing capabilities for complex validation scenarios.

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
