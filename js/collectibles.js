import { GROUND_LEVEL } from './config.js';
import { images } from './imageLoader.js';
import { ctx } from './canvas.js';

export const xmasStar = {
    x: 3200,
    y: GROUND_LEVEL - 220 - 20 - 50,
    width: 50,
    height: 50,
    collected: false
};

export const sonic = {
    x: 2600,
    y: GROUND_LEVEL - 220 - 20 - 50,
    width: 50,
    height: 50,
    collected: false
};

export const xmasTree = {
    x: 3400,
    y: GROUND_LEVEL - 180,
    width: 180,
    height: 180,
    hasWon: false
};

export function drawStar() {
    if (!xmasStar.collected) {
        ctx.drawImage(images.star, xmasStar.x, xmasStar.y, xmasStar.width, xmasStar.height);
    }
}

export function drawTree() {
    const treeImage = xmasTree.hasWon ? images.xmasTreeComplete : images.xmasTree;
    ctx.drawImage(treeImage, xmasTree.x, xmasTree.y, xmasTree.width, xmasTree.height);
}

export function drawSonic() {
    // Draw the small Sonic badge/object if not collected
    if (!sonic.collected) {
        // floating effect using sine wave
        const float = Math.sin(Date.now() / 400 + sonic.x * 0.001) * 8;
        ctx.drawImage(images.sonic, sonic.x, sonic.y + float, sonic.width, sonic.height);
    }
}

export function getSonicDrawY() {
    // Use same float formula as drawSonic so collision checks match render
    const float = Math.sin(Date.now() / 400 + sonic.x * 0.001) * 8;
    return sonic.y + float;
}

export function resetCollectibles() {
    xmasStar.collected = false;
    xmasTree.hasWon = false;
    sonic.collected = false;
}