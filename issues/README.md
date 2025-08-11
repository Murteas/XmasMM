# 📋 Issues Management Guide

## 🎯 Consolidated Approach
**Single Source of Truth**: All issue tracking now consolidated in `ISSUES.md` for optimal AI agent accessibility.

## 📁 Current Structure
```
ISSUES.md                    # PRIMARY TRACKER - All open + recent resolved issues
issues/
├── archived/
│   ├── session-august-11-2025.md
│   ├── session-001-july-12-2025.md
│   └── ...
├── detailed/ (future)      # Complex investigations >100 lines
├── christmas-title-theming.md     # → MOVED to ISSUES.md
├── mobile-fullscreen-viewport-clipping.md  # → RESOLVED & ARCHIVED
└── README.md (this file)
```

## 🔄 Updated Management Rules

### **ISSUES.md (Primary Tracker)**
- ✅ **All Open Issues** - Complete active issue list
- ✅ **Recent Resolved Issues** - Last 1-2 development sessions  
- ✅ **Management Guidelines** - Workflow documentation
- ✅ **Target**: Keep under 200 lines for AI agent scanning

### **issues/archived/ (Historical Reference)**
- 📁 **Resolved Issues** - Organized by development session
- 📁 **Full Context** - Complete technical details preserved
- 📁 **Research Notes** - Background investigation materials

### **AI Agent Workflow**
1. **Check ISSUES.md first** - Primary reference for all current state
2. **Reference archives** - Only when deeper historical context needed
3. **Update ISSUES.md** - All status changes go to primary tracker
4. **Archive when needed** - Move resolved issues when >200 lines

## 🤖 Benefits for AI Agents
1. **Single Reference Point** - No need to check multiple locations
2. **Quick Scanning** - ISSUES.md optimized for rapid comprehension
3. **Complete History** - Archives preserve full context when needed
4. **Clear Workflow** - Unambiguous update patterns

## 📊 Archive Index
- **Session August 11, 2025**: Issues consolidation + mobile safe area implementation
  - MOBILE-001: Mobile fullscreen viewport clipping (RESOLVED)
  - PERF-001: Game transition performance optimization (RESOLVED)
  - UI-009, UI-010, UI-007, UI-006, UI-005, ASSET-001 (all RESOLVED)
- **Session 001** (July 12, 2025): Initial AI setup, scoring overhaul, UI improvements
  - TMS-001: Task management sync issue
  - Additional legacy items preserved

---
*This system maintains optimal balance between immediate accessibility and historical preservation.*
