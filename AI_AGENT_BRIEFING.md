# 🤖 New AI Agent Onboarding Prompt

## Copy this prompt when starting work with a new AI agent:

---

**CONTEXT**: I'm continuing work on the XmasMM Christmas Mastermind game project. This project uses a specialized machine-readable task management system designed for agentic AI agents.

**ONBOARDING CHECKLIST - Before doing anything else, please:**

1. **Check current status**: Read `PROJECT_STATUS.md` for real-time project state
2. **Understand the system**: Review `TASK_MANAGEMENT.md` for the complete AI agent guide  
3. **Validate automation**: Run `python scripts/automation.py status` to see exactly where we are
4. **Review current task**: Run `python scripts/automation.py help` for detailed current task information

**AUTOMATION SYSTEM OVERVIEW**:
- **Single source of truth**: `tasks.json` contains all current project state
- **Live status dashboard**: `PROJECT_STATUS.md` shows real-time progress (auto-updated)
- **AI-friendly interface**: Use `scripts/automation.py` for all status checks and updates
- **Auto-sync documentation**: Task files automatically stay current with `scripts/sync_task_files.py`
- **Dynamic script docs**: Script documentation is auto-generated from actual code (use `regen-docs` to refresh)
- **No manual status tracking**: Never update status manually - always use the automation scripts

**AUTOMATION COMMANDS**:
- `python scripts/automation.py status` - Get current state
- `python scripts/automation.py help` - Current task details
- `python scripts/automation.py update-docs` - Refresh all documentation
- `python scripts/automation.py regen-docs` - Regenerate scripts documentation
- `python scripts/sync_task_files.py` - Sync all documentation

*For terminal command syntax and technical details, see `TECHNICAL_GUIDELINES.md`*

**VALIDATION CHECKLIST**:
1. ✅ You can access and read `PROJECT_STATUS.md` for current state
2. ✅ You can access and read `tasks.json` for task definitions
3. ✅ The automation scripts work on your system (`python scripts/automation.py status`)
4. ✅ Current task status matches between PROJECT_STATUS.md and automation.py status

**Only after confirming the task system is working should you proceed with actual development work.**

---

## Essential Context Files:
- **`PROJECT_STATUS.md`** - Real-time project state (auto-updated) **← START HERE**
- **`tasks.json`** - Master task registry (MOST IMPORTANT)
- **`TASK_MANAGEMENT.md`** - Complete AI agent guide and system documentation
- **`TECHNICAL_GUIDELINES.md`** - Terminal commands and development guidelines ⚡
- **`Graphics_Asset_Requirements.md`** - All Christmas assets ready for implementation ✅
- **`README.md`** - Project overview and general documentation
- **`tasks/`** - Individual task documentation (see PROJECT_STATUS.md for current task)
- **`TESTING.md`** - Test suite documentation

**The system is designed so any AI agent can pick up exactly where the previous one left off without missing context or creating inconsistencies.**
