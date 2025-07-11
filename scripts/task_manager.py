#!/usr/bin/env python3
"""
Task Update Script for AI Agents

Provides simple functions for AI agents to update task status in tasks.json
"""

import json
import datetime
from typing import List, Dict, Optional

class TaskManager:
    def __init__(self, tasks_file: str = 'tasks.json'):
        self.tasks_file = tasks_file
        self.data = self._load_tasks()
    
    def _load_tasks(self) -> Dict:
        """Load tasks from JSON file"""
        with open(self.tasks_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _save_tasks(self):
        """Save tasks to JSON file"""
        self.data['project']['lastUpdated'] = datetime.datetime.now().isoformat()
        with open(self.tasks_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2)
    
    def get_current_task(self) -> Dict:
        """Get the current active task"""
        active_id = self.data['currentState']['activeTask']
        return self.data['tasks'][active_id]
    
    def get_next_task(self) -> Optional[Dict]:
        """Get the next task to work on"""
        next_id = self.data['currentState']['nextTask']
        return self.data['tasks'][next_id] if next_id else None
    
    def get_ready_tasks(self) -> List[Dict]:
        """Get all tasks that are ready to start (dependencies satisfied)"""
        ready_tasks = []
        for task_id, task in self.data['tasks'].items():
            if task['status'] == 'READY':
                ready_tasks.append(task)
        return ready_tasks
    
    def complete_task(self, task_id: str, notes: Optional[str] = None) -> bool:
        """Mark a task as completed"""
        if task_id not in self.data['tasks']:
            return False
        
        task = self.data['tasks'][task_id]
        task['status'] = 'COMPLETED'
        task['completedAt'] = datetime.datetime.now().isoformat()
        
        if notes:
            task['completionNotes'] = notes
        
        # Update dependent tasks to READY if their dependencies are satisfied
        self._update_dependent_tasks(task_id)
        
        # Update current state
        self._update_current_state()
        
        self._save_tasks()
        return True
    
    def start_task(self, task_id: str) -> bool:
        """Start working on a task"""
        if task_id not in self.data['tasks']:
            return False
        
        task = self.data['tasks'][task_id]
        
        # Check if dependencies are satisfied
        if not self._dependencies_satisfied(task_id):
            return False
        
        task['status'] = 'CURRENT'
        task['startedAt'] = datetime.datetime.now().isoformat()
        
        # Update current state
        self.data['currentState']['activeTask'] = task_id
        
        self._save_tasks()
        return True
    
    def _dependencies_satisfied(self, task_id: str) -> bool:
        """Check if all dependencies for a task are completed"""
        task = self.data['tasks'][task_id]
        for dep_id in task['dependencies']:
            if self.data['tasks'][dep_id]['status'] != 'COMPLETED':
                return False
        return True
    
    def _update_dependent_tasks(self, completed_task_id: str):
        """Update tasks that depend on the completed task"""
        for task_id, task in self.data['tasks'].items():
            if completed_task_id in task['dependencies']:
                if self._dependencies_satisfied(task_id) and task['status'] == 'PENDING':
                    task['status'] = 'READY'
    
    def _update_current_state(self):
        """Update the current state based on task statuses"""
        # Find next task to work on
        ready_tasks = [t for t in self.data['tasks'].values() if t['status'] == 'READY']
        if ready_tasks:
            # Sort by priority and take the highest priority task
            next_task = min(ready_tasks, key=lambda x: x['priority'])
            self.data['currentState']['nextTask'] = next_task['id']
        else:
            self.data['currentState']['nextTask'] = None
        
        # Update overall progress
        completed = len([t for t in self.data['tasks'].values() if t['status'] == 'COMPLETED'])
        total = len(self.data['tasks'])
        self.data['currentState']['overallProgress'] = {
            'completed': completed,
            'total': total,
            'percentage': round((completed / total) * 100)
        }
    
    def get_task_summary(self, task_id: str) -> str:
        """Get a summary of a task for AI consumption"""
        task = self.data['tasks'][task_id]
        
        summary = f"""Task {task['id']}: {task['name']}
Status: {task['status']}
Priority: {task['priority']}
Phase: {task['phase']}
Description: {task['description']}

Objectives:
{chr(10).join([f"- {obj}" for obj in task['objectives']])}

Success Criteria:
{chr(10).join([f"- {criteria}" for criteria in task['successCriteria']])}

Dependencies: {', '.join(task['dependencies']) if task['dependencies'] else 'None'}
Dependents: {', '.join(task['dependents']) if task['dependents'] else 'None'}
"""
        
        if 'estimatedHours' in task:
            summary += f"Estimated Hours: {task['estimatedHours']}"
        
        return summary
    
    def validate_state(self) -> List[str]:
        """Validate current state and return any issues"""
        issues = []
        
        # Check dependency satisfaction
        for task_id, task in self.data['tasks'].items():
            if task['status'] in ['CURRENT', 'READY']:
                for dep_id in task['dependencies']:
                    if self.data['tasks'][dep_id]['status'] != 'COMPLETED':
                        issues.append(f"Task {task_id} has unsatisfied dependency: {dep_id}")
        
        # Check that only one task is CURRENT
        current_tasks = [t for t in self.data['tasks'].values() if t['status'] == 'CURRENT']
        if len(current_tasks) > 1:
            issues.append(f"Multiple tasks marked as CURRENT: {[t['id'] for t in current_tasks]}")
        elif len(current_tasks) == 0:
            issues.append("No task marked as CURRENT")
        
        return issues

# Helper functions for AI agents
def get_current_task_info() -> Dict:
    """Simple function to get current task information"""
    tm = TaskManager()
    return tm.get_current_task()

def complete_current_task(notes: Optional[str] = None) -> bool:
    """Simple function to complete the current task"""
    tm = TaskManager()
    current_task = tm.get_current_task()
    return tm.complete_task(current_task['id'], notes)

def start_next_task() -> bool:
    """Simple function to start the next ready task"""
    tm = TaskManager()
    next_task = tm.get_next_task()
    if next_task:
        return tm.start_task(next_task['id'])
    return False

def get_project_status() -> Dict:
    """Get overall project status"""
    tm = TaskManager()
    return tm.data['currentState']

if __name__ == "__main__":
    # Example usage
    tm = TaskManager()
    print("Current Task:")
    print(tm.get_task_summary(tm.get_current_task()['id']))
    
    issues = tm.validate_state()
    if issues:
        print("\nValidation Issues:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("\n✅ State is valid")
