// ============================================
// COLLISION DETECTION
// ============================================

import { player } from '../player.js';
import { iceCubes } from '../obstacles.js';
import { monsters, bullets } from '../enemies.js';
import { xmasStar, xmasTree } from '../collectibles.js';
import { GAME_STATE } from '../config.js';
import * as GameState from '../gameState.js';

export function checkCollisions() {
    // Check ice cube collisions (for ALL sides - top, sides)
    player.onGround = false;

    iceCubes.forEach((cube, index) => {
        // Simple AABB collision detection
        if (player.x < cube.x + cube.width &&
            player.x + player.width > cube.x &&
            player.y < cube.y + cube.height &&
            player.y + player.height > cube.y) {

            // Landing on top of cube - add points if not visited
            if (player.velocityY > 0 && player.y + player.height - player.velocityY < cube.y + 5) {
                player.y = cube.y - player.height;
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
        player.y < xmasStar.y + xmasStar.height &&
        player.y + player.height > xmasStar.y) {
        xmasStar.collected = true;
        player.hasStar = true;
        GameState.setStarCollected(true);
        GameState.addScore(2000); // +2000 points for collecting the star
    }

    // Check win condition (jump on top of Christmas tree)
    if (player.x < xmasTree.x + xmasTree.width &&
        player.x + player.width > xmasTree.x &&
        player.y < xmasTree.y + xmasTree.height &&
        player.y + player.height > xmasTree.y) {

        // Must land on top of tree
        if (player.velocityY > 0 && player.y < xmasTree.y + 20) {
            xmasTree.hasWon = true;
            GameState.setCurrentState(GAME_STATE.WIN_CELEBRATION);
            GameState.setCelebrationTimer(Date.now());
            GameState.setCelebrationMessage("You have successfully saved the Sonunu's Town from demonic Grinch Sonunu!");
            if (GameState.gameEndTime === null) {
                GameState.setGameEndTime(Date.now());
            }
        }
    }
}