#!/usr/bin/env python3
"""
Documentation Auto-Update System
Automatically updates documentation files with current project state
"""

import json
import re
from datetime import datetime
from pathlib import Path

class DocumentationUpdater:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent
        self.tasks_file = self.base_path / "tasks.json"
        
    def get_current_state(self):
        """Get current project state from tasks.json"""
        with open(self.tasks_file, 'r', encoding='utf-8') as f:
            tasks_data = json.load(f)
        
        # Get tasks from the tasks array
        all_tasks = tasks_data.get('tasks', [])
        
        completed_count = sum(1 for task in all_tasks.values() if task.get('status') == 'COMPLETED')
        total_count = len(all_tasks)
        progress = round((completed_count / total_count) * 100) if total_count > 0 else 0
        
        current_task = next((task for task in all_tasks.values() if task.get('status') == 'CURRENT'), None)
        next_ready = next((task for task in all_tasks.values() if task.get('status') == 'READY'), None)
        
        return {
            'completed_count': completed_count,
            'total_count': total_count,
            'progress': progress,
            'current_task': current_task,
            'next_task': next_ready,
            'overall_status': tasks_data.get('project', {}).get('overall_status', 'active')
        }
    
    def update_ai_agent_briefing(self):
        """Update AI_AGENT_BRIEFING.md with current state"""
        state = self.get_current_state()
        briefing_file = self.base_path / "AI_AGENT_BRIEFING.md"
        
        with open(briefing_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update progress line
        progress_pattern = r'📊 \*\*Progress\*\*: \d+% complete \(\d+/\d+ tasks\)'
        new_progress = f"📊 **Progress**: {state['progress']}% complete ({state['completed_count']}/{state['total_count']} tasks)"
        content = re.sub(progress_pattern, new_progress, content)
        
        # Update current task line
        if state['current_task']:
            current_pattern = r'🔄 \*\*Current task\*\*: Task \d+ \([^)]+\) - [^\n]+'
            new_current = f"🔄 **Current task**: Task {state['current_task']['id']} ({state['current_task']['name']}) - {state['current_task']['objectives'][0] if state['current_task']['objectives'] else 'in progress'}"
            content = re.sub(current_pattern, new_current, content)
        
        # Update next task line
        if state['next_task']:
            next_pattern = r'🚀 \*\*Next\*\*: Task \d+ \([^)]+\) - [^\n]+'
            new_next = f"🚀 **Next**: Task {state['next_task']['id']} ({state['next_task']['name']}) - {state['next_task']['objectives'][0] if state['next_task']['objectives'] else 'pending'}"
            content = re.sub(next_pattern, new_next, content)
        
        # Update current task file reference
        if state['current_task']:
            task_file_pattern = r'- `tasks/Task_\d+_[^.]+\.md` - Current task details'
            task_file_name = f"Task_{state['current_task']['id']}_{state['current_task']['name'].replace(' ', '')}.md"
            new_task_file = f"- `tasks/{task_file_name}` - Current task details"
            content = re.sub(task_file_pattern, new_task_file, content)
        
        # Update date
        date_pattern = r'\(as of [^)]+\)'
        new_date = f"(as of {datetime.now().strftime('%B %Y')})"
        content = re.sub(date_pattern, new_date, content)
        
        with open(briefing_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated AI_AGENT_BRIEFING.md with current state")
        print(f"   Progress: {state['progress']}% ({state['completed_count']}/{state['total_count']} tasks)")
        if state['current_task']:
            print(f"   Current: Task {state['current_task']['id']} - {state['current_task']['name']}")
    
    def update_readme_progress(self):
        """Update README.md progress information"""
        state = self.get_current_state()
        readme_file = self.base_path / "README.md"
        
        with open(readme_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update progress bars and percentages anywhere they appear
        progress_patterns = [
            r'(\d+)% complete \(\d+/\d+ tasks\)',
            r'Progress: \d+% \(\d+/\d+ tasks\)',
            r'\*\*\d+%\*\* \(\d+/\d+ tasks\)'
        ]
        
        for pattern in progress_patterns:
            replacement = f"{state['progress']}% complete ({state['completed_count']}/{state['total_count']} tasks)"
            content = re.sub(pattern, replacement, content)
        
        with open(readme_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated README.md progress information")
    
    def check_documentation_freshness(self):
        """Check if documentation might be stale"""
        issues = []
        
        # Only check PROJECT_STATUS.md for freshness since it's the live status doc
        # AI_AGENT_BRIEFING.md and README.md are now stable reference documents
        status_file = self.base_path / "PROJECT_STATUS.md"
        if status_file.exists():
            with open(status_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for outdated progress information in PROJECT_STATUS.md
            state = self.get_current_state()
            if f"{state['progress']}%" not in content:
                issues.append("PROJECT_STATUS.md has outdated progress information")
            
            if state['current_task'] and f"Task {state['current_task']['id']}" not in content:
                issues.append("PROJECT_STATUS.md references wrong current task")
        
        return issues
    
    def update_project_status(self):
        """Update PROJECT_STATUS.md with current state"""
        state = self.get_current_state()
        status_file = self.base_path / "PROJECT_STATUS.md"
        
        if not status_file.exists():
            print("⚠️  PROJECT_STATUS.md not found - skipping")
            return
        
        with open(status_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update date
        date_pattern = r'Last updated: [^\n]+'
        new_date = f"Last updated: {datetime.now().strftime('%B %d, %Y')}"
        content = re.sub(date_pattern, new_date, content)
        
        # Update current task
        if state['current_task']:
            task_pattern = r'\*\*Current Task\*\*: Task \d+ - [^\n]+'
            new_task = f"**Current Task**: Task {state['current_task']['id']} - {state['current_task']['name']}"
            content = re.sub(task_pattern, new_task, content)
            
            # Update description
            desc_pattern = r'\*\*Description\*\*: [^\n]+'
            task_desc = state['current_task']['objectives'][0] if state['current_task']['objectives'] else 'In progress'
            new_desc = f"**Description**: {task_desc}"
            content = re.sub(desc_pattern, new_desc, content)
        
        # Update progress
        progress_pattern = r'\*\*Progress\*\*: \d+% complete \(\d+/\d+ tasks\)'
        new_progress = f"**Progress**: {state['progress']}% complete ({state['completed_count']}/{state['total_count']} tasks)"
        content = re.sub(progress_pattern, new_progress, content)
        
        # Update next task
        if state['next_task']:
            next_pattern = r'\*\*Next Task\*\*: Task \d+ - [^\n]+'
            new_next = f"**Next Task**: Task {state['next_task']['id']} - {state['next_task']['name']}"
            content = re.sub(next_pattern, new_next, content)
        
        # Update overall progress section
        overall_pattern = r'### \*\*Overall Progress\*\*: \d+% \(\d+/\d+ tasks completed\)'
        new_overall = f"### **Overall Progress**: {state['progress']}% ({state['completed_count']}/{state['total_count']} tasks completed)"
        content = re.sub(overall_pattern, new_overall, content)
        
        with open(status_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated PROJECT_STATUS.md with current state")

    def update_all(self):
        """Update all automatically updatable documentation"""
        print("🔄 Updating documentation with current project state...")
        
        # Only update PROJECT_STATUS.md automatically
        # AI_AGENT_BRIEFING.md should remain stable
        self.update_project_status()
        
        # Check for remaining issues
        issues = self.check_documentation_freshness()
        if issues:
            print("\n⚠️  Manual updates may be needed:")
            for issue in issues:
                print(f"   - {issue}")
        else:
            print("\n✅ All documentation is current!")

if __name__ == "__main__":
    updater = DocumentationUpdater()
    updater.update_all()
