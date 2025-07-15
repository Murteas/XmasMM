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

# Check for test files in wrong locations
echo "📁 Checking for test files in root directory..."
test_files_in_root=$(find . -maxdepth 1 -name "*test*" -type f | wc -l)
if [ "$test_files_in_root" -gt 0 ]; then
    echo "❌ Found test files in root directory:"
    find . -maxdepth 1 -name "*test*" -type f
    echo "   These should be moved to tests/ directory"
else
    echo "✅ No test files in root directory"
fi

# Check for duplicate documentation
echo ""
echo "📚 Checking for documentation redundancy..."

# Check for multiple testing docs
testing_docs=$(find . -name "*test*" -name "*.md" | wc -l)
if [ "$testing_docs" -gt 1 ]; then  # Allow only tests/README.md
    echo "❌ Multiple testing documentation files found:"
    find . -name "*test*" -name "*.md"
    echo "   Should only have tests/README.md"
else
    echo "✅ Testing documentation properly consolidated"
fi

# Check for temporary files
echo ""
echo "🗑️ Checking for temporary files..."
temp_files=$(find . -name "*tmp*" -o -name "*temp*" -o -name "*debug*.html" -o -name "*backup*" | grep -v tests/ | grep -v .venv | wc -l)
if [ "$temp_files" -gt 0 ]; then
    echo "❌ Found temporary files that should be cleaned up:"
    find . -name "*tmp*" -o -name "*temp*" -o -name "*debug*.html" -o -name "*backup*" | grep -v tests/ | grep -v .venv
else
    echo "✅ No temporary files found"
fi

# Check for orphaned result files
echo ""
echo "📊 Checking for orphaned result files..."
result_files=$(find . -maxdepth 1 -name "*results*.json" -o -name "*test*.json" -o -name "*.log" | wc -l)
if [ "$result_files" -gt 0 ]; then
    echo "❌ Found result files in root directory:"
    find . -maxdepth 1 -name "*results*.json" -o -name "*test*.json" -o -name "*.log"
    echo "   These should be in test-results/ directory"
else
    echo "✅ No orphaned result files in root"
fi

# Clean up old test-results files (older than 1 days)
echo ""
echo "🧽 Cleaning up old test-results files..."
if [ -d "test-results" ]; then
    old_files=$(find test-results/ -name "*.log" -mtime +7 2>/dev/null | wc -l)
    if [ "$old_files" -gt 0 ]; then
        echo "🗑️ Removing $old_files old log files..."
        find test-results/ -name "*.log" -mtime +1 -delete 2>/dev/null
        echo "✅ Old log files cleaned up"
    else
        echo "✅ No old log files to clean up"
    fi
    
    # Keep only essential recent files
    recent_count=$(find test-results/ -name "*.log" | wc -l)
    if [ "$recent_count" -gt 10 ]; then
        echo "⚠️ Many recent log files ($recent_count) - consider manual cleanup"
    fi
else
    echo "ℹ️ No test-results directory found"
fi

echo ""
echo "🎯 Cleanup Summary"
echo "=================="
if [ "$test_files_in_root" -eq 0 ] && [ "$testing_docs" -le 1 ] && [ "$temp_files" -eq 0 ] && [ "$result_files" -eq 0 ]; then
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
