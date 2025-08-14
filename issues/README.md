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
└── README.md (this file)
```

## 🔄 Updated Management Rules

### **ISSUES.md (Primary Tracker)**
- ✅ **All Open Issues** - Complete active issue list
- ✅ **Recent Resolved Issues** - Last 1-2 development sessions  
- ✅ **Management Guidelines** - Workflow documentation
- ✅ **Target**: Keep under 300 lines for AI agent scanning

### **issues/archived/ (Historical Reference)**
- 📁 **Resolved Issues** - Organized by development session
- 📁 **Full Context** - Complete technical details preserved
- 📁 **Research Notes** - Background investigation materials

### **AI Agent Workflow**
1. **Check ISSUES.md ONLY** - Single source of truth for all current state
2. **Reference archives** - Only when deeper historical context needed
3. **Update ISSUES.md** - All status changes go to primary tracker
4. **Archive when needed** - Move resolved issues when ISSUES.md exceeds 300 lines

## 🚫 **No Duplicate Files**
- Individual issue files in `/issues/` are **NOT maintained**
- All active issues tracked exclusively in `ISSUES.md`
- Prevents AI agent confusion and maintains single source of truth

## 🤖 Benefits for AI Agents
1. **Single Reference Point** - Check ISSUES.md only, no other files needed
2. **Quick Scanning** - Optimized for rapid comprehension
3. **Complete History** - Archives preserve full context when needed
4. **Zero Duplicates** - Eliminates conflicting information sources

## 📊 Archive Index
- **Session August 11, 2025**: Issues consolidation + mobile safe area implementation
  - MOBILE-001: Mobile fullscreen viewport clipping (RESOLVED)
  - PERF-001: Game transition performance optimization (RESOLVED)
  - UI-009, UI-010, UI-007, UI-006, UI-005, ASSET-001 (all RESOLVED)
- **Session 001** (July 12, 2025): Initial AI setup, scoring overhaul, UI improvements
  - TMS-001: Task management sync issue
  - Additional legacy items preserved

---
*ISSUES.md is the ONLY active issue tracker. No other issue files are maintained.*
