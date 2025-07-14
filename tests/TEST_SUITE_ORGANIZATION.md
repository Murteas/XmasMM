# XmasMM Test Suite Organization

## Current Test Files

### Core Tests (Keep)
- **`index.html`** - Main test suite dashboard/launcher
- **`test_mobile_expert.html`** - **SIMPLIFIED** MOBILE-006 ScrollableHistoryManager testing
- **`test_mobile_evaluation.html`** - Mobile device evaluation framework
- **`test_comprehensive.html`** - Integration testing

### Specific Feature Tests (Keep)
- **`test_asset_loading.html`** - Asset loading verification
- **`test_canvas_optimization.html`** - Canvas performance testing
- **`test_debug_performance.html`** - Performance debugging

### Redundant/Old Files (Consider Removing)
- **`test_mobile_expert_old.html`** - ❌ **REMOVE** - Old complex version, now replaced
- **`test_mobile_scrollable.html`** - ❌ **REMOVE** - Duplicate of new mobile expert test
- **`debug_mobile_test.html`** - ❌ **REMOVE** - Simple debug test, functionality covered elsewhere
- **`modules_loader.js`** - ❌ **REMOVE** - Old approach, replaced by centralized ModuleLoader

## Simplified Architecture

### ✅ **What We Fixed:**
1. **MOBILE-006 Test Simplified**: Focused specifically on ScrollableHistoryManager testing
2. **Phaser Loading**: Fixed missing Phaser.js CDN script issue
3. **ModuleLoader Integration**: Proper centralized script loading
4. **Reduced Complexity**: Removed redundant device simulation and debugging functions

### 🎯 **test_mobile_expert.html Features:**
- ✅ Loads Phaser from CDN first
- ✅ Uses centralized ModuleLoader system
- ✅ Focused on MOBILE-006 ScrollableHistoryManager testing
- ✅ Simple device simulation (iPhone SE, XR, Pro Max)
- ✅ Three key test functions:
  - `startGameTest()` - Initialize game scene
  - `populateGameHistory()` - Add 9 test guesses
  - `testScrollingBehavior()` - Manual testing instructions

### 🧹 **Recommended Cleanup:**
```bash
# Remove redundant files
rm tests/test_mobile_expert_old.html
rm tests/test_mobile_scrollable.html
rm tests/debug_mobile_test.html
rm tests/modules_loader.js
```

## Testing Workflow

1. **MOBILE-006 Specific Testing**: Use `test_mobile_expert.html`
2. **General Mobile Testing**: Use `test_mobile_evaluation.html`
3. **Integration Testing**: Use `test_comprehensive.html`
4. **Performance Testing**: Use `test_debug_performance.html`

This creates a clean, focused test suite without redundancy.
