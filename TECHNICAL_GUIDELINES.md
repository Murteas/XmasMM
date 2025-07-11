# 🔧 Technical Guidelines for AI Agents

## Terminal Command Guidelines

### **PowerShell Environment (Windows)**
- **Shell**: PowerShell v5.1 (Windows PowerShell)
- **Command Chaining**: Use `;` instead of `&&`
- **Directory Changes**: Use `Set-Location "path"` instead of `cd`

### **Automation Commands**
```bash
# Core automation workflow
python scripts/automation.py status          # Get current state
python scripts/automation.py help            # Current task details  
python scripts/automation.py update-docs     # Refresh all documentation
python scripts/automation.py regen-docs      # Regenerate scripts documentation
python scripts/sync_task_files.py           # Sync all documentation

# Command chaining (use semicolon in PowerShell)
python scripts/automation.py status; python scripts/automation.py help
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
```powershell
# Directory navigation
Set-Location "d:\DJS Projects\XmasMM"

# Command chaining
python scripts/automation.py status; python scripts/automation.py help

# Testing server (foreground only)
python -m http.server 8000
```

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

### **PowerShell Syntax Error**
```
The token '&&' is not a valid statement separator
```
**Solution**: Use `;` for command chaining in PowerShell

### **Encoding Error**
```
'charmap' codec can't decode byte 0x8f in position...
```
**Solution**: Add `encoding='utf-8'` to all file operations

---

**📌 Remember**: This file should be checked by any AI agent before making terminal commands or file operations.
