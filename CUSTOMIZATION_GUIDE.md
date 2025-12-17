# Game Customization Guide

A quick reference for modifying game colors, enemies, obstacles, collectibles, difficulty, and more.

---

## 1. COLORS & VISUAL STYLING

### Background & Ground Colors
**File:** `js/drawing.js`

- **Gradient background** (start & game screens) — Lines ~40-45
  ```javascript
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#01172F');  // Top color
  gradient.addColorStop(1, '#010D1B');  // Bottom color
  ```

- **Ground color** — Lines ~50-52
  ```javascript
  ctx.fillStyle = '#1a3a52';  // Dark snow color
  ctx.fillRect(0, GROUND_LEVEL, canvas.width, GROUND_HEIGHT);
  ```

### Text Colors
**File:** `js/drawing.js`

- **UI text (Score, Instructions)** — Lines ~180-190
  ```javascript
  ctx.fillStyle = '#FFD700';  // Gold color for score/instructions
  ```

- **Dialog box colors** — Lines ~95-110
  ```javascript
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';  // Dialog background
  ctx.strokeStyle = 'gold';               // Dialog border
  ```

- **Game Over screen** — Lines ~210-220
  ```javascript
  ctx.fillStyle = 'red';  // "GAME OVER" text
  ```

### Canvas Border (CSS)
**File:** `style.css` — Lines ~18-21
```css
#gameCanvas {
    border: 3px solid #c2ddf1;  /* Change color and width */
    border-radius: 18px;        /* Change roundness */
}
```

---

## 2. PLAYER PHYSICS & JUMPING

**File:** `js/player.js`

### Player Properties — Lines ~10-25
```javascript
const player = {
    speed: 5,                    // CHANGE: Horizontal movement speed (increase = faster)
    gravity: 0.6,               // CHANGE: Fall speed (increase = faster falling)
    maxJumps: 3,                // CHANGE: Number of jumps allowed (3 = double jump + 1)
    jumpHeights: [-7, -11, -15] // CHANGE: Power for each jump (more negative = higher)
};
```

### Jump Handler
**File:** `js/input.js` — Lines ~30-40
```javascript
if (e.key === 'ArrowUp' && currentState === GAME_STATE.PLAYING) {
    if (player.jumpCount < player.maxJumps) {
        player.velocityY = player.jumpHeights[player.jumpCount];
        // Increase or decrease jumpHeights in player.js to make jumps higher/lower
    }
}
```

---

## 3. ENEMIES & MONSTERS

**File:** `js/enemies.js`

### Add New Monster — Lines ~1-80
Find the `monsters` array and add a new object:
```javascript
export const monsters = [
    // Existing monsters...
    {
        x: 500,                    // CHANGE: Starting X position
        y: GROUND_LEVEL - 80,      // CHANGE: Starting Y position
        width: 80,                 // CHANGE: Size
        height: 80,
        shootInterval: 1500,       // CHANGE: Time between shots (ms) — lower = faster
        alive: true,
        jumps: true,               // CHANGE: true = monster jumps, false = stays still
        velocityY: 0,
        gravity: 0.6,              // CHANGE: Jump gravity
        jumpPower: -15,            // CHANGE: Jump strength (more negative = higher)
        jumpInterval: 2000,        // CHANGE: Time between jumps (ms)
        isChallenge: false,        // CHANGE: true = harder boss monster
        shootDistance: 600         // CHANGE: (boss only) How far to shoot at player
    }
];
```

### Adjust Monster Bullets
**File:** `js/enemies.js` — Lines ~100-130 (`updateMonsters` function)
```javascript
// Normal monster bullet speed
bullets.push({
    x: monster.x,
    y: monster.y + monster.height / 2,
    width: 24,
    height: 24,
    speed: -8  // CHANGE: -8 = slow, -12 = fast, -15 = very fast
});
```

### Monster Points
**File:** `js/utils/collision.js` — Lines ~65-70
```javascript
GameState.addScore(500);  // CHANGE: Points for killing a monster
```

---

## 4. OBSTACLES (ICE CUBES)

**File:** `js/obstacles.js`

### Add New Ice Cube Obstacle — Lines ~1-60
Find the `iceCubes` array and add:
```javascript
export const iceCubes = [
    // Existing cubes...
    { 
        x: 2000,              // CHANGE: X position
        y: GROUND_LEVEL - 42, // CHANGE: Y position (adjust height)
        width: 50,            // CHANGE: Size
        height: 50,
        type: 1
    }
];
```

