// ============================================
// MAIN GAME LOOP & INITIALIZATION
// ============================================

import { loadAllImages } from './imageLoader.js';
import { createSnowflakes, updateSnowflakes } from './snowEffect.js';
import { setupKeyboardControls, setupTouchControls, keys } from './utils/input.js';
import { updatePlayer, resetPlayer, handleJump } from './player.js';
import { updateCamera, resetCamera, camera } from './camera.js';
import { updateMonsters, updateBullets, resetMonsters } from './enemies.js';
import { resetCollectibles } from './collectibles.js';
import { checkCollisions } from './utils/collision.js';
import { drawStartScreen } from './screens/startScreen.js';
import { drawGame } from './screens/gameScreen.js';
import { drawGameOver } from './screens/gameOverScreen.js';
import { drawWinCelebration, drawRewardScene, drawEndScene } from './screens/winScreen.js';
import { GAME_STATE } from './config.js';
import * as GameState from './gameState.js';

// Initialize
createSnowflakes();
setupKeyboardControls();
setupTouchControls();

// Reset game function
function resetGame() {
    resetPlayer();
    resetCamera();
    resetMonsters();
    resetCollectibles();
    GameState.resetGameState();
}

// Main game loop
function gameLoop() {
    if (GameState.currentState === GAME_STATE.START) {
        updateSnowflakes();
        drawStartScreen();

        // Handle start game
        if (keys['Enter']) {
            if (!GameState.showStartDialog) {
                GameState.setShowStartDialog(true);
                GameState.setStartDialogTimer(Date.now());
            } else {
                GameState.setCurrentState(GAME_STATE.PLAYING);
                resetGame();
                GameState.setShowStartDialog(false);
            }
            keys['Enter'] = false;
        }
    }
    else if (GameState.currentState === GAME_STATE.PLAYING) {
        updateSnowflakes();
        handleJump();
        updatePlayer();
        updateCamera();
        updateMonsters();
        updateBullets(camera.x);
        checkCollisions();
        drawGame();
    }
    else if (GameState.currentState === GAME_STATE.WIN_CELEBRATION) {
        updateSnowflakes();
        drawWinCelebration();

        if (keys['Enter']) {
            GameState.setCurrentState(GAME_STATE.REWARD_SCENE);
            GameState.setRewardSceneStartTime(null);
            keys['Enter'] = false;
        }
    }
    else if (GameState.currentState === GAME_STATE.REWARD_SCENE) {
        updateSnowflakes();
        drawRewardScene();

        if (keys['Enter']) {
            GameState.setCurrentState(GAME_STATE.END_SCENE);
            GameState.setRewardSceneStartTime(null);
            keys['Enter'] = false;
        }
    }
    else if (GameState.currentState === GAME_STATE.END_SCENE) {
        updateSnowflakes();
        drawEndScene();

        if (keys['Enter']) {
            GameState.setCurrentState(GAME_STATE.START);
            GameState.setShowStartDialog(false);
            keys['Enter'] = false;
        }
    }
    else if (GameState.currentState === GAME_STATE.GAME_OVER) {
        drawGameOver();

        if (keys['Enter']) {
            GameState.setCurrentState(GAME_STATE.PLAYING);
            resetGame();
            keys['Enter'] = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start the game when images are loaded
loadAllImages(() => {
    gameLoop();
});