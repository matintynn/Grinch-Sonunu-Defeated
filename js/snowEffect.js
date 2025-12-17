import { canvas, ctx } from './canvas.js';
import { themeColors } from './themeColors.js';

export const snowflakes = [];
export let snowOpacity = 0; // Fade-in opacity for snow

export function createSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() < 0.23 ? 5 : Math.random() < 0.56 ? 6 : 10,
            speed: Math.random() * 0.5 + 0.3,
            drift: Math.random() * 0.5 - 0.25
        });
    }
}

export function updateSnowflakes() {
    // Gradually fade in snow opacity (called in both start screen and game screen)
    if (snowOpacity < 0.8) {
        snowOpacity += 0.02;
    }

    snowflakes.forEach(flake => {
        flake.y += flake.speed;
        flake.x += flake.drift;

        if (flake.y > canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
        }
    });
}

export function drawSnowflakes() {
    ctx.fillStyle = `rgba(255, 255, 255, ${snowOpacity * 0.8})`; // Use snowOpacity for fade-in
    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

