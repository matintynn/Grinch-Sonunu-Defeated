// ============================================
// SECTION A: CANVAS SETUP & IMAGE LOADING
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Make canvas responsive
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = 760 / 560; // Original aspect ratio

    let canvasWidth = windowWidth - 48; // 24px padding on each side
    let canvasHeight = canvasWidth / aspectRatio;

    // If height exceeds window height, scale based on height instead
    if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight - 48;
        canvasWidth = canvasHeight * aspectRatio;
    }

    // Ensure minimum size
    if (canvasWidth < 320) canvasWidth = 320;
    if (canvasHeight < 240) canvasHeight = 240;

    // Set canvas display size - centered both horizontally and vertically
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    canvas.style.position = 'fixed';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    // Actual canvas resolution (internal)
    canvas.width = 760;
    canvas.height = 560;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game states
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    WIN: 'win',
    WIN_CELEBRATION: 'winCelebration',
    REWARD_SCENE: 'rewardScene',
    END_SCENE: 'endScene',
    GAME_OVER: 'gameOver'
};

let currentState = GAME_STATE.START;
let celebrationTimer = 0;
let celebrationMessage = '';
let celebrationCharIndex = 0;
let showStartDialog = false;
let startDialogTimer = 0;
let rewardSceneStartTime = null;
let gameStartTime = null;
let gameEndTime = null;
let playerScore = 0;
let monstersKilled = 0;
let iceCubesVisited = [];
let starCollected = false;

// Load all images
const images = {
    startSceneElement: new Image(),
    endSceneElement: new Image(),
    bgElement1: new Image(),
    bgElement2: new Image(),
    sonic: new Image(),
    sonunuNormal: new Image(),
    sonunuRun: new Image(),
    sonunuRunStar: new Image(),
    monster: new Image(),
    iceBullet: new Image(),
    iceCube1: new Image(),
    iceCube2: new Image(),
    iceCube3: new Image(),
    xmasTree: new Image(),
    xmasTreeComplete: new Image(),
    sonunuReward: new Image(),
    star: new Image()
};

// set sonic image source
images.sonic.src = 'assets/sonic.png';

// Set scene image sources
images.startSceneElement.src = 'assets/start_scene_element.png';
images.endSceneElement.src = 'assets/end_scene_element.png';
images.bgElement1.src = 'assets/bg_element1.png';
images.bgElement2.src = 'assets/bg_element2.png';

// set character image sources
images.sonunuNormal.src = 'assets/sonunu_normal.png';
images.sonunuRun.src = 'assets/sonunu_run.png';
images.sonunuRunStar.src = 'assets/sonunu_runStar.png';

// set monster image sources
images.monster.src = 'assets/monster.png';
images.iceBullet.src = 'assets/ice_bullet.png';

// set obstacle ice cubes image sources
images.iceCube1.src = 'assets/ice_cube1.png';
images.iceCube2.src = 'assets/ice_cube2.png';
images.iceCube3.src = 'assets/ice_cube3.png';
images.iceBullet.src = 'assets/ice_bullet.png';

// set xmas tree image sources
images.xmasTree.src = 'assets/xmas_tree.png';
images.xmasTreeComplete.src = 'assets/xmas_tree_complete.png';

// set sonunu reward image source
images.sonunuReward.src = 'assets/sonunu_reward.png';

// set star image source
images.star.src = 'assets/star.png';

// Wait for images to load
let imagesLoaded = 0;
const totalImages = Object.keys(images).length;

Object.values(images).forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            gameLoop(); // Start game loop when all images loaded
        }
    };
});

// ============================================
// SECTION B: START SCREEN WITH SNOW EFFECT
// ============================================

// Snowflakes array
const snowflakes = [];

// Create snowflakes
function createSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() < 0.33 ? 6 : Math.random() < 0.66 ? 8 : 12,
            speed: Math.random() * 0.5 + 0.3,
            drift: Math.random() * 0.5 - 0.25
        });
    }
}

