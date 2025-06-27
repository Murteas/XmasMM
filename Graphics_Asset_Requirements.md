# 🎨 Graphics Asset Requirements for XmasMM
## Christmas-Themed Mastermind Puzzle Game

**Project**: XmasMM - Web-based Christmas Mastermind Game  
**Platform**: iPhone browsers (Safari/Chrome) via GitHub Pages  
**Date**: June 27, 2025  

---

## 📐 Technical Specifications

- **Format**: PNG with transparency (alpha channel)
- **Resolution**: Multiple sizes for iPhone compatibility
  - Base size: 64x64px (1x)
  - Retina: 128x128px (2x) 
  - Super Retina: 192x192px (3x)
- **Style**: Scandinavian Christmas aesthetic, clean and modern
- **Color Palette**: Festive but not overwhelming (reds, greens, golds, silvers, whites)
- **File Size**: Optimize for web loading (keep individual files under 50KB when possible)

---

## 🎄 Game Elements (6 Required)
*These are the main puzzle pieces players will guess with*

### 1. Santa Claus
- Simple, recognizable Santa face or full figure
- Red hat with white trim, white beard
- Friendly, approachable style
- **Sizes**: 64x64, 128x128, 192x192px
- **File naming**: `santa_1x.png`, `santa_2x.png`, `santa_3x.png`

### 2. Christmas Present
- Wrapped gift box with ribbon and bow
- Bright, festive wrapping (red, green, or gold)
- Clear bow on top
- **Sizes**: 64x64, 128x128, 192x192px
- **File naming**: `present_1x.png`, `present_2x.png`, `present_3x.png`

### 3. Mistletoe
- Green leaves with white berries
- Traditional sprig shape
- Clear, distinctive silhouette
- **Sizes**: 64x64, 128x128, 192x192px
- **File naming**: `mistletoe_1x.png`, `mistletoe_2x.png`, `mistletoe_3x.png`

### 4. Christmas Star
- 5 or 6-pointed star
- Gold or bright yellow color
- Slight shine/glow effect
- **Sizes**: 64x64, 128x128, 192x192px
- **File naming**: `star_1x.png`, `star_2x.png`, `star_3x.png`

### 5. Christmas Tree
- Traditional evergreen tree shape
- Green with slight decorations (optional small ornaments)
- Brown trunk base
- **Sizes**: 64x64, 128x128, 192x192px
- **File naming**: `tree_1x.png`, `tree_2x.png`, `tree_3x.png`

### 6. Snowflake
- Intricate, symmetrical design
- White or light blue color
- Delicate, crystalline appearance
- **Sizes**: 64x64, 128x128, 192x192px
- **File naming**: `snowflake_1x.png`, `snowflake_2x.png`, `snowflake_3x.png`

---

## 🎯 Christmas-Themed Feedback Symbols
*These replace traditional black/white pegs with intuitive Christmas symbols*

### "Perfect Placement" (Correct Element + Position)

#### 7. Gold Star Feedback
- Bright gold/yellow star with sparkle
- Slightly different from game piece star (more ornate)
- **Sizes**: 32x32, 64x64, 96x96px
- **File naming**: `feedback_perfect_star_1x.png`, `feedback_perfect_star_2x.png`, `feedback_perfect_star_3x.png`

#### 8. Wrapped Present Feedback *(Alternative option)*
- Small gift box, different style from main present
- Gold wrapping with ribbon
- **Sizes**: 32x32, 64x64, 96x96px
- **File naming**: `feedback_perfect_present_1x.png`, `feedback_perfect_present_2x.png`, `feedback_perfect_present_3x.png`

### "Right Element, Wrong Position" (Close but not perfect)

#### 9. Silver Bell
- Christmas bell in silver/gray
- Small ribbon or holly accent
- **Sizes**: 32x32, 64x64, 96x96px
- **File naming**: `feedback_close_bell_1x.png`, `feedback_close_bell_2x.png`, `feedback_close_bell_3x.png`

#### 10. Small Christmas Tree Feedback *(Alternative option)*
- Miniature tree, different from main tree
- Yellow/gold star on top
- **Sizes**: 32x32, 64x64, 96x96px
- **File naming**: `feedback_close_tree_1x.png`, `feedback_close_tree_2x.png`, `feedback_close_tree_3x.png`

### "Wrong Element" (Completely incorrect)

#### 11. Red X with Snowflake
- Red X mark with decorative snowflake background
- Clear "incorrect" indication but festive
- **Sizes**: 32x32, 64x64, 96x96px
- **File naming**: `feedback_wrong_x_1x.png`, `feedback_wrong_x_2x.png`, `feedback_wrong_x_3x.png`

