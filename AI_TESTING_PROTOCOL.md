# AI Agent Testing Protocol

**For AI Agents working on XmasMM project**

## Mandatory Testing Steps

### 1. **Always Start Local Server**
```powershell
# Required before any browser testing
python -m http.server 8000
# OR for background job
Start-Job -ScriptBlock { python -m http.server 8000 }
```

### 2. **Test Sequence for ANY Code Changes**
1. **Syntax Check**: Use `get_errors` tool on modified files
2. **Start Server**: Launch development server (localhost:8000)
3. **Functional Test**: Open game at http://localhost:8000
4. **Feature Test**: Open comprehensive test at http://localhost:8000/tests/test_comprehensive.html
5. **Regression Test**: Run relevant specialized tests from /tests/ folder

### 3. **Specific Test Requirements by Feature Type**

#### UI/Layout Changes
- **Required**: test_responsive_layout.html
- **Required**: test_device_comparison.html
- **Verification**: Touch interaction test on mobile viewport

#### Game Logic Changes
- **Required**: test_comprehensive.html
- **Required**: Manual gameplay test (complete at least one round)
- **Verification**: Score calculation accuracy

#### Asset/Graphics Changes
- **Required**: test_asset_loading.html
- **Verification**: All images load correctly across device types

#### Performance Changes
- **Required**: test_debug_performance.html
- **Verification**: FPS remains above 50 on mobile viewport

### 4. **Before Declaring Success**
- [ ] Local server is running
- [ ] Game loads without console errors
- [ ] Feature works as intended in browser
- [ ] No regression in existing functionality
- [ ] At least one comprehensive test passes

### 5. **Issue Tracking Protocol**
- **ANY system issue encountered** → Create entry in ISSUES.md
- **Include**: Problem description, impact, reproduction steps
- **Don't ignore**: Even "minor" automation glitches need documentation
- **Track resolution**: Update issue status when fixed

### 6. **Automation for Compliance**
Consider adding to automation.py:
```python
def require_testing_before_commit():
    """Prevent commits without proper testing verification"""
    # Check if server was started
    # Verify test results
    # Require manual testing confirmation
```

## Emergency Testing Checklist
If time is limited, minimum viable testing:
1. ✅ Start server: `python -m http.server 8000`
2. ✅ Open: http://localhost:8000
3. ✅ Verify: Feature works without errors
4. ✅ Quick test: One complete game round

## Common Testing Failures to Avoid
- ❌ Opening HTML file directly (no server)
- ❌ Assuming code works without browser verification
- ❌ Ignoring console errors
- ❌ Not testing on mobile viewport
- ❌ Skipping regression testing
- ❌ Declaring success without actual verification

---
**Violation Consequences**: Any feature implementation without proper testing should be considered incomplete and requires immediate remediation.
