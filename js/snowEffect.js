import { canvas, ctx } from './canvas.js';
import { themeColors } from './themeColors.js';

export const snowflakes = [];

export function createSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() < 0.33 ? 6 : Math.random() < 0.66 ? 8 : 12,
            speed: Math.random() * 0.5 + 0.3,
            drift: Math.random() * 0.5 - 0.25
        });
    }
}

export function updateSnowflakes() {
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
    ctx.fillStyle = themeColors.accentSnow;
    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}