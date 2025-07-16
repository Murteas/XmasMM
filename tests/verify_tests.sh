#!/bin/bash
# verify_tests.sh - Simple game verification

echo "🧪 XmasMM Verification..."

# Check if server is running
echo "📡 Checking development server..."
if ! curl -s "http://localhost:8000" > /dev/null; then
    echo "❌ Development server not running on port 8000"
    echo "   Please start with: python -m http.server 8000"
    exit 1
fi
echo "✅ Development server running"

# Test main game loads
echo "📋 Testing main game..."
response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:8000/")
if [ "$response" = "200" ]; then
    echo "✅ Main game loads (HTTP $response)"
else
    echo "❌ Main game failed (HTTP $response)"
    exit 1
fi

# Test critical files
echo "📋 Testing JavaScript files..."
files=("js/utils/ModuleLoader.js" "js/scenes/MainMenu.js" "js/scenes/GameScene.js")
for file in "${files[@]}"; do
    response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:8000/$file")
    if [ "$response" = "200" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (HTTP $response)"
        exit 1
    fi
done

echo "✅ All tests passed!"
echo "🎮 Manual test: http://localhost:8000"
echo "💡 Test checklist:"
echo "   - Game loads and shows main menu"  
echo "   - How to Play shows help with real images"
echo "   - Start Game works on mobile and desktop"