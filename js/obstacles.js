import { GROUND_LEVEL } from './config.js';
import { images } from './imageLoader.js';
import { ctx } from './canvas.js';

export const iceCubes = [
    { x: 400, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 800, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 836, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1200, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1200, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
    { x: 1600, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1656, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1628, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
    { x: 1800, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1856, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1912, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 1828, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
    { x: 1882, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
    { x: 1854, y: GROUND_LEVEL - 112, width: 50, height: 50, type: 1 },
    { x: 2300, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 2356, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 2412, y: GROUND_LEVEL - 42, width: 50, height: 50, type: 1 },
    { x: 2328, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
    { x: 2382, y: GROUND_LEVEL - 78, width: 50, height: 50, type: 1 },
    { x: 2354, y: GROUND_LEVEL - 112, width: 50, height: 50, type: 1 },
    { x: 2900, y: GROUND_LEVEL - 140, width: 50, height: 50, type: 1 },
    { x: 3060, y: GROUND_LEVEL - 180, width: 50, height: 50, type: 1 },
    { x: 3200, y: GROUND_LEVEL - 240, width: 50, height: 50, type: 1 }
];

export function drawIceCubes() {
    iceCubes.forEach(cube => {
        ctx.drawImage(images.iceCube1, cube.x, cube.y, cube.width, cube.height);
    });
}