### Ice Cube Points
**File:** `js/utils/collision.js` — Lines ~35-38
```javascript
if (!GameState.iceCubesVisited.includes(index)) {
    GameState.addIceCubeVisited(index);
    GameState.addScore(50);  // CHANGE: Points per cube stepped on
}
```

---

## 5. COLLECTIBLES (STAR, TREE, etc.)

**File:** `js/collectibles.js`

### Christmas Star Position & Size — Lines ~1-15
```javascript
export const xmasStar = {
    x: 3200,                    // CHANGE: Horizontal position
    y: GROUND_LEVEL - 220,      // CHANGE: Vertical position (height above ground)
    width: 50,                  // CHANGE: Size
    height: 50,
    collected: false
};
```

### Christmas Tree (Goal) — Lines ~20-30
```javascript
export const xmasTree = {
    x: 3400,              // CHANGE: Finish line X position
    y: GROUND_LEVEL - 180,// CHANGE: Y position (height)
    width: 180,           // CHANGE: Size
    height: 180,
    hasWon: false
};
```

### Star Collection Points
**File:** `js/utils/collision.js` — Lines ~100-105
```javascript
GameState.addScore(2000);  // CHANGE: Points for collecting star
```

### Add More Collectibles
1. Create a new object in `js/collectibles.js`:
   ```javascript
   export const powerUp = {
       x: 1500,
       y: GROUND_LEVEL - 100,
       width: 40,
       height: 40,
       collected: false
   };
   ```

2. Add collision check in `js/utils/collision.js`:
   ```javascript
   // Check power-up collision
   if (!powerUp.collected &&
       player.x < powerUp.x + powerUp.width &&
       player.x + player.width > powerUp.x &&
       player.y < powerUp.y + powerUp.height &&
       player.y + player.height > powerUp.y) {
       powerUp.collected = true;
       GameState.addScore(500);  // Points for collecting
   }
   ```

3. Draw it in `js/drawing.js` (game drawing function):
   ```javascript
   if (!powerUp.collected) {
       ctx.drawImage(images.powerUp, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
   }
   ```

---

## 6. GAME LENGTH & DIFFICULTY

### World Length
**File:** `js/obstacles.js` — Lines ~50-60 (last ice cube position)
- Extend the rightmost cube `x` position to make the game longer
- Example: Change `x: 3200` to `x: 5000` to add more travel distance

### Add Timer/Speed Bonus
**File:** `js/drawing.js` — Lines ~230-245 (endScene drawing)
```javascript
const elapsedTime = (gameEndTime - gameStartTime) / 1000;
if (elapsedTime < 20) {
    bonusScore += 1000;  // CHANGE: Bonus points for speed
}
```

### Adjust Difficulty
- **Increase monster shooting:** Lower `shootInterval` in `js/enemies.js` (e.g., 800 instead of 1500)
- **Faster bullets:** Change `speed: -8` to `speed: -12` in `js/enemies.js`
- **More obstacles:** Add more cubes to `iceCubes` array in `js/obstacles.js`

---

## 7. MUSIC & SOUND EFFECTS

