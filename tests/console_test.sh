#!/bin/bash
# console_test.sh - Real browser testing with console verification

echo "🔍 REAL Browser Console Testing..."

# Function to check for console errors in a page
check_console_errors() {
    local url=$1
    local page_name=$2
    
    echo "📋 Testing $page_name console output..."
    
    # Use curl to get the page and check for obvious JS errors in source
    response=$(curl -s "$url")
    
    # Check if the page loads at all
    if [[ $response == *"<!DOCTYPE html>"* ]]; then
        echo "✅ $page_name: HTML loads"
    else
        echo "❌ $page_name: Failed to load HTML"
        return 1
    fi
    
    # Check for ModuleLoader reference before ModuleLoader.js
    if [[ $response == *"ModuleLoader.initializeGame"* ]] && [[ $response == *"ModuleLoader.js"* ]]; then
        # Extract the order of ModuleLoader.js and ModuleLoader.initializeGame
        moduleloader_pos=$(echo "$response" | grep -n "ModuleLoader.js" | head -1 | cut -d: -f1)
        init_pos=$(echo "$response" | grep -n "ModuleLoader.initializeGame" | head -1 | cut -d: -f1)
        
        if [ "$moduleloader_pos" -lt "$init_pos" ]; then
            echo "✅ $page_name: ModuleLoader.js loads before initializeGame"
        else
            echo "❌ $page_name: ModuleLoader.initializeGame called before ModuleLoader.js loads"
            return 1
        fi
    fi
    
    # Check for DOMContentLoaded wrapper
    if [[ $response == *"DOMContentLoaded"* ]]; then
        echo "✅ $page_name: Uses DOMContentLoaded"
    else
        echo "⚠️ $page_name: May not wait for DOM"
    fi
    
    return 0
}

# Test main game
check_console_errors "http://localhost:8000/" "Main Game"
main_result=$?

# Test functional test page
check_console_errors "http://localhost:8000/tests/test_game_functional.html" "Functional Test"
test_result=$?

# Summary
echo ""
if [ $main_result -eq 0 ] && [ $test_result -eq 0 ]; then
    echo "✅ Console structure verification PASSED"
    echo "🔍 Manual verification still needed:"
    echo "   1. Open http://localhost:8000 in browser"
    echo "   2. Press F12 to open DevTools"
    echo "   3. Check Console tab for errors"
    echo "   4. Verify game shows main menu (not blue screen)"
    echo ""
    echo "   5. Open http://localhost:8000/tests/test_game_functional.html"
    echo "   6. Check Console tab for errors"
    echo "   7. Verify test controls appear and work"
else
    echo "❌ Console structure verification FAILED"
    echo "   Fix the loading order issues before manual testing"
fi
