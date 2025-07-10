#!/usr/bin/env python3
"""
Task Status Generator for XmasMM Project

Reads the machine-readable tasks.json and generates human-readable documentation.
This ensures consistency between AI-readable data and human documentation.
"""

import json
import datetime
from pathlib import Path

def load_tasks():
    """Load the task registry from tasks.json"""
    with open('tasks.json', 'r') as f:
        return json.load(f)

def get_current_status(data):
    """Get current project status"""
    current = data['currentState']
    active_task = data['tasks'][current['activeTask']]
    
    return {
        'activeTask': active_task,
        'nextTask': data['tasks'][current['nextTask']] if current['nextTask'] else None,
        'progress': current['overallProgress'],
        'phase': current['currentPhase']
    }

def generate_readme_status(data):
    """Generate the Current Status section for README"""
    status = get_current_status(data)
    active = status['activeTask']
    next_task = status['nextTask']
    progress = status['progress']
    
    return f"""## ✨ Current Status
🎉 **Mobile foundation complete!** Ready for Christmas feature implementation.
- ✅ **Complete viewport utilization** (100vw x 100vh) for maximum screen usage
- ✅ All Christmas graphics assets ready (6 game elements + 3 feedback symbols)
- ✅ Family-friendly UX with Santa's hints
- ✅ **Complete**: All mobile polish tasks (5A-5D) finished!
- 🔄 **Current**: Task {active['id']} - {active['name']} ({progress['completed']}/{progress['total']} tasks complete)
- 🚀 **Next**: Task {next_task['id']} - {next_task['name']} (assets ready!)

**Overall Progress**: {progress['percentage']}% complete ({progress['completed']}/{progress['total']} tasks)"""

def generate_task_list(data):
    """Generate task list with current status"""
    output = ["## 📋 Task Status Overview\n"]
    
    for phase_id, phase in data['phases'].items():
        status_emoji = "✅" if phase['status'] == 'COMPLETED' else "🔄" if phase['status'] == 'CURRENT' else "📋"
        output.append(f"### {status_emoji} {phase['name']} - {phase['status']}")
        
        for task_id in phase['tasks']:
            task = data['tasks'][task_id]
            task_emoji = "✅" if task['status'] == 'COMPLETED' else "🔄" if task['status'] == 'CURRENT' else "🚀" if task['status'] == 'READY' else "📋"
            output.append(f"- {task_emoji} **Task {task['id']}**: {task['name']} - *{task['status']}*")
            
            if task['status'] == 'CURRENT':
                output.append(f"  - 📝 {task['description']}")
                if 'estimatedHours' in task:
                    output.append(f"  - ⏱️ Estimated: {task['estimatedHours']} hours")
        
        output.append("")
    
    return "\n".join(output)

def validate_dependencies(data):
    """Validate that task dependencies are satisfied"""
    issues = []
    
    for task_id, task in data['tasks'].items():
        if task['status'] in ['CURRENT', 'READY']:
            for dep_id in task['dependencies']:
                dep_task = data['tasks'][dep_id]
                if dep_task['status'] != 'COMPLETED':
                    issues.append(f"Task {task_id} depends on incomplete task {dep_id}")
    
    return issues

def update_validation(data):
    """Update validation status"""
    data['validation']['lastValidated'] = datetime.datetime.now().isoformat()
    data['validation']['issues'] = validate_dependencies(data)
    return data

def main():
    """Main function to generate status reports"""
    data = load_tasks()
    
    # Validate dependencies
    data = update_validation(data)
    
    # Save updated validation
    with open('tasks.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    # Generate status report
    print("=== XmasMM Project Status ===")
    print(generate_readme_status(data))
    print("\n" + generate_task_list(data))
    
    if data['validation']['issues']:
        print("⚠️ **Validation Issues:**")
        for issue in data['validation']['issues']:
            print(f"  - {issue}")
    else:
        print("✅ **All dependencies satisfied**")
    
    # Show current task details
    current_task = data['tasks'][data['currentState']['activeTask']]
    print(f"\n🔄 **Current Task Details:**")
    print(f"**Task {current_task['id']}: {current_task['name']}**")
    print(f"Status: {current_task['status']}")
    print(f"Description: {current_task['description']}")
    print(f"Priority: {current_task['priority']}")
    if 'estimatedHours' in current_task:
        print(f"Estimated Hours: {current_task['estimatedHours']}")
    
    print(f"\n📋 **Objectives:**")
    for obj in current_task['objectives']:
        print(f"  - {obj}")
    
    print(f"\n🎯 **Success Criteria:**")
    for criteria in current_task['successCriteria']:
        print(f"  - {criteria}")

if __name__ == "__main__":
    main()
