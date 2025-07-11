#!/usr/bin/env python3
"""
Task File Status Sync

Updates individual task .md files to reflect current status from tasks.json
"""

import json
import os
import re
from pathlib import Path

def sync_task_files():
    """Sync task file status with tasks.json"""
    
    # Load tasks.json
    with open('tasks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    tasks_dir = Path('tasks')
    updated_files = []
    
    for task_id, task_data in data['tasks'].items():
        # Find corresponding task file
        task_files = list(tasks_dir.glob(f"Task_{task_id}_*.md"))
        
        if not task_files:
            print(f"⚠️ No file found for task {task_id}")
            continue
            
        task_file = task_files[0]
        
        # Read current content
        with open(task_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determine status emoji
        status_map = {
            'COMPLETED': '✅ COMPLETED',
            'CURRENT': '🔄 CURRENT', 
            'READY': '🚀 READY',
            'PENDING': '📋 PENDING'
        }
        
        new_status = status_map.get(task_data['status'], f"❓ {task_data['status']}")
        
        # Add dependency info for blocked tasks
        if task_data['status'] == 'READY' and task_data['dependencies']:
            dep_str = ', '.join(task_data['dependencies'])
            new_status += f" (depends on {dep_str})"
        elif task_data['status'] == 'PENDING' and task_data['dependencies']:
            incomplete_deps = []
            for dep_id in task_data['dependencies']:
                if data['tasks'][dep_id]['status'] != 'COMPLETED':
                    incomplete_deps.append(dep_id)
            if incomplete_deps:
                dep_str = ', '.join(incomplete_deps)
                new_status += f" (blocked by {dep_str})"
        
        # Update status line
        status_pattern = r'\*\*Status\*\*:.*?(?=\n\*\*|\n>|\n\n|$)'
        status_replacement = f"**Status**: {new_status}  "
        
        if '**Status**:' in content:
            content = re.sub(status_pattern, status_replacement, content, flags=re.DOTALL)
        else:
            # Insert status after title
            lines = content.split('\n')
            if len(lines) > 1:
                lines.insert(2, f"\n**Status**: {new_status}")
                content = '\n'.join(lines)
        
        # Add automation reference if not present
        automation_note = "> 📊 **Note**: Status managed in [tasks.json](../tasks.json). Use `python scripts/automation.py status` for current state."
        
        if "tasks.json" not in content:
            # Find insertion point after status
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if '**Status**:' in line:
                    lines.insert(i + 2, automation_note)
                    lines.insert(i + 3, "")
                    break
            content = '\n'.join(lines)
        
        # Write updated content
        with open(task_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        updated_files.append(f"Task {task_id}: {task_data['status']}")
    
    print("✅ Task files synchronized with tasks.json")
    for update in updated_files:
        print(f"  - {update}")

if __name__ == "__main__":
    sync_task_files()
