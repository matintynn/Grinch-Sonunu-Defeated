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
}