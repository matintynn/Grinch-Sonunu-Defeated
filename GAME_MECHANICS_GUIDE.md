# Game Mechanics Customization Guide

**Complete guide for modifying gameplay, physics, enemies, obstacles, collectibles, and level design.**

---

## Quick Reference: Key Files

| What to Modify | File Location |
|----------------|---------------|
| Player speed, jumps, gravity | `js/config.js` |
| Enemy positions & behavior | `js/enemies.js` |
| Obstacle positions | `js/obstacles.js` |
| Collectible positions | `js/collectibles.js` |
| Points & scoring | `js/utils/collision.js` |
| Game states & screens | `js/screens/` folder |

---

## 1. PLAYER PHYSICS & MOVEMENT

### Edit Player Settings
**File:** `js/config.js` — Lines 11-18

```javascript
export const PLAYER_CONFIG = {
    width: 50,                  // CHANGE: Player size (width)
    height: 80,                 // CHANGE: Player size (height)
    speed: 5,                   // CHANGE: Horizontal movement speed (default: 5)
    gravity: 0.6,               // CHANGE: Fall speed (default: 0.6, higher = faster falling)
    maxJumps: 3,                // CHANGE: Number of jumps (2 = double jump, 3 = triple jump)
    jumpHeights: [-7, -11, -15] // CHANGE: Jump power for each jump (more negative = higher)
};
```

### Examples:

**Faster character:**
```javascript
speed: 8,  // Faster horizontal movement
```

**Higher jumps:**
```javascript
jumpHeights: [-10, -14, -18],  // All jumps go higher
```

**Single jump only:**
```javascript
maxJumps: 1,
jumpHeights: [-12],
```

**Moon gravity (floaty jumps):**
```javascript
gravity: 0.3,               // Slower falling
jumpHeights: [-7, -11, -15], // Keep jump power same
```

**Heavy gravity (fast falling):**
```javascript
gravity: 1.2,               // Faster falling
jumpHeights: [-9, -13, -17], // Increase jump power to compensate
```

---

## 2. ENEMIES & MONSTERS

### Monster Configuration
**File:** `js/enemies.js` — Lines 6-57

Each monster is an object in the `monsters` array:

```javascript
export const monsters = [
    {
        x: 1000,                // CHANGE: Starting X position
        y: GROUND_LEVEL - 80,   // CHANGE: Starting Y position (height above ground)
        width: 80,              // CHANGE: Monster size (width)
        height: 80,             // CHANGE: Monster size (height)
        shootInterval: 1500,    // CHANGE: Time between shots in ms (lower = faster shooting)
        lastShot: Date.now(),   // Don't change - internal timer
        alive: true,            // Don't change - tracks if monster is alive
        jumps: true,            // CHANGE: true = monster jumps, false = stationary
        velocityY: 0,           // Don't change - internal jump velocity
        gravity: 0.6,           // CHANGE: Monster fall speed
        jumpPower: -15,         // CHANGE: Monster jump height (more negative = higher)
        jumpInterval: 2000,     // CHANGE: Time between jumps in ms
        lastJump: Date.now()    // Don't change - internal timer
    },
    // Add more monsters here...
];
```

### Add a New Monster

Copy an existing monster object and modify:

```javascript
{
    x: 2500,                 // New position
    y: GROUND_LEVEL - 80,
    width: 80,
    height: 80,
    shootInterval: 1200,     // Shoots faster than default
    lastShot: Date.now(),
    alive: true,
    jumps: true,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: -18,          // Jumps higher
    jumpInterval: 1500,      // Jumps more frequently
    lastJump: Date.now()
}
```

### Boss Monster (Challenge Monster)

The 3rd monster has special properties:

