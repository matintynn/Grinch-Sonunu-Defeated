import { GAME_STATE } from './config.js';

export let currentState = GAME_STATE.START;
export let celebrationTimer = 0;
export let celebrationMessage = '';
export let celebrationCharIndex = 0;
export let showStartDialog = false;
export let startDialogTimer = 0;
export let rewardSceneStartTime = null;
export let gameStartTime = null;
export let gameEndTime = null;
export let playerScore = 0;
export let monstersKilled = 0;
export let iceCubesVisited = [];
export let starCollected = false;
export let sonicCollected = false;
export let levelEnded = false;
export let showReadMePopup = false;
export let wasPlayingBeforePause = false;

export function setCurrentState(state) {
    currentState = state;
}

export function setShowReadMePopup(value) {
    showReadMePopup = value;
}

export function setWasPlayingBeforePause(value) {
    wasPlayingBeforePause = value;
}

export function setShowStartDialog(value) {
    showStartDialog = value;
}

export function setStartDialogTimer(value) {
    startDialogTimer = value;
}

export function setCelebrationTimer(value) {
    celebrationTimer = value;
}

export function setCelebrationMessage(message) {
    celebrationMessage = message;
}

export function setRewardSceneStartTime(value) {
    rewardSceneStartTime = value;
}

export function setGameStartTime(value) {
    gameStartTime = value;
}

export function setGameEndTime(value) {
    gameEndTime = value;
}

export function addScore(points) {
    playerScore += points;
}

export function incrementMonstersKilled() {
    monstersKilled++;
}

export function addIceCubeVisited(index) {
    iceCubesVisited.push(index);
}

export function resetGameState() {
    playerScore = 0;
    monstersKilled = 0;
    iceCubesVisited = [];
    starCollected = false;
    sonicCollected = false;
    levelEnded = false;
    celebrationTimer = 0;
    celebrationCharIndex = 0;
    rewardSceneStartTime = null;
    gameStartTime = Date.now();
    gameEndTime = null;
    showReadMePopup = false;
    wasPlayingBeforePause = false;
}

export function setStarCollected(value) {
    starCollected = value;
}

export function setSonicCollected(value) {
    sonicCollected = value;
}

export function setLevelEnded(value) {
    levelEnded = value;
}