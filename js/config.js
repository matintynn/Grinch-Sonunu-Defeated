// Game Configuration & Constants
export const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    WIN: 'win',
    WIN_CELEBRATION: 'winCelebration',
    REWARD_SCENE: 'rewardScene',
    END_SCENE: 'endScene',
    GAME_OVER: 'gameOver'
};

export const GROUND_HEIGHT = 60;
export const GROUND_LEVEL = 560 - GROUND_HEIGHT;

export const PLAYER_CONFIG = {
    width: 50,
    height: 80,
    speed: 5,
    gravity: 0.6,
    maxJumps: 3,
    jumpHeights: [-7, -11, -15]
};

export const CANVAS_WIDTH = 760;
export const CANVAS_HEIGHT = 560;