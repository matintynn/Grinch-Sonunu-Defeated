// ============================================
// MAIN GAME SCREEN
// ============================================

import { canvas, ctx } from '../canvas.js';
import { drawGradientBackground, drawGround, drawNoiseEffect, drawBackgroundElements } from '../background.js';
import { drawSnowflakes } from '../snowEffect.js';
import { drawPlayer } from '../player.js';
import { drawIceCubes } from '../obstacles.js';
import { drawMonsters, drawBullets } from '../enemies.js';
import { drawStar, drawTree, drawSonic } from '../collectibles.js';
import { camera } from '../camera.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';
import { images } from '../imageLoader.js';
import { touch, keys } from '../utils/input.js';

export function drawGame() {
    // Draw gradient background
    drawGradientBackground();

    // Draw ground (darker snow color)
    drawGround();

    // Draw snow on ground level (always falling)
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // Save context for camera
    ctx.save();
    ctx.translate(-camera.x, 0);

    // Draw background elements aligned to ground
    drawBackgroundElements();

    // Draw ice cubes
    drawIceCubes();

    // Draw star if not collected
    drawStar();

    // Draw Sonic badge if not collected
    drawSonic();

    // Draw monsters
    drawMonsters();

    // Draw bullets
    drawBullets();

    // Draw player
    drawPlayer();

    // Draw Christmas tree (drawn after player so tree appears behind)
    drawTree();

    ctx.restore();

    // Draw UI - Game instructions on top left
    ctx.fillStyle = themeColors.goldPrimary;
    ctx.font = `bold ${themeFonts.medium} ${themeFonts.primary}`;
    ctx.textAlign = 'left';
    ctx.fillText('← → Move | ↑ Jump', 20, 40);

    // Draw score on top right with Sonic badge if collected
    ctx.fillStyle = themeColors.goldPrimary;
    ctx.font = `bold ${themeFonts.xlarge} ${themeFonts.primary}`;
    ctx.textAlign = 'right';

    // If Sonic badge collected, show it next to score
    if (GameState.sonicCollected) {
        const scoreText = `Score: ${GameState.playerScore}`;
        const scoreX = canvas.width - 20;
        const scoreY = 40;

        // Draw score text
        ctx.fillText(scoreText, scoreX, scoreY);

        // Draw small Sonic badge next to score
        const badgeSize = 30;
        const badgeX = scoreX - ctx.measureText(scoreText).width - badgeSize - 10;
        const badgeY = scoreY - badgeSize + 5;

        // Add glow effect
        ctx.shadowColor = 'rgba(0, 150, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.drawImage(images.sonic, badgeX, badgeY, badgeSize, badgeSize);
        ctx.shadowBlur = 0;

        // Add "Fast Sonic Sonunu!" text below
        ctx.fillStyle = themeColors.accentBorderDialog;
        ctx.font = `bold ${themeFonts.small} ${themeFonts.primary}`;
        ctx.fillText('⚡ Fast Sonic Sonunu!', scoreX, scoreY + 20);
    } else {
        // Just show score normally
        ctx.fillText(`Score: ${GameState.playerScore}`, canvas.width - 20, 40);
    }

    // Draw mobile on-screen controls when touch device available
    drawMobileControls();
}

// Button rects (in canvas coordinates)
let leftBtn = null;
let rightBtn = null;
let upBtn = null;

function isPointInRect(x, y, rect) {
    if (!rect) return false;
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function drawMobileControls() {
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    // size and positions
    const size = 64;
    const pad = 16;
    const leftX = 20;
    const leftY = canvas.height - size - 20;
    const rightX = leftX + size + 12;
    const rightY = leftY;
    const upX = canvas.width - size - 20;
    const upY = canvas.height - size - 20;

    leftBtn = { x: leftX, y: leftY, w: size, h: size };
    rightBtn = { x: rightX, y: rightY, w: size, h: size };
    upBtn = { x: upX, y: upY, w: size, h: size };

    // Draw semi-transparent circles for buttons
    ctx.save();
    ctx.globalAlpha = 0.85;

    // left
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    roundRect(ctx, leftBtn.x, leftBtn.y, leftBtn.w, leftBtn.h, 14, true, false);
    // draw arrow
    drawArrow(leftBtn.x + leftBtn.w / 2 + 6, leftBtn.y + leftBtn.h / 2, 'left');

    // right
    roundRect(ctx, rightBtn.x, rightBtn.y, rightBtn.w, rightBtn.h, 14, true, false);
    drawArrow(rightBtn.x + rightBtn.w / 2 - 6, rightBtn.y + rightBtn.h / 2, 'right');

    // up (jump)
    roundRect(ctx, upBtn.x, upBtn.y, upBtn.w, upBtn.h, 14, true, false);
    drawArrow(upBtn.x + upBtn.w / 2, upBtn.y + upBtn.h / 2 + 2, 'up');

    ctx.restore();

    // Input handling: continuous for touch move, tap for click
    if (touch.isTouching) {
        const tx = touch.currentX;
        const ty = touch.currentY;
        keys['ArrowLeft'] = isPointInRect(tx, ty, leftBtn);
        keys['ArrowRight'] = isPointInRect(tx, ty, rightBtn);
        // Jump should trigger only on initial touch; use a small threshold: if touching up area, set ArrowUp true
        keys['ArrowUp'] = isPointInRect(tx, ty, upBtn);
    } else {
        // If a tap event occurred (touch.tapX), convert to a short key press
        if (touch.tapX !== null) {
            const tx = touch.tapX;
            const ty = touch.tapY;
            if (isPointInRect(tx, ty, leftBtn)) {
                keys['ArrowLeft'] = true;
                setTimeout(() => keys['ArrowLeft'] = false, 150);
            }
            if (isPointInRect(tx, ty, rightBtn)) {
                keys['ArrowRight'] = true;
                setTimeout(() => keys['ArrowRight'] = false, 150);
            }
            if (isPointInRect(tx, ty, upBtn)) {
                keys['ArrowUp'] = true;
                setTimeout(() => keys['ArrowUp'] = false, 150);
            }
            // consume tap
            touch.tapX = null;
            touch.tapY = null;
        }
    }
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    if (r === undefined) r = 5;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function drawArrow(cx, cy, dir) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    if (dir === 'left') {
        ctx.moveTo(cx + 10, cy - 14);
        ctx.lineTo(cx - 6, cy);
        ctx.lineTo(cx + 10, cy + 14);
    } else if (dir === 'right') {
        ctx.moveTo(cx - 10, cy - 14);
        ctx.lineTo(cx + 6, cy);
        ctx.lineTo(cx - 10, cy + 14);
    } else if (dir === 'up') {
        ctx.moveTo(cx - 14, cy + 8);
        ctx.lineTo(cx, cy - 10);
        ctx.lineTo(cx + 14, cy + 8);
    }
    ctx.closePath();
    ctx.fill();
}