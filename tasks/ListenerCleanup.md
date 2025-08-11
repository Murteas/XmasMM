# 🔄 Listener Lifecycle Cleanup (TECH-002)

**Task ID**: ListenerCleanup  
**Status**: PLANNED  
**Phase**: Finalization  
**Objective**: Ensure all global (window) and scene-level (keyboard) event listeners are registered and disposed deterministically to prevent duplication, memory growth, or subtle input bugs during replays or future multi-session flows.

## 🎯 Goals
- Prevent duplicate keyboard event handlers on repeated scene entries
- Centralize or document window listener ownership
- Provide an auditable pattern future agents can reuse
- Zero regression to current input behavior

## 📍 Scope
**In Scope**: `GameScene` keyboard handlers, `main.js` window resize / error / unhandledrejection listeners.  
**Out of Scope**: Future analytics or telemetry listeners (none present yet).

## 🛠️ Implementation Steps
1. Audit: Map existing listener registrations & absence of teardown.
2. Scene Lifecycle: Add `this.events.once('shutdown', ...)` & `this.events.once('destroy', ...)` handlers in `GameScene` to remove keyboard listeners.
3. Window Listeners: Wrap registrations in a small utility (e.g., `WindowListenerRegistry`) with `register()` & `disposeAll()` or document manual removal sequence.
4. Idempotency: Guard repeated registration (flag or internal Set tracking keys).
5. Diagnostics: Optional debug mode log summarizing active listener counts.
6. Documentation: Update `AI_AGENT_BRIEFING.md` with a short “Listener Lifecycle Pattern” section.

## ✅ Success Criteria
- [ ] Keyboard handlers fire exactly once after multiple Play Again cycles
- [ ] Window listeners removable by a single call when disposing game
- [ ] No console warnings or errors introduced
- [ ] Validation script run shows no new discrepancies
- [ ] Brief doc section added

## 📦 Deliverables
- Updated `js/scenes/GameScene.js`
- (Optional) New `js/utils/WindowListenerRegistry.js` or inline pattern
- Updated `AI_AGENT_BRIEFING.md` (listener lifecycle section)
- Validation output from `scripts/validate_tasks.py`

## 🧪 Test Plan
1. Manual: Start game → return to menu → start again (repeat 3x); verify single responses per debug key.
2. (Optional) Instrumentation: Temporarily log increments for handler registration/unregistration.
3. Resize window orientation changes still processed correctly.

## ⏱️ Estimate
3 hours (audit 0.5h, implementation 1.5h, verification + docs 1h)

## 🔗 Dependencies
None (foundational hygiene)  
**Dependents**: AudioImplementation, RandomGuessFeature (for stable future iteration)

---
*Created during August 11, 2025 synchronization pass.*
