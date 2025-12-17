// ============================================
// START SCREEN & STORY DIALOG
// ============================================

import { canvas, ctx } from '../canvas.js';
import { images } from '../imageLoader.js';
import { drawGradientBackground, drawNoiseEffect } from '../background.js';
import { drawSnowflakes } from '../snowEffect.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';

export function drawStartScreen() {
    // Draw gradient background
    drawGradientBackground();

    // Draw ground (darker snow color) - 40px height
    ctx.fillStyle = themeColors.bgGround;
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
    if (!GameState.showStartDialog) {
        ctx.fillStyle = themeColors.whitePrimary;
        ctx.font = `bold ${themeFonts.huge} ${themeFonts.primary}`;
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

    const elapsedTime = Date.now() - GameState.startDialogTimer;
    const charsToShow = Math.floor(elapsedTime / 50); // 50ms per character

    // Build the full text up to the current character count
    let fullText = storyLines.join(' ');
    const displayText = fullText.substring(0, Math.min(charsToShow, fullText.length));

    // Calculate box dimensions based on text
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `${themeFonts.medium} ${themeFonts.primary}`;
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
    ctx.fillStyle = themeColors.bgDialog;
    ctx.fillRect(40, boxY, canvas.width - 80, boxHeight);

    ctx.strokeStyle = themeColors.accentBorderDialog;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, boxY, canvas.width - 80, boxHeight);

    // Draw text
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `${themeFonts.medium} ${themeFonts.primary}`;
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
        ctx.fillStyle = themeColors.yellowPrimary;
        ctx.font = `bold ${themeFonts.small} ${themeFonts.primary}`;
        ctx.fillText('Press ENTER to Start the Rescue', canvas.width / 2, boxY + boxHeight + 25);
    }
}