// ============================================
// MAIN GAME SCREEN
// ============================================

import { canvas, ctx } from '../canvas.js';
import { drawGradientBackground, drawGround, drawNoiseEffect, drawBackgroundElements } from '../background.js';
import { drawSnowflakes } from '../snowEffect.js';
import { drawPlayer } from '../player.js';
import { drawIceCubes } from '../obstacles.js';
import { drawMonsters, drawBullets } from '../enemies.js';
import { drawStar, drawTree } from '../collectibles.js';
import { camera } from '../camera.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';

export function drawGame() {
    // Draw gradient background
    drawGradientBackground();

    // Draw ground (darker snow color)
    drawGround();

    // Draw snow on ground level
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

    // Draw score on top right
    ctx.fillStyle = themeColors.goldPrimary;
    ctx.font = `bold ${themeFonts.xlarge} ${themeFonts.primary}`;
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${GameState.playerScore}`, canvas.width - 20, 40);
}