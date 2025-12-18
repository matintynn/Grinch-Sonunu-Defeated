// ============================================
// WIN SCREENS (CELEBRATION, REWARD, END)
// ============================================

import { canvas, ctx } from '../canvas.js';
import { images } from '../imageLoader.js';
import { drawGradientBackground, drawNoiseEffect, drawGround } from '../background.js';
import { drawSnowflakes } from '../snowEffect.js';
import { drawGame } from './gameScreen.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';

// Floating animation state (same as start screen)
let floatingOffset = 0;
let floatingDirection = 1;

function drawFloatingSonic() {
    // Update floating animation
    floatingOffset += 0.3 * floatingDirection;
    if (floatingOffset > 15) floatingDirection = -1;
    if (floatingOffset < -15) floatingDirection = 1;

    // Sonic badge size and position (match startScreen)
    const sonicSize = 70;
    const sonicX = canvas.width / 2 - sonicSize / 2;
    const sonicY = canvas.height / 6 - sonicSize / 2 + floatingOffset;

    // Draw glow effect
    ctx.shadowColor = 'rgba(255, 200, 0, 0.6)';
    ctx.shadowBlur = 10;

    // Draw sonic badge
    ctx.drawImage(images.sonic, sonicX, sonicY, sonicSize, sonicSize);

    // Reset shadow
    ctx.shadowBlur = 0;
}

export function drawWinCelebration() {
    // Keep showing the game with completed tree
    drawGame();

    // Floating Sonic on celebration screen
    drawFloatingSonic();

    // Typewriter effect
    const elapsedTime = Date.now() - GameState.celebrationTimer;
    const charsToShow = Math.floor(elapsedTime / 50); // 50ms per character
    const isFullyTyped = charsToShow >= GameState.celebrationMessage.length;
    const displayText = isFullyTyped ? GameState.celebrationMessage : GameState.celebrationMessage.substring(0, charsToShow);

    // Calculate box dimensions based on text
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `${themeFonts.large} ${themeFonts.primary}`;
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
    ctx.fillStyle = themeColors.bgDialogDark;
    ctx.fillRect(50, boxY, canvas.width - 100, boxHeight);

    ctx.strokeStyle = themeColors.accentBorderDialog;
    ctx.lineWidth = 3;
    ctx.strokeRect(50, boxY, canvas.width - 100, boxHeight);

    // Draw text
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `${themeFonts.large} ${themeFonts.primary}`;
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

    // Show prompt when message is fully typed
    if (isFullyTyped) {
        ctx.fillStyle = themeColors.yellowPrimary;
        ctx.font = `bold ${themeFonts.small} ${themeFonts.primary}`;
        ctx.fillText('Press ENTER to continue', canvas.width / 2, boxY + boxHeight + 25);
    }
}

export function drawRewardScene() {
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
    ctx.fillStyle = themeColors.bgDialogShadow;
    ctx.fillRect(cardX + 5, cardY + 5, cardWidth, cardHeight);

    // Draw card background (darker ground color)
    ctx.fillStyle = themeColors.bgGround;
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    // Draw card border
    ctx.strokeStyle = themeColors.accentBorderDialog;
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
    ctx.fillStyle = themeColors.goldPrimary;
    ctx.font = `bold 20px ${themeFonts.primary}`;
    ctx.textAlign = 'center';
    ctx.fillText('You Earned!', canvas.width / 2, cardY + 170);

    // "1 Gingerbread Cookie" reward text - responsive sizing
    ctx.font = `bold 18px ${themeFonts.primary}`;
    ctx.fillStyle = themeColors.goldPrimary;
    const rewardText = '1 Gingerbread Cookie';
    const rewardMetrics = ctx.measureText(rewardText);

    // Scale down if text is too wide
    if (rewardMetrics.width > textMaxWidth) {
        ctx.font = `bold 14px ${themeFonts.primary}`;
    }
    ctx.fillText(rewardText, canvas.width / 2, cardY + 215);

    // "Press ENTER" instruction text - responsive sizing
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `${themeFonts.small} ${themeFonts.primary}`;
    const instructionText = 'Press ENTER to move to End Scene';
    const instructionMetrics = ctx.measureText(instructionText);

    // Scale down if text is too wide
    if (instructionMetrics.width > textMaxWidth) {
        ctx.font = `11px ${themeFonts.primary}`;
    }
    ctx.fillText(instructionText, canvas.width / 2, cardY + 355);

    // Initialize timer on first draw
    if (!GameState.rewardSceneStartTime) {
        GameState.setRewardSceneStartTime(Date.now());
    }
}

