# 📋 Issues Archive Management Guide

## 🎯 Purpose
Maintain a clean, scannable ISSUES.md for AI agents while preserving valuable historical context.

## 📁 Structure
```
issues/
├── archived/
│   ├── session-001-july-12-2025.md
│   ├── session-002-july-15-2025.md  
│   └── ...
└── README.md (this file)
```

## 🔄 Management Rules

### **Keep in ISSUES.md**
- ✅ **All Open Issues** - Essential for immediate AI agent reference
- ✅ **Recent Closed Issues** - Last 2-3 development sessions
- ✅ **Current Session Context** - Issues resolved in ongoing work

### **Archive to issues/archived/**
- 📁 **Older Closed Issues** - After 2-3 sessions or when ISSUES.md > 200 lines
- 📁 **Session-Based Archives** - Group by development session/date
- 📁 **Full Context Preservation** - Complete issue details maintained

### **Archive Filename Convention**
`session-{number}-{date}.md`
- Examples: `session-001-july-12-2025.md`, `session-002-july-15-2025.md`

## 🤖 AI Agent Benefits
1. **Quick Scanning** - ISSUES.md stays under ~150 lines for rapid review
2. **Recent Context** - Most relevant closed issues remain visible
3. **Full History** - Complete archive available when deeper investigation needed
4. **Pattern Recognition** - Can analyze historical issues for trends

## 🛠️ Archive Process
1. **When to Archive**: ISSUES.md exceeds 200 lines or after major milestone
2. **What to Move**: Closed issues older than 2-3 sessions
3. **How to Archive**: Move to session-based archive file with full context
4. **Update References**: Add archive reference in ISSUES.md if needed

## 📊 Archive Index
- **Session 001** (July 12, 2025): Initial AI setup, scoring overhaul, UI improvements
  - TMS-001: Task management sync issue
  - Additional sessions will be documented here as they're archived

---
*This system maintains optimal balance between immediate accessibility and historical preservation.*
