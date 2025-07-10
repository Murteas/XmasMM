# 🤖 New AI Agent Onboarding Prompt

## Use this prompt when starting work with a new AI agent:

---

**CONTEXT**: I'm continuing work on the XmasMM Christmas Mastermind game project. This project uses a specialized machine-readable task management system designed for agentic AI agents.

**IMPORTANT**: Before doing anything else, please:

1. **Check current status**: See `PROJECT_STATUS.md` for real-time project state
2. **Read the task system**: Check `TASK_MANAGEMENT.md` for the complete AI agent guide  
3. **Get detailed status**: Run `python scripts/automation.py status` to see exactly where we are
4. **Review current task**: Run `python scripts/automation.py help` for detailed current task information

**KEY SYSTEM OVERVIEW**:
- **Single source of truth**: `tasks.json` contains all current project state
- **Live status dashboard**: `PROJECT_STATUS.md` shows real-time progress (auto-updated)
- **AI-friendly interface**: Use `scripts/automation.py` for all status checks and updates
- **Auto-sync documentation**: Task files automatically stay current with `scripts/sync_task_files.py`
- **No manual status tracking**: Never update status manually - always use the automation scripts

**GET CURRENT STATE**: Check `PROJECT_STATUS.md` for live project status - it's automatically updated and always current.

**VALIDATION COMMANDS**:
- `python scripts/automation.py status` - Get current state
- `python scripts/automation.py help` - Current task details
- `python scripts/automation.py update-docs` - Refresh all documentation
- `python scripts/sync_task_files.py` - Sync all documentation

**PLEASE CONFIRM**:
1. You can access and read `PROJECT_STATUS.md` for current state
2. You can access and read `tasks.json` for task definitions
3. The automation scripts work on your system
4. Current task status matches between PROJECT_STATUS.md and automation.py status

Only after confirming the task system is working should you proceed with actual development work.

---

## Additional Context Files to Review:
- `PROJECT_STATUS.md` - Real-time project state (auto-updated) **← CHECK THIS FIRST**
- `README.md` - Project overview and navigation
- `tasks.json` - Master task registry (MOST IMPORTANT)
- `TASK_MANAGEMENT.md` - Complete AI agent guide
- `tasks/` - Individual task documentation (see PROJECT_STATUS.md for current task)
- `TESTING.md` - Test suite documentation (includes comprehensive integration test)

The system is designed so any AI agent can pick up exactly where the previous one left off without missing context or creating inconsistencies.
