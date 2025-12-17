import { canvas } from './canvas.js';
import { player } from './player.js';

export const camera = {
    x: 0,
    followThreshold: canvas.width / 3
};

export function updateCamera() {
    if (player.x - camera.x > camera.followThreshold) {
        camera.x = player.x - camera.followThreshold;
    }
    if (camera.x < 0) camera.x = 0;
}

export function resetCamera() {
    camera.x = 0;
}