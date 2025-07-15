#!/bin/bash
# verify_tests.sh - Functional game testing

echo "🧪 XmasMM Functional Testing..."

# Check if server is running
echo "📡 Checking development server..."
if ! curl -s "http://localhost:8000" > /dev/null; then
    echo "❌ Development server not running on port 8000"
    echo "   Please start with: python -m http.server 8000"
    exit 1
fi
echo "✅ Development server running"

# Test main game loading
echo "📋 Testing main game (index.html)..."
response=$(curl -s -w "%{http_code}" -o /tmp/main_game.html "http://localhost:8000/")
if [ "$response" != "200" ]; then
    echo "❌ Main game failed to load (HTTP $response)"
    exit 1
fi

if grep -q "ModuleLoader.js" /tmp/main_game.html; then
    echo "✅ Main game loads with ModuleLoader"
else
    echo "❌ Main game missing ModuleLoader"
    exit 1
fi

# Test functional game test page
echo "📋 Testing functional test page..."
response=$(curl -s -w "%{http_code}" -o /tmp/functional_test.html "http://localhost:8000/tests/test_game_functional.html")
if [ "$response" != "200" ]; then
    echo "❌ Functional test page failed to load (HTTP $response)"
    exit 1
fi

if grep -q "Game Test Controls" /tmp/functional_test.html; then
    echo "✅ Functional test page loads correctly"
else
    echo "❌ Functional test page malformed"
    exit 1
fi

# Test critical JavaScript files
echo "📋 Testing critical JavaScript modules..."
critical_files=(
    "js/utils/ModuleLoader.js"
    "js/managers/ScoreManager.js"
    "js/scenes/MainMenu.js"
    "js/scenes/GameScene.js"
)

for file in "${critical_files[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$file")
    if [ "$status" = "200" ]; then
        echo "✅ $file: HTTP $status"
    else
        echo "❌ $file: HTTP $status - CRITICAL MODULE MISSING"
        exit 1
    fi
done

echo ""
echo "� Basic tests PASSED!"
echo "📱 For runtime testing, open: http://localhost:8000/tests/test_game_functional.html"
echo "🎮 For manual testing, open: http://localhost:8000"
echo ""
echo "💡 The functional test page will:"
echo "   - Test game initialization"
echo "   - Test scene transitions" 
echo "   - Test ScoreManager functionality"
echo "   - Test mobile UI basics"
echo "   - Show detailed error logs"
echo ""
