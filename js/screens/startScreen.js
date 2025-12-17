// ============================================
// START SCREEN & STORY DIALOG
// ============================================

import { canvas, ctx } from '../canvas.js';
import { images } from '../imageLoader.js';
import { drawGradientBackground, drawNoiseEffect } from '../background.js';
import { drawSnowflakes } from '../snowEffect.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';

// Floating animation state
let floatingOffset = 0;
let floatingDirection = 1;

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

    // Draw floating Sonic badge in center
    drawFloatingSonic();

    // Draw snow
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // If not showing dialog, show prompt
    if (!GameState.showStartDialog) {
        // Draw "Press Enter To Start" with border
        drawPressEnterWithBorder();
    } else {
        // Show story dialog with typewriter effect
        drawStoryDialog();
    }
}

function drawFloatingSonic() {
    // Update floating animation
    floatingOffset += 0.3 * floatingDirection;
    if (floatingOffset > 15) floatingDirection = -1;
    if (floatingOffset < -15) floatingDirection = 1;

    // Sonic badge size and position
    const sonicSize = 70;
    const sonicX = canvas.width / 2 - sonicSize / 2;
    const sonicY = canvas.height / 5 - sonicSize / 2 + floatingOffset;

    // Draw glow effect
    ctx.shadowColor = 'rgba(255, 200, 0, 0.6)';
    ctx.shadowBlur = 10;

    // Draw sonic badge
    ctx.drawImage(images.sonic, sonicX, sonicY, sonicSize, sonicSize);

    // Reset shadow
    ctx.shadowBlur = 0;
}

function drawPressEnterWithBorder() {
    const text = 'Press Enter To Start';
    const fontSize = themeFonts.huge;
    const font = `bold ${fontSize} ${themeFonts.primary}`;

    ctx.font = font;
    ctx.textAlign = 'center';

    // Measure text for border
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(fontSize);

    const x = canvas.width / 2;
    const y = 236;

    // Draw border rectangle around text
    const padding = 30;
    const rectX = x - textWidth / 2 - padding;
    // const rectY = y - textHeight - padding / 2;
    const rectY = 200;
    const rectWidth = textWidth + padding * 2;
    const rectHeight = textHeight + padding;

    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Draw text with shadow
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 15;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
}

function drawStoryDialog() {
    const storyLines = [
        'Oh no! The Grinch stole the X-mas Star!',
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
    const boxY = 180; // Fixed at top with 100px margin

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
        ctx.font = `bold ${themeFonts.medium} ${themeFonts.primary}`;
        ctx.fillText('Enter to Rescue X-mas', canvas.width / 2, boxY + boxHeight + 25);
    }
}