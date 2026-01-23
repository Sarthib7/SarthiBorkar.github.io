// Game initialization
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;

// Loading animation
let loadProgress = 0;
const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 25;
    if (loadProgress >= 100) {
        loadProgress = 100;
        document.getElementById('loadingProgress').style.width = '100%';
        clearInterval(loadInterval);
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
            setTimeout(() => showWelcomeDialog(), 500);
        }, 500);
    } else {
        document.getElementById('loadingProgress').style.width = loadProgress + '%';
    }
}, 200);

// Game constants
const TILE_SIZE = 32, PLAYER_SIZE = 32, PLAYER_SPEED = 3;

// Game state
let gameState = {
    currentScene: 'overworld', previousScene: null,
    inDialog: false, currentDialog: null, dialogIndex: 0, canMove: true
};

// Player
const player = {
    x: 640, y: 550, width: PLAYER_SIZE, height: PLAYER_SIZE,
    speed: PLAYER_SPEED, direction: 'down', moving: false,
    frameCount: 0, animFrame: 0, idleSwayOffset: 0
};

// Input
const keys = { up: false, down: false, left: false, right: false };

// Buildings with unique designs
const buildings = [
    { name: 'home', x: 100, y: 170, width: 200, height: 200, doorX: 200, doorY: 355, label: '🏠 MY HOUSE', type: 'cottage' },
    { name: 'office', x: 800, y: 170, width: 200, height: 200, doorX: 900, doorY: 355, label: '🏢 OFFICE', type: 'modern' },
    { name: 'library', x: 450, y: 50, width: 200, height: 200, doorX: 550, doorY: 235, label: '📚 LIBRARY', type: 'classic' },
    { name: 'arcade', x: 1030, y: 420, width: 180, height: 180, doorX: 1120, doorY: 585, label: '🎮 ARCADE', type: 'neon' },
    { name: 'cafe', x: 380, y: 510, width: 240, height: 150, doorX: 500, doorY: 645, label: '☕ PIXEL CAFE', type: 'cafe' }
];

const trees = [
    { x: 40, y: 90 }, { x: 40, y: 510 }, { x: 1180, y: 90 },
    { x: 320, y: 410 }, { x: 1000, y: 290 }, { x: 720, y: 630 }
];

const flowers = [
    { x: 150, y: 460, color: '#ff6b9d' }, { x: 180, y: 480, color: '#ffeb3b' },
    { x: 710, y: 570, color: '#9d6bff' }, { x: 740, y: 550, color: '#ff6b9d' }
];

function transitionToScene(sceneName, playerStartX, playerStartY) {
    if (gameState.inDialog) return;
    gameState.canMove = false;
    document.getElementById('sceneTransition').classList.add('active');
    setTimeout(() => {
        gameState.previousScene = gameState.currentScene;
        gameState.currentScene = sceneName;
        player.x = playerStartX; player.y = playerStartY; player.direction = 'down';
        setTimeout(() => {
            document.getElementById('sceneTransition').classList.remove('active');
            gameState.canMove = true;
        }, 300);
    }, 300);
}

// Improved text rendering with better visibility
function drawText(text, x, y, size, color = '#fff') {
    ctx.font = size + 'px "Press Start 2P"';
    ctx.textAlign = 'center';
    // Strong black outline for contrast
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.strokeText(text, x, y);
    // White fill
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

console.log('✨ Sarthi\\'s Detailed Pixel World Loaded! ✨');
console.log('🎮 Explore unique buildings with rich interiors!');
console.log('☕ Visit the Pixel Cafe for social links!');