#### 12. Coal Lump *(Alternative option)*
- Black coal piece with slight shine
- Rounded, organic shape
- **Sizes**: 32x32, 64x64, 96x96px
- **File naming**: `feedback_wrong_coal_1x.png`, `feedback_wrong_coal_2x.png`, `feedback_wrong_coal_3x.png`

---

## 🎮 UI Elements

### 13. Submit Button
- Festive button design
- Text: "Submit Guess" or "Ho Ho Ho!" (text can be added programmatically)
- Christmas green with gold accent
- **Size**: 200x60px (base), with 2x and 3x versions
- **File naming**: `button_submit_1x.png`, `button_submit_2x.png`, `button_submit_3x.png`

### 14. Santa's Hint Button
- Special button for hint feature
- Santa hat or face icon
- Text: "Santa's Hint" (text can be added programmatically)
- **Two states needed**:
  - Available: Gold/yellow when unlocked
  - Locked: Gray when not available
- **Size**: 180x50px (base), with 2x and 3x versions
- **File naming**: 
  - `button_hint_available_1x.png`, `button_hint_available_2x.png`, `button_hint_available_3x.png`
  - `button_hint_locked_1x.png`, `button_hint_locked_2x.png`, `button_hint_locked_3x.png`

### 15. Sound Toggle Buttons (2 needed)

#### SFX Button
- Speaker icon with musical notes
- **Two states**: ON (bright) and OFF (dimmed)
- **Size**: 60x60px (base), with 2x and 3x versions
- **File naming**: 
  - `button_sfx_on_1x.png`, `button_sfx_on_2x.png`, `button_sfx_on_3x.png`
  - `button_sfx_off_1x.png`, `button_sfx_off_2x.png`, `button_sfx_off_3x.png`

#### Music Button
- Musical note or headphone icon
- **Two states**: ON (bright) and OFF (dimmed)
- **Size**: 60x60px (base), with 2x and 3x versions
- **File naming**: 
  - `button_music_on_1x.png`, `button_music_on_2x.png`, `button_music_on_3x.png`
  - `button_music_off_1x.png`, `button_music_off_2x.png`, `button_music_off_3x.png`

### 16. Play Again Button
- Festive restart/replay icon
- Text: "Play Again" (text can be added programmatically)
- Christmas colors (green/red with gold accents)
- **Size**: 150x50px (base), with 2x and 3x versions
- **File naming**: `button_play_again_1x.png`, `button_play_again_2x.png`, `button_play_again_3x.png`

### 17. Start Game Button
- Main call-to-action for the menu
- Text: "Start Game" (text can be added programmatically)
- Prominent, festive design
- **Size**: 200x60px (base), with 2x and 3x versions
- **File naming**: `button_start_game_1x.png`, `button_start_game_2x.png`, `button_start_game_3x.png`

---

## 🎨 Background Elements

### 18. Main Christmas Background
- **Purpose**: Primary background for all game scenes
- **Style**: Scandinavian Christmas scene - cozy, winter wonderland
- **Elements to include**:
  - Snow-covered landscape
  - Evergreen trees in background
  - Cozy cabin or house with warm lights
  - Soft, falling snow effect
  - Warm color palette (not too bright/overwhelming)
- **Technical requirements**:
  - **Size**: 800x600px minimum, should scale well to different iPhone sizes
  - **Format**: PNG or JPG (PNG preferred for quality)
  - **Optimization**: Keep file size under 200KB for fast loading
  - **Contrast**: Subtle enough to not interfere with UI elements placed on top
- **File naming**: `background_main.png` (single high-quality version that scales)

### 19. Dark Overlay Texture
- Semi-transparent dark overlay for contrast behind feedback elements
- Subtle Christmas pattern (optional - small snowflakes or holly)
- **Size**: 800x600px, tileable
- **Opacity**: 70-80% transparency
- **File naming**: `overlay_dark.png`

---

## 📱 Icon & Branding

### 20. App Icon/Favicon
- XmasMM logo or representative icon
- Christmas theme incorporating Mastermind concept
- Works at small sizes (clear and recognizable)
- **Sizes**: 16x16, 32x32, 180x180, 512x512px
- **File naming**: `icon_16.png`, `icon_32.png`, `icon_180.png`, `icon_512.png`

---

## 🎄 Additional Nice-to-Have Elements

### 21. Sparkle/Magic Effects
- Small sparkle graphics for animations
- Various sizes for different effect intensities
- Gold/white sparkles
- **Sizes**: 16x16, 24x24, 32x32px
- **File naming**: `sparkle_small.png`, `sparkle_medium.png`, `sparkle_large.png`

### 22. Holly Decoration Borders
- Decorative holly borders for UI sections
- Scalable, tileable patterns
- Green leaves with red berries
- **Various sizes for different UI sections**
- **File naming**: `border_holly_horizontal.png`, `border_holly_vertical.png`

