# 🤖 New AI Agent Onboarding Prompt

## Use this prompt when starting work with a new AI agent:

---

**CONTEXT**: I'm continuing work on the XmasMM Christmas Mastermind game project. This project uses a specialized machine-readable task management system designed for agentic AI agents.

**IMPORTANT**: Before doing anything else, please:

1. **Read the task management system**: Check `TASK_MANAGEMENT.md` for the complete AI agent guide
2. **Get current status**: Run `python scripts/automation.py status` to see exactly where we are
3. **Review current task**: Run `python scripts/automation.py help` for detailed current task information

**KEY SYSTEM OVERVIEW**:
- **Single source of truth**: `tasks.json` contains all current project state
- **AI-friendly interface**: Use `scripts/automation.py` for all status checks and updates
- **Auto-sync documentation**: Task files automatically stay current with `scripts/sync_task_files.py`
- **No manual status tracking**: Never update status manually - always use the automation scripts

**CURRENT PROJECT STATE** (as of July 2025):
- ✅ **Mobile foundation complete**: Tasks 5A-5D finished (100% viewport utilization)
- ✅ **Code refactoring complete**: Task 5E finished (modular architecture implemented)
- � **Current task**: Task 6 (Christmas Theme) - implement festive UI elements and feedback symbols
- 🚀 **Next**: Task 7 (Round Over) - game completion mechanics
- 📊 **Progress**: 45% complete (5/11 tasks)

**VALIDATION COMMANDS**:
- `python scripts/automation.py status` - Get current state
- `python scripts/automation.py help` - Current task details
- `python scripts/sync_task_files.py` - Sync all documentation

**PLEASE CONFIRM**:
1. You can access and read `tasks.json`
2. The automation scripts work on your system
3. Current task status matches what you see in the JSON file

Only after confirming the task system is working should you proceed with actual development work.

---

## Additional Context Files to Review:
- `README.md` - Project overview
- `tasks.json` - Master task registry (MOST IMPORTANT)
- `TASK_MANAGEMENT.md` - Complete AI agent guide
- `tasks/Task_6_ChristmasTheme.md` - Current task details
- `TESTING.md` - Test suite documentation (includes new comprehensive integration test)

The system is designed so any AI agent can pick up exactly where the previous one left off without missing context or creating inconsistencies.
