# Task System Reorganization Proposal

## Current Problem
Task numbering (6, 7, 8, 9, 10, 11, 12, 13) doesn't match priority order, creating confusion.

**Example Issues:**
- Task 11 (Mobile Layout) has priority 9
- Task 8 (Audio) has priority 11  
- Task 10 (Testing) has priority 12
- Numbers suggest sequence but priorities don't follow

## Proposed Solution: Named Tasks with Logical Ordering

### Phase 1: Current Feature Development (by priority)
1. **QualityIndicators** (current: Task 9, priority 7)
2. **MobileLayoutOptimization** (current: Task 11, priority 9) 
3. **CodeArchitectureRefactoring** (current: Task 13, priority 8)
4. **UsabilityImprovements** (current: Task 12, priority 10)

### Phase 2: Finalization (by priority)
1. **AudioImplementation** (current: Task 8, priority 11)
2. **FinalTesting** (current: Task 10, priority 12)

### Completed
- **ChristmasTheme** (Task 6) ✅
- **RoundOverScene** (Task 7) ✅

## Benefits of Named Tasks
- **Clear purpose** from name alone
- **Logical priority ordering** within phases
- **No confusion** about sequence vs importance
- **Better for AI agents** - descriptive names aid understanding
- **Easier communication** - "work on mobile layout" vs "work on task 11"

## Implementation Options

### Option A: Rename in tasks.json
```json
"tasks": {
  "QualityIndicators": {
    "id": "QualityIndicators", 
    "name": "Quality Indicators",
    "priority": 1,
    // ...
  }
}
```

### Option B: Keep IDs, reorder priorities
```json
"tasks": {
  "9": {
    "id": "9",
    "name": "Quality Indicators", 
    "priority": 1,  // Changed from 7
    // ...
  }
}
```

### Option C: New sequential numbering
Renumber tasks 1-6 based on actual priority order.

## Recommendation
**Option A (Named Tasks)** provides the clearest long-term solution:
- Most intuitive for humans and AI agents
- Self-documenting task purpose
- Eliminates number/priority confusion
- Better for project handoffs

## Migration Plan
1. **Backup current tasks.json**
2. **Update automation scripts** to handle named IDs
3. **Rename task files** to match new naming
4. **Update all references** in documentation
5. **Test automation system** with new structure

Would you like me to implement this reorganization?