```javascript
{
    x: 3280,
    y: GROUND_LEVEL - 80,
    width: 80,
    height: 80,
    shootInterval: 1000,     // Shoots faster
    lastShot: Date.now(),
    alive: true,
    jumps: true,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: -20,          // Jumps higher
    jumpInterval: 1500,      // Jumps more frequently
    lastJump: Date.now(),
    isChallenge: true,       // IMPORTANT: Enables boss behavior
    shootDistance: 600       // Only shoots when player is within 600px
}
```

**Boss features:**
- Shoots **2 bullets** at once (regular monsters shoot 1)
- Only shoots when player is within `shootDistance`

### Bullet Speed
**File:** `js/enemies.js` — Lines 108 & 116

```javascript
// Normal monster bullets
speed: -8  // CHANGE: -8 = slow, -12 = fast, -15 = very fast

// Boss monster bullets (2 bullets)
speed: -8  // CHANGE: Same as above
```

### Points for Killing Monsters
**File:** `js/utils/collision.js` — Line 68

```javascript
GameState.addScore(500);  // CHANGE: Points awarded for jumping on a monster
```

---

## 3. OBSTACLES (ICE CUBES)

### Ice Cube Configuration
**File:** `js/obstacles.js` — Lines 5-28

Each ice cube is an object in the `iceCubes` array:

```javascript
export const iceCubes = [
    { 
        x: 400,                  // CHANGE: X position (horizontal)
        y: GROUND_LEVEL - 42,    // CHANGE: Y position (height above ground)
        width: 50,               // CHANGE: Cube width
        height: 50,              // CHANGE: Cube height
        type: 1                  // Don't change - image type
    },
    // Add more cubes here...
];
```

### Add a New Ice Cube Platform

```javascript
{ x: 2800, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
```

### Create Stairs (Multiple Cubes)

```javascript
// Staircase going up
{ x: 3000, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },  // Step 1
{ x: 3050, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },  // Step 2
{ x: 3100, y: GROUND_LEVEL - 114, width: 50, height: 50, type: 1 }, // Step 3
```

### Create a Platform (Multiple Cubes Side-by-Side)

```javascript
// 3-cube wide platform
{ x: 2500, y: GROUND_LEVEL - 100, width: 50, height: 50, type: 1 },
{ x: 2550, y: GROUND_LEVEL - 100, width: 50, height: 50, type: 1 },
{ x: 2600, y: GROUND_LEVEL - 100, width: 50, height: 50, type: 1 },
```

### Points for Stepping on Ice Cubes
**File:** `js/utils/collision.js` — Line 37

```javascript
GameState.addScore(50);  // CHANGE: Points per cube (awarded once per cube)
```

---

## 4. COLLECTIBLES

### Christmas Star
**File:** `js/collectibles.js` — Lines 5-11

```javascript
export const xmasStar = {
    x: 3200,                    // CHANGE: Horizontal position
    y: GROUND_LEVEL - 220 - 20 - 50,  // CHANGE: Vertical position (height)
    width: 50,                  // CHANGE: Star size
    height: 50,
    collected: false            // Don't change - tracks collection
};
```

**Points for collecting star:**
**File:** `js/utils/collision.js` — Line 106

```javascript
GameState.addScore(2000);  // CHANGE: Points for collecting the star
```

### Christmas Tree (Goal)
**File:** `js/collectibles.js` — Lines 20-26

```javascript
export const xmasTree = {
    x: 3400,                    // CHANGE: Horizontal position (finish line)
    y: GROUND_LEVEL - 180,      // CHANGE: Vertical position
    width: 180,                 // CHANGE: Tree size
    height: 180,
    hasWon: false               // Don't change - tracks win state
};
```

### Add a New Collectible (e.g., Sonic Ring)

Already included in `js/collectibles.js` but not used! To activate:

**1. The object exists (Lines 13-18):**
```javascript
export const sonic = {
    x: 2600,
    y: GROUND_LEVEL - 220 - 20 - 50,
    width: 50,
    height: 50,
    collected: false
};
```

