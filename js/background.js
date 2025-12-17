import { canvas, ctx } from './canvas.js';
import { GROUND_LEVEL, GROUND_HEIGHT } from './config.js';
import { images } from './imageLoader.js';
import { themeColors, themeOpacity } from './themeColors.js';

export function drawGradientBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, themeColors.bgGradientTop);
    gradient.addColorStop(1, themeColors.bgGradientBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawNoiseEffect() {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * themeOpacity.dialog) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawGround() {
    ctx.fillStyle = themeColors.bgGround;
    ctx.fillRect(0, GROUND_LEVEL, canvas.width, GROUND_HEIGHT);
}

export function drawBackgroundElements() {
    const bgScale = 150;
    ctx.drawImage(images.bgElement1, 0, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement2, 800, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement1, 1600, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement2, 2400, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement1, 3200, GROUND_LEVEL - bgScale, 300, bgScale);
    // Additional 3 bg_element2 at varied positions
    ctx.drawImage(images.bgElement2, 1100, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement2, 2000, GROUND_LEVEL - bgScale, 300, bgScale);
    ctx.drawImage(images.bgElement2, 2900, GROUND_LEVEL - bgScale, 300, bgScale);
}