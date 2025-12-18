// ============================================
// GAME OVER SCREEN
// ============================================

import { canvas, ctx } from '../canvas.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';

export function drawGameOver() {

    ctx.fillStyle = themeColors.bgOverlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = themeColors.redPrimary;
    ctx.font = `bold ${themeFonts.gameover} ${themeFonts.fancy}`;
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);

    // Display score
    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `bold 28px ${themeFonts.fancy}`;
    ctx.fillText(`Score: ${GameState.playerScore}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.fillStyle = themeColors.whitePrimary;
    ctx.font = `${themeFonts.huge} ${themeFonts.fancy}`;
    ctx.fillText('Press ENTER to Restart', canvas.width / 2, canvas.height / 2 + 80);
}