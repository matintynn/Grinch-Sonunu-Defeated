// ============================================
// READ ME BUTTON & POPUP
// ============================================

import { canvas, ctx } from '../canvas.js';
import { touch } from '../utils/input.js';
import * as GameState from '../gameState.js';
import { themeColors, themeFonts } from '../themeColors.js';

let readMeButtonRect = null;
let closeButtonRect = null;
let popupScrollOffset = 0;
let maxScrollOffset = 0;

export function drawReadMeButton() {
    const btnWidth = 80;
    const btnHeight = 32;
    const btnX = canvas.width - btnWidth - 18;
    const btnY = canvas.height - btnHeight - 18;

    // Store button rect for hit testing
    readMeButtonRect = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };

    // Draw button background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

    // Draw button border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

    // Draw button text
    ctx.fillStyle = '#ffffff';
    ctx.font = `12px ${themeFonts.primary}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Read Me', btnX + btnWidth / 2, btnY + btnHeight / 2);

    // Handle button click
    if (touch.tapX !== null && readMeButtonRect) {
        const tx = touch.tapX;
        const ty = touch.tapY;
        if (tx >= readMeButtonRect.x && tx <= readMeButtonRect.x + readMeButtonRect.width &&
            ty >= readMeButtonRect.y && ty <= readMeButtonRect.y + readMeButtonRect.height) {
            GameState.setShowReadMePopup(true);
            popupScrollOffset = 0;
            touch.tapX = null;
            touch.tapY = null;
        }
    }
}

export function drawReadMePopup() {
    // Draw overlay background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Popup dimensions
    const popupWidth = Math.min(600, canvas.width - 40);
    const popupHeight = Math.min(480, canvas.height - 40);
    const popupX = (canvas.width - popupWidth) / 2;
    const popupY = (canvas.height - popupHeight) / 2;
    const padding = 24;

    // Draw popup background
    ctx.fillStyle = themeColors.bgGround;
    ctx.fillRect(popupX, popupY, popupWidth, popupHeight);

    // Draw popup border
    ctx.strokeStyle = themeColors.accentBorderDialog;
    ctx.lineWidth = 3;
    ctx.strokeRect(popupX, popupY, popupWidth, popupHeight);

    // Draw close button (X)
    const closeSize = 28;
    const closeX = popupX + popupWidth - closeSize - 12;
    const closeY = popupY + 12;

    closeButtonRect = { x: closeX, y: closeY, width: closeSize, height: closeSize };

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(closeX, closeY, closeSize, closeSize);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(closeX, closeY, closeSize, closeSize);

    // Draw X
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(closeX + 8, closeY + 8);
    ctx.lineTo(closeX + closeSize - 8, closeY + closeSize - 8);
    ctx.moveTo(closeX + closeSize - 8, closeY + 8);
    ctx.lineTo(closeX + 8, closeY + closeSize - 8);
    ctx.stroke();

    // Content area with scrolling
    const contentX = popupX + padding;
    const contentY = popupY + padding + 40;
    const contentWidth = popupWidth - padding * 2;
    const contentHeight = popupHeight - padding * 2 - 40;

    ctx.save();
    ctx.beginPath();
    ctx.rect(contentX, contentY, contentWidth, contentHeight);
    ctx.clip();

    let currentY = contentY - popupScrollOffset;
    const lineHeight = 20;
    const sectionSpacing = 12;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Title
    ctx.fillStyle = themeColors.goldPrimary;
    ctx.font = `bold 20px ${themeFonts.primary}`;
    ctx.fillText('Sonunu: The Stolen Star', contentX, currentY);
    currentY += 28 + sectionSpacing;

    // Content sections
    const content = [
        {
            type: 'text',
            text: "Hi! I'm Matin - a designer & aspiring game dev. This is my first game ever, and I built it because Sonunu inspired me."
        },
        {
            type: 'text',
            text: "I've always loved simple, fun platformer games (the kind you grow up playing), and during the holiday season I thought:"
        },
        {
            type: 'text',
            text: "What if I created my own Sonunu game with a Christmas twist?"
        },
        {
            type: 'heading',
            text: 'How this game was made'
        },
        {
            type: 'bullet',
            text: 'All game visuals and game elements were designed in Figma'
        },
        {
            type: 'bullet',
            text: 'Downloaded Sonunu mascot from sonunu.sonicsvm.org'
        },
        {
            type: 'bullet',
            text: 'I kept the illustration style simple, playful, and cozy'
        },
        {
            type: 'bullet',
            text: 'The goal was fun first - not perfection'
        },
        {
            type: 'text',
            text: 'This started as fanart, but I wanted to push myself further and turn it into something interactive.'
        },
        {
            type: 'heading',
            text: 'The story'
        },
        {
            type: 'text',
            text: 'The demonic Grinch Sonunu has stolen the Christmas star. Your mission is simple:'
        },
        {
            type: 'text',
            text: 'Play. Jump. Dodge. And rescue the star.'
        },
        {
            type: 'heading',
            text: 'What I learned'
        },
        {
            type: 'bullet',
            text: 'Turning ideas into something playable is hard - but incredibly rewarding'
        },
        {
            type: 'bullet',
            text: 'Designing for players is different from designing static screens'
        },
        {
            type: 'bullet',
            text: 'Small games can create big joy'
        },
        {
            type: 'heading',
            text: 'What I want to build next'
        },
        {
            type: 'text',
            text: 'If I continue this project, I would love to:'
        },
        {
            type: 'bullet',
            text: 'Save player names & scores'
        },
        {
            type: 'bullet',
            text: 'Show a Top 3 leaderboard'
        },
        {
            type: 'bullet',
            text: 'Add more levels, enemies, and surprises'
        },
        {
            type: 'heading',
            text: 'Thank you'
        },
        {
            type: 'text',
            text: 'Thank you to the Sonunu & SonicSVM community for the inspiration. If you enjoyed playing, that honestly means everything to me.'
        },
        {
            type: 'text',
            text: '- Matin'
        },
        {
            type: 'text',
            text: 'Designer / Dev'
        },
        {
            type: 'heading',
            text: 'Connect with me'
        },
        {
            type: 'text',
            text: 'My Website: matintruong.com'
        },
        {
            type: 'text',
            text: 'X & IG: @matin_uxdesign'
        }
    ];

    content.forEach(item => {
        if (item.type === 'heading') {
            currentY += sectionSpacing;
            ctx.fillStyle = themeColors.accentBorderDialog;
            ctx.font = `bold 14px ${themeFonts.primary}`;
            ctx.fillText(item.text, contentX, currentY);
            currentY += 18 + 6;
        } else if (item.type === 'bullet') {
            ctx.fillStyle = themeColors.whitePrimary;
            ctx.font = `12px ${themeFonts.primary}`;

            const bulletText = '• ' + item.text;
            const words = bulletText.split(' ');
            let line = '';

            words.forEach((word, i) => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > contentWidth - 10 && i > 0) {
                    ctx.fillText(line, contentX, currentY);
                    currentY += lineHeight;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });

            if (line) {
                ctx.fillText(line, contentX, currentY);
                currentY += lineHeight + 4;
            }
        } else {
            ctx.fillStyle = themeColors.whitePrimary;
            ctx.font = `12px ${themeFonts.primary}`;

            const words = item.text.split(' ');
            let line = '';

            words.forEach((word, i) => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > contentWidth - 10 && i > 0) {
                    ctx.fillText(line, contentX, currentY);
                    currentY += lineHeight;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });

            if (line) {
                ctx.fillText(line, contentX, currentY);
                currentY += lineHeight + 4;
            }
        }
    });

    const totalContentHeight = currentY - (contentY - popupScrollOffset);
    maxScrollOffset = Math.max(0, totalContentHeight - contentHeight);

    ctx.restore();

    // Draw scroll indicator
    if (maxScrollOffset > 0) {
        const scrollBarWidth = 6;
        const scrollBarHeight = Math.max(30, (contentHeight / totalContentHeight) * contentHeight);
        const scrollBarX = popupX + popupWidth - scrollBarWidth - 8;
        const scrollBarY = contentY + (popupScrollOffset / maxScrollOffset) * (contentHeight - scrollBarHeight);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(scrollBarX, scrollBarY, scrollBarWidth, scrollBarHeight);
    }

    // Handle close button click
    if (touch.tapX !== null && closeButtonRect) {
        const tx = touch.tapX;
        const ty = touch.tapY;
        if (tx >= closeButtonRect.x && tx <= closeButtonRect.x + closeButtonRect.width &&
            ty >= closeButtonRect.y && ty <= closeButtonRect.y + closeButtonRect.height) {
            GameState.setShowReadMePopup(false);
            touch.tapX = null;
            touch.tapY = null;
        }
    }
}

// Add mouse wheel support for scrolling
canvas.addEventListener('wheel', (e) => {
    if (GameState.showReadMePopup) {
        e.preventDefault();
        popupScrollOffset += e.deltaY * 0.5;
        popupScrollOffset = Math.max(0, Math.min(popupScrollOffset, maxScrollOffset));
    }
}, { passive: false });