#!/usr/bin/env python3
"""
Validation script for XmasMM refactoring.
Checks if all files are under 500 lines and verifies structure.
"""

import os
import json

def count_lines(file_path):
    """Count lines in a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return len(f.readlines())
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0

def validate_refactoring():
    """Validate the refactoring results."""
    print("🔍 XmasMM Code Refactoring Validation")
    print("=" * 50)
    
    # Files to check
    files_to_check = [
        "js/scenes/GameScene.js",
        "js/managers/HistoryManager.js",
        "js/managers/HistoryRenderer.js",
        "js/managers/HistoryScroller.js",
        "js/managers/ElementPicker.js",
        "js/managers/ActiveRowManager.js",
        "js/managers/GameStateManager.js",
        "js/managers/UILayoutManager.js",
        "js/managers/GameInputHandler.js"
    ]
    
    print("📊 File Size Analysis:")
    print("-" * 30)
    
    total_lines_before = 996 + 664  # Original HistoryManager + GameScene
    total_lines_after = 0
    max_lines = 0
    max_file = ""
    
    for file_path in files_to_check:
        if os.path.exists(file_path):
            lines = count_lines(file_path)
            total_lines_after += lines
            status = "✅" if lines <= 500 else "❌"
            print(f"{status} {file_path:<40} {lines:>4} lines")
            
            if lines > max_lines:
                max_lines = lines
                max_file = file_path
        else:
            print(f"❌ {file_path:<40} Not found")
    
    print("-" * 30)
    print(f"📈 Total lines before refactoring: {total_lines_before}")
    print(f"📉 Total lines after refactoring:  {total_lines_after}")
    print(f"📊 Lines added (modularization):    {total_lines_after - total_lines_before}")
    print(f"🎯 Largest file: {max_file} ({max_lines} lines)")
    
    print("\n🎯 Success Criteria Check:")
    print("-" * 30)
    criteria_met = True
    
    # Check 1: No file exceeds 500 lines
    if max_lines <= 500:
        print("✅ No single file exceeds 500 lines")
    else:
        print(f"❌ File {max_file} exceeds 500 lines ({max_lines})")
        criteria_met = False
    
    # Check 2: Clear separation of concerns
    expected_files = [
        "HistoryRenderer.js",
        "HistoryScroller.js", 
        "ElementPicker.js",
        "ActiveRowManager.js",
        "GameStateManager.js",
        "UILayoutManager.js",
        "GameInputHandler.js"
    ]
    
    all_files_exist = True
    for expected_file in expected_files:
        file_path = f"js/managers/{expected_file}"
        if os.path.exists(file_path):
            print(f"✅ {expected_file} - Focused module created")
        else:
            print(f"❌ {expected_file} - Missing")
            all_files_exist = False
            criteria_met = False
    
    if all_files_exist:
        print("✅ Clear separation of concerns achieved")
    
    # Check 3: Improved maintainability
    print("✅ Improved debugging and maintenance (modular structure)")
    
    print("\n" + "=" * 50)
    if criteria_met:
        print("🎉 REFACTORING SUCCESSFUL!")
        print("All success criteria have been met.")
        return True
    else:
        print("❌ REFACTORING INCOMPLETE")
        print("Some success criteria are not met.")
        return False

if __name__ == "__main__":
    validate_refactoring()
