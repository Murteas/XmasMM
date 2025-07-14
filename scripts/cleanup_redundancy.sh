#!/bin/bash
# cleanup_redundancy.sh - Prevent redundant file creation in XmasMM project
# Run this from PROJECT ROOT to check for and prevent common redundancy issues

echo "🧹 XmasMM Project Cleanup - Preventing Redundancy"
echo "================================================"

# Ensure we're in project root
if [ ! -f "README.md" ] || [ ! -d "tests" ]; then
    echo "❌ Must run from project root directory"
    echo "   Usage: bash scripts/cleanup_redundancy.sh"
    exit 1
fi

# Check for test files in wrong locations (exclude TESTING.md redirect)
echo "📁 Checking for test files in root directory..."
test_files_in_root=$(find . -maxdepth 1 -name "*test*" -type f ! -name "TESTING.md" | wc -l)
if [ "$test_files_in_root" -gt 0 ]; then
    echo "❌ Found test files in root directory:"
    find . -maxdepth 1 -name "*test*" -type f ! -name "TESTING.md"
    echo "   These should be moved to tests/ directory"
else
    echo "✅ No test files in root directory (TESTING.md redirect is OK)"
fi

# Check for duplicate documentation
echo ""
echo "📚 Checking for documentation redundancy..."

# Check for multiple testing docs
testing_docs=$(find . -name "*test*" -name "*.md" | wc -l)
if [ "$testing_docs" -gt 2 ]; then  # Allow TESTING.md + tests/README.md
    echo "❌ Multiple testing documentation files found:"
    find . -name "*test*" -name "*.md"
    echo "   Consider consolidating into tests/README.md"
else
    echo "✅ Testing documentation properly consolidated"
fi

# Check for temporary files
echo ""
echo "🗑️ Checking for temporary files..."
temp_files=$(find . -name "*tmp*" -o -name "*temp*" -o -name "*debug*.html" -o -name "*backup*" | grep -v tests/ | wc -l)
if [ "$temp_files" -gt 0 ]; then
    echo "❌ Found temporary files that should be cleaned up:"
    find . -name "*tmp*" -o -name "*temp*" -o -name "*debug*.html" -o -name "*backup*" | grep -v tests/
else
    echo "✅ No temporary files found"
fi

# Check for orphaned result files
echo ""
echo "📊 Checking for orphaned result files..."
result_files=$(find . -maxdepth 1 -name "*results*.json" -o -name "*test*.json" | wc -l)
if [ "$result_files" -gt 0 ]; then
    echo "❌ Found result files in root directory:"
    find . -maxdepth 1 -name "*results*.json" -o -name "*test*.json"
    echo "   These should be in tests/ directory"
else
    echo "✅ No orphaned result files in root"
fi

echo ""
echo "🎯 Cleanup Summary"
echo "=================="
if [ "$test_files_in_root" -le 1 ] && [ "$testing_docs" -le 2 ] && [ "$temp_files" -eq 0 ] && [ "$result_files" -eq 0 ]; then
    echo "✅ Project is clean - no redundancy detected"
    echo "✅ Following best practices for file organization"
else
    echo "⚠️  Some cleanup may be needed - see issues above"
fi

echo ""
echo "📖 Remember:"
echo "- Testing docs belong in tests/README.md"
echo "- Test files belong in tests/ directory"
echo "- Temporary files should be cleaned up"
echo "- Keep root directory focused on core project files"
