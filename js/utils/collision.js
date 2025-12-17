// ============================================
// COLLISION DETECTION
// ============================================

import { player } from '../player.js';
import { iceCubes, getCubeDrawY } from '../obstacles.js';
import { monsters, bullets } from '../enemies.js';
import { xmasStar, xmasTree, sonic, getSonicDrawY } from '../collectibles.js';
import { GAME_STATE } from '../config.js';
import * as GameState from '../gameState.js';

export function checkCollisions() {
    // Check ice cube collisions (for ALL sides - top, sides)
    player.onGround = false;

    iceCubes.forEach((cube, index) => {
        // Simple AABB collision detection
        // Use the cube's current draw Y (floating)
        const cubeDrawY = getCubeDrawY(cube);
        if (player.x < cube.x + cube.width &&
            player.x + player.width > cube.x &&
            player.y < cubeDrawY + cube.height &&
            player.y + player.height > cubeDrawY) {

            // Landing on top of cube - add points if not visited
            if (player.velocityY > 0 && player.y + player.height - player.velocityY < cubeDrawY + 5) {
                player.y = cubeDrawY - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                player.jumpCount = 0;
                player.onGround = true;

                // Award points for passing ice cube (+50 points each)
                if (!GameState.iceCubesVisited.includes(index)) {
                    GameState.addIceCubeVisited(index);
                    GameState.addScore(50);
                }
            }
            // Hit from right (moving left into cube)
            else if (player.velocityX < 0 && player.x + player.width - player.velocityX > cube.x + cube.width - 5) {
                player.x = cube.x + cube.width;
                player.velocityX = 0;
            }
            // Hit from left (moving right into cube)
            else if (player.velocityX > 0 && player.x - player.velocityX < cube.x + 5) {
                player.x = cube.x - player.width;
                player.velocityX = 0;
            }
            // Hit from bottom (jumping into cube)
            else if (player.velocityY < 0) {
                player.y = cube.y + cube.height;
                player.velocityY = 0;
            }
        }
    });

    // Check monster collisions (jump on top to kill)
    monsters.forEach(monster => {
        if (!monster.alive) return;

        if (player.x < monster.x + monster.width &&
            player.x + player.width > monster.x &&
            player.y < monster.y + monster.height &&
            player.y + player.height > monster.y) {

            // Jump on top = kill monster
            if (player.velocityY > 0 && player.y < monster.y + 20) {
                monster.alive = false;
                player.velocityY = -8; // Bounce (fixed value to prevent player from disappearing)
                GameState.addScore(500); // +500 points for killing a monster
                GameState.incrementMonstersKilled();
            } else {
                // Hit from side = game over
                if (GameState.gameEndTime === null) {
                    GameState.setGameEndTime(Date.now());
                }
                GameState.setCurrentState(GAME_STATE.GAME_OVER);
            }
        }
    });

    // Check bullet collisions
    bullets.forEach(bullet => {
        if (player.x < bullet.x + bullet.width &&
            player.x + player.width > bullet.x &&
            player.y < bullet.y + bullet.height &&
            player.y + player.height > bullet.y) {
            if (GameState.gameEndTime === null) {
                GameState.setGameEndTime(Date.now());
            }
            GameState.setCurrentState(GAME_STATE.GAME_OVER);
        }
    });

    // Check star collision
    if (!xmasStar.collected &&
        player.x < xmasStar.x + xmasStar.width &&
        player.x + player.width > xmasStar.x &&
        // use static star y
        player.y < xmasStar.y + xmasStar.height &&
        player.y + player.height > xmasStar.y) {
        xmasStar.collected = true;
        player.hasStar = true;
        GameState.setStarCollected(true);
        GameState.addScore(2000); // +2000 points for collecting the star
    }

    // Check sonic badge collision (allow touching or jumping to collect)
    const sonicDrawY = getSonicDrawY();
    if (!sonic.collected &&
        player.x < sonic.x + sonic.width &&
        player.x + player.width > sonic.x &&
        player.y < sonicDrawY + sonic.height &&
        player.y + player.height > sonicDrawY) {
        sonic.collected = true;
        GameState.setSonicCollected(true);
        GameState.addScore(500); // +500 points for sonic badge
    }

    // Check win condition (jump on top of Christmas tree)
    // Only allow winning if the player has collected the star
    if (GameState.starCollected) {
        // Touching/overlapping the tree
        if (player.x < xmasTree.x + xmasTree.width &&
            player.x + player.width > xmasTree.x &&
            player.y < xmasTree.y + xmasTree.height &&
            player.y + player.height > xmasTree.y) {

            // Landing on top of tree = WIN
            if (player.velocityY > 0 && player.y + player.height - player.velocityY < xmasTree.y + 5) {
                player.y = xmasTree.y - player.height;
                player.velocityY = 0;
                xmasTree.hasWon = true;
                GameState.setLevelEnded(true);
                GameState.setCurrentState(GAME_STATE.WIN_CELEBRATION);
                GameState.setCelebrationTimer(Date.now());
                GameState.setCelebrationMessage("You have successfully saved the Sonunu's Town from demonic Grinch Sonunu!");
                if (GameState.gameEndTime === null) {
                    GameState.setGameEndTime(Date.now());
                }
            }
            // Hit from right (moving left into tree)
            else if (player.velocityX < 0 && player.x + player.width - player.velocityX > xmasTree.x + xmasTree.width - 5) {
                player.x = xmasTree.x + xmasTree.width;
                player.velocityX = 0;
            }
            // Hit from left (moving right into tree)
            else if (player.velocityX > 0 && player.x - player.velocityX < xmasTree.x + 5) {
                player.x = xmasTree.x - player.width;
                player.velocityX = 0;
            }
            // Hit from bottom (jumping into tree from below)
            else if (player.velocityY < 0) {
                player.y = xmasTree.y + xmasTree.height;
                player.velocityY = 0;
            }
        }
    } else {
        // If star not collected, tree acts as a wall (block all collisions including jumping over)
        if (player.x < xmasTree.x + xmasTree.width &&
            player.x + player.width > xmasTree.x &&
            player.y < xmasTree.y + xmasTree.height &&
            player.y + player.height > xmasTree.y) {

            // Hit from left (moving right into tree)
            if (player.velocityX > 0 && player.x - player.velocityX < xmasTree.x + 5) {
                player.x = xmasTree.x - player.width;
                player.velocityX = 0;
            }
            // Hit from right (moving left into tree)
            else if (player.velocityX < 0 && player.x + player.width - player.velocityX > xmasTree.x + xmasTree.width - 5) {
                player.x = xmasTree.x + xmasTree.width;
                player.velocityX = 0;
            }
            // Hit from bottom (jumping into tree from below)
            else if (player.velocityY < 0) {
                player.y = xmasTree.y + xmasTree.height;
                player.velocityY = 0;
            }
            // Hit from top (jumping over/landing on tree without star)
            else if (player.velocityY > 0) {
                player.y = xmasTree.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                player.jumpCount = 0;
                player.onGround = true;
            }
        }
    }
}