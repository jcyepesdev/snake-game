// ==============================
// SELECTORES
// ==============================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const mobileButtons = document.querySelectorAll('[data-dir]');

// ==============================
// CONFIG
// ==============================
const gridSize = 20;
let canvasSize;

// ==============================
// CANVAS RESPONSIVE
// ==============================
// function resizeCanvas() {
//     canvasSize = Math.min(window.innerWidth - 40, 400);
//     canvas.width = canvasSize;
//     canvas.height = canvasSize;
// }
function resizeCanvas() {
    const size = canvas.offsetWidth; // tamaño REAL en pantalla

    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const getTileCount = () => canvas.width / gridSize;

// ==============================
// ESTADO
// ==============================
let snake;
let direction;
let food;
let score;
let highScore = localStorage.getItem('snakeHighScore') || 0;

let gameState; // 'running' | 'paused' | 'gameover'

// tiempo (PRO)
let lastTime = 0;
let moveInterval = 120;
let accumulator = 0;

// ==============================
// INICIO
// ==============================
function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };

    food = generateFood();
    score = 0;

    moveInterval = 120;
    accumulator = 0;
    lastTime = 0;

    gameState = 'running';
    updateScore();
}

// ==============================
// GAME LOOP
// ==============================
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    if (gameState === 'running') {
        accumulator += deltaTime;

        if (accumulator >= moveInterval) {
            update();
            accumulator = 0;
        }
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// ==============================
// UPDATE
// ==============================
function update() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const tileCount = getTileCount();

    // colisión paredes
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
    ) {
        return gameOver();
    }

    // colisión consigo mismo
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        return gameOver();
    }

    snake.unshift(head);

    // comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();

        // velocidad progresiva
        if (score % 5 === 0 && moveInterval > 50) {
            moveInterval -= 10;
        }

        food = generateFood();

        // vibración en mobile (pro)
        if (navigator.vibrate) navigator.vibrate(50);

    } else {
        snake.pop();
    }
}

// ==============================
// DRAW
// ==============================
function draw() {
    // fondo
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e";
        ctx.fillRect(
            part.x * gridSize,
            part.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });

    // comida
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );

    drawOverlay();
}

// ==============================
// UI OVERLAY
// ==============================
function drawOverlay() {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    if (gameState === 'paused') {
        ctx.font = "bold 32px sans-serif";
        ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2);
    }

    if (gameState === 'gameover') {
        ctx.font = "bold 28px sans-serif";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = "20px sans-serif";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText(`Record: ${highScore}`, canvas.width / 2, canvas.height / 2 + 35);
    }
}

// ==============================
// UTILIDADES
// ==============================
function generateFood() {
    let newFood;

    while (true) {
        newFood = {
            x: Math.floor(Math.random() * getTileCount()),
            y: Math.floor(Math.random() * getTileCount())
        };

        const collision = snake.some(
            part => part.x === newFood.x && part.y === newFood.y
        );

        if (!collision) break;
    }

    return newFood;
}

function updateScore() {
    scoreElement.textContent = score;
}

// ==============================
// GAME OVER
// ==============================
function gameOver() {
    gameState = 'gameover';

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

// ==============================
// INPUT TECLADO
// ==============================
function changeDirection(dir) {
    if (gameState !== 'running') return;

    switch (dir) {
        case 'up':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'down':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'left':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'right':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

document.addEventListener("keydown", (e) => {
    const map = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };

    if (map[e.key]) changeDirection(map[e.key]);

    if (e.key.toLowerCase() === 'p') {
        if (gameState === 'running') gameState = 'paused';
        else if (gameState === 'paused') gameState = 'running';
    }

    if (e.key.toLowerCase() === 'r') startGame();
});

// ==============================
// INPUT MOBILE (BOTONES)
// ==============================
mobileButtons.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeDirection(btn.dataset.dir);
    });
});

// ==============================
// INPUT MOBILE (SWIPE)
// ==============================
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) changeDirection('right');
        else changeDirection('left');
    } else {
        if (dy > 0) changeDirection('down');
        else changeDirection('up');
    }
});

// ==============================
// RESTART
// ==============================
restartBtn.addEventListener('click', startGame);

// ==============================
// INIT
// ==============================
startGame();
requestAnimationFrame(gameLoop);