### 23. Christmas Lights String
- Optional decorative element for borders
- Colorful, small bulbs
- Tileable pattern
- **File naming**: `lights_string.png`

---

## 🎯 Style Guidelines

### Aesthetic Requirements
- **Style**: Clean, modern Scandinavian Christmas
- **Mood**: Cozy, family-friendly, festive but not overwhelming
- **Contrast**: High contrast for iPhone visibility in various lighting
- **Accessibility**: Clear distinction between all elements for users with visual impairments
- **Scalability**: Must work well at small iPhone sizes (down to iPhone SE)
- **Consistency**: Unified style across all elements - same artistic approach
- **Touch-Friendly**: Clear, distinct shapes for touch interaction

### Color Palette Suggestions
- **Primary**: Deep Christmas Green (#165B33), Rich Burgundy Red (#8B0000)
- **Accents**: Warm Gold (#FFD700), Silver (#C0C0C0)
- **Neutrals**: Cream White (#F5F5DC), Soft Gray (#E0E0E0)
- **Background**: Soft Winter Blues (#E6F3FF), Warm Whites (#FFFAF0)

### Avoid
- Overly bright/neon colors that strain eyes on phone screens
- Too much detail that becomes unclear at small sizes
- Colors that are too similar (ensure good contrast between elements)
- Busy patterns that compete with game UI

---

## 📦 Deliverable Organization

### Folder Structure
```
XmasMM_Assets/
├── GameElements/
│   ├── santa_1x.png, santa_2x.png, santa_3x.png
│   ├── present_1x.png, present_2x.png, present_3x.png
│   ├── mistletoe_1x.png, mistletoe_2x.png, mistletoe_3x.png
│   ├── star_1x.png, star_2x.png, star_3x.png
│   ├── tree_1x.png, tree_2x.png, tree_3x.png
│   └── snowflake_1x.png, snowflake_2x.png, snowflake_3x.png
├── Feedback/
│   ├── feedback_perfect_star_1x.png, feedback_perfect_star_2x.png, feedback_perfect_star_3x.png
│   ├── feedback_close_bell_1x.png, feedback_close_bell_2x.png, feedback_close_bell_3x.png
│   └── feedback_wrong_x_1x.png, feedback_wrong_x_2x.png, feedback_wrong_x_3x.png
├── UI/
│   ├── button_submit_1x.png, button_submit_2x.png, button_submit_3x.png
│   ├── button_hint_available_1x.png, button_hint_available_2x.png, button_hint_available_3x.png
│   ├── button_hint_locked_1x.png, button_hint_locked_2x.png, button_hint_locked_3x.png
│   ├── button_sfx_on_1x.png, button_sfx_on_2x.png, button_sfx_on_3x.png
│   ├── button_sfx_off_1x.png, button_sfx_off_2x.png, button_sfx_off_3x.png
│   ├── button_music_on_1x.png, button_music_on_2x.png, button_music_on_3x.png
│   ├── button_music_off_1x.png, button_music_off_2x.png, button_music_off_3x.png
│   ├── button_play_again_1x.png, button_play_again_2x.png, button_play_again_3x.png
│   └── button_start_game_1x.png, button_start_game_2x.png, button_start_game_3x.png
├── Backgrounds/
│   ├── background_main.png
│   └── overlay_dark.png
├── Icons/
│   ├── icon_16.png, icon_32.png, icon_180.png, icon_512.png
└── Effects/ (Optional)
    ├── sparkle_small.png, sparkle_medium.png, sparkle_large.png
    ├── border_holly_horizontal.png, border_holly_vertical.png
    └── lights_string.png
```

### File Requirements
- **Individual PNG files** with transparency (alpha channel)
- **Multiple resolution versions** (1x, 2x, 3x) for each element
- **Color variations** where specified (ON/OFF states, etc.)
- **Optimized file sizes** for web delivery
- **Consistent naming convention** as specified above

---

## 📋 Priority Levels

### **CRITICAL (Must Have)**: 
Game Elements (1-6), Key Feedback Symbols (7, 9, 11), Main Background (18), Essential UI Buttons (13, 14, 15, 16, 17)

### **HIGH (Should Have)**: 
App Icons (20), Dark Overlay (19), Alternative Feedback Options (8, 10, 12)

### **NICE TO HAVE**: 
Sparkle Effects (21), Decorative Borders (22, 23)

---

## 📞 Contact & Questions

If you have any questions about these requirements or need clarification on any design elements, please don't hesitate to ask. We're aiming for a cohesive, beautiful Christmas-themed visual system that will make the game delightful for family members during their Christmas party!

**Target completion**: ASAP for Task 4 implementation
**File delivery**: ZIP archive with organized folder structure as specified above

Thank you for helping make XmasMM a beautiful and engaging Christmas game! 🎄✨
