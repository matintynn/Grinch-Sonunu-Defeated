import { GROUND_LEVEL, PLAYER_CONFIG } from './config.js';
import { keys, touch } from './utils/input.js';
import { images } from './imageLoader.js';
import { ctx } from './canvas.js';
import * as GameState from './gameState.js';
import { xmasTree } from './collectibles.js';

export const player = {
    x: 100,
    y: GROUND_LEVEL - PLAYER_CONFIG.height,
    width: PLAYER_CONFIG.width,
    height: PLAYER_CONFIG.height,
    velocityY: 0,
    velocityX: 0,
    speed: PLAYER_CONFIG.speed,
    gravity: PLAYER_CONFIG.gravity,
    isJumping: false,
    jumpCount: 0,
    maxJumps: PLAYER_CONFIG.maxJumps,
    onGround: false,
    isMoving: false,
    hasStar: false,
    jumpHeights: PLAYER_CONFIG.jumpHeights,
    facingRight: true // Track horizontal direction
};

export function updatePlayer() {
    // Keyboard controls
    if (keys['ArrowRight']) {
        player.velocityX = player.speed;
        player.isMoving = true;
        player.facingRight = true;
    } else if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
        player.isMoving = true;
        player.facingRight = false;
    } else {
        player.velocityX = 0;
        player.isMoving = false;
    }

    // Touch controls
    if (touch.isTouching) {
        const deltaX = touch.currentX - touch.startX;
        const deltaY = touch.currentY - touch.startY;

        if (Math.abs(deltaX) > 20) {
            if (deltaX > 0) {
                player.velocityX = player.speed;
                player.isMoving = true;
                player.facingRight = true;
            } else {
                player.velocityX = -player.speed;
                player.isMoving = true;
                player.facingRight = false;
            }
        }

        if (deltaY < -30 && player.jumpCount < player.maxJumps) {
            player.velocityY = player.jumpHeights[player.jumpCount];
            player.isJumping = true;
            player.jumpCount++;
            touch.startY = touch.currentY;
        }
    }

    player.x += player.velocityX;
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= GROUND_LEVEL) {
        player.y = GROUND_LEVEL - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        player.jumpCount = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }

    if (player.x < 0) player.x = 0;
    // Prevent moving past tree (max 120px beyond tree)
    const maxPlayerX = xmasTree.x + xmasTree.width + 120;
    if (player.x > maxPlayerX) player.x = maxPlayerX;
    // Collision detection will handle tree interactions (landing on top, side blocking)
}

export function handleJump() {
    if (keys['ArrowUp'] && player.jumpCount < player.maxJumps) {
        player.velocityY = player.jumpHeights[player.jumpCount];
        player.isJumping = true;
        player.jumpCount++;
    }
}

export function drawPlayer() {
    let playerImage;
    if (player.hasStar && player.isMoving) {
        playerImage = images.sonunuRunStar;
    } else if (player.isMoving) {
        playerImage = images.sonunuRun;
    } else {
        playerImage = images.sonunuNormal;
    }

    // Draw with horizontal flip if facing left
    if (!player.facingRight) {
        ctx.save();
        ctx.translate(player.x + player.width, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(playerImage, 0, 0, player.width, player.height);
        ctx.restore();
    } else {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }
}

export function resetPlayer() {
    player.x = 100;
    player.y = GROUND_LEVEL - player.height;
    player.velocityY = 0;
    player.velocityX = 0;
    player.jumpCount = 0;
    player.isMoving = false;
    player.hasStar = false;
}