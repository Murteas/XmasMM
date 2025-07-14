#!/bin/bash
# verify_tests.sh - Simple script to verify test results

echo "🧪 Verifying test results..."

# Test the comprehensive page
echo "📋 Testing comprehensive test page..."
curl -s "http://localhost:8000/tests/test_comprehensive.html" > /tmp/comprehensive_test.html

# Check if the page loads properly
if grep -q "XmasMM Refactoring Integration Test" /tmp/comprehensive_test.html; then
    echo "✅ Comprehensive test page loads"
else
    echo "❌ Comprehensive test page failed to load"
fi

# Check module loader script reference
if grep -q "ModuleLoader.js" /tmp/comprehensive_test.html; then
    echo "✅ ModuleLoader reference found in comprehensive test"
else
    echo "❌ ModuleLoader reference missing in comprehensive test"
fi

# Test individual module files
echo "📋 Testing individual module accessibility..."
modules=(
    "js/utils/ModuleLoader.js"
    "js/utils/TestConfig.js"
    "js/utils/GameUtils.js"
    "js/managers/ScoreManager.js"
    "js/scenes/MainMenu.js"
)

for module in "${modules[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$module")
    if [ "$status" = "200" ]; then
        echo "✅ $module: HTTP $status"
    else
        echo "❌ $module: HTTP $status"
    fi
done

echo "🏁 Verification complete!"
