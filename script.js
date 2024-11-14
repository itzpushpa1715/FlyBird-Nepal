const gameArea = document.getElementById('game');
const crow = document.getElementById('crow');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const getReady = document.getElementById('getReady');

let crowPosition = 200;
let gravity = 1.5;
let isGameOver = false;
let score = 0;
let bambooGap = 200;
let bamboos = [];
let gameLoopInterval, addBambooInterval;

// Difficulty Settings
let speed = 1.5;
const EASY_LEVEL = { gap: 200, speed: 1.5, spawnInterval: 2500 }; // Increased spawn interval for easy level
const MEDIUM_LEVEL = { gap: 150, speed: 2.0, spawnInterval: 1800 };
const HARD_LEVEL = { gap: 120, speed: 2.5, spawnInterval: 1500 };

// Start the game with a "Get Ready" screen
function startGame() {
    crowPosition = 200;
    score = 0;
    scoreDisplay.innerText = 'Score: 0';
    bamboos.forEach(bamboo => bamboo.element.remove());
    bamboos = [];
    gameOverScreen.style.display = 'none';
    getReady.style.display = 'block';

    // Set initial difficulty
    bambooGap = EASY_LEVEL.gap;
    speed = EASY_LEVEL.speed;

    setTimeout(() => {
        getReady.style.display = 'none';
        document.addEventListener('click', flap);
        gameLoopInterval = setInterval(gameLoop, 20);
        addBambooInterval = setInterval(addBamboo, EASY_LEVEL.spawnInterval); // Use initial spawn interval for easy level
    }, 1000);
}

// Adjust difficulty based on score
function updateDifficulty() {
    clearInterval(addBambooInterval); // Clear existing interval

    if (score >= 50) {
        bambooGap = HARD_LEVEL.gap;
        speed = HARD_LEVEL.speed;
        addBambooInterval = setInterval(addBamboo, HARD_LEVEL.spawnInterval);
    } else if (score >= 15) {
        bambooGap = MEDIUM_LEVEL.gap;
        speed = MEDIUM_LEVEL.speed;
        addBambooInterval = setInterval(addBamboo, MEDIUM_LEVEL.spawnInterval);
    } else {
        bambooGap = EASY_LEVEL.gap;
        speed = EASY_LEVEL.speed;
        addBambooInterval = setInterval(addBamboo, EASY_LEVEL.spawnInterval);
    }
}

// Function to make the crow flap
function flap() {
    if (!isGameOver) {
        crowPosition -= 35;
        crow.style.transform = 'rotate(-20deg)';
        setTimeout(() => crow.style.transform = 'rotate(0deg)', 100);
    }
}

// Game loop function
function gameLoop() {
    crowPosition += gravity;
    crow.style.top = crowPosition + 'px';

    if (crowPosition >= gameArea.offsetHeight - crow.offsetHeight || crowPosition <= 0) {
        endGame();
        return;
    }

    // Update bamboo positions and check collisions
    bamboos.forEach(bamboo => {
        bamboo.left -= speed;
        bamboo.element.style.left = bamboo.left + 'px';

        if (bamboo.left + bamboo.element.offsetWidth < crow.offsetLeft && !bamboo.scored) {
            score++;
            scoreDisplay.innerText = 'Score: ' + score;
            bamboo.scored = true;
            updateDifficulty(); // Check and update difficulty when the score changes
        }

        const crowRect = crow.getBoundingClientRect();
        const bambooRect = bamboo.element.getBoundingClientRect();

        if (
            crowRect.right > bambooRect.left &&
            crowRect.left < bambooRect.right &&
            ((bamboo.element.classList.contains('top') && crowRect.top < bambooRect.bottom) ||
             (bamboo.element.classList.contains('bottom') && crowRect.bottom > bambooRect.top))
        ) {
            endGame();
            return;
        }
    });

    bamboos = bamboos.filter(bamboo => bamboo.left > -60);
}

// Add a new bamboo obstacle
function addBamboo() {
    const topHeight = Math.floor(Math.random() * (gameArea.offsetHeight - bambooGap - 100)) + 50;
    const bottomHeight = gameArea.offsetHeight - topHeight - bambooGap;

    const topBamboo = document.createElement('div');
    topBamboo.classList.add('bamboo', 'top');
    topBamboo.style.height = topHeight + 'px';
    topBamboo.style.left = '400px';
    gameArea.appendChild(topBamboo);

    const bottomBamboo = document.createElement('div');
    bottomBamboo.classList.add('bamboo', 'bottom');
    bottomBamboo.style.height = bottomHeight + 'px';
    bottomBamboo.style.left = '400px';
    gameArea.appendChild(bottomBamboo);

    bamboos.push({ element: topBamboo, left: 400, scored: false });
    bamboos.push({ element: bottomBamboo, left: 400, scored: false });
}

// End the game
function endGame() {
    isGameOver = true;
    document.removeEventListener('click', flap);
    clearInterval(gameLoopInterval);
    clearInterval(addBambooInterval);
    finalScore.innerText = score;
    gameOverScreen.style.display = 'block';
}

// Restart the game
function restartGame() {
    isGameOver = false;
    startGame();
}

// Start the game initially
startGame();
