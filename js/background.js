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
    // Create a more visible retro noise effect
    const noiseIntensity = 0.08; // Adjust this value (0.05 to 0.15 works well)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Add noise to every pixel
    for (let i = 0; i < pixels.length; i += 4) {
        const noise = (Math.random() - 0.5) * 255 * noiseIntensity;
        pixels[i] += noise;     // Red
        pixels[i + 1] += noise; // Green
        pixels[i + 2] += noise; // Blue
        // pixels[i + 3] is alpha, we don't change it
    }

    ctx.putImageData(imageData, 0, 0);

    // Add subtle scanline effect for extra retro feel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let y = 0; y < canvas.height; y += 2) {
        ctx.fillRect(0, y, canvas.width, 1);
    }
}

export function drawGround() {
    // Draw main ground
    ctx.fillStyle = themeColors.bgGround;
    ctx.fillRect(0, GROUND_LEVEL, canvas.width, GROUND_HEIGHT);

    // Draw wavy snow on top of ground
    drawSnowOnGround();
}

function drawSnowOnGround() {
    // CUSTOMIZE THESE VALUES to change the snow appearance
    const snowHeight = 11;        // Height of snow layer (try 6-12)
    const waveHeight = 5;          // How tall the waves are (try 2-6)
    const waveFrequency = 0.02;    // How many waves (try 0.01-0.04)

    ctx.fillStyle = themeColors.accentSnow; // White snow color
    ctx.beginPath();

    // Start at the left side of ground
    ctx.moveTo(0, GROUND_LEVEL);

    // Create wavy top edge using sine wave
    for (let x = 0; x <= canvas.width; x += 2) {
        const y = GROUND_LEVEL + Math.sin(x * waveFrequency) * waveHeight;
        ctx.lineTo(x, y);
    }

    // Complete the shape (go down, across, and back up)
    ctx.lineTo(canvas.width, GROUND_LEVEL + snowHeight);
    ctx.lineTo(0, GROUND_LEVEL + snowHeight);
    ctx.closePath();
    ctx.fill();
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