createSnowflakes();

// Update snowflakes
function updateSnowflakes() {
    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.drift;

        // Reset to top when it falls off screen
        if (flake.y > canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
        }
    });
}

// Draw snowflakes
function drawSnowflakes() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw gradient background (used in both start and game screens)
function drawGradientBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#01172F');
    gradient.addColorStop(1, '#010D1B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw noise effect overlay
function drawNoiseEffect() {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * 0.03) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw start screen
function drawStartScreen() {
    // Draw gradient background
    drawGradientBackground();

    // Draw ground (darker snow color) - 40px height
    ctx.fillStyle = '#1a3a52';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Calculate image dimensions (full height responsive, aligned to bottom)
    const targetHeight = canvas.height - 40;
    const imgRatio = images.startSceneElement.width / images.startSceneElement.height;
    const targetWidth = targetHeight * imgRatio;

    // Position: centered horizontally, aligned to bottom above ground
    const drawX = (canvas.width - targetWidth) / 2;
    const drawY = canvas.height - 40 - targetHeight;

    ctx.drawImage(images.startSceneElement, drawX, drawY, targetWidth, targetHeight);

    // Draw snow
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // If not showing dialog, show prompt
    if (!showStartDialog) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;
        ctx.fillText('Press ENTER to Begin Story', canvas.width / 2, 100);
        ctx.shadowBlur = 0;
    } else {
        // Show story dialog with typewriter effect
        drawStoryDialog();
    }
}

function drawStoryDialog() {
    const storyLines = [
        'Oh no! The Grinch stole the Christmas Star!',
        'Grab the replacement star and dodge icy chaos.',
        'Jump on monsters. Collect coins. Save Christmas! 🎄'
    ];

    const elapsedTime = Date.now() - startDialogTimer;
    const charsToShow = Math.floor(elapsedTime / 50); // 50ms per character

    // Build the full text up to the current character count
    let fullText = storyLines.join(' ');
    const displayText = fullText.substring(0, Math.min(charsToShow, fullText.length));

    // Calculate box dimensions based on text
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    // Word wrap to calculate height
    const words = displayText.split(' ');
    let line = '';
    let lineCount = 0;
    const maxWidth = canvas.width - 120;

    words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            lineCount++;
            line = word + ' ';
        } else {
            line = testLine;
        }
    });
    if (line.length > 0) lineCount++;

    // Calculate box height based on number of lines
    const lineHeight = 25;
    const boxHeight = Math.max(80, lineCount * lineHeight + 40);
    const boxY = 100; // Fixed at top with 100px margin

    // Draw message box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(40, boxY, canvas.width - 80, boxHeight);

    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, boxY, canvas.width - 80, boxHeight);

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    line = '';
    let y = boxY + 25;

    words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, canvas.width / 2, y);

    // Show continue prompt if all text is shown
    if (charsToShow >= fullText.length) {
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Press ENTER to Start the Rescue', canvas.width / 2, boxY + boxHeight + 25);
    }
}

// ============================================
// SECTION C: PLAYER CONTROLS & PHYSICS
// ============================================

const GROUND_HEIGHT = 60; // Ground is now 60px tall
const GROUND_LEVEL = canvas.height - GROUND_HEIGHT;

const player = {
    x: 100,
    y: GROUND_LEVEL - 80, // Start on ground
    width: 50,
    height: 80,
    velocityY: 0,
    velocityX: 0,
    speed: 5,
    gravity: 0.6,
    isJumping: false,
    jumpCount: 0,
    maxJumps: 3,
    onGround: false,
    isMoving: false,
    hasStar: false,
    jumpHeights: [-7, -11, -15] // Jump power for each jump level (40px, 70px, 100px)
};

// Keyboard input
const keys = {};