**2. Add drawing in `js/collectibles.js`:**
```javascript
export function drawSonic() {
    if (!sonic.collected) {
        ctx.drawImage(images.sonic, sonic.x, sonic.y, sonic.width, sonic.height);
    }
}
```

**3. Draw it in `js/screens/gameScreen.js` (Line ~44, after `drawStar()`):**
```javascript
import { drawStar, drawTree, drawSonic } from '../collectibles.js';

// In drawGame() function:
drawSonic();
```

**4. Add collision detection in `js/utils/collision.js` (after star collision check):**
```javascript
// Check sonic ring collision
if (!sonic.collected &&
    player.x < sonic.x + sonic.width &&
    player.x + player.width > sonic.x &&
    player.y < sonic.y + sonic.height &&
    player.y + player.height > sonic.y) {
    sonic.collected = true;
    GameState.addScore(1000);  // Points for collecting
}
```

**5. Reset in `js/collectibles.js` `resetCollectibles()` function:**
```javascript
export function resetCollectibles() {
    xmasStar.collected = false;
    sonic.collected = false;  // Add this line
    xmasTree.hasWon = false;
}
```

---

## 5. GAME LENGTH & DIFFICULTY

### Extend Game World

**Method 1: Move the tree further**
**File:** `js/collectibles.js` — Line 21

```javascript
x: 5000,  // Changed from 3400 (extends game by ~1600px)
```

**Method 2: Add more obstacles**
**File:** `js/obstacles.js`

Add ice cubes at higher X values:
```javascript
{ x: 3800, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
{ x: 4200, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
{ x: 4600, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
```

**Method 3: Add more monsters**
**File:** `js/enemies.js`

Add monsters at new positions:
```javascript
{
    x: 3800,  // New monster position
    y: GROUND_LEVEL - 80,
    width: 80,
    height: 80,
    shootInterval: 1200,
    lastShot: Date.now(),
    alive: true,
    jumps: true,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: -15,
    jumpInterval: 2000,
    lastJump: Date.now()
}
```

### Adjust Difficulty

**Easier game:**
- Increase player `speed` in `js/config.js` (e.g., 7)
- Decrease monster `shootInterval` (e.g., 2000 = slower shooting)
- Increase `jumpHeights` for higher jumps
- Reduce number of monsters

**Harder game:**
- Decrease player `speed` (e.g., 4)
- Decrease monster `shootInterval` (e.g., 800 = rapid shooting)
- Increase bullet `speed` (e.g., -12 or -15)
- Add more monsters
- Reduce `jumpHeights` for lower jumps

---

## 6. SCORING & POINTS

### Points Summary
**File:** `js/utils/collision.js`

| Action | Points | Line |
|--------|--------|------|
| Step on ice cube (first time) | 50 | 37 |
| Jump on monster | 500 | 68 |
| Collect star | 2000 | 106 |
| Speed bonus (< 20 seconds) | 1000 | ~247 (in `js/screens/winScreen.js`) |

### Change Point Values

**Ice cube points:**
```javascript
GameState.addScore(50);  // Change to 100, 200, etc.
```

**Monster kill points:**
```javascript
GameState.addScore(500);  // Change to 1000, 250, etc.
```

**Star collection points:**
```javascript
GameState.addScore(2000);  // Change to 5000, 1000, etc.
```

### Speed Bonus
**File:** `js/screens/winScreen.js` — Lines 245-248

```javascript
const elapsedTime = (GameState.gameEndTime - GameState.gameStartTime) / 1000;

if (elapsedTime < 20) {  // CHANGE: Time threshold in seconds
    bonusScore += 1000;  // CHANGE: Bonus points
}
```

**Example: Harder speed bonus**
```javascript
if (elapsedTime < 15) {  // Must complete in under 15 seconds
    bonusScore += 2000;  // Double the bonus
}
```

---

## 7. GAME SCREENS & MESSAGES

### Start Screen Story Text
**File:** `js/screens/startScreen.js` — Lines 44-48

