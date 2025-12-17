import { GROUND_LEVEL } from './config.js';
import { images } from './imageLoader.js';
import { ctx } from './canvas.js';
import { player } from './player.js';
import { sonic } from './collectibles.js';
import * as GameState from './gameState.js';

export const monsters = [
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
        lastJump: Date.now(),
        velocityX: 0
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
        lastJump: Date.now(),
        // patrol properties
        patrolLeft: 1850,
        patrolRight: 2050,
        velocityX: 1.4,
        shootDistance: 200
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
        patrolLeft: 3180,
        patrolRight: 3380,
        velocityX: 1.6,
        shootDistance: 200
    },
    // Additional monster placed below the Sonic badge
    {
        x: sonic.x || 2600,
        y: GROUND_LEVEL - 80,
        width: 80,
        height: 80,
        shootInterval: 1200,
        lastShot: Date.now(),
        alive: true,
        jumps: true,
        velocityY: 0,
        gravity: 0.6,
        jumpPower: -12,
        jumpInterval: 2000,
        lastJump: Date.now(),
        patrolLeft: (sonic.x || 2600) - 120,
        patrolRight: (sonic.x || 2600) + 120,
        velocityX: 1.2,
        shootDistance: 200
    }
];

export const bullets = [];

export function updateMonsters() {
    const currentTime = Date.now();

    monsters.forEach(monster => {
        if (!monster.alive) return;

        // horizontal patrol movement if configured
        if (typeof monster.velocityX === 'number' && (monster.patrolLeft !== undefined || monster.patrolRight !== undefined)) {
            monster.x += monster.velocityX;
            if (monster.patrolLeft !== undefined && monster.x < monster.patrolLeft) {
                monster.x = monster.patrolLeft;
                monster.velocityX *= -1;
            }
            if (monster.patrolRight !== undefined && monster.x > monster.patrolRight) {
                monster.x = monster.patrolRight;
                monster.velocityX *= -1;
            }
        }

        if (monster.jumps) {
            monster.velocityY += monster.gravity;
            monster.y += monster.velocityY;

            if (monster.y + monster.height >= GROUND_LEVEL) {
                monster.y = GROUND_LEVEL - monster.height;
                monster.velocityY = 0;
            }

            if (currentTime - monster.lastJump > monster.jumpInterval &&
                monster.y + monster.height >= GROUND_LEVEL) {
                monster.velocityY = monster.jumpPower;
                monster.lastJump = currentTime;
            }
        }

        // Start snow when player passes the second monster
        // REMOVED: Snow now fades in automatically after 2-second delay in gameScreen

        if (monster.shootInterval > 0 && currentTime - monster.lastShot > monster.shootInterval) {
            const distanceToPlayer = Math.abs(monster.x - player.x);
            const shootDist = monster.shootDistance || 300;
            if (distanceToPlayer < shootDist) {
                if (monster.isChallenge) {
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
                } else {
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
        }
    });
}

export function updateBullets(cameraX) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].speed;

        if (bullets[i].x < cameraX - 100) {
            bullets.splice(i, 1);
        }
    }
}

export function drawMonsters() {
    monsters.forEach(monster => {
        if (monster.alive) {
            ctx.drawImage(images.monster, monster.x, monster.y, monster.width, monster.height);
        }
    });
}

export function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(images.iceBullet, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

export function resetMonsters() {
    monsters[0].alive = true;
    monsters[0].x = 1000;
    monsters[1].alive = true;
    monsters[1].x = 1950;
    monsters[2].alive = true;
    monsters[2].x = 3280;
    // Reset the extra sonic-area monster to stay below the sonic badge
    if (monsters[3]) {
        monsters[3].alive = true;
        monsters[3].x = sonic.x || 2600;
    }

    monsters.forEach(m => {
        m.lastShot = Date.now();
        m.lastJump = Date.now();
        m.velocityY = 0;
        m.y = GROUND_LEVEL - m.height;
    });

    bullets.length = 0;
}