export function drawEndScene() {
    // Draw gradient background
    drawGradientBackground();

    // Floating Sonic on end scene (same position as start)
    drawFloatingSonic();

    // Draw ground (darker snow color) - 40px height
    ctx.fillStyle = themeColors.bgGround;
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Calculate image dimensions (width 500px responsive, auto height)
    const targetWidth = Math.min(500, canvas.width - 40);
    const imgRatio = images.endSceneElement.height / images.endSceneElement.width;
    const imgHeight = targetWidth * imgRatio;

    // Position: centered horizontally, above ground
    const drawX = (canvas.width - targetWidth) / 2;
    const drawY = canvas.height - 40 - imgHeight - 18;

    ctx.drawImage(images.endSceneElement, drawX, drawY, targetWidth, imgHeight);

    // Draw ground with snowy effect
    drawGround();

    // Draw snow
    drawSnowflakes();

    // Add noise effect
    drawNoiseEffect();

    // Victory message - centered vertically and horizontally
    // Calculate bonus points
    let bonusScore = GameState.playerScore;
    if (GameState.gameStartTime && GameState.gameEndTime === null) {
        GameState.setGameEndTime(Date.now());
    }
    const elapsedTime = (GameState.gameEndTime - GameState.gameStartTime) / 1000; // seconds
    if (elapsedTime < 22) bonusScore += 1000;

    const titleText = 'Christmas Saved!';
    const scoreText = `Score: ${bonusScore}`;
    const bonusText = `+1000 Bonus (less than 22s)`;
    const promptText = 'Press ENTER to Play Again';

    const titleFont = `bold ${themeFonts.title} ${themeFonts.fancy}`;
    const scoreFont = `bold ${themeFonts.medium} ${themeFonts.fancy}`;
    const promptFont = `${themeFonts.medium} ${themeFonts.fancy}`;
    const lineSpacing = 8;

    const lines = [
        { text: titleText, font: titleFont, color: themeColors.accentBorderDialog, shadow: 10 },
        { text: scoreText, font: scoreFont, color: themeColors.goldPrimary, shadow: 0 },
    ];
    if (elapsedTime < 20) {
        lines.push({ text: bonusText, font: scoreFont, color: themeColors.goldPrimary, shadow: 0 });
    }
    lines.push({ text: promptText, font: promptFont, color: themeColors.whitePrimary, shadow: 10 });

    // Measure total block height
    let totalHeight = 0;
    const sizes = lines.map(l => {
        const m = l.font.match(/(\d+)px/);
        const size = m ? parseInt(m[1], 10) : parseInt(themeFonts.medium, 10) || 16;
        totalHeight += size + lineSpacing;
        return size;
    });
    totalHeight -= lineSpacing; // remove last spacing

    // Starting Y to center block
    let y = Math.round(canvas.height / 2 - totalHeight / 2) - 70;

    ctx.textAlign = 'center';
    // Draw each line
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const sz = sizes[i];
        ctx.font = l.font;
        ctx.fillStyle = l.color;
        if (l.shadow) {
            ctx.shadowColor = 'black';
            ctx.shadowBlur = l.shadow;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fillText(l.text, canvas.width / 2, y + sz / 2);
        y += sz + lineSpacing;
    }
    ctx.shadowBlur = 0;
}