```javascript
const storyLines = [
    'Oh no! The Grinch stole the Christmas Star!',    // CHANGE: Story line 1
    'Grab the replacement star and dodge icy chaos.', // CHANGE: Story line 2
    'Jump on monsters. Collect coins. Save Christmas! 🎄' // CHANGE: Story line 3
];
```

### Win Celebration Message
**File:** `js/utils/collision.js` — Line 124

```javascript
GameState.setCelebrationMessage(
    "You have successfully saved the Sonunu's Town from demonic Grinch Sonunu!"
);
// CHANGE: Customize victory message
```

### End Screen Title
**File:** `js/screens/winScreen.js` — Line 234

```javascript
ctx.fillText('Christmas Saved!', canvas.width / 2, 60);
// CHANGE: "Christmas Saved!" to any text
```

### Reward Screen
**File:** `js/screens/winScreen.js` — Lines 175 & 189

```javascript
ctx.fillText('You Earned!', canvas.width / 2, cardY + 170);  // CHANGE: Title
ctx.fillText('1 Gingerbread Cookie', canvas.width / 2, cardY + 215);  // CHANGE: Reward text
```

---

## 8. GAME STATES & FLOW

### Game State Constants
**File:** `js/config.js` — Lines 2-10

```javascript
export const GAME_STATE = {
    START: 'start',                    // Start screen with story
    PLAYING: 'playing',                // Main gameplay
    WIN: 'win',                        // Not currently used
    WIN_CELEBRATION: 'winCelebration', // Victory message overlay
    REWARD_SCENE: 'rewardScene',       // Reward card screen
    END_SCENE: 'endScene',             // Final score screen
    GAME_OVER: 'gameOver'              // Game over screen
};
```

### Game Flow:
1. **START** → Player presses ENTER → Shows story dialog → ENTER again → **PLAYING**
2. **PLAYING** → Jump on tree → **WIN_CELEBRATION**
3. **WIN_CELEBRATION** → Press ENTER → **REWARD_SCENE**
4. **REWARD_SCENE** → Press ENTER → **END_SCENE**
5. **END_SCENE** → Press ENTER → **START** (loops back)
6. **PLAYING** → Hit by bullet or monster → **GAME_OVER**
7. **GAME_OVER** → Press ENTER → **PLAYING** (restart)

---

## 9. WORLD DIMENSIONS

### Canvas Size
**File:** `js/config.js` — Lines 20-21

```javascript
export const CANVAS_WIDTH = 760;   // CHANGE: Game world width in pixels
export const CANVAS_HEIGHT = 560;  // CHANGE: Game world height in pixels
```

**Note:** These are internal dimensions. The canvas scales responsively to fit the window.

### Ground Level
**File:** `js/config.js` — Lines 12-13

```javascript
export const GROUND_HEIGHT = 60;                        // Height of ground bar
export const GROUND_LEVEL = 560 - GROUND_HEIGHT;        // Y position of ground (500)
```

**To raise/lower ground:**
```javascript
export const GROUND_HEIGHT = 80;  // Taller ground bar
```

---

## 10. ADVANCED: ADD A NEW LEVEL SECTION

**Example: Create "Level 2" starting at X = 4000**

**1. Add obstacles in `js/obstacles.js`:**
```javascript
// Level 2 obstacles
{ x: 4000, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
{ x: 4100, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
{ x: 4200, y: GROUND_LEVEL - 114, width: 50, height: 50, type: 1 },
```

**2. Add monster in `js/enemies.js`:**
```javascript
{
    x: 4300,
    y: GROUND_LEVEL - 80,
    width: 80,
    height: 80,
    shootInterval: 1000,  // Fast shooting
    lastShot: Date.now(),
    alive: true,
    jumps: true,
    velocityY: 0,
    gravity: 0.6,
    jumpPower: -20,
    jumpInterval: 1500,
    lastJump: Date.now(),
    isChallenge: true,    // Boss monster
    shootDistance: 600
}
```

