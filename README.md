# Sonunu's Christmas Adventure - Customization System

## 📁 Documentation Structure

Your customization guides have been reorganized into specialized documents:

### 🎨 **STYLE_CUSTOMIZATION_GUIDE.md**
**For visual changes:** Colors, fonts, backgrounds, UI styling, themes
- All visual styling now uses CSS variables in `style.css`
- Changes automatically sync to JavaScript via `js/themeColors.js`
- No JavaScript editing needed for color/font changes!

### 🎮 **GAME_MECHANICS_GUIDE.md**
**For gameplay changes:** Physics, enemies, obstacles, collectibles, difficulty, scoring
- Player speed, jumps, gravity configuration
- Monster behavior and positioning
- Level design and world layout
- Points and scoring system

---

## 🚀 Quick Start: How to Customize

### Want to Change Colors/Fonts?
1. Open `style.css`
2. Edit CSS variables in the `:root` section (lines 1-45)
3. Save and refresh - changes apply automatically!

**Example:** Change score color from gold to blue:
```css
--color-primary-gold: #00aaff;  /* Changed from #efcc03 */
```

### Want to Change Gameplay?
1. Open `js/config.js` for player physics
2. Open `js/enemies.js` for monster settings
3. Open `js/obstacles.js` for ice cube positions
4. See **GAME_MECHANICS_GUIDE.md** for detailed instructions

**Example:** Make player jump higher:
```javascript
jumpHeights: [-10, -14, -18],  // In js/config.js
```

---

## 🎨 New CSS Variables System

### How It Works

**Before (old system):**
```javascript
// Had to edit JS files directly
ctx.fillStyle = '#FFD700';  // Hardcoded color
ctx.font = 'bold 20px Arial';  // Hardcoded font
```

**After (new system):**
```javascript
// Colors/fonts pulled from CSS automatically
ctx.fillStyle = themeColors.goldPrimary;  // Reads from CSS
ctx.font = `bold ${themeFonts.xlarge} ${themeFonts.primary}`;  // Reads from CSS
```

### Benefits
✅ Change all colors/fonts in ONE place (`style.css`)  
✅ No JavaScript knowledge needed for visual changes  
✅ Easy theme switching (dark mode, light mode, etc.)  
✅ Consistent styling across entire game  
✅ Better organization and maintainability  

---

## 📊 System Architecture

```
style.css (CSS Variables)
    ↓ (automatically synced by)
js/themeColors.js (JavaScript Objects)
    ↓ (used by)
js/screens/*.js (Drawing Code)
    ↓ (renders)
Game Canvas
```

### Key Files

| File | Purpose | Edit For |
|------|---------|----------|
| `style.css` | **Master style config** | Colors, fonts, transparency |
| `js/themeColors.js` | Syncs CSS → JS | Don't edit (auto-generated) |
| `js/config.js` | Game settings | Player physics, world size |
| `js/enemies.js` | Monster behavior | Enemy positions, shooting |
| `js/obstacles.js` | Level obstacles | Ice cube platforms |
| `js/collectibles.js` | Items to collect | Star, tree positions |
| `js/utils/collision.js` | Game logic | Points, collision rules |

---

## 🎯 Common Customization Tasks

### 1. Change Game Theme (Colors)
→ See **STYLE_CUSTOMIZATION_GUIDE.md** Section 1  
→ Edit `style.css` `:root` variables

### 2. Make Player Faster/Slower
→ See **GAME_MECHANICS_GUIDE.md** Section 1  
→ Edit `js/config.js` → `PLAYER_CONFIG.speed`

### 3. Add New Monster
→ See **GAME_MECHANICS_GUIDE.md** Section 2  
→ Edit `js/enemies.js` → Add to `monsters` array

### 4. Create New Level Section
→ See **GAME_MECHANICS_GUIDE.md** Section 10  
→ Add obstacles, monsters, move tree position

### 5. Change UI Text Colors
→ See **STYLE_CUSTOMIZATION_GUIDE.md** Section 6  
→ Edit `style.css` → Change color variables

### 6. Adjust Difficulty
→ See **GAME_MECHANICS_GUIDE.md** Section 5  
→ Modify player speed, monster shooting, bullet speed

### 7. Change Points/Scoring
→ See **GAME_MECHANICS_GUIDE.md** Section 6  
→ Edit `js/utils/collision.js` → `GameState.addScore()` calls

### 8. Modify Story Text
→ See **GAME_MECHANICS_GUIDE.md** Section 7  
→ Edit `js/screens/startScreen.js` → `storyLines` array

---

## 🎨 Theme Examples (Quick Copy-Paste)

### Dark Theme (Current Default)
```css
--color-bg-gradient-top: #01172F;
--color-bg-gradient-bottom: #010D1B;
--color-primary-gold: #efcc03;
```

### Light Theme
```css
--color-bg-gradient-top: #87CEEB;
--color-bg-gradient-bottom: #E0F6FF;
--color-primary-gold: #d4af37;
--color-primary-white: #000000;
```

### Halloween Theme
```css
--color-bg-gradient-top: #4f2305ff;
--color-bg-gradient-bottom: #2d1403ff;
--color-primary-gold: #ff6600;
--color-accent-snow: rgba(248, 248, 248, 0.46);
```

### Cyberpunk Theme
```css
--color-bg-gradient-top: #0a0e27;
--color-bg-gradient-bottom: #000000;
--color-primary-gold: #00ffff;
--color-primary-yellow: #ff00ff;
--color-accent-border: #00ffff;
```

---

## ⚠️ Important Notes

### CSS Variables Must Load First
The game reads CSS variables on startup. Make sure:
1. `style.css` is linked in `index.html` `<head>`
2. `js/themeColors.js` loads before other JS files
3. Clear browser cache if changes don't appear

### Don't Edit `js/themeColors.js` Directly
This file auto-reads from CSS. Edit colors/fonts in `style.css` instead.

### Test After Each Change
- Save file
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Test gameplay to verify changes

### Backup Before Major Changes
Copy your files before making complex modifications.

---

## 🐛 Troubleshooting

**Colors not changing?**
→ Clear cache, hard refresh, check CSS variable names

**Fonts not loading?**
→ Verify font link in `index.html`, check font name spelling

**New monster not appearing?**
→ Check position, verify image loaded, add reset function

**Game too easy/hard?**
→ Adjust player speed, monster shooting, bullet speed

See individual guides for detailed troubleshooting sections.

---

## 📚 Documentation Index

1. **README_CUSTOMIZATION.md** (this file) - Overview and quick reference
2. **STYLE_CUSTOMIZATION_GUIDE.md** - Colors, fonts, visual styling
3. **GAME_MECHANICS_GUIDE.md** - Gameplay, physics, enemies, levels

---

## 🎓 Learning Path

**Beginner (No coding needed):**
1. Change colors in `style.css`
2. Adjust player speed in `js/config.js`
3. Move obstacles/enemies to new positions

**Intermediate:**
1. Add new monsters and obstacles
2. Adjust difficulty (shooting speed, gravity)
3. Modify scoring system

**Advanced:**
1. Create new level sections
2. Add custom collectibles
3. Implement new game mechanics

---

## 💡 Tips for Success

1. **Start small** - Change one thing at a time
2. **Test frequently** - Verify each change works
3. **Use the guides** - Reference tables show exact locations
4. **Comment your changes** - Add notes for future reference
5. **Keep backups** - Save working versions

---

**Last Updated:** December 17, 2025

**Need Help?** Check the detailed guides or search for specific keywords like "color", "speed", "monster", "points", etc.

**Happy Customizing! 🎄✨**

