#!/usr/bin/env python3
"""
README Updater - Updates README.md from tasks.json

This ensures the README always reflects the current state in tasks.json
"""

import json
import re

def update_readme_from_tasks():
    """Update README.md with current status from tasks.json"""
    
    # Load task data
    with open('tasks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Read current README
    with open('README.md', 'r', encoding='utf-8') as f:
        readme_content = f.read()
    
    # Get current status
    current_state = data['currentState']
    active_task = data['tasks'][current_state['activeTask']]
    next_task = data['tasks'][current_state['nextTask']] if current_state['nextTask'] else None
    progress = current_state['overallProgress']
    
    # Generate new status section
    new_status = f"""## ✨ Current Status
🎉 **Mobile foundation complete!** Ready for Christmas feature implementation.
- ✅ **Complete viewport utilization** (100vw x 100vh) for maximum screen usage
- ✅ All Christmas graphics assets ready (6 game elements + 3 feedback symbols)
- ✅ Family-friendly UX with Santa's hints
- ✅ **Complete**: All mobile polish tasks (5A-5D) finished!
- 🔄 **Current**: Task {active_task['id']} - {active_task['name']}
- 🚀 **Next**: Task {next_task['id']} - {next_task['name']} (assets ready!)

**Overall Progress**: {progress['percentage']}% complete ({progress['completed']}/{progress['total']} tasks)"""
    
    # Generate navigation section
    next_link = f"[{next_task['id']}.md](tasks/{next_task['id']}.md)" if next_task else "Project Complete!"
    current_link = f"[{active_task['id']}.md](tasks/{active_task['id']}.md)"
    
    new_navigation = f"""## 📋 Quick Navigation
- **✅ Complete**: All mobile foundation tasks (5A-5D) ✅
- **🔄 Current**: {current_link} (refactor before features)
- **🚀 Next**: {next_link}
- **📁 All Tasks**: [tasks/](tasks/) folder
- **🎨 Graphics Assets**: [Graphics_Asset_Requirements.md](Graphics_Asset_Requirements.md) (detailed status)
- **🧪 Testing**: [TESTING.md](TESTING.md) (mobile validation)
- **📋 Original PRD**: [XmasMM_PRD.md](XmasMM_PRD.md) (historical reference)"""
    
    # Update README content
    # Replace Current Status section
    readme_content = re.sub(
        r'## ✨ Current Status.*?(?=## )',
        new_status + '\n\n',
        readme_content,
        flags=re.DOTALL
    )
    
    # Replace Quick Navigation section  
    readme_content = re.sub(
        r'## 📋 Quick Navigation.*?(?=## )',
        new_navigation + '\n\n',
        readme_content,
        flags=re.DOTALL
    )
    
    # Write updated README
    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    print("✅ README.md updated from tasks.json")
    print(f"📋 Current Task: {active_task['id']} - {active_task['name']}")
    print(f"🚀 Next Task: {next_task['id']} - {next_task['name']}" if next_task else "🎉 Project Complete!")
    print(f"📊 Progress: {progress['percentage']}% ({progress['completed']}/{progress['total']} tasks)")

if __name__ == "__main__":
    update_readme_from_tasks()