**3. Move tree to end of new level in `js/collectibles.js`:**
```javascript
export const xmasTree = {
    x: 4600,  // Changed from 3400
    y: GROUND_LEVEL - 180,
    width: 180,
    height: 180,
    hasWon: false
};
```

**4. (Optional) Add collectible in new level:**
```javascript
export const powerUp = {
    x: 4150,
    y: GROUND_LEVEL - 150,
    width: 50,
    height: 50,
    collected: false
};
```

---

## 11. RESET FUNCTIONS

When adding new monsters, obstacles, or collectibles, update reset functions:

### Reset Monsters
**File:** `js/enemies.js` — Lines 143-157

When adding a 4th monster, add:
```javascript
monsters[3].alive = true;
monsters[3].x = 4300;  // Reset position
```

### Reset Collectibles
**File:** `js/collectibles.js` — Lines 45-48

When adding new collectible:
```javascript
export function resetCollectibles() {
    xmasStar.collected = false;
    sonic.collected = false;      // Add this if using sonic
    powerUp.collected = false;    // Add this if using powerUp
    xmasTree.hasWon = false;
}
```

---

## 12. TROUBLESHOOTING

**Player falls through ice cubes?**
- Check `GROUND_LEVEL` calculation in `js/config.js`
- Verify ice cube `y` positions are above `GROUND_LEVEL`

**Monster not shooting?**
- Verify `shootInterval > 0`
- Check `isChallenge: true` is set for boss monsters only

**Star not collecting?**
- Verify collision check exists in `js/utils/collision.js`
- Check image is loaded in `js/imageLoader.js`
- Confirm `drawStar()` is called in `js/screens/gameScreen.js`

**Game too easy/hard?**
- Adjust player `speed` and `jumpHeights` in `js/config.js`
- Change monster `shootInterval` and bullet `speed`
- Add/remove obstacles and monsters

**New collectible not appearing?**
1. Create object in `js/collectibles.js`
2. Add draw function in `js/collectibles.js`
3. Call draw function in `js/screens/gameScreen.js`
4. Add collision check in `js/utils/collision.js`
5. Add reset in `resetCollectibles()`

---

## 13. QUICK REFERENCE TABLE

| What to Change | File | Variable/Function | Default Value |
|----------------|------|-------------------|---------------|
| Player speed | `js/config.js` | `PLAYER_CONFIG.speed` | 5 |
| Player gravity | `js/config.js` | `PLAYER_CONFIG.gravity` | 0.6 |
| Jump power | `js/config.js` | `PLAYER_CONFIG.jumpHeights` | [-7, -11, -15] |
| Max jumps | `js/config.js` | `PLAYER_CONFIG.maxJumps` | 3 |
| Monster position | `js/enemies.js` | `monsters[n].x` | varies |
| Monster shooting | `js/enemies.js` | `monsters[n].shootInterval` | 1500 ms |
| Bullet speed | `js/enemies.js` | `bullets[n].speed` | -8 |
| Ice cube position | `js/obstacles.js` | `iceCubes[n].x` | varies |
| Star position | `js/collectibles.js` | `xmasStar.x/y` | 3200, calculated |
| Tree position | `js/collectibles.js` | `xmasTree.x/y` | 3400, calculated |
| Cube points | `js/utils/collision.js` | `GameState.addScore(50)` | 50 |
| Monster points | `js/utils/collision.js` | `GameState.addScore(500)` | 500 |
| Star points | `js/utils/collision.js` | `GameState.addScore(2000)` | 2000 |
| Speed bonus | `js/screens/winScreen.js` | `bonusScore += 1000` | 1000 |
| Speed threshold | `js/screens/winScreen.js` | `elapsedTime < 20` | 20 seconds |

---

**Last Updated:** December 17, 2025

**Pro Tip:** Start with small changes (like player speed) and test frequently. Add one new monster/obstacle at a time to ensure proper positioning and collision detection!