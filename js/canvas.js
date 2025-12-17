import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

    let canvasWidth = windowWidth - 48;
    let canvasHeight = canvasWidth / aspectRatio;

    if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight - 48;
        canvasWidth = canvasHeight * aspectRatio;
    }

    if (canvasWidth < 320) canvasWidth = 320;
    if (canvasHeight < 240) canvasHeight = 240;

    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    canvas.style.position = 'fixed';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);