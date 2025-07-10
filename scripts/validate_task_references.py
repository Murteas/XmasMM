#!/usr/bin/env python3
"""
Validate and suggest updates for task file references after code refactoring.

This script checks that all file references in tasks.json are still valid
after the Task 5E refactoring that split large files into smaller modules.
"""

import json
import os
from pathlib import Path

def get_current_files():
    """Get list of all current JavaScript files in the project."""
    js_dir = Path("js")
    current_files = []
    
    if js_dir.exists():
        for js_file in js_dir.rglob("*.js"):
            current_files.append(str(js_file).replace("\\", "/"))
    
    return set(current_files)

def check_task_references():
    """Check all task references against current file structure."""
    with open("tasks.json", "r", encoding='utf-8') as f:
        tasks_data = json.load(f)
    
    current_files = get_current_files()
    issues = []
    suggestions = []
    
    for task_id, task in tasks_data["tasks"].items():
        if "deliverables" in task:
            for deliverable in task["deliverables"]:
                # Extract file path from deliverable string
                if " - " in deliverable:
                    file_part = deliverable.split(" - ")[0]
                    if file_part.endswith(".js"):
                        if file_part not in current_files:
                            issues.append({
                                "task": task_id,
                                "task_name": task["name"],
                                "missing_file": file_part,
                                "full_deliverable": deliverable
                            })
    
    print(f"Debug: Found {len(issues)} issues")
    for issue in issues:
        print(f"Debug: Issue in task {issue['task']}: {issue['missing_file']}")
    
    # Generate suggestions based on known refactoring
    refactoring_map = {
        "js/managers/HistoryManager.js": {
            "feedback": "js/managers/HistoryRenderer.js",
            "scroll": "js/managers/HistoryScroller.js", 
            "coordination": "js/managers/HistoryManager.js"
        }
    }
    
    for issue in issues:
        file_path = issue["missing_file"]
        deliverable = issue["full_deliverable"]
        
        if file_path in refactoring_map:
            # Suggest based on content
            if "feedback" in deliverable.lower() or "display" in deliverable.lower():
                suggestion = deliverable.replace(file_path, refactoring_map[file_path]["feedback"])
            elif "scroll" in deliverable.lower():
                suggestion = deliverable.replace(file_path, refactoring_map[file_path]["scroll"])
            else:
                suggestion = deliverable.replace(file_path, refactoring_map[file_path]["coordination"])
            
            suggestions.append({
                "task": issue["task"],
                "task_name": issue["task_name"],
                "original": deliverable,
                "suggested": suggestion,
                "reason": f"After Task 5E refactoring, {file_path} was split into specialized modules"
            })
    
    return issues, suggestions

def main():
    print("🔍 Validating Task References After Refactoring")
    print("=" * 50)
    
    issues, suggestions = check_task_references()
    
    if not issues:
        print("✅ All task file references are valid!")
        return
    
    print(f"❌ Found {len(issues)} task reference issues:")
    print()
    
    for suggestion in suggestions:
        print(f"📋 Task {suggestion['task']}: {suggestion['task_name']}")
        print(f"   Original:  {suggestion['original']}")
        print(f"   Suggested: {suggestion['suggested']}")
        print(f"   Reason:    {suggestion['reason']}")
        print()
    
    print("💡 Recommendation:")
    print("Update the deliverables in tasks.json with the suggested file references")
    print("to match the new modular code structure created in Task 5E.")

if __name__ == "__main__":
    main()