**File:** `js/audio.js` (create this file if it doesn't exist)

### Basic Sound Setup
```javascript
export const sounds = {
    jump: new Audio('assets/jump.mp3'),
    collect: new Audio('assets/collect.mp3'),
    gameOver: new Audio('assets/gameover.mp3'),
    win: new Audio('assets/win.mp3'),
    bgm: new Audio('assets/background.mp3')  // Background music
};

export function playSound(soundName) {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
}
```

### Add Sounds to Game

**Jump sound:**
**File:** `js/input.js` — Lines ~30-40
```javascript
if (e.key === 'ArrowUp' && currentState === GAME_STATE.PLAYING) {
    if (player.jumpCount < player.maxJumps) {
        player.velocityY = player.jumpHeights[player.jumpCount];
        // ADD THIS LINE:
        playSound('jump');
    }
}
```

**Collect star sound:**
**File:** `js/utils/collision.js` — Lines ~100-105
```javascript
if (xmasStar.collected) {
    xmasStar.collected = true;
    // ADD THIS LINE:
    playSound('collect');
    GameState.addScore(2000);
}
```

**Background music:**
**File:** `js/main.js` (game loop start)
```javascript
// At start of gameLoop or in init:
sounds.bgm.loop = true;
sounds.bgm.volume = 0.5;  // CHANGE: 0-1 for volume
sounds.bgm.play();
```

### Sound File Locations
Place audio files in: `assets/` folder
- `jump.mp3` — Jump sound
- `collect.mp3` — Item collection
- `gameover.mp3` — Game over sound
- `win.mp3` — Victory sound
- `background.mp3` — Background music loop

---

## 8. GAME STATES & SCREENS

### Modify Start Screen Dialog
**File:** `js/drawing.js` — Lines ~60-80
```javascript
const storyLines = [
    'Oh no! The Grinch stole the Christmas Star!',    // CHANGE: Story text
    'Grab the replacement star and dodge icy chaos.',
    'Jump on monsters. Collect coins. Save Christmas! 🎄'
];
```

### Modify Victory Message
**File:** `js/utils/collision.js` — Lines ~120-125
```javascript
GameState.setCelebrationMessage(
    "You have successfully saved the Sonunu's Town!"  // CHANGE: Victory text
);
```

### Modify Game Over Screen
**File:** `js/drawing.js` — Lines ~210-225
```javascript
ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);  // CHANGE: Text
ctx.fillText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2 + 20);
```

---

## 9. IMAGES & ASSETS

**File:** `js/setup.js` — Lines ~10-50 (image definitions)

Add or modify images:
```javascript
export const images = {
    sonunuNormal: new Image(),
    monster: new Image(),
    // ADD NEW IMAGES:
    powerUp: new Image(),
    boss: new Image()
};

// Set image sources
images.powerUp.src = 'assets/powerup.png';
images.boss.src = 'assets/boss.png';
```

Place image files in: `assets/` folder

---

## 10. QUICK ADJUSTMENT CHECKLIST

| What to Change | File | Lines | What to Modify |
|---|---|---|---|
| Player speed | `js/player.js` | ~15 | `speed: 5` |
| Jump power | `js/player.js` | ~22 | `jumpHeights: [-7, -11, -15]` |
| Gravity | `js/player.js` | ~16 | `gravity: 0.6` |
| Monster position | `js/enemies.js` | ~10-50 | `x:` and `y:` properties |
| Monster shooting | `js/enemies.js` | ~20 | `shootInterval: 1500` |
| Bullet speed | `js/enemies.js` | ~100 | `speed: -8` |
| Obstacle position | `js/obstacles.js` | ~10-50 | `x:` and `y:` properties |
| Star position | `js/collectibles.js` | ~5 | `x:` and `y:` properties |
| Tree position | `js/collectibles.js` | ~15 | `x:` and `y:` properties |
| Background color | `js/drawing.js` | ~43 | `gradient.addColorStop()` |
| UI text color | `js/drawing.js` | ~185 | `ctx.fillStyle` |
| Points per cube | `js/utils/collision.js` | ~37 | `GameState.addScore(50)` |
| Points for star | `js/utils/collision.js` | ~103 | `GameState.addScore(2000)` |
| Points for monster | `js/utils/collision.js` | ~68 | `GameState.addScore(500)` |

---

## 11. EXAMPLE: ADD A NEW LEVEL SECTION

1. **Add obstacles in `js/obstacles.js`:**
   ```javascript
   // Level 7 (new section)
   { x: 4000, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
   { x: 4100, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
   ```

2. **Add monster in `js/enemies.js`:**
   ```javascript
   {
       x: 4200,
       y: GROUND_LEVEL - 80,
       width: 80,
       height: 80,
       shootInterval: 1200,
       alive: true,
       jumps: true,
       // ... rest of properties
   }
   ```

3. **Move tree further in `js/collectibles.js`:**
   ```javascript
   export const xmasTree = {
       x: 4400,  // Changed from 3400
       // ... rest
   }
   ```

---

## 12. TROUBLESHOOTING COMMON CHANGES

**Monster not shooting?**
- Check `shootInterval > 0` in `js/enemies.js`
- Check boss monster has `isChallenge: true` if you only want boss to shoot

**Player falls through ground?**
- Verify `GROUND_LEVEL` in `js/config.js` matches canvas height calculation

**Collectible not appearing?**
- Add draw command in `js/drawing.js` game drawing function
- Check image is loaded in `js/setup.js`

**Obstacles not blocking?**
- Verify collision check exists in `js/utils/collision.js`
- Check `x`, `y`, `width`, `height` are correct

---

**Last Updated:** December 17, 2025
