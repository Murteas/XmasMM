#!/usr/bin/env python3
"""
AI Agent Task Automation

Simple script for AI agents to check status and update tasks.
Run this after completing any task to update documentation automatically.
"""

import sys
import subprocess
import os

# Fix Unicode encoding for Windows
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        # Fallback for older Python versions
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer)

# Add the project root to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.task_manager import TaskManager, get_current_task_info, get_project_status

def update_documentation():
    """Update all documentation with current state"""
    try:
        from scripts.update_documentation import DocumentationUpdater
        updater = DocumentationUpdater()
        updater.update_all()
        return True
    except Exception as e:
        print(f"❌ Error updating documentation: {e}")
        return False

def check_status():
    """Check current project status"""
    print("=== XmasMM Task Status ===")
    
    try:
        tm = TaskManager()
        current = tm.get_current_task()
        project_status = get_project_status()
        
        print(f"📋 Current Task: {current['id']} - {current['name']}")
        print(f"📊 Progress: {project_status['overallProgress']['percentage']}% ({project_status['overallProgress']['completed']}/{project_status['overallProgress']['total']} tasks)")
        print(f"🏗️ Phase: {project_status['currentPhase']}")
        
        # Validate state
        issues = tm.validate_state()
        if issues:
            print(f"\n⚠️ Validation Issues:")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print("\n✅ All dependencies satisfied")
        
        # Show next ready task
        next_task = tm.get_next_task()
        if next_task:
            print(f"\n🚀 Next Task: {next_task['id']} - {next_task['name']}")
        else:
            print(f"\n🎉 No next task - project may be complete!")
            
        return True
        
    except Exception as e:
        print(f"❌ Error checking status: {e}")
        return False

def complete_task(task_id, notes=""):
    """Complete a task and update documentation"""
    try:
        tm = TaskManager()
        
        # Complete the task
        success = tm.complete_task(task_id, notes)
        if not success:
            print(f"❌ Failed to complete task {task_id}")
            return False
        
        print(f"✅ Task {task_id} marked as completed")
        
        # Recalculate state to fix progress tracking
        tm.recalculate_state()
        print("🔄 Project state recalculated")
        
        # Auto-update documentation
        print("📝 Auto-updating documentation...")
        doc_success = update_documentation()
        if doc_success:
            print("📋 Documentation updated successfully")
        else:
            print("⚠️  Documentation update had issues - check manually")
        
        # Sync task files
        try:
            subprocess.run([sys.executable, "scripts/sync_task_files.py"], 
                         capture_output=True, text=True, check=True)
            print("📄 Task files synchronized")
        except subprocess.CalledProcessError:
            print("⚠️  Task file sync had issues")
        
        print("🎉 Task completion successful!")
        return True
        
    except Exception as e:
        print(f"❌ Error completing task: {e}")
        return False

def start_next():
    """Start the next ready task"""
    try:
        tm = TaskManager()
        next_task = tm.get_next_task()
        
        if not next_task:
            print("🎉 No next task available - project may be complete!")
            return True
            
        success = tm.start_task(next_task['id'])
        if success:
            print(f"🚀 Started Task {next_task['id']}: {next_task['name']}")
            return True
        else:
            print(f"❌ Could not start Task {next_task['id']} - check dependencies")
            return False
            
    except Exception as e:
        print(f"❌ Error starting next task: {e}")
        return False

def main():
    """Main automation function"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python scripts/automation.py status           # Check current status")
        print("  python scripts/automation.py complete <id>    # Complete task with ID")
        print("  python scripts/automation.py next            # Start next ready task")
        print("  python scripts/automation.py help            # Show current task details")
        print("  python scripts/automation.py update-docs     # Update documentation")
        print("  python scripts/automation.py regen-docs      # Regenerate scripts documentation")
        return
    
    command = sys.argv[1].lower()
    
    if command == "status":
        check_status()
        
    elif command == "complete":
        if len(sys.argv) < 3:
            print("❌ Please specify task ID to complete")
            return
        task_id = sys.argv[2]
        notes = " ".join(sys.argv[3:]) if len(sys.argv) > 3 else ""
        complete_task(task_id, notes)
        
    elif command == "next":
        start_next()
        
    elif command == "update-docs":
        print("📝 Manually updating documentation...")
        success = update_documentation()
        if success:
            print("✅ Documentation update completed")
        else:
            print("❌ Documentation update failed")
        
    elif command == "sync-state":
        print("🔄 Recalculating project state...")
        try:
            tm = TaskManager()
            tm.recalculate_state()
            print("✅ Project state synchronized with actual task statuses")
            print("📝 Updating documentation...")
            update_documentation()
            print("✅ Documentation updated with corrected state")
        except Exception as e:
            print(f"❌ Error syncing state: {e}")
        
    elif command == "regen-docs":
        print("Regenerating scripts documentation...")
        try:
            # Run the generate_docs.py script
            os.environ['PYTHONIOENCODING'] = 'utf-8'
            result = subprocess.run([sys.executable, "scripts/generate_docs.py"], 
                                  capture_output=True, text=True, check=True)
            # Filter out Unicode characters for display
            output = result.stdout.encode('ascii', 'ignore').decode('ascii')
            print(output)
            print("Scripts documentation regenerated successfully")
        except subprocess.CalledProcessError as e:
            print(f"Error regenerating docs: {e}")
            if e.stderr:
                stderr_clean = e.stderr.encode('ascii', 'ignore').decode('ascii')
                print(f"Error output: {stderr_clean}")
        
    elif command == "help":
        try:
            current = get_current_task_info()
            print(f"🔄 Current Task: {current['id']} - {current['name']}")
            print(f"📝 Description: {current['description']}")
            print(f"⏱️ Estimated Hours: {current.get('estimatedHours', 'Not specified')}")
            print(f"\n📋 Objectives:")
            for obj in current['objectives']:
                print(f"  - {obj}")
            print(f"\n🎯 Success Criteria:")
            for criteria in current['successCriteria']:
                print(f"  - {criteria}")
        except Exception as e:
            print(f"❌ Error getting current task: {e}")
    
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()
