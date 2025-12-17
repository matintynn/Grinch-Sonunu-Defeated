import { canvas } from '../canvas.js';

export const keys = {};

export const touch = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isTouching: false
};

export function setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

export function setupTouchControls() {
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touchPoint = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touch.startX = (touchPoint.clientX - rect.left) * (canvas.width / rect.width);
        touch.startY = (touchPoint.clientY - rect.top) * (canvas.height / rect.height);
        touch.currentX = touch.startX;
        touch.currentY = touch.startY;
        touch.isTouching = true;
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchPoint = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touch.currentX = (touchPoint.clientX - rect.left) * (canvas.width / rect.width);
        touch.currentY = (touchPoint.clientY - rect.top) * (canvas.height / rect.height);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        // record tap position (use current touch coords)
        touch.isTouching = false;
        touch.tapX = touch.currentX;
        touch.tapY = touch.currentY;
    });
}

// initialize tap coords
touch.tapX = null;
touch.tapY = null;

// Add mouse click support: record click position and simulate Enter key
export function setupMouseControls() {
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        touch.tapX = mx;
        touch.tapY = my;
        // simulate Enter press for UI buttons
        // set and clear a short time later to emulate a key press
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 10);
    });
}