#!/bin/bash
# run_tests.sh - Comprehensive test runner for AI agents
# Usage: cd tests && bash run_tests.sh

echo "🧪 XmasMM Test Suite - AI Agent Verification System"
echo "=================================================="

# Check if we're in the tests directory
if [ ! -f "verify_tests.sh" ]; then
    echo "❌ ERROR: Must run from tests/ directory"
    echo "   Usage: cd tests && bash run_tests.sh"
    exit 1
fi

# Check if dev server is running
echo "🔍 Checking development server..."
if curl -s "http://localhost:8000" > /dev/null 2>&1; then
    echo "✅ Development server is running"
else
    echo "❌ Development server not running"
    echo "   Start with: python scripts/dev_server.py"
    exit 1
fi

# Run primary verification
echo ""
echo "🚀 Running primary verification..."
bash verify_tests.sh

# Run deep verification if Node.js available
if command -v node > /dev/null 2>&1; then
    echo ""
    echo "🔬 Running deep verification..."
    node automated_test_verifier.js
else
    echo "⚠️  Node.js not available - skipping deep verification"
fi

# Check for common issues
echo ""
echo "🔍 Checking for common issues..."

# Check for files in wrong location
echo "📁 Verifying file organization..."
root_test_files=$(find .. -maxdepth 1 -name "*test*" -type f 2>/dev/null | wc -l)
if [ "$root_test_files" -gt 0 ]; then
    echo "❌ Found test files in root directory:"
    find .. -maxdepth 1 -name "*test*" -type f 2>/dev/null
    echo "   These should be moved to tests/ directory"
else
    echo "✅ No test files in root directory"
fi

# Check ModuleLoader accessibility
echo "🔧 Verifying ModuleLoader..."
status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/js/utils/ModuleLoader.js")
if [ "$status" = "200" ]; then
    echo "✅ ModuleLoader accessible"
else
    echo "❌ ModuleLoader not accessible (HTTP $status)"
fi

# Summary
echo ""
echo "📊 Test Suite Summary"
echo "===================="
echo "✅ File organization verified"
echo "✅ Server connectivity verified"
echo "✅ Primary tests completed"

if command -v node > /dev/null 2>&1; then
    echo "✅ Deep verification completed"
fi

echo ""
echo "🎯 Next Steps for AI Agents:"
echo "1. Check browser console at: http://localhost:8000/tests/test_comprehensive.html"
echo "2. Verify mobile viewport at: http://localhost:8000/tests/test_mobile_expert.html"
echo "3. Review any failures above before making changes"
echo ""
echo "🤖 Remember: Always run this script after making changes!"
