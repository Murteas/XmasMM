# Christmas MasterMind (XmasMM)

Mobile-first themeable Mastermind game for family play. Working and playable;
active work is UX polish and hint tuning.

## Stack

Phaser 3.80.1 loaded from CDN. Plain ES5-style JS, no bundler, no build step.
Modules are loaded in dependency order by `js/utils/ModuleLoader.js` — a new
file must be registered there or it silently won't exist at runtime.

## Commands

```bash
python -m http.server 8000    # must be served; file:// breaks Phaser asset loading
npm test                      # ConstraintSolver test suite (no deps, ~2s)
```

Then open `http://localhost:8000`. Deploys via GitHub Pages.

## Tests

`js/utils/ConstraintSolver.js` is covered by `test/ConstraintSolver.test.js`:
feedback scoring including duplicate elements, elimination across multiple
guesses, per-position deduction, and both game sizes. Run it with `npm test`.

- Node's built-in runner (`node --test`), no dependencies, no build step.
- `test/helpers/load-browser-class.js` wraps a `js/` source file in a function
  and returns its class, so browser-only files with no `module.exports` load in
  Node untouched. Don't add export plumbing to `js/` to make a test work.
- `test/helpers/mastermind-reference.js` is a second, deliberately different
  implementation (frequency counting, not array splicing). Tests compare the
  solver against it, so a shared bug would have to appear in both.
- The solver's `console.log` output is suppressed; set `XMASMM_TEST_VERBOSE=1`
  to see it.

**Everything else is still verified manually**, in a browser, at mobile width.
Treat any rules or layout change as NOT VERIFIED until it's been played.

## Structure

- `js/config/ThemeConfig.js` — **authoritative** for all theme data: elements,
  feedback symbols, colors, backgrounds, audio, asset paths. Nothing
  theme-related should be hardcoded anywhere else.
- `js/config/LayoutConfig.js` — dimensions and spacing. Colors here are getters
  that read from `ThemeConfig`; keep them that way.
- `js/managers/` — game state, scoring, history, input, active row, ghost overlays.
- `js/scenes/` — MainMenu, GameScene, RoundOver.
- `js/utils/ConstraintSolver.js` — exhaustive search over all 6^n codes,
  filtered by feedback history. 100% accurate, runs in <10ms. This is what
  drives ghost hints.
- `js/utils/LogicDeductionEngine.js` — deprecated heuristic predecessor, still
  present. Don't build on it.

## Project-specific conventions

- **Mobile first, seriously.** Target is iPhone SE through Pro Max, 375–428px.
  Layout changes must be checked at 375px; that's where things clip.
- Adding a theme means config plus assets only — never new code paths. If a
  theme needs code, the abstraction is wrong.
- Game mechanics live in `managers/`, not scenes. Feedback calculation, code
  generation, and scoring have been stable; be careful there.
- Keep console logging compact: secret code at game start, each guess with
  feedback, ConstraintSolver summary. Don't reintroduce per-slot render logs.

## Open design question

Ghost hints currently use perfect mathematical knowledge — they eliminate
options a human player wouldn't reason out. I've flagged this as possibly "too
smart." It's deliberately at 100% accuracy for now; a strict/forgiving toggle
is an option, but changing hint strength is a design decision, not a fix.
`test/ConstraintSolver.test.js` pins the current strict behavior, so retuning
means updating those expectations on purpose rather than discovering breakage
in a playtest.

Pending: family UX feedback on the hints.

## Notes

`docs/session-history.md` is an archived narrative of two past refactors
(theme system, ghost hints). Background only — it's not authoritative and
doesn't need updating.
