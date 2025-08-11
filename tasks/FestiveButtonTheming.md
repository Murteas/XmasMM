# Task: Festive Button & UI Theming Refresh (PRIORITY – before Audio)

**Status**: 📋 PENDING  
**Priority**: HIGH (Execute before `AudioImplementation.md`)  
**Objective**: Unify and upgrade interactive UI elements (buttons / info icons / hint text) with a polished, festive visual style that is consistent, accessible, and reusable—without introducing a build step.

## Why This Matters
Current buttons are functional but visually flat and inconsistent. A cohesive festive style (subtle gradients, ornament accents, consistent spacing, soft shadows, accessible contrast) will elevate perceived quality more than audio alone and should land first so later features (audio, random guess button) adopt the shared system.

## Goals
- Centralize button styling tokens (colors, padding, corner radius, shadow intensity) – extend `LayoutConfig` (no bundler needed).
- Replace ad‑hoc Text objects-as-buttons with a helper that wraps: background shape + label + optional accent icon/emoji.
- Add light festive accents (tiny ornament/star sparkle) on primary CTAs (Play Again, Share Score, Submit, Hint when available).
- Provide consistent press / hover / disabled states (scale + tint currently duplicated).
- Maintain strict readability (WCAG-ish contrast in dark backgrounds).
- Keep implementation minimal & fully data‑driven (no runtime image generation, use Phaser Graphics). 

## Non-Goals (Defer)
- Full particle system or snow fall (separate optional polish task)
- Animated gradient shaders (would require pipeline changes)
- Theme switching system (YAGNI for now)

## Implementation Plan
### 1. Define Style Tokens (LayoutConfig additions)
Add under a new section `BUTTON_STYLE`:
```
PRIMARY_BG: '#0d5016'
PRIMARY_BG_HOVER: '#156b1f'
PRIMARY_BG_ACTIVE: '#093b11'
PRIMARY_FG: '#ffffff'
ACCENT_BG: '#ffd700'
ACCENT_BG_HOVER: '#ffe55c'
ACCENT_BG_ACTIVE: '#e6c200'
ACCENT_FG: '#0d5016'
DISABLED_BG: '#444444'
DISABLED_FG: '#bbbbbb'
RADIUS: 10
PADDING_X: 22
PADDING_Y: 12
SHADOW_COLOR: 0x000000
SHADOW_ALPHA: 0.35
SHADOW_OFFSET_Y: 3
FONT: '18px Arial'
```
(Adjust sizes for smaller screens with simple multiplier if width < 430.)

### 2. Create `ButtonFactory` Utility (`js/utils/ButtonFactory.js`)
Responsibilities:
- `createButton(scene, x, y, label, variant, opts)` returns container with background (rounded rect), label text, optional emoji/icon.
- Variants: `primary`, `accent`, `ghost`, `danger` (future-proof; implement at least primary & accent now).
- Handles interactive states: hover/over (desktop), pointerdown/up, disable/enable API.
- Applies consistent shadow (drop shadow via duplicate graphics offset OR pipeline tint fallback on low-end devices).
- Accepts `onClick` callback.

### 3. Replace Existing Button Constructions
Targets:
- RoundOver: Play Again, Share Score, Info modal Close (danger or accent), (future Random Guess inherits automatically).
- MainMenu: Play, How to Play, Difficulty selections if present, future audio toggle integration.
- GameScene footer: Submit, Hint, (future Random Guess).

### 4. Add Optional Accent Emoji/Icon Support
- Provide small star / bell / gift emoji to left of key CTAs (config flag).
- Scale with font; ensure baseline alignment.

### 5. Centralize Feedback Animation
Move current `addButtonFeedback` logic into factory (scale pulse + maybe quick glow).

### 6. Accessibility & Responsiveness
- Ensure minimum hit target >= 44x44.
- Auto-expand padding if text shorter than threshold.
- Color contrast check (simple luminance calc; console.warn if variant fails).

### 7. Update Docs
- README: brief “Festive UI Style” section.
- AI_AGENT_BRIEFING: mention ButtonFactory, tokens, extension pattern.
- Add note to RandomGuessFeature to use factory.

### 8. Light QA Checklist
- [ ] Buttons render correctly on mobile DPR 1x / 2x / 3x.
- [ ] States (normal, hover, pressed, disabled) visually distinct.
- [ ] Hint button disabled style applies after use.
- [ ] Info modal Close using consistent styling.
- [ ] No layout regressions (RoundOver scroll still correct).
- [ ] Performance: no GC spikes when creating/destroying buttons.

## Files To Add / Modify
- Add: `js/utils/ButtonFactory.js`
- Modify: `js/config/LayoutConfig.js` (tokens), `RoundOver.js`, `MainMenu.js`, `GameScene.js`, `UILayoutManager.js`, `GameInputHandler.js` (for hint styling refresh), README, AI_AGENT_BRIEFING.

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Over-styling reduces clarity | Keep palette limited to two strong variants + neutral | 
| Inconsistent adoption | Grep for `.setInteractive` button patterns and migrate | 
| Mobile performance (graphics redraw) | Cache graphics textures using `generateTexture` when size stable | 
| Text scaling truncation | Recalculate container width after label set | 

## Success Criteria
- [ ] All major interactive elements use ButtonFactory.
- [ ] Styling defined by centralized tokens only (no magic numbers in scenes).
- [ ] Visual upgrade noted (subjective) while keeping readability & contrast.
- [ ] No new console errors or performance regressions.

---
**Precedes**: `AudioImplementation.md`  
**Follow-up Candidates**: Subtle particle sparkle, Snow drift background, Theming toggle (light/dark festive).