// Mobile touch controls
let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let touchCurrentY = 0;
let isTouching = false;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    touchStartX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    touchStartY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    isTouching = true;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    touchCurrentX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    touchCurrentY = (touch.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isTouching = false;
});

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Start game with ENTER
    if (e.key === 'Enter' && currentState === GAME_STATE.START) {
        if (!showStartDialog) {
            // Show the story dialog
            showStartDialog = true;
            startDialogTimer = Date.now();
        } else {
            // Start the actual game
            currentState = GAME_STATE.PLAYING;
            resetGame();
            showStartDialog = false;
        }
    }

    // Also start game with ENTER from END_SCENE
    if (e.key === 'Enter' && currentState === GAME_STATE.END_SCENE) {
        currentState = GAME_STATE.START;
        showStartDialog = false;
    }

    // Jump with UP arrow
    if (e.key === 'ArrowUp' && currentState === GAME_STATE.PLAYING) {
        if (player.jumpCount < player.maxJumps) {
            player.velocityY = player.jumpHeights[player.jumpCount];
            player.isJumping = true;
            player.jumpCount++;
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player
function updatePlayer() {
    // Keyboard controls
    if (keys['ArrowRight']) {
        player.velocityX = player.speed;
        player.isMoving = true;
    } else if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
        player.isMoving = true;
    } else {
        player.velocityX = 0;
        player.isMoving = false;
    }

    // Touch controls
    if (isTouching) {
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = touchCurrentY - touchStartY;

        // Horizontal movement (swipe left/right)
        if (Math.abs(deltaX) > 20) {
            if (deltaX > 0) {
                player.velocityX = player.speed;
                player.isMoving = true;
            } else {
                player.velocityX = -player.speed;
                player.isMoving = true;
            }
        }

        // Jump (swipe up)
        if (deltaY < -30 && player.jumpCount < player.maxJumps) {
            player.velocityY = player.jumpHeights[player.jumpCount];
            player.isJumping = true;
            player.jumpCount++;
            touchStartY = touchCurrentY; // Reset to prevent multiple jumps
        }
    }

    player.x += player.velocityX;

    // Vertical movement (gravity)
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Ground collision (simple floor at bottom)
    if (player.y + player.height >= GROUND_LEVEL) {
        player.y = GROUND_LEVEL - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        player.jumpCount = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
}

// ============================================
// SECTION D: CAMERA SYSTEM (MARIO-STYLE)
// ============================================

const camera = {
    x: 0,
    followThreshold: canvas.width / 3 // Camera follows when player passes this point
};

function updateCamera() {
    // Move camera when player moves right past threshold
    if (player.x - camera.x > camera.followThreshold) {
        camera.x = player.x - camera.followThreshold;
    }

    // Don't let camera go negative
    if (camera.x < 0) camera.x = 0;
}

// ============================================
// SECTION E: OBSTACLES & ENEMIES
// ============================================

// Ice cube obstacles (world coordinates) - adjusted for new ground level
const iceCubes = [
    // Level 1 obstacles (single cubes) - on ground
    { x: 400, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },

    // Level 2 obstacles (2 stacked)
    { x: 800, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 836, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },

    { x: 1200, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1200, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },

    // Level 3 obstacles (pyramid: 2 bottom + 1 top)
    { x: 1600, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom left
    { x: 1656, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom right
    { x: 1628, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 }, // Top middle

    // Level 4 obstacles (pyramid: 2 bottom + 1 top)
    { x: 1800, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom left
    { x: 1856, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom right
    { x: 1912, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom right
    { x: 1828, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 }, // Top middle
    { x: 1882, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 }, // Top middle
    { x: 1854, y: GROUND_LEVEL - 112, width: 50, height: 50, type: 1 }, // Top middle

    // Level 5 obstacles (pyramid: 2 bottom + 1 top)
    { x: 2300, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom left
    { x: 2356, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom right
    { x: 2412, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 }, // Bottom right
    { x: 2328, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 }, // Top middle
    { x: 2382, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 }, // Top middle
    { x: 2354, y: GROUND_LEVEL - 112, width: 50, height: 50, type: 1 }, // Top middle

    // Level 6 obstacles (pyramid: 2 bottom + 1 top)
    { x: 2900, y: GROUND_LEVEL - 140, width: 50, height: 50, type: 1 }, // Top middle
    { x: 3060, y: GROUND_LEVEL - 180, width: 50, height: 50, type: 1 }, // Top middle
    { x: 3200, y: GROUND_LEVEL - 240, width: 50, height: 50, type: 1 }, // Top middle

];

// Monster enemies - adjusted for new ground level
const monsters = [
    {
        x: 1000,
        y: GROUND_LEVEL - 80,
        width: 80,
        height: 80,
        shootInterval: 1500,
        lastShot: Date.now(),
        alive: true,
        jumps: true,
        velocityY: 0,
        gravity: 0.6,
        jumpPower: -15,
        jumpInterval: 2000,
        lastJump: Date.now()
    },
    {
        x: 1950,
        y: GROUND_LEVEL - 80,
        width: 80,
        height: 80,
        shootInterval: 1500,
        lastShot: Date.now(),
        alive: true,
        jumps: true,
        velocityY: 0,
        gravity: 0.6,
        jumpPower: -15,
        jumpInterval: 2000,
        lastJump: Date.now()
    },
    {
        x: 3280,
        y: GROUND_LEVEL - 80,
        width: 80,
        height: 80,
        shootInterval: 1000,
        lastShot: Date.now(),
        alive: true,
        jumps: true,
        velocityY: 0,
        gravity: 0.6,
        jumpPower: -20,
        jumpInterval: 1500,
        lastJump: Date.now(),
        isChallenge: true,
        shootDistance: 600
    }
];

// Ice bullets
const bullets = [];

function updateMonsters() {
    const currentTime = Date.now();

    monsters.forEach(monster => {
        if (!monster.alive) return;

        // Apply gravity if monster jumps
        if (monster.jumps) {
            monster.velocityY += monster.gravity;
            monster.y += monster.velocityY;

            // Ground collision
            if (monster.y + monster.height >= GROUND_LEVEL) {
                monster.y = GROUND_LEVEL - monster.height;
                monster.velocityY = 0;
            }

            // Jump periodically
            if (currentTime - monster.lastJump > monster.jumpInterval && monster.y + monster.height >= GROUND_LEVEL) {
                monster.velocityY = monster.jumpPower;
                monster.lastJump = currentTime;
            }
        }

        // Shoot bullets at intervals (if shootInterval > 0)
        if (monster.shootInterval > 0 && currentTime - monster.lastShot > monster.shootInterval) {
            if (monster.isChallenge) {
                // Challenge monster only shoots when player is within shootDistance
                const distanceToPlayer = Math.abs(monster.x - player.x);
                const shootDist = monster.shootDistance || 300;
                if (distanceToPlayer < shootDist) {
                    // Shoot 2 bullets in different directions for challenge monster
                    bullets.push({
                        x: monster.x,
                        y: monster.y + monster.height / 2,
                        width: 24,
                        height: 24,
                        speed: -8
                    });
                    bullets.push({
                        x: monster.x,
                        y: monster.y + monster.height / 2 - 30,
                        width: 24,
                        height: 24,
                        speed: -8
                    });
                }
            } else {
                // Single bullet for normal monster
                bullets.push({
                    x: monster.x,
                    y: monster.y + monster.height / 2,
                    width: 24,
                    height: 24,
                    speed: -8
                });
            }
            monster.lastShot = currentTime;
        }
    });
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].speed;

        // Remove bullets that go off screen
        if (bullets[i].x < camera.x - 100) {
            bullets.splice(i, 1);
        }
    }
}

// Christmas star object - placed above last ice cube
const xmasStar = {
    x: 3200,
    y: GROUND_LEVEL - 220 - 20 - 50, // 20px above the last ice cube
    width: 50,
    height: 50,
    collected: false
};

const sonic = {
    x: 2600,
    y: GROUND_LEVEL - 220 - 20 - 50, // 20px above the last ice cube
    width: 50,
    height: 50,
    collected: false
};

// Christmas tree at the end - adjusted for new ground level
const xmasTree = {
    x: 3400,
    y: GROUND_LEVEL - 180,
    width: 180,
    height: 180,
    hasWon: false
};

// ============================================
// SECTION F: COLLISION DETECTION & WIN
// ============================================

function checkCollisions() {
    // Check ice cube collisions (for ALL sides - top, sides)
    player.onGround = false;

    iceCubes.forEach((cube, index) => {
        // Simple AABB collision detection
        if (player.x < cube.x + cube.width &&
            player.x + player.width > cube.x &&
            player.y < cube.y + cube.height &&
            player.y + player.height > cube.y) {

            // Landing on top of cube - add points if not visited
            if (player.velocityY > 0 && player.y + player.height - player.velocityY < cube.y + 5) {
                player.y = cube.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                player.jumpCount = 0;
                player.onGround = true;

                // Award points for passing ice cube (+50 points each)
                if (!iceCubesVisited.includes(index)) {
                    iceCubesVisited.push(index);
                    playerScore += 50;
                }
            }
            // Hit from right (moving left into cube)
            else if (player.velocityX < 0 && player.x + player.width - player.velocityX > cube.x + cube.width - 5) {
                player.x = cube.x + cube.width;
                player.velocityX = 0;
            }
            // Hit from left (moving right into cube)
            else if (player.velocityX > 0 && player.x - player.velocityX < cube.x + 5) {
                player.x = cube.x - player.width;
                player.velocityX = 0;
            }
            // Hit from bottom (jumping into cube)
            else if (player.velocityY < 0) {
                player.y = cube.y + cube.height;
                player.velocityY = 0;
            }
        }
    });

    // Check monster collisions (jump on top to kill)
    monsters.forEach(monster => {
        if (!monster.alive) return;

        if (player.x < monster.x + monster.width &&
            player.x + player.width > monster.x &&
            player.y < monster.y + monster.height &&
            player.y + player.height > monster.y) {

            // Jump on top = kill monster
            if (player.velocityY > 0 && player.y < monster.y + 20) {
                monster.alive = false;
                player.velocityY = -8; // Bounce (fixed value to prevent player from disappearing)
                playerScore += 500; // +500 points for killing a monster
                monstersKilled++;
            } else {
                // Hit from side = game over
                if (gameEndTime === null) {
                    gameEndTime = Date.now();
                }
                currentState = GAME_STATE.GAME_OVER;
            }
        }
    });

    // Check bullet collisions - FIXED THIS PART
    bullets.forEach(bullet => {
        if (player.x < bullet.x + bullet.width &&
            player.x + player.width > bullet.x &&
            player.y < bullet.y + bullet.height &&
            player.y + player.height > bullet.y) {
            if (gameEndTime === null) {
                gameEndTime = Date.now();
            }
            currentState = GAME_STATE.GAME_OVER;
        }
    });

    // Check star collision
    if (!xmasStar.collected &&
        player.x < xmasStar.x + xmasStar.width &&
        player.x + player.width > xmasStar.x &&
        player.y < xmasStar.y + xmasStar.height &&
        player.y + player.height > xmasStar.y) {
        xmasStar.collected = true;
        player.hasStar = true;
        starCollected = true;
        playerScore += 2000; // +2000 points for collecting the star
    }

    // Check win condition (jump on top of Christmas tree)
    if (player.x < xmasTree.x + xmasTree.width &&
        player.x + player.width > xmasTree.x &&
        player.y < xmasTree.y + xmasTree.height &&
        player.y + player.height > xmasTree.y) {

        // Must land on top of tree
        if (player.velocityY > 0 && player.y < xmasTree.y + 20) {
            xmasTree.hasWon = true;
            currentState = GAME_STATE.WIN_CELEBRATION;
            celebrationTimer = Date.now();
            celebrationMessage = "You have successfully saved the Sonunu's Town from demonic Grinch Sonunu!";
            celebrationCharIndex = 0;
            if (gameEndTime === null) {
                gameEndTime = Date.now();
            }
        }
    }
}

// Check star collision
if (!xmasStar.collected &&
    player.x < xmasStar.x + xmasStar.width &&
    player.x + player.width > xmasStar.x &&
    player.y < xmasStar.y + xmasStar.height &&
    player.y + player.height > xmasStar.y) {
    xmasStar.collected = true;
    player.hasStar = true;
    starCollected = true;
    playerScore += 2000; // +2000 points for collecting the star
}

// Check win condition (jump on top of Christmas tree)
if (player.x < xmasTree.x + xmasTree.width &&
    player.x + player.width > xmasTree.x &&
    player.y < xmasTree.y + xmasTree.height &&
    player.y + player.height > xmasTree.y) {

    // Must land on top of tree
    if (player.velocityY > 0 && player.y < xmasTree.y + 20) {
        xmasTree.hasWon = true;
        currentState = GAME_STATE.WIN_CELEBRATION;
        celebrationTimer = Date.now();
        celebrationMessage = "You have successfully saved the Sonunu's Town from demonic Grinch Sonunu!";
        celebrationCharIndex = 0;
    }
};

// ============================================
// DRAW FUNCTIONS
// ============================================

function drawGame() {
    // Draw gradient background
    drawGradientBackground();

    // Draw ground (darker snow color)
    ctx.fillStyle = '#1a3a52';
    ctx.fillRect(0, GROUND_LEVEL, canvas.width, GROUND_HEIGHT);

    // Draw snow on ground level
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // Save context for camera
    ctx.save();
    ctx.translate(-camera.x, 0);

    // Draw background elements aligned to ground
    const bgScale = 150; // Height of background elements
    ctx.drawImage(images.bgElement1, 0, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement2, 800, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement1, 1600, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement2, 2400, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement1, 3200, GROUND_LEVEL - bgScale, 300, bgScale);

    // Draw ice cubes
    iceCubes.forEach(cube => {
        ctx.drawImage(images.iceCube1, cube.x, cube.y, cube.width, cube.height);
    });

    // Draw star if not collected
    if (!xmasStar.collected) {
        ctx.drawImage(images.star, xmasStar.x, xmasStar.y, xmasStar.width, xmasStar.height);
    }

    // Draw monsters
    monsters.forEach(monster => {
        if (monster.alive) {
            ctx.drawImage(images.monster, monster.x, monster.y, monster.width, monster.height);
        }
    });

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.drawImage(images.iceBullet, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw player (choose image based on movement state and if has star)
    let playerImage;
    if (player.hasStar && player.isMoving) {
        playerImage = images.sonunuRunStar;
    } else if (player.isMoving) {
        playerImage = images.sonunuRun;
    } else {
        playerImage = images.sonunuNormal;
    }
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw Christmas tree (use completed version if won) - drawn after player so tree appears behind
    const treeImage = xmasTree.hasWon ? images.xmasTreeComplete : images.xmasTree;
    ctx.drawImage(treeImage, xmasTree.x, xmasTree.y, xmasTree.width, xmasTree.height);

    ctx.restore();

    // Draw UI - Game instructions on top left
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('← → Move | ↑ Jump', 20, 40);

    // Draw score on top right
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${playerScore}`, canvas.width - 20, 40);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 72px "Space Grotesk", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px "Space Grotesk", Arial';
    ctx.fillText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.fillStyle = 'white';
    ctx.font = '24px "Space Grotesk", Arial';
    ctx.fillText('Press ENTER to Restart', canvas.width / 2, canvas.height / 2 + 80);
}

function drawWinCelebration() {
    // Keep showing the game with completed tree
    drawGame();

    // Typewriter effect
    const elapsedTime = Date.now() - celebrationTimer;
    const charsToShow = Math.floor(elapsedTime / 50); // 50ms per character
    const isFullyTyped = charsToShow >= celebrationMessage.length;
    const displayText = isFullyTyped ? celebrationMessage : celebrationMessage.substring(0, charsToShow);

    // Calculate box dimensions based on text
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';

    // Word wrap to calculate height
    const words = displayText.split(' ');
    let line = '';
    let lineCount = 0;
    const maxWidth = canvas.width - 140;

    words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            lineCount++;
            line = word + ' ';
        } else {
            line = testLine;
        }
    });
    if (line.length > 0) lineCount++;

    // Calculate box height based on number of lines
    const lineHeight = 28;
    const boxHeight = Math.max(100, lineCount * lineHeight + 40);
    const boxY = canvas.height / 2 - boxHeight / 2;

    // Draw message box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(50, boxY, canvas.width - 100, boxHeight);

    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, boxY, canvas.width - 100, boxHeight);

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';

    line = '';
    let y = boxY + 25;

    words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    });
    // Show prompt when message is fully typed
    if (isFullyTyped) {
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Press ENTER to continue', canvas.width / 2, boxY + boxHeight + 25);
    }
}

function drawEndScene() {
    // Draw gradient background
    drawGradientBackground();

    // Draw ground (darker snow color) - 40px height
    ctx.fillStyle = '#1a3a52';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Calculate image dimensions (width 500px responsive, auto height)
    const targetWidth = Math.min(500, canvas.width - 40);
    const imgRatio = images.endSceneElement.height / images.endSceneElement.width;
    const imgHeight = targetWidth * imgRatio;

    // Position: centered horizontally, above ground
    const drawX = (canvas.width - targetWidth) / 2;
    const drawY = canvas.height - 40 - imgHeight;

    ctx.drawImage(images.endSceneElement, drawX, drawY, targetWidth, imgHeight);

    // Draw snow
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // Victory message
    ctx.fillStyle = 'gold';
    ctx.font = 'bold 36px "Space Grotesk", Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 15;
    ctx.fillText('Christmas Saved!', canvas.width / 2, 60);

    // Calculate bonus points
    let bonusScore = playerScore;
    if (gameStartTime && gameEndTime === null) {
        gameEndTime = Date.now();
    }
    const elapsedTime = (gameEndTime - gameStartTime) / 1000; // Convert to seconds

    // Add bonus if completed in less than 20 seconds
    if (elapsedTime < 20) {
        bonusScore += 1000;
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px "Space Grotesk", Arial';
    ctx.fillText(`Score: ${bonusScore}`, canvas.width / 2, 100);

    // Show bonus message if applicable
    if (elapsedTime < 20) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px "Space Grotesk", Arial';
        ctx.fillText(`+1000 Bonus (< 20s)`, canvas.width / 2, 125);
    }

    ctx.fillStyle = 'white';
    ctx.font = '18px "Space Grotesk", Arial';
    ctx.shadowBlur = 10;
    ctx.fillText('Press ENTER to Play Again', canvas.width / 2, 155);
    ctx.shadowBlur = 0;
}

function drawRewardScene() {
    // Draw gradient background
    drawGradientBackground();

    // Draw snow
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // Draw reward card background
    const cardWidth = 320;
    const cardHeight = 400;
    const cardX = (canvas.width - cardWidth) / 2;
    const cardY = (canvas.height - cardHeight) / 2;
    const cardPadding = 24;

    // Draw card with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(cardX + 5, cardY + 5, cardWidth, cardHeight);

    // Draw card background (darker ground color)
    ctx.fillStyle = '#1a3a52';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    // Draw card border
    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

    // Draw reward image
    const rewardImgSize = 120;
    const rewardImgX = cardX + (cardWidth - rewardImgSize) / 2;
    const rewardImgY = cardY + 30;
    ctx.drawImage(images.sonunuReward, rewardImgX, rewardImgY, rewardImgSize, rewardImgSize);

    // Draw reward message with responsive text sizing
    const textMaxWidth = cardWidth - (cardPadding * 2);

    // "You Earned!" title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Earned!', canvas.width / 2, cardY + 170);

    // "1 Gingerbread Cookie" reward text - responsive sizing
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#FFD700';
    const rewardText = '1 Gingerbread Cookie';
    const rewardMetrics = ctx.measureText(rewardText);

    // Scale down if text is too wide
    if (rewardMetrics.width > textMaxWidth) {
        ctx.font = 'bold 14px Arial';
    }
    ctx.fillText(rewardText, canvas.width / 2, cardY + 215);

    // "Press ENTER" instruction text - responsive sizing
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    const instructionText = 'Press ENTER to move to End Scene';
    const instructionMetrics = ctx.measureText(instructionText);

    // Scale down if text is too wide
    if (instructionMetrics.width > textMaxWidth) {
        ctx.font = '11px Arial';
    }
    ctx.fillText(instructionText, canvas.width / 2, cardY + 355);

    // Initialize timer on first draw
    if (!rewardSceneStartTime) {
        rewardSceneStartTime = Date.now();
    }
};

function drawWin() {
    drawEndScene();
}

// ============================================
// GAME LOOP
// ============================================

function resetGame() {
    player.x = 100;
    player.y = GROUND_LEVEL - player.height;
    player.velocityY = 0;
    player.velocityX = 0;
    player.jumpCount = 0;
    player.isMoving = false;
    camera.x = 0;
    gameStartTime = Date.now();
    gameEndTime = null;
    playerScore = 0;
    monstersKilled = 0;
    iceCubesVisited = [];
    starCollected = false;

    // Reset all monsters
    monsters[0].alive = true;
    monsters[0].x = 1000;
    monsters[1].alive = true;
    monsters[1].x = 1950;
    monsters[2].alive = true;
    monsters[2].x = 3280;
    monsters[2].lastJump = Date.now();
    monsters[1].lastJump = Date.now();

    monsters.forEach(m => {
        m.lastShot = Date.now();
        m.velocityY = 0;
        m.y = GROUND_LEVEL - m.height;
    });

    bullets.length = 0;
    xmasTree.hasWon = false;
    celebrationTimer = 0;
    celebrationCharIndex = 0;
}

function gameLoop() {
    if (currentState === GAME_STATE.START) {
        updateSnowflakes();
        drawStartScreen();
    } else if (currentState === GAME_STATE.PLAYING) {
        updateSnowflakes();
        updatePlayer();
        updateCamera();
        updateMonsters();
        updateBullets();
        checkCollisions();
        drawGame();
    } else if (currentState === GAME_STATE.WIN_CELEBRATION) {
        updateSnowflakes();
        drawWinCelebration();

        // Allow skip to reward scene when message is fully typed
        if (keys['Enter']) {
            currentState = GAME_STATE.REWARD_SCENE;
            rewardSceneStartTime = null;
            keys['Enter'] = false;
        }
    } else if (currentState === GAME_STATE.REWARD_SCENE) {
        updateSnowflakes();
        drawRewardScene();

        // Allow skip with ENTER
        if (keys['Enter']) {
            currentState = GAME_STATE.END_SCENE;
            rewardSceneStartTime = null;
            keys['Enter'] = false;
        }
    } else if (currentState === GAME_STATE.END_SCENE) {
        updateSnowflakes();
        drawEndScene();

        // Allow restart
        if (keys['Enter']) {
            currentState = GAME_STATE.PLAYING;
            resetGame();
            keys['Enter'] = false;
        }
    } else if (currentState === GAME_STATE.GAME_OVER) {
        drawGameOver();

        // Allow restart
        if (keys['Enter']) {
            currentState = GAME_STATE.PLAYING;
            resetGame();
            keys['Enter'] = false;
        }
    } else if (currentState === GAME_STATE.WIN) {
        drawWin();

        if (keys['Enter']) {
            currentState = GAME_STATE.PLAYING;
            resetGame();
            keys['Enter'] = false;
        }
    }

    requestAnimationFrame(gameLoop);
}