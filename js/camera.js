import { canvas } from './canvas.js';
import { player } from './player.js';
import * as GameState from './gameState.js';
import { xmasTree } from './collectibles.js';

export const camera = {
    x: 0,
    followThreshold: canvas.width / 3
};

export function updateCamera() {
    // If level ended, clamp camera so the tree stays within the right side
    if (GameState.levelEnded) {
        // target so tree's left is at most (canvas.width - 300)
        const maxCameraX = Math.max(0, xmasTree.x - (canvas.width - 300));
        if (camera.x > maxCameraX) camera.x = maxCameraX;
        if (camera.x < 0) camera.x = 0;
        return;
    }

    // Limit camera to not scroll past the tree (even when level not ended)
    const maxCameraX = Math.max(0, xmasTree.x - (canvas.width - 200));
    if (camera.x > maxCameraX) camera.x = maxCameraX;

    if (player.x - camera.x > camera.followThreshold) {
        camera.x = player.x - camera.followThreshold;
    }
    if (camera.x < 0) camera.x = 0;
}

export function resetCamera() {
    camera.x = 0;
}