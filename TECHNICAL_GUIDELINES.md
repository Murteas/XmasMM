# 🔧 Technical Guidelines for AI Agents

## Terminal Command Guidelines

### **Git Bash Environment (Recommended for AI Agents)**
- **Shell**: Git Bash (provides Unix-like commands on Windows)
- **Command Chaining**: Use `&&` for success chaining, `||` for failure handling
- **Directory Changes**: Use `cd "path"` with standard Unix syntax
- **Benefits**: Cross-platform consistency, better text processing tools

### **Automation Commands**
```bash
# Core automation workflow
python scripts/automation.py status          # Get current state
python scripts/automation.py help            # Current task details  
python scripts/automation.py update-docs     # Refresh all documentation
python scripts/automation.py regen-docs      # Regenerate scripts documentation
python scripts/sync_task_files.py           # Sync all documentation

# Command chaining (Unix style)
python scripts/automation.py status && python scripts/automation.py help
```

### **Critical Rule: NO BACKGROUND PROCESSES**
```javascript
// ❌ WRONG - This will fail
run_in_terminal({
  command: "python -m http.server 8000",
  isBackground: true  // ← This causes errors
});

// ✅ CORRECT - Always use false
run_in_terminal({
  command: "python -m http.server 8000", 
  isBackground: false  // ← Always use false
});
```

### **Common Command Patterns**
```bash
# Directory navigation
cd "/d/DJS Projects/XmasMM"

# Command chaining
python scripts/automation.py status && python scripts/automation.py help

# Testing server (foreground only)
python -m http.server 8000

# File operations
ls -la                           # List files
grep -r "pattern" js/            # Search in files
find . -name "*.js"              # Find files by pattern
wc -l ISSUES.md                  # Count lines
```

### **Server Management**
```bash
# Start development server
python -m http.server 8000

# Check what's running on port 8000
netstat -ano | grep :8000

# Find and kill server by PID
tasklist | grep python
taskkill //PID [PID_NUMBER] //F

# Alternative: Kill all Python processes (use with caution)
taskkill //IM python.exe //F
taskkill //IM python3.11.exe //F
```

**Best Practices**:
- Always stop development servers when done working
- Use `Ctrl+C` in the terminal where you started the server (preferred method)
- Use `taskkill` only when the terminal is no longer accessible
- Check for running servers before starting new ones to avoid port conflicts

## Development Environment

### **Project Structure Rules**
- **No manual status updates**: Always use automation scripts to update task status
- **UTF-8 encoding required**: All Python file operations must use `encoding='utf-8'`
- **Modular architecture**: Keep files under 500 lines (established in Task 5E refactoring)
- **Dynamic documentation**: Script docs auto-generate from code - use `regen-docs` to refresh

### **File Encoding**
- All Python scripts must use `encoding='utf-8'` for file operations
- This prevents "charmap codec" errors on Windows

### **Automation System**
- Always validate scripts work: `python scripts/automation.py status`
- Never add manual task status to documentation - keep it automated
- Use `PROJECT_STATUS.md` as the single source of truth for current state

## Error Patterns to Avoid

### **Background Process Error**
```
ERROR: Cannot read properties of undefined (reading 'executeCommand')
```
**Solution**: Always use `isBackground: false`

### **Command Syntax Error (Old PowerShell)**
```
The token '&&' is not a valid statement separator
```
**Solution**: Switch to Git Bash for better AI agent compatibility. Git Bash supports standard Unix commands (`&&`, `||`, `grep`, `find`, etc.)

### **Path Format Error**
```
No such file or directory: d:\path\to\file
```
**Solution**: In Git Bash, use Unix paths: `/d/DJS Projects/XmasMM`

### **Encoding Error**
```
'charmap' codec can't decode byte 0x8f in position...
```
**Solution**: Add `encoding='utf-8'` to all file operations

---

**📌 Remember**: This file should be checked by any AI agent before making terminal commands or file operations.
